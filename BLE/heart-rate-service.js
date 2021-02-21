const Bleno = require('@abandonware/bleno');

const HeartRateMeasurementCharacteristic = require('./heart-rate-measurement-characteristic');

class HeartRateService extends Bleno.PrimaryService {

  constructor() {
    let HeartRateMeasurement = new HeartRateMeasurementCharacteristic();
    super({
        uuid: '180D',
        characteristics: [
          HeartRateMeasurement
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
