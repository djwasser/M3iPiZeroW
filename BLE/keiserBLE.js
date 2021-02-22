const bleno = require('@abandonware/bleno');
const EventEmitter = require('events');
const CyclingPowerService = require('./cycling-power-service');
const FitnessMachineService = require('./fitness-machine-service');
const HeartRateService = require('./heart-rate-service');

var keiserDeviceId = -1;
var isPoweredOn = false;

class KeiserBLE extends EventEmitter {

	constructor() {
		super();

		this.setName();		

		this.cps = new CyclingPowerService();
		this.fms = new FitnessMachineService();
		this.hrs = new HeartRateService();

		let self = this;
		console.log(`[${this.name} starting]`);

		bleno.on('stateChange', (state) => {
			console.log(`[${this.name} stateChange] new state: ${state}`);
			
			self.emit('stateChange', state);

			if (state === 'poweredOn') {
				isPoweredOn = true;
				this.checkStartConditions();
			} else {
				console.log('Stopping...');
				isPoweredOn = false;
				bleno.stopAdvertising();
			}
		});

		bleno.on('advertisingStart', (error) => {
			console.log(`[${this.name} advertisingStart] ${(error ? 'error ' + error : 'success')}`);
			self.emit('advertisingStart', error);

			if (!error) {
				bleno.setServices([
					self.cps, 
					self.fms,
					self.hrs
				], 
				(error) => {
					console.log(`[${this.name} setServices] ${(error ? 'error ' + error : 'success')}`);
				});
			}
		});

		bleno.on('advertisingStartError', () => {
			console.log(`[${this.name} advertisingStartError] advertising stopped`);
			self.emit('advertisingStartError');
		});

		bleno.on('advertisingStop', error => {
			console.log(`[${this.name} advertisingStop] ${(error ? 'error ' + error : 'success')}`);
			self.emit('advertisingStop');
		});

		bleno.on('servicesSet', error => {
			console.log(`[${this.name} servicesSet] ${ (error) ? 'error ' + error : 'success'}`);
		});

		bleno.on('accept', (clientAddress) => {
			console.log(`[${this.name} accept] Client: ${clientAddress}`);
			self.emit('accept', clientAddress);
			bleno.updateRssi();
		});

		bleno.on('disconnect', (clientAddress) => {
			console.log(`[${this.name} disconnect] Client: ${clientAddress}`);
			self.emit('disconnect', clientAddress);
		});

		bleno.on('rssiUpdate', (rssi) => {
			console.log(`[${this.name} rssiUpdate]: ${rssi}`);
		});

	}

	// notify BLE Client
	notifyClient(event) {
		this.cps.notify(event);
		this.fms.notify(event);
		this.hrs.notify(event)
	};

	setDeviceId(deviceId) {
		keiserDeviceId = deviceId;
		this.setName();
		this.checkStartConditions();
	}

	setName() {
		if (keiserDeviceId == -1) {
			this.name = "KeiserM3";
		} else {
			this.name = "KeiserM3-" + keiserDeviceId;
		}

		process.env['BLENO_DEVICE_NAME'] = this.name; 
	}

	checkStartConditions() {
		if (isPoweredOn && keiserDeviceId != -1) {
			bleno.startAdvertising(this.name, [
				this.cps.uuid, 
				this.fms.uuid,
				this.hrs.uuid
			]);
		}
	}
};

module.exports = KeiserBLE;
