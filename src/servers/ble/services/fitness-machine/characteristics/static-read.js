import {Characteristic, Descriptor} from '@abandonware/bleno';

/**
 * Bluetooth LE GATT Sensor Location Characteristic implementation.
 */
export class StatisReadCharacteristic extends Characteristic {
  constructor(uuid, description, value) {
    super({
      uuid: uuid,
      properties: ['read'],
      descriptors: [
        new Descriptor({
          uuid: '2901',
          value: 'Sensor Location'
        })
      ],
      value: Buffer.from([13]) // power value measured at rear hub
    })
  }
}
