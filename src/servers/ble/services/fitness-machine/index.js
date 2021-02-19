import {PrimaryService} from '@abandonware/bleno';
import {StaticReadCharacteristic} from './characteristics/static-read';
import {FitnessMachineStatusCharacteristic} from './characteristics/fitness-machine-status';
import {IndoorBikeDataCharacteristic} from './characteristics/indoor-bike-data';

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
        new StaticReadCharacteristic('2ACC', 'Fitness Machine Feature', [0x02, 0x44, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
        new FitnessMachineStatusCharacteristic(),
        new IndoorBikeDataCharacteristic(),
      ]
    })
  }

  /**
   * Notify subscriber (e.g. Zwift) of new Fitness Machine Indoor Bike Data Measurement.
   * @param {object} measurement - new cycling power measurement.
   * @param {number} measurement.rpm - instantaneous cadence (rpm).
   * @param {number} measurement.power - current power (watts)
   * @param {number} measurement.hr - instantaneous heart rate (bpm).
   */
  updateMeasurement(measurement) {
    this.characteristics[0].updateMeasurement(measurement)
  }
}
