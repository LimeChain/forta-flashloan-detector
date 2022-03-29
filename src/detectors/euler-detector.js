const { ethers } = require('forta-agent');

const controllerAddress = '0x27182842E098f60e3D576794A5bFFb0777E025d3';

const eulerEventSigs = [
  'event Borrow(address indexed underlying, address indexed account, uint amount)',
  'event Repay(address indexed underlying, address indexed account, uint amount)',
];

const zero = ethers.constants.Zero;

module.exports = {
  hasEulerFlashloan: (txEvent) => {
    // Euler doesn't support flashloans natively so we have to sum
    // the borrows and the repays in a tx. If they are equal then
    // the transaction probably contains flashloan
    const events = txEvent.filterLog(eulerEventSigs, controllerAddress);
    if (events.length === 0) return false;

    // Store the balance difference for each market seperately
    const balanceDiff = {};

    events.forEach((event) => {
      const isBorrow = (event.name === 'Borrow');
      const { underlying, amount } = event.args;

      // Set initial balance difference to 0
      const tempBalance = balanceDiff[underlying] || zero;

      // Add to the balance when borrowing and subtract on repaying
      balanceDiff[underlying] = (isBorrow)
        ? tempBalance.add(amount)
        : tempBalance.sub(amount);
    });

    // Check if the balance difference for a market is equal to 0
    return Object.values(balanceDiff).some((diff) => diff.eq(zero));
  },
};
