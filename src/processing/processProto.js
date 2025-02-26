const { SerialPort } = require('serialport'); 
const protobuf = require("protobufjs");

const os = require('os');
const path = require('path');
const url = require('url');
const fs = require('fs');

let root;  // Global variable to hold the protobuf root
let currentPacket;  // Global variable to store the current packet


// Load protobuf definition and initialize global `root`
protobuf.load(path.resolve(__dirname, 'message.proto'), (err, loadedRoot) => {
  if (err) {
    console.error('Failed to load protobuf definition:', err);
    return;
  }
  root = loadedRoot;
  console.log('Protobuf definition loaded');
});

let portPath;

const { InfluxDB, Point } = require('@influxdata/influxdb-client');

const host = process.env.INFLUX_HOST
// const token = process.env.INFLUX_TOKEN
const token = "1bkG2GLih-gV2kf5sXsGj7NWm7xY5KsRKI8UHwsRLb_Z740htB4oKJK1TPzgO0ZSUHEQUxarMjQECPMfGdVbJQ=="

const influxDB = new InfluxDB({ url: 'https://cwrcg87oxx-fcwnpwwurvjrx2.timestream-influxdb.us-east-2.on.aws:8086', token: token });
const writeApi = influxDB.getWriteApi('915a1d8148ba09aa', 'patagonia');
writeApi.useDefaultTags({region: 'west'}) // To apply one or more tags to all points, use the useDefaultTags() method


// // Function to initialize the serial port
function initProcessProto(mainWindow, filePath) {
  console.log("Initializing processProto");

  if (os.platform() === 'win32') {
    portPath = 'COM3'; // Adjust for your COM port
  } else {
    portPath = '/dev/cu.usbmodem12341'; // Adjust for macOS/Linux
  } // TODO make serial port general?

  console.log('Serial Port Path:', portPath);

  if (!portPath) {
    console.error('Error: Serial port path is undefined');
    return;
  }

  const port = new SerialPort({
    path: portPath,
    baudRate: 115200,
    autoOpen: true,
  });

  let buffer = Buffer.alloc(0); // Initialize an empty buffer

  port.on('data', (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);
  });

  const timeoutMs = 200;

  function readUntilTimeout() {
    const timeout = setTimeout(() => {
      if (buffer.length > 0) {
        console.log('Raw data received:', buffer.toString('hex'));

        try {
          decodeAndPrintMessage(buffer, mainWindow, filePath, new Date().toISOString());
        } catch (error) {
          console.error('Error while decoding message:', error);
        }

        buffer = Buffer.alloc(0); // Clear the buffer after processing
      } else {
        console.log('No data received within timeout.');
      }

      readUntilTimeout(); // Schedule the next read
    }, timeoutMs);
  }

  port.on('open', () => {
    console.log('Serial port opened.');
    readUntilTimeout();
  });

  port.on('error', (err) => {
    console.error('Serial port error:', err);
  });

  port.on('close', () => {
    console.log('Serial port closed.');
  });
}


function decodeAndPrintMessage(buffer, mainWindow, filePath, timeReceived) {
  if (!root) {
    console.error('Protobuf definition not loaded');
    return;
  }

  try {
    console.log('Raw data received:', buffer.toString('hex'));

    // Obtain a message type from the root
    const LoRaPacket = root.lookupType('LoRaPacket');

    // Attempt to decode the buffer into a generic object
    let packet;
    try {
      packet = LoRaPacket.decode(buffer);
    } catch (decodeError) {
      console.log('Packet received is not a LoraPacket:', decodeError);
      return; // Exit if the buffer cannot be decoded
    }

    // const packet = LoRaPacket.decode(buffer);

    const packetObject = LoRaPacket.toObject(packet, { defaults: true });
    console.log("converted to packetObject");

    console.log('Deserialized packetObject:', packetObject);

    console.log('test indexing packet.systemSummaryPacket.temperature',  packet.systemSummaryPacket.temperature);

    // Store the current packet in the global variable
    currentPacket = packetObject;

    // Send the packet to the frontend
    mainWindow.webContents.send('packet-updated', packetObject);

    // Store current packet in the csv
    saveToCsv(packetObject, filePath, timeReceived);

    // Write current packet to InfluxDB
    writeToInfluxDB(packetObject, timeReceived);

  } catch (error) {
    console.error('Error decoding message:', error);
  }
}

async function listSerialPorts() {
  try {
    const ports = await SerialPort.list();
    if (ports.length === 0) {
      console.log('No serial ports found. Retrying in 2 seconds...');
      // Recheck for ports every 2 seconds
      setTimeout(listSerialPorts, 2000);
    } else {
      console.log('Ports:', ports);
      // Optionally, you can handle the list of ports here or update the UI
    }
  } catch (err) {
    console.error('Error listing ports:', err);
    // Retry after 2 seconds if an error occurs
    setTimeout(listSerialPorts, 2000);
  }
}

// Function to get the current packet
function getCurrentPacket() {
  if (!currentPacket) {
    console.log('No packet received yet.');
    return null;
  }
  return currentPacket;
}

// Function to write to InfluxDB
function writeToInfluxDB(packetObject, timeReceived) {
  const systemSummary = packetObject.systemSummaryPacket || {};
  const packetLocation = packetObject.systemSummaryPacket.location || {};
  const sdcardState = packetObject.systemSummaryPacket.sdCard || {};
  const radioPower = packetObject.systemSummaryPacket.radioPower || {};

  console.log("systemSummary.classifierVersion", systemSummary.classifierVersion)
  
  const point = new Point('system_summary')
    .tag('systemUid', packetObject.header.systemUid)
    .floatField('msFromStart', packetObject.header.msFromStart || null)
    .floatField('epoch', packetObject.header.epoch || null)
    .floatField('lat', packetLocation.lat || null)
    .floatField('lon', packetLocation.lon || null)
    .floatField('elev', packetLocation.elev || null)
    .floatField('classifierVersion', systemSummary.classifierVersion || 0)
    .floatField('epochLastDetection', systemSummary.epochLastDetection || 0)
    .floatField('transmissionIntervalM', systemSummary.transmissionIntervalM || 0)
    .floatField('buzzCountInterval', systemSummary.buzzCountInterval || 0)
    .floatField('species_1CountInterval', systemSummary.species_1CountInterval || 0)
    .floatField('species_2CountInterval', systemSummary.species_2CountInterval || 0)
    .floatField('sdcardSpaceRemaining', sdcardState.spaceRemaining || 0)
    .floatField('sdcardTotalSpace', sdcardState.totalSpace || 0)
    .floatField('radioRssi', radioPower.rssi || 0)
    .floatField('radioSnr', radioPower.snr || 0)
    .floatField('radioRssiEst', radioPower.rssiEst || 0)
    .floatField('batteryVoltage', systemSummary.batteryVoltage || 0)
    .floatField('temperature', systemSummary.temperature || 0)
    .floatField('humidity', systemSummary.humidity || 0)
    .floatField('gas', systemSummary.gas || 0)
    .timestamp(new Date(timeReceived));

    writeApi.writePoint(point); // write the point to InfluxDB

    writeApi.flush().then(() => {
      console.log('Data written to InfluxDB');
    }).catch(err => {
      console.error('Error writing to InfluxDB', err);
    });

}

function closeInfluxDB() {
  writeApi.close().then(() => {
    console.log('InfluxDB writeApi closed');
  }).catch(err => {
    console.error('Error closing InfluxDB writeApi', err);
  });
}

process.on('SIGINT', () => {
  console.log('Received SIGINT. Closing InfluxDB writeApi...');
  closeInfluxDB();
  process.exit();
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Closing InfluxDB writeApi...');
  closeInfluxDB();
  process.exit();
});

// Function to save Protobuf data into CSV file
function saveToCsv(packetObject, csvFilePath, timeReceived) {
  const header = [
      'timeReceived', 'systemUid', 'msFromStart', 'epoch', 'lat', 'lon', 'elev',
      'classifier_version', 'epoch_last_detection', 'transmission_interval_m', 'buzz_count_interval', 
      'species_1_count_interval', 'species_2_count_interval',
      'sdcardSpaceRemaining', 'sdcardTotalSpace', 
      'radioRssi', 'radioSnr', 'radioRssiEst',
      'batteryVoltage', 'temperature', 'humidity', 'gas',
  ];

  // Check if the CSV file exists
  console.log("csvFilePath ", csvFilePath)
  if (fs.existsSync(csvFilePath)) {
      // Extract values from packetObject, or write null if not available
    const systemSummary = packetObject.systemSummaryPacket || {};
    const packetLocation = packetObject.systemSummaryPacket.location || {};
    const sdcardState = packetObject.systemSummaryPacket.sdCard || {};
    const radioPower = packetObject.systemSummaryPacket.radioPower || {};

    const row = [
        timeReceived || null,
        packetObject.header.systemUid || null,
        packetObject.header.msFromStart || null,
        packetObject.header.epoch || null,
        packetLocation.lat || null,
        packetLocation.lon || null,
        packetLocation.elev || null,
        systemSummary.classifierVersion || null,
        systemSummary.epochLastDetection || null,
        systemSummary.transmissionIntervalM || null,
        systemSummary.buzzCountInterval || null,
        systemSummary.species_1CountInterval || null,
        systemSummary.species_2CountInterval || null,
        sdcardState.spaceRemaining || null,
        sdcardState.totalSpace || 0,
        radioPower.rssi || null,
        radioPower.snr || null,
        radioPower.rssiEst || null,
        systemSummary.batteryVoltage || null,
        systemSummary.temperature || null,
        systemSummary.humidity || null,
        systemSummary.gas || null
    ];

    // Write the row to the CSV file
    fs.appendFileSync(csvFilePath, row.join(',') + '\n', 'utf8');
  }
  else {
    console.log("CSV file not created yet")
  }

  
}


module.exports = { getCurrentPacket, initProcessProto, listSerialPorts, saveToCsv };
