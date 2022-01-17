var Bleno = require('@abandonware/bleno');
var DEBUG = false;
const FLAG_HASCRANKDATA = (1<<5);
// Spec
//https://developer.bluetooth.org/gatt/characteristics/Pages/CharacteristicViewer.aspx?u=org.bluetooth.characteristic.cycling_power_measurement.xml

class CyclingPowerMeasurementCharacteristic extends  Bleno.Characteristic {
 
  constructor() {
    super({
      uuid: '2A63',
      value: null,
      properties: ['notify','read','write', 'writeWithoutResponse'],
      descriptors: [
        new Bleno.Descriptor({
		uuid: '2901',
		value: 'Cycling Power Measurement'
	}),
	new Bleno.Descriptor({
		// Server Characteristic Configuration
		uuid: '2903',
		value: Buffer.alloc(2)
	})
      ]
    });
    this._updateValueCallback = null;
  }

  onSubscribe(maxValueSize, updateValueCallback) {
    if (DEBUG) console.log('[powerService] client subscribed to PM');
    this._updateValueCallback = updateValueCallback;
    return this.RESULT_SUCCESS;
  };

  onUnsubscribe() {
    if (DEBUG) console.log('[powerService] client unsubscribed from PM');
    this._updateValueCallback = null;
    return this.RESULT_UNLIKELY_ERROR;
  };

  notify(event) {
    if (!('power' in event) && !('crankcount' in event) && !('cranktime' in event)) {
      // ignore events that do not have all of the data expected.
      return this.RESULT_SUCCESS;
    }
  
    if (this._updateValueCallback) {
		if (DEBUG) console.log("[powerService] Notify");
		var buffer = Buffer.alloc(8);
	        
	        let flags = 0;
	        flags |= FLAG_HASCRANKDATA;
		buffer.writeUInt16LE(flags, 0);
	    
	        const power = event.power;
	        const revolutions16bit = event.crankcount & 0xffff;
	        const timestamp16bit = event.cranktime & 0xffff;
		buffer.writeInt16LE(power, 2);
	        buffer.writeUInt16LE(revolutions16bit, 4);
	        buffer.writeUInt16LE(timestamp16bit, 6);
	  
      this._updateValueCallback(buffer);
    }
    return this.RESULT_SUCCESS;
  }
  
  
};

module.exports = CyclingPowerMeasurementCharacteristic;
