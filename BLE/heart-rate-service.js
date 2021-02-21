const Bleno = require('@abandonware/bleno');

const HeartRateMeasurementCharacteristic = require('./heart-rate-measurement-characteristic');
const StaticReadCharacteristic = require('./static-read-characteristic');

class HeartRateService extends Bleno.PrimaryService {

  constructor() {
    let HeartRateMeasurement = new HeartRateMeasurementCharacteristic();
    super({
        uuid: '180D',
        characteristics: [
          HeartRateMeasurement,
          new StaticReadCharacteristic('2A65', 'Cycling Power Feature', [0x00, 0, 0, 0]), // no additional features
          new StaticReadCharacteristic('2A5D', 'Sensor Location', [13])         // 13 = rear hub
        ]
    });

    this.HeartRateMeasurement = HeartRateMeasurement;
  }

  notify(event) {
    this.HeartRateMeasurement.notify(event);
    return this.RESULT_SUCCESS;
  };
}

module.exports = HeartRateService;
