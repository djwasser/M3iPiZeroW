import {Characteristic, Descriptor} from '@abandonware/bleno';

/**
 * Bluetooth LE GATT Statis Read Characteristic implementation.
 */
export class StatisReadCharacteristic extends Characteristic {
  constructor(uuid, description, value) {
    super({
      uuid: uuid,
      properties: ['read'],
      descriptors: [
        new Descriptor({
          uuid: '2901',
          value: description
        })
      ],
      value: Buffer.from(value)
    })
  }
}
