const makerFlashLenderAddress = '0x1EB4CF3A948E7D72A198fe073cCb8C7a948cD853';
const makerFlashloanSig = 'event FlashLoan(address indexed receiver, address token, uint256 amount, uint256 fee)';

module.exports = {
  hasMakerFlashloan: (txEvent) => {
    const events = txEvent.filterLog(makerFlashloanSig, makerFlashLenderAddress);
    return !!events.length;
  },
};
