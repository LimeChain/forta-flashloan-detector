const { ethers } = require('forta-agent');

// Only supports flashloans from these markets
const eulerMarkets = [
  '0x62e28f054efc24b26a794f5c1249b6349454352c', // WETH
  '0x84721a3db22eb852233aeae74f9bc8477f8bcc42', // USDC
  '0x6085bc95f506c326dcbcd7a6dd6c79fbc18d4686', // DAI
];

const eulerEventSigs = [
  'event RequestBorrow(address indexed account, uint amount)',
  'event RequestRepay(address indexed account, uint amount)',
];

const zero = ethers.constants.Zero;

module.exports = {
  hasEulerFlashloan: (txEvent) => {
    // Euler doesn't support flashloans natively so we have to sum
    // the borrows and the repays in a tx. If they are equal then
    // the transaction probably contains flashloan
    const events = txEvent.filterLog(eulerEventSigs, eulerMarkets);
    if (events.length === 0) return false;

    // Set the amount of borrow/repay for each market to 0
    const borrowAmounts = {};
    const repayAmounts = {};
    eulerMarkets.forEach((market) => {
      borrowAmounts[market] = zero;
      repayAmounts[market] = zero;
    });

    // Add the borrow/repay amount to the correct market
    events.forEach((event) => {
      if (event.name === 'RequestBorrow') {
        borrowAmounts[event.address] = borrowAmounts[event.address].add(event.args.amount);
      } else {
        repayAmounts[event.address] = repayAmounts[event.address].add(event.args.amount);
      }
    });

    // Euler doesn't have a fee for a flashloan so borrow and repay should be equal
    return eulerMarkets
      .some((market) => !borrowAmounts[market].eq(zero)
      && borrowAmounts[market].eq(repayAmounts[market]));
  },
};
