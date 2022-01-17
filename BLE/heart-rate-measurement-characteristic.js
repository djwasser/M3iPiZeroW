var Bleno = require('@abandonware/bleno');
var DEBUG = false;

class HeartRateMeasurementCharacteristic extends  Bleno.Characteristic {
 
  constructor() {
    super({
      uuid: '2A37',
      value: null,
      properties: ['notify'],
      descriptors: [
        new Bleno.Descriptor({
					uuid: '2901',
					value: 'Heart Rate Measurement'
        }),
	new Bleno.Descriptor({
		// Client Characteristic Configuration
		uuid: '2902',
		value: Buffer.alloc(2)
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
    if (DEBUG) console.log('[HeartRateService] client subscribed to PM');
    this._updateValueCallback = updateValueCallback;
    return this.RESULT_SUCCESS;
  };

  onUnsubscribe() {
    if (DEBUG) console.log('[HeartRateService] client unsubscribed from PM');
    this._updateValueCallback = null;
    return this.RESULT_UNLIKELY_ERROR;
  };

  notify(event) {
	  if (!('hr' in event)) {
		  // ignore events with no heart rate
		  return this.RESULT_SUCCESS;
	  }
	  if (this._updateValueCallback) {
		  if (DEBUG) console.log("[HeartRateService] Notify");
		  var buffer = Buffer.alloc(2);
		  
		  // Set flags to indicate data only contains UINT8 Heart Rate
		  buffer.writeUInt8(0x00, 0);
		  
		  var hr = event.hr & 0xff;  // ensure hr is an 8-bit integer
		  if (DEBUG) console.log("[HeartRateService] heart rate: " + hr);
		  buffer.writeUInt8(hr, 1);
		  this._updateValueCallback(buffer);
	  }
	  return this.RESULT_SUCCESS;
  }
};
module.exports = HeartRateMeasurementCharacteristic;
