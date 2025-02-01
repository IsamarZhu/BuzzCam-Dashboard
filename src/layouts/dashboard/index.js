/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import { Card, LinearProgress, Stack, Select, MenuItem } from "@mui/material";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiProgress from "components/VuiProgress";

// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import linearGradient from "assets/theme/functions/linearGradient";

// Vision UI Dashboard React base styles
import typography from "assets/theme/base/typography";
import colors from "assets/theme/base/colors";

// Dashboard layout components
import WelcomeMark from "layouts/dashboard/components/WelcomeMark";
import Projects from "layouts/dashboard/components/Projects";
import OrderOverview from "layouts/dashboard/components/OrderOverview";
import SatisfactionRate from "layouts/dashboard/components/SatisfactionRate";
import ReferralTracking from "layouts/dashboard/components/ReferralTracking";

// React icons
import { IoIosRocket } from "react-icons/io";
import { IoGlobe } from "react-icons/io5";
import { IoBuild } from "react-icons/io5";
import { IoWallet } from "react-icons/io5";
import { IoDocumentText } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import { FaTemperatureHalf } from "react-icons/fa6";
import { IoSpeedometerSharp } from "react-icons/io5";
import { PiWindBold } from "react-icons/pi";
import { GiSparkles } from "react-icons/gi";
import { MdBrightnessMedium } from "react-icons/md";
import { TbArrowsMove } from "react-icons/tb";
import { IoPaw } from "react-icons/io5";
import { RiWaterPercentFill } from "react-icons/ri";



// Data
import LineChart from "examples/Charts/LineCharts/LineChart";
import BarChart from "examples/Charts/BarCharts/BarChart";
import HeatMap from "examples/Charts/HeatMaps/HeatMap";

import { lineChartDataDashboard } from "layouts/dashboard/data/lineChartData";
import { lineChartOptionsDashboard } from "layouts/dashboard/data/lineChartOptions";
import { barChartDataDashboard } from "layouts/dashboard/data/barChartData";
import { barChartOptionsDashboard } from "layouts/dashboard/data/barChartOptions";
import { heatMapDataDashboard } from "layouts/dashboard/data/heatMapData";
import { heatMapOptionsDashboard } from "layouts/dashboard/data/heatMapOptions";



// const { ipcRenderer } = window.require('electron');
import { useEffect, useMemo, useState, useRef } from "react";
import LastFivePackets from "./components/LastFivePackets";
import OfflineMap from "./components/OfflineMap";


function getNumFromLong(longObj) {
  
  const low = BigInt.asUintN(32, BigInt(longObj.low));
  const high = BigInt.asUintN(32, BigInt(longObj.high));
  var combined = (high << 32n) | low;
  var combinedBigInt = BigInt.asUintN(64, combined);
  console.log("combinedBigInt ", combinedBigInt)
  return combinedBigInt;

}


const { InfluxDB, Point } = require('@influxdata/influxdb-client');

const host = process.env.INFLUX_HOST
const token = "aCVb85vzJw7oxOS1SQbX13ZPC3z7vuUl5Ba1dbPWg_Tc2E1DEnURAHPLIV6Kp7g1YYLxU-clxLtKK994xtU7Kw=="

const influxDB = new InfluxDB({ url: 'https://us-east-1-1.aws.cloud2.influxdata.com', token: token });
const queryApi = influxDB.getQueryApi('80718fbb557b61b0');


function Dashboard() {
  const { gradients } = colors;
  const { cardContent } = gradients;

  const [currentPacket, setCurrentPacket] = useState(null);

  const [lastPackets, setLastPackets] = useState({}); // dictionary to store last packet from each device, keyed by UID

  const [maxBuzzCount, setMaxBuzzCount] = useState(0); // keep track of the max buzz count so far
  const [minBuzzCount, setMinBuzzCount] = useState(Infinity); // keep track of the min buzz count so far

  const [maxSpecies1Count, setMaxSpecies1Count] = useState(0);
  const [minSpecies1Count, setMinSpecies1Count] = useState(Infinity);

  const [maxSpecies2Count, setMaxSpecies2Count] = useState(0);
  const [minSpecies2Count, setMinSpecies2Count] = useState(Infinity);

  const [temperature, setTemperature] = useState("N/A");
  const [humidity, setHumidity] = useState("N/A");
  const [gas, setGas] = useState("N/A");
  const [classifierVersion, setClassifierVersion] = useState("N/A");
  const [epochLastDetection, setEpochLastDetection] = useState("N/A");
  const [transmissionIntervalM, setTransmissionIntervalM] = useState("N/A");
  const [sdcardSpaceRemaining, setSdcardSpaceRemaining] = useState("N/A");

  const [sdcardTotalSpace, setSdcardTotalSpace] = useState("N/A");

  const [selectedUID, setSelectedUID] = useState("None"); // current UID that is being displayed, selected from dropdown

  const getQuery = async () => {
    const fluxQuery = `
      from(bucket: "buzzcam_test")
        |> range(start: -24h)
        |> filter(fn: (r) => r._measurement == "system_summary")
        |> filter(fn: (r) => r.systemUid == "${selectedUID}")
        |> group(columns: ["_time", "_start", "_stop", "_field"])
        |> last()
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    `;
    try {
      const results = {};
      for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
        const o = tableMeta.toObject(values);
        console.log("InfluxDB response:", o);
        if (o.temperature !== undefined) {
          results.temperature = o.temperature;
        }
        if (o.humidity !== undefined) {
          results.humidity = o.humidity;
        }
        if (o.gas !== undefined) {
          results.gas = o.gas;
        }

        if (o.classifierVersion !== undefined) {
          results.classifierVersion = o.classifierVersion;
        }
        
        if (o.epochLastDetection !== undefined) {
          results.epochLastDetection = o.epochLastDetection;
        }

        if (o.transmissionIntervalM !== undefined) {
          results.transmissionIntervalM = o.transmissionIntervalM;
        }

        if (o.sdcardSpaceRemaining !== undefined) {
          results.sdcardSpaceRemaining = o.sdcardSpaceRemaining;
        }
      }
      // Update state variables with the results
      if (results.temperature !== undefined) {
        setTemperature(results.temperature);
      }
      if (results.humidity !== undefined) {
        setHumidity(results.humidity);
      }
      if (results.gas !== undefined) {
        setGas(results.gas);
      }

      if (results.classifierVersion !== undefined) {
        setClassifierVersion(results.classifierVersion);
      }

      if (results.epochLastDetection !== undefined) {
        setEpochLastDetection(results.epochLastDetection);
      }

      if (results.transmissionIntervalM !== undefined) {
        setTransmissionIntervalM(results.transmissionIntervalM);
      }

      if (results.sdcardSpaceRemaining !== undefined) {
        setSdcardSpaceRemaining(results.sdcardSpaceRemaining);
      }
    } catch (error) {
      console.error("Error querying InfluxDB:", error);
    }
  };

  // store all packets received in dictionary

  // store last packet received for each systemUid in a dict
  

  // const [temperatureLineChartData, setTemperatureLineChartData] = useState([]);
  // const [humidityLineChartData, setHumidityLineChartData] = useState([]);
  // const [pressureLineChartData, setPressureLineChartData] = useState([]);
  // const [gasLineChartData, setGasLineChartData] = useState([]);
  // const [pmLineChartData, setPmLineChartData] = useState([]);
  // const [lightLineChartData, setLightLineChartData] = useState([]);
  // const [activityLineChartData, setActivityLineChartData] = useState([]);
  // const [stepsLineChartData, setStepsLineChartData] = useState([]);


  // const [lastFivePackets, setLastFivePackets] = useState([]);

  // const [lastTenLocations, setLastTenLocations] = useState([]);

  // const [packetDiff, setPacketDiff] = useState({
  //   temperature: 0,
  //   humidity: 0,
  //   pressure: 0,
  //   gas: 0,
  //   pm: 0,
  //   light: 0,
  //   activity: 0,
  //   steps: 0,
  // });

  // const [selectedChart, setSelectedChart] = useState("temperature");

  // // Use ref to store the latest temperatureLineChartData
  // const temperatureDataRef = useRef(temperatureLineChartData);
  // const humidityDataRef = useRef(humidityLineChartData);
  // const pressureDataRef = useRef(pressureLineChartData);
  // const gasDataRef = useRef(gasLineChartData);
  // const pmDataRef = useRef(pmLineChartData);
  // const lightDataRef = useRef(lightLineChartData);
  // const activityDataRef = useRef(activityLineChartData);
  // const stepsDataRef = useRef(stepsLineChartData);


  // // Update ref whenever temperatureLineChartData state changes
  // useEffect(() => {
  //   temperatureDataRef.current = temperatureLineChartData;
  // }, [temperatureLineChartData]);

  // useEffect(() => {
  //   humidityDataRef.current = humidityLineChartData;
  // }, [humidityLineChartData]);

  // useEffect(() => {
  //   pressureDataRef.current = pressureLineChartData;
  // }, [pressureLineChartData]);

  // useEffect(() => {
  //   gasDataRef.current = gasLineChartData;
  // }, [gasLineChartData]);

  // useEffect(() => {
  //   pmDataRef.current = pmLineChartData;
  // }, [pmLineChartData]);

  // useEffect(() => {
  //   lightDataRef.current = lightLineChartData;
  // }, [lightLineChartData]);

  // useEffect(() => {
  //   activityDataRef.current = activityLineChartData;
  // }, [activityLineChartData]);

  // useEffect(() => {
  //   stepsDataRef.current = stepsLineChartData;
  // }, [stepsLineChartData]);

  // useEffect(() => {
  //   const getQuery = async () => {
  //     const fluxQuery = 'from(bucket:"buzzcam_test") |> range(start: -24h) |> last()';
  //     for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
  //       const o = tableMeta.toObject(values);
  //       console.log(`${o._temperature} temperature`);
  //       setTemperature(o._temperature);
  //     }
  //   };

  //   getQuery();
  // }, []);

  useEffect(() => {
    if (window.electron && window.electron.ipcRenderer) {
      // Listen for the packet-updated event
      window.electron.ipcRenderer.on('packet-updated', async (event, packet) => {
        console.log("Packet updated on frontend")
        setCurrentPacket(packet);
        console.log("Packet", packet);
        console.log("currentPacket", currentPacket);

        // update the temperature array
        // const packetEpoch = getEpochFromLong(packet.header.epoch); // Or some method to deserialize Long
        // const newDate = new Date(packetEpoch * 1000n); // If epoch is in seconds, multiply by 1000
        // const newDateSec = new Date(packetEpoch); // If epoch is in seconds, multiply by 1000

        // Get the epoch time from the packet
        const packetEpochBigInt = (new Date()).getTime()
        
        console.log("packetEpoch (BigInt): ", packetEpochBigInt);
        console.log("newDate (seconds): ", new Date(Number(packetEpochBigInt)));


        // const newTemp = packet.systemInfoPacket.simpleSensorReading.temperature
        // const newHumidity = packet.systemInfoPacket.simpleSensorReading.humidity;
        // const newPressure = packet.systemInfoPacket.simpleSensorReading.pressure;
        // const newGas = packet.systemInfoPacket.simpleSensorReading.gas;
        // const newPm = packet.systemInfoPacket.simpleSensorReading.pm2_5;
        // const newLight = packet.systemInfoPacket.simpleSensorReading.light;
        // const newActivity = packet.systemInfoPacket.simpleSensorReading.activity; // ENUM to display text
        // const newSteps = packet.systemInfoPacket.simpleSensorReading.steps;

        // console.log("newTemp ", newTemp)
        // // setTemperatureLineChartData((prevData) => [...prevData, [0, 1]]);

        // console.log("test triggering electron build workflow!")

        // // Update state using ref to always reference the latest array
        // setTemperatureLineChartData([...temperatureDataRef.current, [Number(packetEpochBigInt), newTemp]]);
        // setHumidityLineChartData([...humidityDataRef.current, [Number(packetEpochBigInt), newHumidity]]);
        // setPressureLineChartData([...pressureDataRef.current, [Number(packetEpochBigInt), newPressure]]);
        // setGasLineChartData([...gasDataRef.current, [Number(packetEpochBigInt), newGas]]);
        // setPmLineChartData([...pmDataRef.current, [Number(packetEpochBigInt), newPm]]);
        // setLightLineChartData([...lightDataRef.current, [Number(packetEpochBigInt), newLight]]);
        // setActivityLineChartData([...activityDataRef.current, [Number(packetEpochBigInt), newActivity]]);
        // setStepsLineChartData([...stepsDataRef.current, [Number(packetEpochBigInt), newSteps]]);


        // console.log("temperatureLineChartData, ", temperatureLineChartData)

        // // Update the lastFivePackets array to store the packet and its received date
        // setLastFivePackets((prevPackets) => {
        //   const newPacket = [
        //     packet,
        //     new Date(Number(packetEpochBigInt))
        //   ];

        //   const newPackets = [...prevPackets, newPacket].slice(-5); // Only keep the last 5 packets
        //   return newPackets;
        // });

        // const newLocationData = {
        //   loc: { 
        //     latitude: packet.systemInfoPacket.gpsData.latitude, 
        //     longitude: packet.systemInfoPacket.gpsData.longitude 
        //   },
        //   time: new Date(Number(packetEpochBigInt)),
        //   uid: packet.header.systemUid,
        // };
    
        // // Update the lastTenLocations array, keeping only the last 10 entries
        // setLastTenLocations((prevLocations) => {
        //   const updatedLocations = [...prevLocations, newLocationData].slice(-10);
        //   return updatedLocations;
        // });

        // // Log the updated locations for testing
        // console.log("Updated lastTenLocations: ", lastTenLocations);

        
        // update dictionary with new packet
        // if packet already in dictionary, update
        // if packet not in dictionary, add it
        const currentUID = packet.header.systemUid
        console.log("currentUID ", currentUID);

        setLastPackets(prevDict => ({
          ...prevDict,
          [currentUID]: packet
        }));

        // update maxBuzzCount
        setMaxBuzzCount(prevMax => Math.max(prevMax, packet.systemSummaryPacket.buzzCountInterval));
        console.log("maxBuzzCount ", maxBuzzCount);

        // update minBuzzCount
        setMinBuzzCount(prevMin => Math.min(prevMin, packet.systemSummaryPacket.buzzCountInterval));
        console.log("minBuzzCount ", minBuzzCount);

        // update maxSpecies1Count
        setMaxSpecies1Count(prevMax => Math.max(prevMax, packet.systemSummaryPacket.species_1CountInterval));
        console.log("maxSpecies1Count ", maxSpecies1Count);

        // update minSpecies1Count
        setMinSpecies1Count(prevMin => Math.min(prevMin, packet.systemSummaryPacket.species_1CountInterval));
        console.log("minSpecies1Count ", minSpecies1Count);

        // update maxSpecies2Count
        setMaxSpecies2Count(prevMax => Math.max(prevMax, packet.systemSummaryPacket.species_2CountInterval));
        console.log("maxSpecies2Count ", maxSpecies2Count);

        // update minSpecies2Count
        setMinSpecies2Count(prevMin => Math.min(prevMin, packet.systemSummaryPacket.species_2CountInterval));
        console.log("minSpecies2Count ", minSpecies2Count);

        // only requery if the current selected UID is being updated
        console.log("selectedUID ", selectedUID);
        if (String(currentUID) === String(selectedUID)) {
          // reset sd card space total space
          setSdcardTotalSpace(packet.systemSummaryPacket.sdCard.totalSpace);

          console.log("currentUID === selectedUID")

          await getQuery();
        }
        

      });

      // Cleanup the event listener when the component unmounts
      return () => {
        if (window.electron && window.electron.ipcRenderer && typeof window.electron.ipcRenderer.removeAllListeners === 'function') {
          window.electron.ipcRenderer.removeAllListeners('packet-updated');
        }
        // window.electron.ipcRenderer.removeAllListeners('packet-updated');
      };
    } else {
      console.error("ipcRenderer is not available.");
    }
  }, [selectedUID]);

  // // Log updated temperature data
  // useEffect(() => {
  //   console.log("Updated temperatureLineChartData: ", temperatureLineChartData);
  // }, [temperatureLineChartData]);

  // // Log updated location data
  // useEffect(() => {
  //   console.log("Updated lastTenLocations: ", lastTenLocations);
  // }, [lastTenLocations]);

  // useEffect(() => {
  //   console.log("Updated lastFivePackets: ", lastFivePackets);
  //   console.log("lastFivePackets.length ", lastFivePackets.length)

  //       if (lastFivePackets.length > 1) { // if there's another packet to compare to
  //         console.log("updating packetDiff")
  //         const newDiff = {
  //           "temperature": (currentPacket.systemInfoPacket.simpleSensorReading.temperature - lastFivePackets[lastFivePackets.length - 2][0].systemInfoPacket.simpleSensorReading.temperature).toFixed(2),
  //           "humidity": (currentPacket.systemInfoPacket.simpleSensorReading.humidity - lastFivePackets[lastFivePackets.length - 2][0].systemInfoPacket.simpleSensorReading.humidity).toFixed(2),
  //           "pressure": (currentPacket.systemInfoPacket.simpleSensorReading.pressure - lastFivePackets[lastFivePackets.length - 2][0].systemInfoPacket.simpleSensorReading.pressure).toFixed(2),
  //           "gas": (currentPacket.systemInfoPacket.simpleSensorReading.gas - lastFivePackets[lastFivePackets.length - 2][0].systemInfoPacket.simpleSensorReading.gas).toFixed(2),
  //           "pm": (currentPacket.systemInfoPacket.simpleSensorReading.pm2_5 - lastFivePackets[lastFivePackets.length - 2][0].systemInfoPacket.simpleSensorReading.pm2_5).toFixed(2), 
  //           "light": (currentPacket.systemInfoPacket.simpleSensorReading.light - lastFivePackets[lastFivePackets.length - 2][0].systemInfoPacket.simpleSensorReading.light).toFixed(2),
  //           "activity": (currentPacket.systemInfoPacket.simpleSensorReading.activity - lastFivePackets[lastFivePackets.length - 2][0].systemInfoPacket.simpleSensorReading.activity).toFixed(2),
  //           "steps": (currentPacket.systemInfoPacket.simpleSensorReading.steps - lastFivePackets[lastFivePackets.length - 2][0].systemInfoPacket.simpleSensorReading.steps).toFixed(2),
  //         }
  //         setPacketDiff(newDiff)
  //       }
        
  // }, [lastFivePackets]);

  // useEffect(() => {
  //   console.log("Updated packetDiff: ", packetDiff);
  // }, [packetDiff]);

  useEffect(() => {
    console.log("Updated lastPackets: ", lastPackets);
  }, [lastPackets]);

  useEffect(() => {
    console.log("Updated currentPacket: ", currentPacket);
  }, [currentPacket]);


  // also update the minicard values if the selected UID changes
  useEffect(() => {
    console.log("selectedUID in useEffect: ", selectedUID);
    if (selectedUID != "None") {
      console.log("currentUID === selectedUID")
      // influxDB query
      

      getQuery();
    
    }
  }, [selectedUID]);
  
  // handle selected UID change
  const handleSelectedUIDChange = (event) => {
    const newUID = event.target.value;
    console.log("Selected UID new: ", newUID);
    setSelectedUID(newUID); // Update the selected chart based on dropdown selection
  };




  // // handle line chart change
  // const handleChartChange = (event) => {
  //   setSelectedChart(event.target.value); // Update the selected chart based on dropdown selection
  // };

  // // Determine which line chart data to display
  // const lineChartData = () => {
  //   switch (selectedChart) {
  //     case "humidity":
  //       return humidityLineChartData.length > 0 ? [{ name: "Humidity", data: humidityLineChartData }] : [];
  //     case "pressure":
  //       return pressureLineChartData.length > 0 ? [{ name: "Pressure", data: pressureLineChartData }] : [];
  //     case "gas":
  //       return gasLineChartData.length > 0 ? [{ name: "Gas", data: gasLineChartData }] : [];
  //     case "pm":
  //       return pmLineChartData.length > 0 ? [{ name: "Particulate Matter", data: pmLineChartData }] : [];
  //     case "light":
  //       return lightLineChartData.length > 0 ? [{ name: "Light", data: lightLineChartData }] : [];
  //     case "activity":
  //       return activityLineChartData.length > 0 ? [{ name: "Activity", data: activityLineChartData }] : [];
  //     case "steps":
  //       return stepsLineChartData.length > 0 ? [{ name: "Steps", data: stepsLineChartData }] : [];
  //     default: // temperature
  //       return temperatureLineChartData.length > 0 ? [{ name: "Temperature", data: temperatureLineChartData }] : [];
  //   }
  // };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>

          <VuiBox mb={3}>
            <Grid container spacing="18px">
              <Grid item xs={12} lg={12} xl={5}>
                <WelcomeMark />
              </Grid>
              <Grid item xs={12} lg={8} xl={4}>
                <VuiBox mb={3} sx={{ width: '100%' }}>
                  <Select
                    value={selectedUID}
                    onChange={handleSelectedUIDChange}
                    displayEmpty
                    sx={{ width: '230px' }}
                  >
                    <MenuItem value="None">
                      Select UID
                    </MenuItem>
                    {console.log("lastPackets keys:", Object.keys(lastPackets))}
                    {Object.keys(lastPackets).map((uid, index) => (
                      <MenuItem key={index} value={uid}>
                        {uid}
                      </MenuItem>
                    ))}
                  </Select>
                </VuiBox>


                <Grid container spacing={1}>
                  <Grid item xs={12} lg={6} xl={6}>
                    <VuiBox mb={1} sx={{ width: '100%' }}>
                      <MiniStatisticsCard
                        title={{ text: "Temperature", fontWeight: "regular" }}
                        count={temperature ? `${parseFloat(temperature).toFixed(1)} °C` : "N/A"}
                        icon={{ color: "info", component: <FaTemperatureHalf size="20px" color="white" /> }}
                      />
                    </VuiBox>

                    <VuiBox mb={1} sx={{ width: '100%' }}>
                      <MiniStatisticsCard
                        title={{ text: "Humidity", fontWeight: "regular" }}
                        count={humidity ? `${parseFloat(humidity).toFixed(1)} %` : "N/A"}
                        icon={{ color: "info", component: <FaTemperatureHalf size="20px" color="white" /> }}
                      />
                    </VuiBox>

                    <VuiBox mb={1} sx={{ width: '100%' }}>
                      <MiniStatisticsCard
                        title={{ text: "Gas", fontWeight: "regular" }}
                        count={gas ? parseFloat(gas).toFixed(1) : "N/A"}
                        icon={{ color: "info", component: <FaTemperatureHalf size="20px" color="white" /> }}
                      />
                    </VuiBox>
                  </Grid>

                  <Grid item xs={12} lg={6} xl={6}>
                    <VuiBox mb={1} sx={{ width: '100%' }}>
                      <MiniStatisticsCard
                        title={{ text: "Classifier Version", fontWeight: "regular" }}
                        count={classifierVersion ? parseFloat(classifierVersion) : "N/A"}
                        icon={{ color: "info", component: <FaTemperatureHalf size="20px" color="white" /> }}
                      />
                    </VuiBox>

                    <VuiBox mb={1} sx={{ width: '100%' }}>
                      <MiniStatisticsCard
                        title={{ text: "Epoch Last Detection", fontWeight: "regular" }}
                        count={epochLastDetection ? new Date(epochLastDetection).toLocaleString() : "N/A"}
                        icon={{ color: "info", component: <FaTemperatureHalf size="20px" color="white" /> }}
                      />
                    </VuiBox>

                    <VuiBox mb={1} sx={{ width: '100%' }}>
                      <MiniStatisticsCard
                        title={{ text: "Transmission Interval", fontWeight: "regular" }}
                        count={transmissionIntervalM ? `${parseFloat(transmissionIntervalM)} min` : "N/A"}
                        icon={{ color: "info", component: <FaTemperatureHalf size="20px" color="white" /> }}
                      />
                    </VuiBox>
                  </Grid>
                </Grid>

                
                
              </Grid>
              <Grid item xs={12} lg={4} xl={4}>
              <SatisfactionRate value={selectedUID != "None" ? (sdcardSpaceRemaining * 0.001).toFixed(2) : "N/A"} total={selectedUID != "None" ? (sdcardTotalSpace * 0.001).toFixed(2) : "N/A"}/>
                {/* <ReferralTracking charging={currentPacket ? currentPacket.systemInfoPacket.batteryState.charging : false}
                  voltage={currentPacket ? currentPacket.systemInfoPacket.batteryState.voltage : "N/A"}
                  percentage={currentPacket ? currentPacket.systemInfoPacket.batteryState.percentage : "N/A"
                  } /> */}
              </Grid>
            </Grid>
          </VuiBox>

          

          {/* <Grid container spacing={3}>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "temperature", fontWeight: "regular" }}
                count={temperature ? parseFloat(temperature).toFixed(4) : "N/A"}
                percentage={{ color: "success", text: "N/A" }}
                icon={{ color: "info", component: <FaTemperatureHalf size="20px" color="white" /> }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "humidity" }}
                count={currentPacket ?
                  currentPacket.systemInfoPacket.simpleSensorReading.humidity.toFixed(4) : "N/A"
                }
                percentage={{ color: packetDiff && packetDiff["humidity"] > 0 ? "success" : "error", text: currentPacket && lastFivePackets.length > 1 && lastFivePackets[lastFivePackets.length - 1][0]
                  ? (packetDiff["humidity"])
                  : "N/A" }}
                icon={{ color: "info", component: <RiWaterPercentFill size="20px" color="white" /> }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "pressure" }}
                count={currentPacket ?
                  currentPacket.systemInfoPacket.simpleSensorReading.pressure.toFixed(4) : "N/A"
                }
                percentage={{ color: packetDiff && packetDiff["pressure"] > 0 ? "success" : "error", text: currentPacket && lastFivePackets.length > 1 && lastFivePackets[lastFivePackets.length - 1][0]
                  ? (packetDiff["pressure"])
                  : "N/A" }}
                icon={{ color: "info", component: <IoSpeedometerSharp size="20px" color="white" /> }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "gas" }}
                count={currentPacket ?
                  currentPacket.systemInfoPacket.simpleSensorReading.gas.toFixed(4) : "N/A"
                }
                percentage={{ color: packetDiff && packetDiff["gas"] > 0 ? "success" : "error", text: currentPacket && lastFivePackets.length > 1 && lastFivePackets[lastFivePackets.length - 1][0]
                  ? (packetDiff["gas"])
                  : "N/A" }}
                icon={{ color: "info", component: <PiWindBold size="20px" color="white" /> }}
              />
            </Grid>
          </Grid> */}
        </VuiBox>

        <VuiBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} xl={3}>
              {/* <MiniStatisticsCard
                title={{ text: "Particulate Matter", fontWeight: "regular" }}
                count={currentPacket ?
                  currentPacket.systemInfoPacket.simpleSensorReading.pm2_5.toFixed(4) : "N/A"
                }
                percentage={{ color: packetDiff && packetDiff["pm"] > 0 ? "success" : "error", text: currentPacket && lastFivePackets.length > 1 && lastFivePackets[lastFivePackets.length - 1][0]
                  ? (packetDiff["pm"])
                  : "N/A" }}
                icon={{ color: "info", component: <GiSparkles size="20px" color="white" /> }}
              /> */}
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              {/* <MiniStatisticsCard
                title={{ text: "Light" }}
                count={currentPacket ?
                  currentPacket.systemInfoPacket.simpleSensorReading.light : "N/A"
                }
                percentage={{ color: packetDiff && packetDiff["light"] > 0 ? "success" : "error", text: currentPacket && lastFivePackets.length > 1 && lastFivePackets[lastFivePackets.length - 1][0]
                  ? (packetDiff["light"])
                  : "N/A" }}
                icon={{ color: "info", component: <MdBrightnessMedium size="20px" color="white" /> }}
              /> */}
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              {/* <MiniStatisticsCard
                title={{ text: "Activity" }}
                count={
                  currentPacket
                    ? currentPacket.systemInfoPacket.simpleSensorReading.activity === 0
                      ? "Still"
                      : currentPacket.systemInfoPacket.simpleSensorReading.activity === 1
                      ? "Walk"
                      : currentPacket.systemInfoPacket.simpleSensorReading.activity === 2
                      ? "Run"
                      : "Unknown"
                    : "N/A"
                }
                percentage={{ color: packetDiff && packetDiff["activity"] > 0 ? "success" : "error", text: currentPacket && lastFivePackets.length > 1 && lastFivePackets[lastFivePackets.length - 1][0]
                  ? (packetDiff["activity"])
                  : "N/A" }}
                icon={{ color: "info", component: <TbArrowsMove size="20px" color="white" /> }}
              /> */}
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              {/* <MiniStatisticsCard
                title={{ text: "Steps" }}
                count={currentPacket ?
                  currentPacket.systemInfoPacket.simpleSensorReading.steps : "N/A"
                }
                percentage={{ color: packetDiff && packetDiff["steps"] > 0 ? "success" : "error", text: currentPacket && lastFivePackets.length > 1 && lastFivePackets[lastFivePackets.length - 1][0]
                  ? (packetDiff["steps"])
                  : "N/A" }}
                icon={{ color: "info", component: <IoPaw size="20px" color="white" /> }}
              /> */}
            </Grid>
          </Grid>
        </VuiBox>
        
        <VuiBox sx={{ height: "100%", paddingBottom: "20px" }}>
          <OfflineMap lastPackets={lastPackets} maxBuzzCount={maxBuzzCount} minBuzzCount={minBuzzCount} maxSpecies1Count={maxSpecies1Count} minSpecies1Count={minSpecies1Count} maxSpecies2Count={maxSpecies2Count} minSpecies2Count={minSpecies2Count}/>
          {/* <Grid container spacing={3}>
            
            <Grid item xs={12} lg={6} xl={6}>
              <Card>
                <VuiBox sx={{ height: "100%" }} >
                  <VuiBox mb="10px">
                    <VuiTypography variant="lg" color="white" fontWeight="bold" mb="40px">
                      Map Overview
                    </VuiTypography>
                  </VuiBox>
                   

                    <VuiBox sx={{ height: "500px" }} mb="20px" >
                    < OfflineMap lastPackets={lastPackets} maxBuzzCount={maxBuzzCount} minBuzzCount={minBuzzCount}/>
                    </VuiBox>
                </VuiBox>
              </Card>
            </Grid> */}
            {/* <Grid item xs={12} lg={6} xl={6}>
              <Card> */}
                {/* <VuiBox sx={{ height: "100%" }}>
                  <VuiBox display="flex" alignItems="center" justifyContent="space-between" mb="5px">
                    <VuiBox>
                      <VuiTypography variant="lg" color="white" fontWeight="bold">
                        {`${selectedChart.charAt(0).toUpperCase() + selectedChart.slice(1)} Overview`}
                      </VuiTypography>
                    </VuiBox>
                    <VuiBox sx={{ width: '230px' }}>
                      <Select
                        value={selectedChart}
                        onChange={handleChartChange}
                        bgColor="info"
                        sx={{ width: '40px' }}
                      >
                        <MenuItem value="temperature">Temperature</MenuItem>
                        <MenuItem value="humidity">Humidity</MenuItem>
                        <MenuItem value="pressure">Pressure</MenuItem>
                        <MenuItem value="gas">Gas</MenuItem>
                        <MenuItem value="pm">Particulate Matter</MenuItem>
                        <MenuItem value="light">Light</MenuItem>
                        <MenuItem value="activity">Activity</MenuItem>
                        <MenuItem value="steps">Steps</MenuItem>
                      </Select>
                    </VuiBox>
                  </VuiBox>
                  <VuiBox display="flex" alignItems="center" mb="40px">
                    <VuiTypography variant="button" color={packetDiff && packetDiff[selectedChart] > 0 ? "success" : "error"} fontWeight="bold">
                      { currentPacket && lastFivePackets.length > 1 && lastFivePackets[lastFivePackets.length - 1][0]
                        ? packetDiff[selectedChart]
                        : "N/A" }
                      <VuiTypography variant="button" color="text" fontWeight="regular">
                        {" "} change since last packet
                      </VuiTypography>
                    </VuiTypography>
                  </VuiBox>
                  <VuiBox sx={{ height: "420px" }}>
                    <LineChart
                      lineChartData={lineChartData()}
                      lineChartOptions={lineChartOptionsDashboard}
                    />
                  </VuiBox>
                </VuiBox> */}
              {/* </Card>
            </Grid> */}
          {/* </Grid> */}
        </VuiBox>
        <Grid container spacing={3} direction="row" justifyContent="center" alignItems="stretch">
          <Grid item xs={12} md={6} lg={6}>
            {/* <LastFivePackets lastFivePackets={lastFivePackets}/> */}
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            {/* <OrderOverview staticObstructed={currentPacket ? currentPacket.systemInfoPacket.simpleSensorReading.particulateStaticObstructed : false}
            dynamicObstructed={currentPacket ? currentPacket.systemInfoPacket.simpleSensorReading.particulateDynamicObstructed : false}
            particulateOutsideDetectionLimits={currentPacket ? currentPacket.systemInfoPacket.simpleSensorReading.particulateOutsideDetectionLimits : false}/> */}
          </Grid>
        </Grid>
      </VuiBox>
            
      <VuiBox>
        <Grid container spacing={1} direction="row" justifyContent="center" alignItems="stretch">
          <Grid item xs={12} md={6} lg={4}>
            <VuiBox>
              <div style={{ width: "100%", display: "flex", justifyContent: "center", margin: "20px 0" }}>
                <iframe src="http://localhost:3000/d-solo/cebmelc9br4sgf/buzzcam-dashboard?orgId=1&timezone=browser&panelId=1&__feature.dashboardSceneSolo" width="100%" height="500" frameborder="0"></iframe>        
              </div>
            </VuiBox>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <VuiBox>
              <div style={{ width: "100%", display: "flex", justifyContent: "center", margin: "20px 0" }}>
                <iframe src="http://localhost:3000/d-solo/cebmelc9br4sgf/buzzcam-dashboard?orgId=1&timezone=browser&theme=dark&panelId=3&__feature.dashboardSceneSolo" width="100%" height="500" frameborder="0"></iframe>
              </div>
            </VuiBox>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <VuiBox>
              <div style={{ width: "100%", display: "flex", justifyContent: "center", margin: "20px 0" }}>
                <iframe src="http://localhost:3000/d-solo/cebmelc9br4sgf/buzzcam-dashboard?orgId=1&timezone=browser&panelId=2&__feature.dashboardSceneSolo" width="100%" height="500" frameborder="0"></iframe>        
              </div>
            </VuiBox>
          </Grid>
        </Grid>
      </VuiBox>
      
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
