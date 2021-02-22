const Bleno = require('@abandonware/bleno');

const CscMeasurementCharacteristic = require('./csc-measurement-characteristic');
const StaticReadCharacteristic = require('./static-read-characteristic');

class  CyclingSpeedAndCadenceService extends Bleno.PrimaryService {

  constructor() {
    let cscMeasurement = new CscMeasurementCharacteristic();
    super({
        uuid: '1816',
        characteristics: [
          cscMeasurement,
          new StaticReadCharacteristic('2A5C', 'CSC Feature', [2]) // crank revolution data
        ]
    });

    this.cscMeasurement = cscMeasurement;
  }

  notify(event) {
    this.cscMeasurement.notify(event);
    return this.RESULT_SUCCESS;
  };
}

module.exports =  CyclingSpeedAndCadenceService ;
