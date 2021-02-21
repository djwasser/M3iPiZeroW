var Bleno = require('@abandonware/bleno');
var DEBUG = false;

class IndoorBikeDataCharacteristic extends Bleno.Characteristic {

	constructor() {
		super({
			uuid: '2AD2',
			value: null,
			properties: ['notify'],
			descriptors: [
				new Bleno.Descriptor({
					// Client Characteristic Configuration
					uuid: '2902',
					value: Buffer.alloc(2)
				})
			]
		});
		this._updateValueCallback = null;
	}

	onSubscribe(maxValueSize, updateValueCallback) {
		if (DEBUG) console.log('[IndoorBikeDataCharacteristic] client subscribed');
		this._updateValueCallback = updateValueCallback;
		return this.RESULT_SUCCESS;
	};

	onUnsubscribe() {
		if (DEBUG) console.log('[IndoorBikeDataCharacteristic] client unsubscribed');
		this._updateValueCallback = null;
		return this.RESULT_UNLIKELY_ERROR;
	};

	notify(event) {
		if (!('power' in event) && !('hr' in event) && !('ftmsrpm' in event)) {
			// ignore events that do not have complete data set
			return this.RESULT_SUCCESS; 
		}

		if (this._updateValueCallback) {
			if (DEBUG) console.log("[IndoorBikeDataCharacteristic] Notify");
			var buffer = new Buffer(7);
			// set flags for rpm + power + heart rate
			buffer.writeUInt8(0x45, 0);
			buffer.writeUInt8(0x02, 1);

			// For ftms refernce, see the Fitness Machine Service BLE Specification at 
			// https://www.bluetooth.com/specifications/specs/fitness-machine-service-1-0/
			// Note that info on data types for Indoor Bike Data are detailed (buried!!) in 
			// the Control Point portion of the document. 

			var ftmsrpm = event.ftmsrpm & 0xffff;  // ensure ftmsrpm is a 16-bit integer
			if (DEBUG) console.log("[IndoorBikeDataCharacteristic] rpm: " + (ftmsrpm/2));
			buffer.writeUInt16LE(ftmsrpm, 2);  // ftms spec is UINT16; resolution is 0.5 rpm
			
			var power = event.power & 0xffff; // ensure power is a 16-bit integer
			if (DEBUG) console.log("[IndoorBikeDataCharacteristic] power: " + power);
			buffer.writeInt16LE(power, 4); // ftms spec is SINT16

			var hr = event.hr & 0xff; // ensure hr is an 8-bit integer
			if (DEBUG) console.log("[IndoorBikeDataCharacteristic] hr : " + hr);
			buffer.writeUInt8(hr, 6); // ftms spec is UINT8

			this._updateValueCallback(buffer);
		}
		else
		{
			if (DEBUG) console.log("[IndoorBikeDataCharacteristic] nobody is listening");
		}
		return this.RESULT_SUCCESS;
	}

};

module.exports = IndoorBikeDataCharacteristic;
