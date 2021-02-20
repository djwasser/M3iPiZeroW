// This likely will take place of keiserBLE from keiser2Zwift repo
import {CyclingPowerService} from './services/cycling-power'
// import {CyclingSpeedAndCadenceService} from './services/cycling-speed-and-cadence'
import {FitnessMachineService} from './services/fitness-machine'
import {BleServer} from '../../util/ble-server'

export const DEFAULT_NAME = 'M3iPiZeroW';

/**
 * Handles communication with apps (e.g. Zwift) using the standard Bluetooth Services
 * LE GATT Cycling Power, Fitness Maschine
 */
export class M3iPiZeroW extends BleServer {
  /**
   * Create a M3iPiZeroWServer instance.
   * @param {Bleno} bleno - a Bleno instance.
   */
  constructor(bleno, name=DEFAULT_NAME) {
    this.cps = new CyclingPowerService();
    this.fms = new FitnessMachineService();

    super(bleno, name, [
      this.cps,
      this.fms
    ])
  }

  // notifiy BLE services
  notifyFTMS(event) {
	  this.cps.notify(event);
	  this.fms.notify(event);
  };
}
