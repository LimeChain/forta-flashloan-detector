const { ethers, getEthersProvider } = require('forta-agent');

const comptrollerAbi = ['function getAllMarkets() public view returns (address[] memory)'];

const ironBankControllerAddress = '0xab1c342c7bf5ec5f02adea1c2270670bca144cbb';
const ironBankControllerContract = new ethers
  .Contract(ironBankControllerAddress, comptrollerAbi, getEthersProvider());
const ironBankFlashloanSig = 'event Flashloan(address indexed receiver, uint256 amount, uint256 totalFee, uint256 reservesFee)';
let ironBankMarketsAddresses = [];

module.exports = {
  initIronBankMarkets: async () => {
    ironBankMarketsAddresses = await ironBankControllerContract.getAllMarkets();
  },
  hasIronBankFlashloan: (txEvent) => {
    const events = txEvent.filterLog(ironBankFlashloanSig, ironBankMarketsAddresses);
    return !!events.length;
  },
};
