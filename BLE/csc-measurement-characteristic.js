var Bleno = require('@abandonware/bleno');
var DEBUG = false;
const FLAG_HASCRANKDATA = (1<<1);

class CscMeasurementCharacteristic extends  Bleno.Characteristic {
 
  constructor() {
    super({
      uuid: '2A5B',
      value: null,
      properties: ['notify'],
      descriptors: [
        new Bleno.Descriptor({
		uuid: '2903',
		value: Buffer.alloc(2)
	})
      ]
    });
    this._updateValueCallback = null;
  }

  onSubscribe(maxValueSize, updateValueCallback) {
    if (DEBUG) console.log('[cscService] client subscribed to PM');
    this._updateValueCallback = updateValueCallback;
    return this.RESULT_SUCCESS;
  };

  onUnsubscribe() {
    if (DEBUG) console.log('[cscService] client unsubscribed from PM');
    this._updateValueCallback = null;
    return this.RESULT_UNLIKELY_ERROR;
  };

  notify(event) {
    if (!('crankcount' in event) && !('cranktime' in event)) {
      // ignore events that do not have all of the data expected
      return this.RESULT_SUCCESS;
    }
  
    if (this._updateValueCallback) {
		if (DEBUG) console.log("[cscService] Notify");
		var buffer = Buffer.alloc(5);
	        
	        let flags = 0;
	        flags |= FLAG_HASCRANKDATA;
		buffer.writeUInt8(flags, 0);
	    
	        const revolutions16bit = event.crankcount & 0xffff;
	        const timestamp16bit = event.cranktime & 0xffff;
	        buffer.writeUInt16LE(revolutions16bit, 1);
	        buffer.writeUInt16LE(timestamp16bit, 3);
	  
      this._updateValueCallback(buffer);
    }
    return this.RESULT_SUCCESS;
  }
};
module.exports = CscMeasurementCharacteristic;
