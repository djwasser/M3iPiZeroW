// Setup multi role support and two different adapters for Peripheral and Central
process.env['NOBLE_MULTI_ROLE'] = 1
process.env['NOBLE_REPORT_ALL_HCI_EVENTS'] = 1
process.env['BLENO_HCI_DEVICE_ID'] = 0
process.env['NOBLE_HCI_DEVICE_ID'] = 1

const noble = require('@abandonware/noble');
const keiserParser = require('./keiserParser.js')
const KeiserBLE = require('./BLE/keiserBLE')

var fillInTimer = null;
var dataToSend = null;
var connectedCount = 0;
var abortCount = 0;
var targetDeviceId = -1;
var cranks = 0;
var cranksLastEventTime = 0;

console.log("Starting");

var keiserBLE = new KeiserBLE();

keiserBLE.on('advertisingStart', (client) => {
	//oled.displayBLE('Started');
});
keiserBLE.on('accept', (client) => {
	connectedCount++;
	//oled.displayBLE('Connected');
});
keiserBLE.on('disconnect', (client) => {
	connectedCount--;
	//oled.displayBLE('Disconnected');
});

noble.on('stateChange', async (state) => {
    console.log(`[Central] State changed to ${state}`);
    if (state === 'poweredOn') {
    	console.log(`[Central] starting scan`);
        await noble.startScanningAsync(null, true);
    } else if (state === 'poweredOff') {
		console.log('No adapter detected, exiting in 5 seconds');
		setTimeout(() => {
			process.exit();	
		}, 5000);
    }
});

function sendFillInData() {
	if (!dataToSend || (connectedCount < 1)) {
		console.log("Aborting nothing to send");
		// after 5 minutes assume there are no connections
		if (++abortCount > 60) {
			console.log("Setting connected count to 0.");
			connectedCount = 0;
		}
	} else {
		abortCount = 0;
	}

	console.log("Sending fill in data");
	keiserBLE.notifyClient(dataToSend);
	if (connectedCount > 0) {
		fillInTimer = setTimeout(sendFillInData, 1000);
	};
};

noble.on('discover', (peripheral) => {
   	//console.log(`[Central] Found device ${peripheral.advertisement.localName} ${peripheral.address}`); 
	if (peripheral.advertisement.localName == "M3") {
		try {
			var result = keiserParser.parseAdvertisement(peripheral);
			if (targetDeviceId == -1) {
				if (result.realTime) {
					console.log(`Attaching to bike id ${result.ordinalId}`);
					targetDeviceId = result.ordinalId;
					keiserBLE.setDeviceId(targetDeviceId);
				} else {
					return;
				}
			}
			if (result.ordinalId == targetDeviceId) {
				console.log(`Bike ${result.ordinalId}: ${result.realTime} ${result.cadence} ${result.power} ${result.gear} ${result.duration}`); 
				if (result.realTime) {
					if (result.cadence > 0) {
						var cranksCurrentEventTime = (cranksLastEventTime + Math.round((60 * 1024)/result.cadence)) % 65535;
						cranks++;
					} else {
						var cranksCurrentEventTime = cranksLastEventTime;
					}
					dataToSend = { 
						rpm: result.cadence,
						ftmsrpm: result.ftmscadence,
						power: result.power,
						hr: result.heartRate,
						crankcount: cranks,
						cranktime: cranksCurrentEventTime
					};
					cranks = cranks % 65535;
					cranksLastEventTime = cranksCurrentEventTime;
					if (fillInTimer) {
						clearTimeout(fillInTimer);
						fillInTimer = null;
					}

					if (connectedCount > 0) {
						keiserBLE.notifyClient(dataToSend);
						fillInTimer = setTimeout(sendFillInData, 1000);
					}
				}
			}
		} 
		catch (err) {
			console.log(`\tError parsing: ${err}`);
			console.log(`\t ${err.stack}`);
		}
	}
});
