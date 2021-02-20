import {PrimaryService} from '@abandonware/bleno';
import {CyclingPowerMeasurementCharacteristic} from './characteristics/cycling-power-measurement';
import {CyclingPowerFeatureCharacteristic} from './characteristics/cycling-power-feature';
import {SensorLocationCharacteristic} from './characteristics/sensor-location';

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
				new CyclingPowerFeatureCharacteristic(),
				new SensorLocationCharacteristic(),
			]
		});
		this.powerMeasurement = powerMeasurement;
	}
	notify(event) {
		this.powerMeasurement.notify(event);
		return this.RESULT_SUCCESS;
	};
}
