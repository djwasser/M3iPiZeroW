import {PrimaryService} from '@abandonware/bleno';
import {IndoorBikeDataCharacteristic} from './characteristics/indoor-bike-data';
import {StaticReadCharacteristic} from './characteristics/static-read';
import {FitnessMachineStatusCharacteristic} from './characteristics/fitness-machine-status';

/**
 * Bluetooth LE GATT Fitness Machine Service implementation.
 */
export class FitnessMachineService extends PrimaryService {
  /**
   * Create a FitnessMachineService instance.
   */
  constructor() {
    super({
      uuid: '1826',
      characteristics: [
        new IndoorBikeDataCharacteristic(),
        new StaticReadCharacteristic('2ACC', 'Fitness Machine Feature', [0x02, 0x44, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), //rpm, power, hr
        new FitnessMachineStatusCharacteristic()
      ]
    });
    this.indoorBikeData = indoorBikeData;
  }

  /**
   * Transfer evernt to the given characteristics.
   */
  notify(event) {
    this.indoorBikeData.notify(event);
  }
}
