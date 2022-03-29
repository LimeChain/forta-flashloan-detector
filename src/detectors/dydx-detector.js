const { ethers } = require('forta-agent');

const dydxSoloMarginAddress = '0x1e0447b19bb6ecfdae1e4ae1694b0c3659614e4e';
const dydxEventSigs = [
  'event LogDeposit(address indexed accountOwner, uint256 accountNumber, uint256 market, ((bool sign, uint256 value) deltaWei, tuple(bool sign, uint128 value) newPar) update, address from)',
  'event LogWithdraw(address indexed accountOwner, uint256 accountNumber, uint256 market, ((bool sign, uint256 value) deltaWei, tuple(bool sign, uint128 value) newPar) update, address from',
];

const zero = ethers.constants.Zero;
const two = ethers.BigNumber.from(2);

// Information taken from https://money-legos.studydefi.com/#/dydx
// DyDx doesn't natively support "flashloan" feature.
// However you can achieve a similar behavior by executing a series of operations on
// the SoloMargin contract. In order to mimic an Aave flashloan on DyDx, you would need to:
//  1. Borrow x amount of tokens. (Withdraw)
//  2. Call a function (i.e. Logic to handle flashloaned funds). (Call)
//  3. Deposit back x (+2 wei) amount of tokens. (Deposit)
module.exports = {
  hasDydxFlashloan: (txEvent) => {
    // dydx currently supports 3 markets:
    // 0: WETH
    // 1: DAI
    // 2: USDC
    // Store the balance difference for each market seperately
    const balanceDiff = {};

    // Increase the balanceDiff for the specific market on every deposit
    // and decrease it on every withdraw
    txEvent.filterLog(dydxEventSigs, dydxSoloMarginAddress).forEach((event) => {
      const market = event.args.market.toNumber();
      const { value, sign } = event.args.update.deltaWei;

      // Set initial balance difference to 0
      const tempBalance = balanceDiff[market] || zero;

      balanceDiff[market] = (sign)
        ? tempBalance.add(value)
        : tempBalance.sub(value);
    });

    // Check if the balance difference for a market is equal to 2
    return Object.values(balanceDiff).some((diff) => diff.eq(two));
  },
};
