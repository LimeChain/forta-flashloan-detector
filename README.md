# forta-flashloan-detector

The forta-flashloan-detector library checks if a transaction contains a flashloan.
It currently supports only the Ethereum network and supports these protocols:
 - Aave
 - dYdX
 - Euler
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
const flashloanDetector = new FlashloanDetector(['aave', 'maker']);

const handleTransaction = async (txEvent) => {
  const findings = [];

  const flashloanProtocols = flashloanDetector.getFlashloans(txEvent);

  if (flashloanProtocols.length > 0) {
      findings.push(createAlert(flashloanProtocols));
  }

  return findings;
}
```

### Test Data

 - Aave flashloan tx: `0xeda125ef4a0d59be543ecb90b9d66ce606593497d8e8cfc5933822e8b6527c82`
 - dYdX flashloan tx: `0xfcd0564b16592a6168ca0a906f7781182a071aa30f7eb9d67dbce42f6a358db9`
 - Euler flashloan tx: `0x1eddb00425ba62dea460825967583b8dd4ec239d6c68c25c49025304161682b6`
 - Iron Bank flashloan tx: `0x891e70b9e4201c6f481c07054bad88e7c11c946535c20b96e1920e876b1fd0b0`
 - MakerDAO flashloan tx: `0x291fbea2843e188c2997a00e35c9a4340e736215572c2fb57935db3366789106`