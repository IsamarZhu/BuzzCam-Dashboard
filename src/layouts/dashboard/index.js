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

import { Card, LinearProgress, Stack, Select, MenuItem } from "@mui/material";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
// import VuiProgress from "components/VuiProgress";
import VuiInput from "components/VuiInput";


// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import linearGradient from "assets/theme/functions/linearGradient";

// Vision UI Dashboard React base styles
import typography from "assets/theme/base/typography";
import colors from "assets/theme/base/colors";

// Dashboard layout components
import WelcomeMark from "layouts/dashboard/components/WelcomeMark";
// import Projects from "layouts/dashboard/components/Projects";
// import OrderOverview from "layouts/dashboard/components/OrderOverview";
import SatisfactionRate from "layouts/dashboard/components/SatisfactionRate";
// import ReferralTracking from "layouts/dashboard/components/ReferralTracking";

// React icons
import { FaTemperatureHalf } from "react-icons/fa6";
import { PiWindBold } from "react-icons/pi";
import { GiSparkles } from "react-icons/gi";
import { RiWaterPercentFill } from "react-icons/ri";
import { MdAccessTimeFilled } from "react-icons/md";
import { FiBatteryCharging } from "react-icons/fi";
import { MdSignalCellularAlt } from "react-icons/md";
import { LuRadioReceiver } from "react-icons/lu";



// Data
// import LineChart from "examples/Charts/LineCharts/LineChart";
// import BarChart from "examples/Charts/BarCharts/BarChart";
// import HeatMap from "examples/Charts/HeatMaps/HeatMap";

// import { lineChartDataDashboard } from "layouts/dashboard/data/lineChartData";
// import { lineChartOptionsDashboard } from "layouts/dashboard/data/lineChartOptions";
// import { barChartDataDashboard } from "layouts/dashboard/data/barChartData";
// import { barChartOptionsDashboard } from "layouts/dashboard/data/barChartOptions";
// import { heatMapDataDashboard } from "layouts/dashboard/data/heatMapData";
// import { heatMapOptionsDashboard } from "layouts/dashboard/data/heatMapOptions";



// const { ipcRenderer } = window.require('electron');
import { useEffect, useMemo, useState, useRef } from "react";
// import LastFivePackets from "./components/LastFivePackets";
import OfflineMap from "./components/OfflineMap";



const { InfluxDB, Point } = require('@influxdata/influxdb-client');

const host = process.env.INFLUX_HOST
const token = "1bkG2GLih-gV2kf5sXsGj7NWm7xY5KsRKI8UHwsRLb_Z740htB4oKJK1TPzgO0ZSUHEQUxarMjQECPMfGdVbJQ=="

const influxDB = new InfluxDB({ url: 'https://cwrcg87oxx-fcwnpwwurvjrx2.timestream-influxdb.us-east-2.on.aws:8086', token: token });
const queryApi = influxDB.getQueryApi('915a1d8148ba09aa');


// TEST BUCKET
// const token = "aCVb85vzJw7oxOS1SQbX13ZPC3z7vuUl5Ba1dbPWg_Tc2E1DEnURAHPLIV6Kp7g1YYLxU-clxLtKK994xtU7Kw=="

// const influxDB = new InfluxDB({ url: 'https://us-east-1-1.aws.cloud2.influxdata.com', token: token });
// const queryApi = influxDB.getQueryApi('80718fbb557b61b0');


function Dashboard() {
  const { gradients } = colors;
  const { cardContent } = gradients;

  const [currentPacket, setCurrentPacket] = useState(null);

  const [lastPackets, setLastPackets] = useState({}); // dictionary to store last packet from each device, keyed by UID

  const [maxBuzzCount, setMaxBuzzCount] = useState(0); // keep track of the max buzz count so far
  const [minBuzzCount, setMinBuzzCount] = useState(0); // keep track of the min buzz count so far

  const [maxSpecies1Count, setMaxSpecies1Count] = useState(0);
  const [minSpecies1Count, setMinSpecies1Count] = useState(0);

  const [maxSpecies2Count, setMaxSpecies2Count] = useState(0);
  const [minSpecies2Count, setMinSpecies2Count] = useState(0);

  const [temperature, setTemperature] = useState("N/A");
  const [humidity, setHumidity] = useState("N/A");
  const [gas, setGas] = useState("N/A");

  const [classifierVersion, setClassifierVersion] = useState("N/A");

  const [buzzCountInterval, setBuzzCountInterval] = useState("N/A");
  const [species_1CountInterval, setSpecies_1CountInterval] = useState("N/A");  
  const [species_2CountInterval, setSpecies_2CountInterval] = useState("N/A");
  const [epochLastDetectionInterval, setEpochLastDetectionInterval] = useState("N/A");
  const [transmissionIntervalM, setTransmissionIntervalM] = useState("N/A");

  const [buzzCountSummary, setBuzzCountSummary] = useState("N/A");
  const [species_1CountSummary, setSpecies_1CountSummary] = useState("N/A");
  const [species_2CountSummary, setSpecies_2CountSummary] = useState("N/A");
  const [epochLastDetectionSummary, setEpochLastDetectionSummary] = useState("N/A");

  const [radioRssiEst, setRadioRssiEst] = useState("N/A");
  const [radioSnr, setRadioSnr] = useState("N/A");

  const [sdcardSpaceRemaining, setSdcardSpaceRemaining] = useState("N/A");
  const [sdcardTotalSpace, setSdcardTotalSpace] = useState("N/A");

  const [msFromStart, setMsFromStart] = useState(0);
  const [batteryVoltage, setBatteryVoltage] = useState(0);

  const [selectedUID, setSelectedUID] = useState("None"); // current UID that is being displayed, selected from dropdown
  

  const getQuery = async () => {
    const fluxQuery = `
      from(bucket: "patagonia")
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

        if (o.buzzCountInterval !== undefined) {
          results.buzzCountInterval = o.buzzCountInterval;
        }

        if (o.species_1CountInterval !== undefined) { 
          results.species_1CountInterval = o.species_1CountInterval;
        }

        if (o.species_2CountInterval !== undefined) {
          results.species_2CountInterval = o.species_2CountInterval;
        }
        
        if (o.epochLastDetectionInterval !== undefined) {
          results.epochLastDetectionInterval = o.epochLastDetectionInterval;
          console.log("results.epochLastDetectionInterval", results.epochLastDetectionInterval)
        }

        if (o.transmissionIntervalM !== undefined) {
          results.transmissionIntervalM = o.transmissionIntervalM;
        }

        if (o.buzzCountSummary !== undefined) {
          results.buzzCountSummary = o.buzzCountSummary;
        }

        if (o.species_1CountSummary !== undefined) {
          results.species_1CountSummary = o.species_1CountSummary;
          console.log("results.species_1CountSummary", results.species_1CountSummary)
        }

        if (o.species_2CountSummary !== undefined) {
          results.species_2CountSummary = o.species_2CountSummary;
          console.log("results.species_2CountSummary", results.species_2CountSummary)
        }

        if (o.epochLastDetectionSummary !== undefined) {
          results.epochLastDetectionSummary = o.epochLastDetectionSummary;
        }

        if (o.sdcardSpaceRemaining !== undefined) {
          results.sdcardSpaceRemaining = o.sdcardSpaceRemaining;
          console.log("results.sdcardSpaceRemaining", results.sdcardSpaceRemaining)
        }

        if (o.radioRssiEst !== undefined) {
          results.radioRssiEst = o.radioRssiEst;
          console.log("results.radioRssiEst", results.radioRssiEst)
        }

        if (o.radioSnr !== undefined) { 
          results.radioSnr = o.radioSnr;
          console.log("results.radioSnr", results.radioSnr)
        }

        if (o.msFromStart !== undefined) {
          results.msFromStart = o.msFromStart;
        }

        if (o.batteryVoltage !== undefined) {
          results.batteryVoltage = o.batteryVoltage;
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

      if (results.buzzCountInterval !== undefined) {
        setBuzzCountInterval(results.buzzCountInterval);
      }

      if (results.species_1CountInterval !== undefined) {
        setSpecies_1CountInterval(results.species_1CountInterval);
      }

      if (results.species_2CountInterval !== undefined) {
        setSpecies_2CountInterval(results.species_2CountInterval);
        console.log("setSpecies_2CountInterval, species_2CountInterval", species_2CountInterval)
      }

      if (results.epochLastDetectionInterval !== undefined) {
        setEpochLastDetectionInterval(results.epochLastDetectionInterval);
        console.log("epochLastDetectionInterval", epochLastDetectionInterval)
      }

      if (results.transmissionIntervalM !== undefined) {
        setTransmissionIntervalM(results.transmissionIntervalM);
      }

      if (results.buzzCountSummary !== undefined) {
        setBuzzCountSummary(results.buzzCountSummary);
      }

      if (results.species_1CountSummary !== undefined) {
        setSpecies_1CountSummary(results.species_1CountSummary);
        console.log("setSpecies_1CountSummary, species_1CountSummary", species_1CountSummary)
      }

      if (results.species_2CountSummary !== undefined) {
        setSpecies_2CountSummary(results.species_2CountSummary);
        console.log("setSpecies_2CountSummary, species_2CountSummary", species_2CountSummary)
      }

      if (results.epochLastDetectionSummary !== undefined) {
        setEpochLastDetectionSummary(results.epochLastDetectionSummary);
        console.log("epochLastDetectionSummary", epochLastDetectionSummary)
      }

      if (results.sdcardSpaceRemaining !== undefined) {
        setSdcardSpaceRemaining(results.sdcardSpaceRemaining);
        console.log("setSdcardSpaceRemaining", sdcardSpaceRemaining)
      }

      if (results.radioRssiEst !== undefined) { 
        setRadioRssiEst(results.radioRssiEst);
        console.log("setRadioRssiEst", radioRssiEst)
      }

      if (results.radioSnr !== undefined) { 
        setRadioSnr(results.radioSnr);
        console.log("setRadioSnr", radioSnr)
      }

      if (results.msFromStart !== undefined) {
        setMsFromStart(results.msFromStart);
      }

      if (results.batteryVoltage !== undefined) {
        setBatteryVoltage(results.batteryVoltage);
      }
    } catch (error) {
      console.error("Error querying InfluxDB:", error);
    }
  };


  useEffect(() => {
    if (window.electron && window.electron.ipcRenderer) {
      // Listen for the packet-updated event
      window.electron.ipcRenderer.on('packet-updated', async (event, packet) => {
        console.log("Packet updated on frontend")
        setCurrentPacket(packet);
        console.log("Packet", packet);
        console.log("currentPacket", currentPacket);
        // Get the epoch time from the packet
        const packetEpochBigInt = (new Date()).getTime()
        
        console.log("packetEpoch (BigInt): ", packetEpochBigInt);
        console.log("newDate (seconds): ", new Date(Number(packetEpochBigInt)));
        
        // update dictionary with new packet
        // if packet already in dictionary, update
        // if packet not in dictionary, add it
        const currentUID = packet.header.systemUid
        console.log("currentUID ", currentUID);

        setLastPackets(prevDict => ({
          ...prevDict,
          [currentUID]: packet
        }));

        // // update maxBuzzCount
        // setMaxBuzzCount(prevMax => Math.max(prevMax, packet.systemSummaryPacket.buzzIntervalData.buzzCount));
        // console.log("maxBuzzCount ", maxBuzzCount);

        // // update minBuzzCount  

        // console.log(typeof packet.systemSummaryPacket.buzzIntervalData.buzzCount);

        // setMinBuzzCount(prevMin => Math.min(prevMin, packet.systemSummaryPacket.buzzIntervalData.buzzCount.low));
        // console.log("minBuzzCount ", minBuzzCount);

        // // update maxSpecies1Count
        // setMaxSpecies1Count(prevMax => Math.max(prevMax, packet.systemSummaryPacket.buzzIntervalData.species_1Count.low));
        // console.log("maxSpecies1Count ", maxSpecies1Count);
        // console.log("packet.systemSummaryPacket.buzzIntervalData.species_1Count ", packet.systemSummaryPacket.buzzIntervalData.species_1Count);
        // console.log("packet.systemSummaryPacket.buzzIntervalData.species_1Count.low ", packet.systemSummaryPacket.buzzIntervalData.species_1Count.low);

        // // update minSpecies1Count
        // setMinSpecies1Count(prevMin => Math.min(prevMin, packet.systemSummaryPacket.buzzIntervalData.species_1Count.low));
        // console.log("minSpecies1Count ", minSpecies1Count);

        // // update maxSpecies2Count
        // setMaxSpecies2Count(prevMax => Math.max(prevMax, packet.systemSummaryPacket.buzzIntervalData.species_2Count.low));
        // console.log("maxSpecies2Count ", maxSpecies2Count);

        // // update minSpecies2Count
        // setMinSpecies2Count(prevMin => Math.min(prevMin, packet.systemSummaryPacket.buzzIntervalData.species_2Count.low));
        // console.log("minSpecies2Count ", minSpecies2Count);

        // only requery if the current selected UID is being updated
        console.log("selectedUID ", selectedUID);
        if (String(currentUID) === String(selectedUID)) {
          // reset sd card space total space
          setSdcardTotalSpace(packet.systemSummaryPacket.sdCard.totalSpace);

          console.log("currentUID === selectedUID")

          await getQuery();
          console.log("Querying InfluxDB")
        }

        console.log("packet.systemSummaryPacket.location.lat",packet.systemSummaryPacket.location.lat)
        

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

  const handleInputChange = (setter) => (event) => {
    setter(Number(event.target.value));
  };


  return (
    <DashboardLayout>
      {/* <DashboardNavbar /> */}
      <VuiBox py={3}>
        <VuiBox mb={3}>

          <VuiBox mb={3}>
            <Grid container spacing="18px">
            
              <Grid item xs={12} lg={12} xl={12}>
                <VuiBox mb={3}>
                  <WelcomeMark />
                </VuiBox>
              </Grid>
              
              <Grid item xs={12} lg={6} xl={6}>
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
                  <Grid item xs={6} lg={6} xl={6}>
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
                        icon={{ color: "info", component: <RiWaterPercentFill size="20px" color="white" /> }}
                      />
                    </VuiBox>

                    <VuiBox mb={1} sx={{ width: '100%' }}>
                      <MiniStatisticsCard
                        title={{ text: "Gas", fontWeight: "regular" }}
                        count={gas ? parseFloat(gas).toFixed(1) : "N/A"}
                        icon={{ color: "info", component: <PiWindBold size="20px" color="white" /> }}
                      />
                    </VuiBox>

                    <VuiBox mb={1} sx={{ width: '100%' }}>
                      <MiniStatisticsCard
                        title={{ text: "Runtime", fontWeight: "regular" }}
                        count={msFromStart ? (parseFloat(msFromStart) / 60000).toFixed(1) : "N/A"}
                        icon={{ color: "info", component: <MdAccessTimeFilled size="20px" color="white" /> }}
                      />
                    </VuiBox>
                  </Grid>

                  <Grid item xs={6} lg={6} xl={6}>
                    <VuiBox mb={1} sx={{ width: '100%' }}>
                      <MiniStatisticsCard
                        title={{ text: "Classifier Version", fontWeight: "regular" }}
                        count={classifierVersion ? parseFloat(classifierVersion) : "N/A"}
                        icon={{ color: "info", component: <GiSparkles size="20px" color="white" /> }}
                      />
                    </VuiBox>

                    <VuiBox mb={1} sx={{ width: '100%' }}>
                      <MiniStatisticsCard
                        title={{ text: "Radio RSSI Estimate", fontWeight: "regular" }}
                        count={radioRssiEst ? parseFloat(radioRssiEst) : "N/A"}
                        icon={{ color: "info", component: <LuRadioReceiver size="20px" color="white" /> }}
                      />
                    </VuiBox>

                    <VuiBox mb={1} sx={{ width: '100%' }}>
                      <MiniStatisticsCard
                        title={{ text: "Radio SNR", fontWeight: "regular" }}
                        count={radioSnr ? parseFloat(radioSnr) : "N/A"}
                        icon={{ color: "info", component: <MdSignalCellularAlt size="20px" color="white" /> }}
                      />
                    </VuiBox>

                    <VuiBox mb={1} sx={{ width: '100%' }}>
                      <MiniStatisticsCard
                        title={{ text: "Battery voltage", fontWeight: "regular" }}
                        count={batteryVoltage ? (parseFloat(batteryVoltage)).toFixed(2) : "N/A"}
                        icon={{ color: "info", component: <FiBatteryCharging size="20px" color="white" /> }}
                      />
                    </VuiBox>

                    {/* <VuiBox mb={1} sx={{ width: '100%' }}>
                      <MiniStatisticsCard
                        title={{ text: "Epoch Last Detection", fontWeight: "regular" }}
                        count={epochLastDetectionInterval ? new Date(epochLastDetectionInterval * 1000).toLocaleString() : "N/A"}
                        icon={{ color: "info", component: <MdOutlineAccessTimeFilled size="20px" color="white" /> }}
                      />
                    </VuiBox>

                    <VuiBox mb={1} sx={{ width: '100%' }}>
                      <MiniStatisticsCard
                        title={{ text: "Transmission Interval", fontWeight: "regular" }}
                        count={transmissionIntervalM ? `${parseFloat(transmissionIntervalM)} min` : "N/A"}
                        icon={{ color: "info", component: <MdOutlineRadar size="20px" color="white" /> }}
                      />
                    </VuiBox> */}
                  </Grid>

                  {/* <Grid item xs={6} lg={4} xl={4}>
                    <VuiBox mb={1} sx={{ width: '100%' }}>
                      <MiniStatisticsCard
                        title={{ text: "Radio RSSI Estimate", fontWeight: "regular" }}
                        count={rssiEst ? parseFloat(rssiEst) : "N/A"}
                        icon={{ color: "info", component: <GiSparkles size="20px" color="white" /> }}
                      />
                    </VuiBox>

                    <VuiBox mb={1} sx={{ width: '100%' }}>
                      <MiniStatisticsCard
                        title={{ text: "Radio SNR", fontWeight: "regular" }}
                        count={snr ? parseFloat(snr) : "N/A"}
                        icon={{ color: "info", component: <MdOutlineAccessTimeFilled size="20px" color="white" /> }}
                      />
                    </VuiBox>
                  </Grid> */}
                </Grid>
              </Grid>

              <Grid item xs={12} lg={6} xl={6}>
                <SatisfactionRate value={selectedUID != "None" ? (sdcardSpaceRemaining * 0.001).toFixed(2) : "N/A"} total={selectedUID != "None" ? (sdcardTotalSpace * 0.001).toFixed(2) : "N/A"}/>
              </Grid>
            </Grid>
          </VuiBox>
        </VuiBox>




        <VuiBox mb={3}>

        <Card sx={{ padding: "17px" }}>
          <VuiBox display='flex' flexDirection='column'>
            <VuiTypography variant='lg' color='white' fontWeight='bold' mb='18px'>
              Classifier Data
            </VuiTypography>


            <Grid container spacing={'18px'}>
              <Grid item xs={6} lg={6} xl={6}> 
                <VuiBox mb={1} sx={{ width: '100%', background: linearGradient('#644531', cardContent.main, cardContent.deg), padding: '18px 22px', borderRadius: '20px',}}>
                  <VuiTypography variant='h6' color='text' fontWeight='regular' mb='10px'>
                    <strong> Interval Data</strong>
                  </VuiTypography>

                  <VuiTypography color="white" variant="button" fontWeight="regular" mb="12px" display="block">
                      <strong>Buzz Count:</strong> {buzzCountInterval ?? '0'}
                  </VuiTypography>

                  <VuiTypography color="white" variant="button" fontWeight="regular" mb="12px" display="block">
                      <strong>Species 1 Count:</strong> {species_1CountInterval ?? '0'}
                  </VuiTypography>

                  <VuiTypography color="white" variant="button" fontWeight="regular" mb="12px" display="block">
                      <strong>Species 2 Count:</strong> {species_2CountInterval ?? '0'}
                  </VuiTypography>

                  <VuiTypography color="white" variant="button" fontWeight="regular" mb="12px" display="block">
                      <strong>Last detection epoch:</strong> {new Date(epochLastDetectionInterval * 1000).toLocaleString() ?? 'N/A'}
                  </VuiTypography>

                  <VuiTypography color="white" variant="button" fontWeight="regular" mb="12px" display="block">
                      <strong>Transmission Interval (mins):</strong> {transmissionIntervalM ?? 'N/A'}
                  </VuiTypography>
                </VuiBox>
              </Grid>
              
              <Grid item xs={6} lg={6} xl={6}>
                <VuiBox mb={1} sx={{ width: '100%', background: linearGradient('#644531', cardContent.main, cardContent.deg), padding: '18px 22px', borderRadius: '20px',}}>
                  <VuiTypography variant='h6' color='text' fontWeight='regular' mb='10px'>
                    <strong> Summary Data</strong>
                  </VuiTypography>

                  <VuiTypography color="white" variant="button" fontWeight="regular" mb="12px" display="block">
                      <strong>Buzz Count:</strong> {buzzCountSummary ?? '0'}
                  </VuiTypography>

                  <VuiTypography color="white" variant="button" fontWeight="regular" mb="12px" display="block">
                      <strong>Species 1 Count:</strong> {species_1CountSummary ?? '0'}
                  </VuiTypography>

                  <VuiTypography color="white" variant="button" fontWeight="regular" mb="12px" display="block">
                      <strong>Species 2 Count:</strong> {species_2CountSummary ?? '0'}
                  </VuiTypography>

                  <VuiTypography color="white" variant="button" fontWeight="regular" mb="12px" display="block">
                      <strong>Last detection epoch:</strong> {new Date(epochLastDetectionSummary * 1000).toLocaleString() ?? 'N/A'}
                  </VuiTypography>
                </VuiBox>
              </Grid>
            </Grid>

            <Grid container spacing={'18px'}>
              <Grid item xs={6} lg={3} xl={3}>
                <VuiBox mb={1} sx={{ width: '100%', background: linearGradient('#5c75a7', cardContent.state, cardContent.deg), padding: '18px 22px', borderRadius: '20px',}}>
                  <VuiTypography variant="h6" color="white" mb={'10px'}>Max Buzz Count</VuiTypography>
                  {/* <TextField
                    fullWidth
                    variant="outlined"
                    value={maxBuzzCount}
                    onChange={handleInputChange(setMaxBuzzCount)}
                    inputProps={{ style: { color: 'black' } }}
                  /> */}

                <VuiInput
                  placeholder="0"
                  value={maxBuzzCount}
                  onChange={handleInputChange(setMaxBuzzCount)}
                  sx={{
                    backgroundColor: "info.main !important",
                  }}
                />
                </VuiBox>
              </Grid>

              <Grid item xs={6} lg={3} xl={3}>
                <VuiBox mb={1} sx={{ width: '100%', background: linearGradient('#5c75a7', cardContent.state, cardContent.deg), padding: '18px 22px', borderRadius: '20px',}}>
                  <VuiTypography variant="h6" color="white" mb={'10px'}>Min Buzz Count</VuiTypography>
                  {/* <TextField
                    fullWidth
                    variant="outlined"
                    value={minBuzzCount}
                    onChange={handleInputChange(setMinBuzzCount)}
                    inputProps={{ style: { color: 'black' } }}
                  /> */}

                <VuiInput
                  placeholder="0"
                  value={minBuzzCount}
                  onChange={handleInputChange(setMinBuzzCount)}
                  sx={{
                    backgroundColor: "info.main !important",
                  }}
                />
                </VuiBox>
              </Grid>

              <Grid item xs={6} lg={3} xl={3}>
                <VuiBox mb={1} sx={{ width: '100%', background: linearGradient('#5c75a7', cardContent.state, cardContent.deg), padding: '18px 22px', borderRadius: '20px',}}>
                  <VuiTypography variant="h6" color="white" mb={'10px'}>Max Species 1 Count</VuiTypography>
                  {/* <TextField
                    fullWidth
                    variant="outlined"
                    value={maxSpecies1Count}
                    onChange={handleInputChange(setMaxSpecies1Count)}
                    inputProps={{ style: { color: 'black' } }}
                  /> */}

                  <VuiInput
                    placeholder="0"
                    value={maxSpecies1Count}
                    onChange={handleInputChange(setMaxSpecies1Count)}
                    sx={{
                      backgroundColor: "info.main !important",
                    }}
                  />
                </VuiBox>
              </Grid>

              <Grid item xs={6} lg={3} xl={3}>
                <VuiBox mb={1} sx={{ width: '100%', background: linearGradient('#5c75a7', cardContent.state, cardContent.deg), padding: '18px 22px', borderRadius: '20px',}}>
                  <VuiTypography variant="h6" color="white" mb={'10px'}>Min Species 1 Count</VuiTypography>
                  {/* <TextField
                    fullWidth
                    variant="outlined"
                    value={minSpecies1Count}
                    onChange={handleInputChange(setMinSpecies1Count)}
                    inputProps={{ style: { color: 'black' } }}
                  /> */}

                  <VuiInput
                    placeholder="0"
                    value={minSpecies1Count}
                    onChange={handleInputChange(setMinSpecies1Count)}
                    sx={{
                      backgroundColor: "info.main !important",
                    }}
                  />
                </VuiBox>
              </Grid>

              <Grid item xs={6} lg={3} xl={3}>
                <VuiBox mb={1} sx={{ width: '100%', background: linearGradient('#5c75a7', cardContent.state, cardContent.deg), padding: '18px 22px', borderRadius: '20px',}}>
                  <VuiTypography variant="h6" color="white" mb={'10px'}>Max Species 2 Count</VuiTypography>
                  {/* <TextField
                    fullWidth
                    variant="outlined"
                    value={maxSpecies2Count}
                    onChange={handleInputChange(setMaxSpecies2Count)}
                    inputProps={{ style: { color: 'black' } }}
                  /> */}

                    <VuiInput
                      placeholder="0"
                      value={maxSpecies2Count}
                      onChange={handleInputChange(setMaxSpecies2Count)}
                      sx={{
                        backgroundColor: "info.main !important",
                      }}
                    />
                </VuiBox>
              </Grid>

              <Grid item xs={6} lg={3} xl={3}>
                <VuiBox mb={1} sx={{ width: '100%', background: linearGradient('#5c75a7', cardContent.state, cardContent.deg), padding: '18px 22px', borderRadius: '20px',}}>
                  <VuiTypography variant="h6" color="white" mb={'10px'}>Min Species 2 Count</VuiTypography>
                  {/* <TextField
                    fullWidth
                    variant="outlined"
                    value={minSpecies2Count}
                    onChange={handleInputChange(setMinSpecies2Count)}
                    inputProps={{ style: { color: 'black' } }}
                  /> */}
                  <VuiInput
                      placeholder="0"
                      value={minSpecies2Count}
                      onChange={handleInputChange(setMinSpecies2Count)}
                      sx={{
                        backgroundColor: "info.main !important",
                      }}
                    />
                </VuiBox>
              </Grid>

            </Grid>
          </VuiBox>
        </Card>
        </VuiBox>
        
        <VuiBox sx={{ height: "100%", paddingBottom: "20px" }}>
          <OfflineMap lastPackets={lastPackets} maxBuzzCount={maxBuzzCount} minBuzzCount={minBuzzCount} maxSpecies1Count={maxSpecies1Count} minSpecies1Count={minSpecies1Count} maxSpecies2Count={maxSpecies2Count} minSpecies2Count={minSpecies2Count}/>
        </VuiBox>
      </VuiBox>
            
      <VuiBox>
        <Card sx={{ padding: "17px" }}>
          <VuiBox display='flex' flexDirection='column'>
            <VuiTypography variant='lg' color='white' fontWeight='bold' mb='10px'>
              Visualizations
            </VuiTypography>

            <VuiTypography variant='button' color='white' fontWeight='regular' mb='18px'>
              Click and drag to zoom in on the graphs, double-click to zoom out
            </VuiTypography>

            <Grid container spacing={1} direction="row" justifyContent="center" alignItems="stretch">
            <Grid item xs={12} md={6} lg={4}>
              <VuiBox>
                <div style={{ width: "100%", display: "flex", justifyContent: "center", margin: "20px 0" }}>
                  <iframe src="http://buzzcam.media.mit.edu:3000/d-solo/beeda8oj4mtq8a/buzzcam-dashboard?orgId=1&timezone=browser&panelId=3&__feature.dashboardSceneSolo" width="100%" height="500" frameborder="0"></iframe>              
                </div>
              </VuiBox>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <VuiBox> 
                <div style={{ width: "100%", display: "flex", justifyContent: "center", margin: "20px 0" }}>
                <iframe src="http://buzzcam.media.mit.edu:3000/d-solo/beeda8oj4mtq8a/buzzcam-dashboard?orgId=1&timezone=browser&panelId=2&__feature.dashboardSceneSolo" width="100%" height="500" frameborder="0"></iframe>
                </div>
              </VuiBox>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <VuiBox>
                <div style={{ width: "100%", display: "flex", justifyContent: "center", margin: "20px 0" }}>
                  <iframe src="http://buzzcam.media.mit.edu:3000/d-solo/beeda8oj4mtq8a/buzzcam-dashboard?orgId=1&timezone=browser&panelId=1&__feature.dashboardSceneSolo" width="100%" height="500" frameborder="0"></iframe>        
                </div>
              </VuiBox>
            </Grid>
        </Grid>
          </VuiBox>
        </Card>
        
      </VuiBox>
      
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
