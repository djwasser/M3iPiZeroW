// Setup multi role support and two different adapters for Peripheral and Central
process.env['NOBLE_MULTI_ROLE'] = 1
process.env['NOBLE_REPORT_ALL_HCI_EVENTS'] = 1
process.env['BLENO_HCI_DEVICE_ID'] = 0
process.env['NOBLE_HCI_DEVICE_ID'] = 1

const noble = require('@abandonware/noble');
const keiserParser = require('./keiserParser.js');
const KeiserBLE = require('./BLE/keiserBLE');
const { createServer } = require('http');

var fillInTimer = null;
var dataToSend = null;
var connectedCount = 0;
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
	} else {
		console.log("Sending fill in data");
		keiserBLE.notifyClient(dataToSend);
		fillInTimer = setTimeout(sendFillInData, 1000);
	}

};

createServer((req, res) => {
	res.writeHead(200, { 'Content-Type': 'text/html' })
	res.end(`
<h1>RPM: ${result.cadence}</h1> 
<h1>Power: ${result.power}</h1>
<h1>Gear: ${result.gear}</h1>
<h1>Duration ${result.duration}</h1>`)
}).listen(3000, () => console.log('server running - 3000'));

noble.on('discover', (peripheral) => {
   	//console.log(`[Central] Found device ${peripheral.advertisement.localName} ${peripheral.address}`); 
	if (peripheral.advertisement.localName == "M3") {
		try {
			var result = keiserParser.parseAdvertisement(peripheral);
			console.log(`Bike ${result.ordinalId}: RT: ${result.realTime} RPM: ${result.cadence} PWR: ${result.power} GEAR: ${result.gear} ET: ${result.duration}`);
			
			// Only continue if M3i is transmitting real-time data
			if (result.realTime) {
				// Only use data coming from target device; if no target device set then set it
				if (result.ordinalId != targetDeviceId) {
					if (targetDeviceId == -1) {
						console.log(`Attaching to bike id ${result.ordinalId}`);
						targetDeviceId = result.ordinalId;
						keiserBLE.setDeviceId(targetDeviceId);
					} else {
						return;
					}
				}
				
				// Use current rpm (cadence) to simulate the crank count and crank event time for CPS and CSC services
				// (for range of valid values for crank count and crank event time, see BLE specs)
				if (result.cadence > 0) {
					var cranksCurrentEventTime = (cranksLastEventTime + Math.round((60 * 1024)/result.cadence)) % 65535;
					cranks++;
				} else {
					var cranksCurrentEventTime = cranksLastEventTime;
				}
				
				// Assemble the data structure for the BLE service/characteristics to use
				dataToSend = { 
						rpm: result.cadence,
						ftmsrpm: result.ftmscadence,
						power: result.power,
						hr: result.heartRate,
						crankcount: cranks,
						cranktime: cranksCurrentEventTime
				};
				// ensure value of cranks is in the range specified by the BLE specification
				cranks = cranks % 65535;
				cranksLastEventTime = cranksCurrentEventTime;
				
				// Reset the fill-data timer if it is set
				if (fillInTimer) {
					clearTimeout(fillInTimer);
					fillInTimer = null;
				}
				
				// Pass data to services/characteritcs to process and send to client; set a timer for fill-data
				if (connectedCount > 0) {
					keiserBLE.notifyClient(dataToSend);
					fillInTimer = setTimeout(sendFillInData, 1000);
				}
			}
		}
		catch (err) {
			console.log(`\tError parsing: ${err}`);
			console.log(`\t ${err.stack}`);
		}
	}
});
