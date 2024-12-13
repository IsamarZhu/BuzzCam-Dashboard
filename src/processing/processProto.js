const { SerialPort } = require('serialport'); 
// const { SimpleSensorReading } = require('./protoMessage');
const protobuf = require("protobufjs");
// const proto = require("./message.proto");


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

// Function to initialize the serial port
function initProcessProto(mainWindow, filePath) {
  console.log("in initProcessProto");

  // Determine the port path based on the OS
  if (os.platform() === 'win32') {
    portPath = 'COM3'; // Change to the correct COM port
  } else {
    portPath = '/dev/tty.usbmodem12341'; // Adjust for macOS/Linux
  }

  console.log('Serial Port Path:', portPath);  // Debugging: log the port path

  // Ensure portPath is defined before creating SerialPort
  if (!portPath) {
      console.error('Error: Serial port path is undefined');
      return;
  }

  // Create the SerialPort instance
  const port = new SerialPort({
    path: portPath,
    baudRate: 115200
  });

  // Listen for data from the serial port
  port.on('data', (data) => {
    // const timeReceived = new Date().toLocaleString();

    // Get the current date and time
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // getMonth is 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Format as MM-DD-YYYY_HH:MM:SS
    const timeReceived = `${month}-${day}-${year}_${hours}.${minutes}.${seconds}`;

    console.log('Data received:', data.toString());
    decodeAndPrintMessage(data, mainWindow, filePath, timeReceived);  // Pass mainWindow to decodeAndPrintMessage
    // getCurrentPacket(data);
  });

  // Handle errors
  port.on('error', (err) => {
    console.error('Serial Port Error:', err);
  });
}

function decodeAndPrintMessage(dataBuffer, mainWindow, filePath, timeReceived) {
  if (!root) {
    console.error('Protobuf definition not loaded');
    return;
  }

  try {
    // Obtain a message type from the root
    const Packet = root.lookupType('Packet');
    const packet = Packet.decode(dataBuffer);

    // Convert the packet to a plain object
    const packetObject = Packet.toObject(packet, { defaults: true });

    console.log('Deserialized Packet:', packetObject);

    console.log('test indexing packetObject.systemInfoPacket.simpleSensorReading.temperature',  packetObject.systemInfoPacket.simpleSensorReading.temperature);

    // Store the current packet in the global variable
    currentPacket = packetObject;

    // Send the packet to the frontend
    mainWindow.webContents.send('packet-updated', packetObject);

    // Store current packet in the csv

    saveToCsv(packetObject, filePath, timeReceived);


    // // Check for SystemInfoPacket payload and handle it
    // if (packetObject.system_info_packet) {
    //   const sensorReading = packetObject.system_info_packet.simple_sensor_reading;
    //   console.log('Sensor Reading:', sensorReading);
    // }
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

// Function to save Protobuf data into CSV file
function saveToCsv(packetObject, csvFilePath, timeReceived) {
  const header = [
      'timeReceived', 'systemUid', 'msFromStart', 'epoch', 'packetIndex', 'requestAck',
      'temperature', 'humidity', 'pressure', 'gas', 'pm2_5', 'light', 'activity', 'steps',
      'particulateStaticObstructed', 'particulateDynamicObstructed', 'particulateOutsideDetectionLimits',
      'deviceEngaged', 'sdcardSpaceRemaining', 'sdcardTotalSpace',
      'batteryCharging', 'batteryVoltage', 'batteryPercentage',
      'gpsLatitude', 'gpsLongitude', 'gpsAltitude', 'gpsSpeed', 'gpsHeading',
      'radioRssi', 'radioSnr', 'radioRssiEst'
  ];

  // Check if the CSV file exists
  console.log("csvFilePath ", csvFilePath)
  if (fs.existsSync(csvFilePath)) {
      // fs.writeFileSync(csvFilePath, header.join(',') + '\n', 'utf8');
      // Extract values from packetObject, or write null if not available
    const systemInfo = packetObject.systemInfoPacket || {};
    const sensorReading = systemInfo.simpleSensorReading || {};
    const sdcardState = systemInfo.sdcardState || {};
    const batteryState = systemInfo.batteryState || {};
    const gpsData = systemInfo.gpsData || {};
    const radioPower = packetObject.radioPower || {};

    const row = [
        timeReceived || null,
        packetObject.header.systemUid || null,
        packetObject.header.msFromStart || null,
        packetObject.header.epoch ? packetObject.header.epoch.low || null : null,
        packetObject.header.packetIndex || null,
        packetObject.header.requestAck ? "true" : "false",
        sensorReading.temperature || null,
        sensorReading.humidity || null,
        sensorReading.pressure || null,
        sensorReading.gas || null,
        sensorReading.pm2_5 || null,
        sensorReading.light || null,
        sensorReading.activity || 0,
        sensorReading.steps || 0,
        sensorReading.particulateStaticObstructed ? "true" : "false",
        sensorReading.particulateDynamicObstructed ? "true" : "false",
        sensorReading.particulateOutsideDetectionLimits ? "true" : "false",
        systemInfo.deviceEngaged ? "true" : "false",
        sdcardState.spaceRemaining || null,
        sdcardState.totalSpace || 0,
        batteryState.charging ? "true" : "false",
        batteryState.voltage || null,
        batteryState.percentage || null,
        gpsData.latitude || null,
        gpsData.longitude || null,
        gpsData.altitude || null,
        gpsData.speed || null,
        gpsData.heading || null,
        radioPower.rssi || null,
        radioPower.snr || null,
        radioPower.rssiEst || null
    ];

    // Write the row to the CSV file
    fs.appendFileSync(csvFilePath, row.join(',') + '\n', 'utf8');
  }
  else {
    console.log("CSV file not created yet")
  }

  
}


module.exports = { getCurrentPacket, initProcessProto, listSerialPorts, saveToCsv };


// const { SerialPort } = require('serialport'); 
// // const { SimpleSensorReading } = require('./protoMessage');
// const protobuf = require("protobufjs");
// // const proto = require("./message.proto");


// const os = require('os');
// const path = require('path');
// const url = require('url');


// let portPath;
// let SimpleSensorReading;

// // Function to initialize the protobuf definitions
// async function loadProtobufDefinitions() {
//   return new Promise((resolve, reject) => {
//     protobuf.load(path.resolve(__dirname, 'message.proto'), (err, root) => {
//       if (err) {
//         reject(err);
//         return;
//       }

//       // Obtain message types
//       SimpleSensorReading = root.lookupType('SimpleSensorReading');
//       resolve();
//     });
//   });
// }

// // Function to initialize the serial port
// async function initProcessProto(mainWindow) {
//   console.log('in initProcessProto');

//   // Load protobuf definitions
//   try {
//     await loadProtobufDefinitions();
//   } catch (err) {
//     console.error('Failed to load protobuf definitions:', err);
//     return;
//   }

//   // Determine the port path based on the OS
//   if (os.platform() === 'win32') {
//     portPath = 'COM3'; // Change to the correct COM port
//   } else {
//     portPath = '/dev/tty.usbmodem12341'; // Adjust for macOS/Linux
//   }

//   console.log('Serial Port Path:', portPath); // Debugging: log the port path

//   // Ensure portPath is defined before creating SerialPort
//   if (!portPath) {
//     console.error('Error: Serial port path is undefined');
//     return;
//   }

//   // Create the SerialPort instance
//   const port = new SerialPort({
//     path: portPath,
//     baudRate: 9600
//   });

//   // Listen for data from the serial port
//   port.on('data', (data) => {
//     console.log('Data received:', data.toString());
//     decodeAndPrintMessage(data);
    
//     // // Send data to the React frontend via IPC
//     // if (mainWindow) {
//     //   mainWindow.webContents.send('serial-data', data.toString());
//     // }
//   });

//   // Handle errors
//   port.on('error', (err) => {
//     console.error('Serial Port Error:', err);
//   });
// }

// // Function to decode and print message
// function decodeAndPrintMessage(dataBuffer) {
//   if (!SimpleSensorReading) {
//     console.error('Protobuf definition not loaded');
//     return;
//   }

//   try {
//     // Decode the buffer into a Packet message
//     const Packet = root.lookupType('Packet');
//     const packet = Packet.decode(dataBuffer);

//     // Convert the packet to a plain object
//     const packetObject = Packet.toObject(packet, { defaults: true });

//     console.log('Deserialized Packet:', packetObject);

//     // Check for SystemInfoPacket payload and handle it
//     if (packetObject.system_info_packet) {
//       const sensorReading = packetObject.system_info_packet.simple_sensor_reading;
//       console.log('Sensor Reading:', sensorReading);
//     }
//   } catch (error) {
//     console.error('Error decoding message:', error);
//   }
// }


// // Function to list serial ports
// async function listSerialPorts() {
//   try {
//     const ports = await SerialPort.list();
//     if (ports.length === 0) {
//       console.log('No serial ports found. Retrying in 2 seconds...');
//       setTimeout(listSerialPorts, 2000);
//     } else {
//       console.log('Ports:', ports);
//     }
//   } catch (err) {
//     console.error('Error listing ports:', err);
//     setTimeout(listSerialPorts, 2000);
//   }
// }

// // // Function to initialize the serial port
// // function initProcessProto(mainWindow) {

// //   let SimpleSensorReading;

// //   protobuf.load('./message.proto', (err, root) => {
// //     if (err) {
// //       console.error('Failed to load protobuf definition:', err);
// //       return;
// //     }

// //     // Obtain a message type
// //     SimpleSensorReading = root.lookupType('SimpleSensorReading');
// //   });

// //   console.log("in initProcessProto");

// //   // Determine the port path based on the OS
// //   if (os.platform() === 'win32') {
// //     portPath = 'COM3'; // Change to the correct COM port
// //   } else {
// //     portPath = '/dev/tty.usbmodem12341'; // Adjust for macOS/Linux
// //   }

// //   console.log('Serial Port Path:', portPath);  // Debugging: log the port path

// //   // Ensure portPath is defined before creating SerialPort
// //   if (!portPath) {
// //       console.error('Error: Serial port path is undefined');
// //       return;
// //   }

// //   // Create the SerialPort instance
// //   const port = new SerialPort({
// //     path: portPath,
// //     baudRate:9600
// //   });
  

// //   // Listen for data from the serial port
// //   port.on('data', (data) => {
// //     console.log('Data received:', data.toString());
// //     decodeAndPrintMessage(data)

// //     // // Send data to the React frontend via IPC
// //     // if (mainWindow) {
// //     //   mainWindow.webContents.send('serial-data', data.toString());
// //     // }
// //   });

// //   // Handle errors
// //   port.on('error', (err) => {
// //     console.error('Serial Port Error:', err);
// //   });
// // }

// // // function decodeAndPrintMessage(dataBuffer) {

// // //     // // Deserialize the buffer into a SimpleSensorReading message
// // //     // const message = SimpleSensorReading.decodeDelimited(dataBuffer);

// // //     // // Convert the message to a plain object
// // //     // const messageObject = SimpleSensorReading.toObject(false, message);
  
// // //     // // Extract information from the object
// // //     // console.log('Deserialized Message:', messageObject);

// // //     // Load the .proto file
// // //   protobuf.load("./message,proto", (err, root) => {
// // //     if (err) throw err;
    
// // //     // Obtain a message type
// // //     const SimpleSensorReading = root.lookupType('SimpleSensorReading');
    
// // //     // Decode a message
// // //     const message = SimpleSensorReading.decode(dataBuffer);
    
// // //     // Convert the message to a plain object
// // //     const messageObject = SimpleSensorReading.toObject(message, { defaults: true });
    
// // //     console.log('Deserialized Message:', messageObject);
// // //   });

// // // }


// // function decodeAndPrintMessage(dataBuffer) {
// //   if (!SimpleSensorReading) {
// //     console.error('Protobuf definition not loaded');
// //     return;
// //   }

// //   try {
// //     // Decode the buffer into a SimpleSensorReading message
// //     const message = SimpleSensorReading.decode(dataBuffer);

// //     // Convert the message to a plain object
// //     const messageObject = SimpleSensorReading.toObject(message, { defaults: true });

// //     console.log('Deserialized Message:', messageObject);
// //   } catch (error) {
// //     console.error('Error decoding message:', error);
// //   }
// // }


// // // const { Packet, SimpleSensorReading, SystemInfoPacket, ConfigPacket, AckPacket, RadioPower } = proto;

// // // // Example of handling incoming data from a serial port
// // // function processData(dataBuffer) {
// // //   try {
// // //     // Deserialize the data buffer into a Packet message
// // //     const packet = Packet.decode(dataBuffer);

// // //     // Convert the packet to a plain JavaScript object
// // //     const packetObject = Packet.toObject(packet, {
// // //       enums: String,  // Convert enums to strings if needed
// // //       defaults: true  // Include default values
// // //     });

// // //     console.log('Deserialized Packet:', packetObject);

// // //     // Handle the specific payload
// // //     if (packetObject.system_info_packet) {
// // //       const sensorReading = packetObject.system_info_packet.simple_sensor_reading;
// // //       console.log('Sensor Reading:', sensorReading);
// // //     }
    
// // //     // Handle other payload types as needed
// // //   } catch (error) {
// // //     console.error('Error processing data:', error);
// // //   }
// // // }


// // async function listSerialPorts() {
// //   try {
// //     const ports = await SerialPort.list();
// //     if (ports.length === 0) {
// //       console.log('No serial ports found. Retrying in 2 seconds...');
// //       // Recheck for ports every 2 seconds
// //       setTimeout(listSerialPorts, 2000);
// //     } else {
// //       console.log('Ports:', ports);
// //       // Optionally, you can handle the list of ports here or update the UI
// //     }
// //   } catch (err) {
// //     console.error('Error listing ports:', err);
// //     // Retry after 2 seconds if an error occurs
// //     setTimeout(listSerialPorts, 2000);
// //   }
// // }



// module.exports = { initProcessProto, listSerialPorts };
