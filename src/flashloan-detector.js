const { hasAaveFlashloan } = require('./detectors/aave-detector');
const { hasDydxFlashloan } = require('./detectors/dydx-detector');
const { hasEulerFlashloan } = require('./detectors/euler-detector');
const { initIronBankMarkets, hasIronBankFlashloan } = require('./detectors/iron-bank-detector');
const { hasMakerFlashloan } = require('./detectors/maker-detector');

const allSupportedProtocols = ['aave', 'dydx', 'euler', 'ironBank', 'maker'];

module.exports = class FlashloanDetector {
  constructor(supportedProtocols) {
    // If there are no provided protocols then support all
    const tempProtocols = supportedProtocols || allSupportedProtocols;

    this.protocols = {};
    tempProtocols.forEach((protocol) => {
      if (!allSupportedProtocols.includes(protocol)) {
        throw new Error('Unsupported protocol. Supported protocols: "aave", "dydx", "euler", "ironBank", "maker"');
      }

      // Store the protocols as an object ("name": true) for easier access
      this.protocols[protocol] = true;
    });
  }

  // Initialize some protocols
  // The Iron Bank markets are fetched dynamically
  async init() {
    if (this.protocols.ironBank) await initIronBankMarkets();
  }

  // Returns an array of protocols from which a flashloan was taken
  getFlashloans(txEvent) {
    const flashloanProtocols = [];
    if (this.protocols.aave && hasAaveFlashloan(txEvent)) {
      flashloanProtocols.push('Aave');
    }
    if (this.protocols.dydx && hasDydxFlashloan(txEvent)) {
      flashloanProtocols.push('dYdX');
    }
    if (this.protocols.euler && hasEulerFlashloan(txEvent)) {
      flashloanProtocols.push('Euler');
    }
    if (this.protocols.ironBank && hasIronBankFlashloan(txEvent)) {
      flashloanProtocols.push('Iron Bank');
    }
    if (this.protocols.maker && hasMakerFlashloan(txEvent)) {
      flashloanProtocols.push('MakerDAO');
    }
    return flashloanProtocols;
  }
};
