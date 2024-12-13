
const timestamps = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '01:00', '01:30']

function generateData(timestamps, { min, max }) {
    return timestamps.map(time => {
      const y = Math.floor(Math.random() * (max - min + 1)) + min; // Random value between min and max
      return { x: String(time), y: y }; // Convert the time to a string and return the object
    });
  }
  
  
export const heatMapDataDashboard = [
    {
        name: 'Temperature',
        data: generateData(timestamps, {
          min: 0,
          max: 90
        })
      },
      {
        name: 'Humidity',
        data: generateData(timestamps, {
          min: 0,
          max: 90
        })
      },
      {
        name: 'Pressure',
        data: generateData(timestamps, {
          min: 0,
          max: 90
        })
      },
      {
        name: 'Gas',
        data: generateData(timestamps, {
          min: 0,
          max: 90
        })
      },
      {
        name: 'PM',
        data: generateData(timestamps, {
          min: 0,
          max: 90
        })
      },
      {
        name: 'Light',
        data: generateData(timestamps, {
          min: 0,
          max: 90
        })
      },
  ];