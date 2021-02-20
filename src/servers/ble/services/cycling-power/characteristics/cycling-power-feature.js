import {Characteristic, Descriptor} from '@abandonware/bleno';

/**
 * Bluetooth LE GATT Cycling Power Feature Characteristic implementation.
 */
export class CyclingPowerFeatureCharacteristic extends Characteristic {
  constructor() {
    super({
      uuid: '2A65',
      properties: ['read'],
      descriptors: [
        new Descriptor({
          uuid: '2901',
          value: 'Cycling Power Feature'
        })
      ],
      value: Buffer.from([0x08,0,0,0]) // crank revolution data is present
    })
  }
}
