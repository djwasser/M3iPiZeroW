import {PrimaryService} from '@abandonware/bleno';
import {CyclingPowerMeasurementCharacteristic} from './characteristics/cycling-power-measurement';
import {StaticReadCharacteristic} from './characteristics/static-read';

/**
 * Bluetooth LE GATT Cycling Power Service implementation.
 */
export class CyclingPowerService extends PrimaryService {
	constructor() {
		let powerMeasurement = new CyclingPowerMeasurementCharacteristic();
		super({
			uuid: '1818',
			characteristics: [
				powerMeasurement,
				new StaticReadCharacteristic('2A65', 'Cycling Power Feature', [0x08, 0, 0, 0]), //0x08 - crank revolutions present
				new SensorLocationCharacteristic('2A5D', 'Sensor Location', [13]), // 13 = rear hub
			]
		});
		this.powerMeasurement = powerMeasurement;
	}
	notify(event) {
		this.powerMeasurement.notify(event);
		return this.RESULT_SUCCESS;
	};
}
