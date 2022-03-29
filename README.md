# forta-flashloan-detector

The forta-flashloan-detector library checks if a transaction contains a flashloan.
It currently supports only the Ethereum network and supports these protocols:
 - Aave
 - dYdX
 - Euler (not tested with mainnet transaction)
 - Iron Bank
 - MakerDAO

## Dependencies

This package depends on the `forta-agent` package.


## Installation

Use the node package manager npm to add the library to your project:

```
$ npm install forta-flashloan-detector
```

## Usage

Import the forta-flashloan-detector library into a JavaScript file like this:

```
const FlashloanDetector = require('forta-flashloan-detector');
```

Specify the protocols you want to support (If you don't specify any protocols the detector will support all):

```
const flashloanDetector = new FlashloanDetector(['aave', 'maker']);
```

### Examples

```
const handleTransaction = async (txEvent) => {
  const findings = [];
  const flashloanDetector = new FlashloanDetector(['aave', 'maker']);

  const flashloanProtocols = flashloanDetector.getFlashloans(txEvent);

  if (flashloanProtocols.length > 0) {
      findings.push(createAlert(flashloanProtocols));
  }

  return findings;
}
```
