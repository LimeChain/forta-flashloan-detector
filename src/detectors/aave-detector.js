const aaveFlashloanSig = 'event FlashLoan(address indexed target, address indexed initiator, address indexed asset, uint256 amount, uint256 premium, uint16 referralCode)';
const aaveLendingPoolAddress = '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9';

module.exports = {
  hasAaveFlashloan: (txEvent) => {
    const events = txEvent.filterLog(aaveFlashloanSig, aaveLendingPoolAddress);
    return !!events.length;
  },
};
