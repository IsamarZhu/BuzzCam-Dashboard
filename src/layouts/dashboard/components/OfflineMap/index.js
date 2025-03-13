
// import React, { useEffect, useState, useRef } from "react";
// import { MapContainer, CircleMarker, Popup, TileLayer } from "react-leaflet";
// import L from "leaflet";
// import "leaflet.offline";
// import 'leaflet/dist/leaflet.css';
// import icon from 'leaflet/dist/images/marker-icon.png';
// import iconShadow from 'leaflet/dist/images/marker-shadow.png';
// import VuiBox from "components/VuiBox";
// import VuiTypography from "components/VuiTypography";
// import { Card, Select, MenuItem } from "@mui/material";

// let DefaultIcon = L.icon({
//     iconUrl: icon,
//     shadowUrl: iconShadow
// });

// L.Marker.prototype.options.icon = DefaultIcon;

// const OfflineMap = ({ lastPackets = [], maxBuzzCount, minBuzzCount, maxSpecies1Count, minSpecies1Count, maxSpecies2Count, minSpecies2Count }) => {
//     const [map, setMap] = useState(null);
//     const [packets, setPackets] = useState(lastPackets);
//     const initialPosition = [-41.0243015, -71.8205756]; // initialized to puerto blest
//     const [selectedPacket, setSelectedPacket] = useState(null);
//     const [selectedOption, setSelectedOption] = useState("totalBuzzCount");
//     const markersRef = useRef([]); // Ref to store markers

//     useEffect(() => {
//         console.log("updating lastPackets in offline map")
//         setPackets(lastPackets);
//     }, [lastPackets]);

//     useEffect(() => {
//         console.log("Updated packets:", packets);
//         updateMarkers(); // Update markers when packets or selectedOption changes
//     }, [packets, selectedOption]);

//     useEffect(() => {
//         if (map) {
//             const tileLayerOffline = L.tileLayer.offline(
//                 "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
//                 {
//                     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//                     subdomains: ["a", "b", "c"],
//                 }
//             ).addTo(map);
//         }
//     }, [map]);

//     const handleSelectChange = (event) => {
//         setSelectedOption(event.target.value);
//     };

//     const getOpacity = (packet) => {
//         switch (selectedOption) {
//             case "species1Count":
//                 return parseFloat(packet.systemSummaryPacket.species_1CountInterval - minSpecies1Count) / (maxSpecies1Count - minSpecies1Count);
//             case "species2Count":
//                 return parseFloat(packet.systemSummaryPacket.species_2CountInterval - minSpecies2Count) / (maxSpecies2Count - minSpecies2Count);
//             case "totalBuzzCount":
//             default:
//                 return parseFloat(packet.systemSummaryPacket.buzzCountInterval - minBuzzCount) / (maxBuzzCount - minBuzzCount);
//         }
//     };

//     const getBuzzCount = (packet) => {
//         switch (selectedOption) {
//             case "species1Count":
//                 return packet.systemSummaryPacket.species_1CountInterval;
//             case "species2Count":
//                 return packet.systemSummaryPacket.species_2CountInterval;
//             case "totalBuzzCount":
//             default:
//                 return packet.systemSummaryPacket.buzzCountInterval;
//         }
//     };

//     const updateMarkers = () => {
//         // Clear previous markers
//         markersRef.current.forEach(marker => {
//             if (map) {
//                 map.removeLayer(marker);
//             }
//         });
//         markersRef.current = [];

//         // Add new markers
//         Object.entries(lastPackets).forEach(([key, packet], index) => {
//             const marker = (
//                 <CircleMarker
//                     key={`${selectedOption}-${key}`} // Use selectedOption and key to force re-render
//                     center={[packet.systemSummaryPacket.location.lat, packet.systemSummaryPacket.location.lon]}
//                     radius={40}
//                     weight={1}
//                     opacity={getOpacity(packet)}
//                     fillOpacity={getOpacity(packet)}
//                     color="blue"
//                     eventHandlers={{
//                         click: () => {
//                             setSelectedPacket(packet);
//                         }
//                     }}
//                 >
//                     <Popup>
//                         <div>
//                             <p><strong>UID:</strong> {packet.header.systemUid}</p>
//                             <p><strong>Buzz count:</strong> {getBuzzCount(packet)}</p>
//                         </div>
//                     </Popup>
//                 </CircleMarker>
//             );
//             markersRef.current.push(marker);
//         });
//     };

//     return (
//         <div style={{ display: 'flex' }}>
//             <Card style={{ flex: 3, marginRight: '10px', position: 'relative' }}>
//                 <MapContainer
//                     center={initialPosition}
//                     zoom={13}
//                     whenCreated={setMap}
//                     style={{ height: "500px", width: "100%" }}
//                 >
//                     <TileLayer
//                         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                     />
//                     {console.log("packets in map", packets)}
//                     {markersRef.current}
//                 </MapContainer>
//                 <VuiBox
//                     sx={{
//                         position: 'absolute',
//                         top: '10px',
//                         right: '10px',
//                         zIndex: 1000,
//                         backgroundColor: 'white',
//                         padding: '5px',
//                         borderRadius: '5px',
//                         border: '1px solid #ccc',
//                     }}
//                 >
//                     <Select
//                         value={selectedOption}
//                         onChange={handleSelectChange}
//                         sx={{
//                             width: '150px' // Adjust the width as needed
//                         }}
//                     >
//                         <MenuItem value="totalBuzzCount">Total Buzz Count</MenuItem>
//                         <MenuItem value="species1Count">Species 1 Count</MenuItem>
//                         <MenuItem value="species2Count">Species 2 Count</MenuItem>
//                     </Select>
//                 </VuiBox>
//             </Card>
//             <Card style={{ flex: 1, width: '300px' }}>
//                 <VuiBox mb="10px">
//                     <VuiTypography variant="lg" color="white" fontWeight="bold" mb="40px">
//                         Map Overview
//                     </VuiTypography>
//                     {selectedPacket ? (
//                         <div>
//                             <VuiTypography variant="h6" color="white" mb="15px">
//                                 Packet Information
//                             </VuiTypography>
//                             <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
//                                 <strong>UID:</strong> {selectedPacket?.header?.systemUid ?? 'N/A'}
//                             </VuiTypography>
//                             <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
//                                 <strong>Buzz Count:</strong> {selectedPacket?.systemSummaryPacket?.buzzCountInterval ?? 'N/A'}
//                             </VuiTypography>
//                             <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
//                                 <strong>Latitude:</strong> {selectedPacket?.systemSummaryPacket?.location?.lat ?? 'N/A'}
//                             </VuiTypography>
//                             <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
//                                 <strong>Longitude:</strong> {selectedPacket?.systemSummaryPacket?.location?.lon ?? 'N/A'}
//                             </VuiTypography>
//                             <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
//                                 <strong>Elevation:</strong> {selectedPacket?.systemSummaryPacket?.location?.elev ?? 'N/A'}
//                             </VuiTypography>
//                             <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
//                                 <strong>Classifier Version:</strong> {selectedPacket?.systemSummaryPacket?.classifierVersion ?? 'N/A'}
//                             </VuiTypography>
//                             <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
//                                 <strong>Transmission Interval M:</strong> {selectedPacket?.systemSummaryPacket?.trasmissionIntervalM ?? 'N/A'}
//                             </VuiTypography>
//                             <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
//                                 <strong>Species 1 Count:</strong> {selectedPacket?.systemSummaryPacket?.species_1CountInterval ?? 'N/A'}
//                             </VuiTypography>
//                             <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
//                                 <strong>Species 2 Count:</strong> {selectedPacket?.systemSummaryPacket?.species_2CountInterval ?? 'N/A'}
//                             </VuiTypography>
//                             <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
//                                 <strong>Temperature:</strong> {selectedPacket?.systemSummaryPacket?.temperature ?? 'N/A'}
//                             </VuiTypography>
//                             <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
//                                 <strong>Humidity:</strong> {selectedPacket?.systemSummaryPacket?.humidity ?? 'N/A'}
//                             </VuiTypography>
//                             <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
//                                 <strong>Gas:</strong> {selectedPacket?.systemSummaryPacket?.gas ?? 'N/A'}
//                             </VuiTypography>
//                         </div>
//                     ) : (
//                         <VuiTypography color="white" variant="body2" fontWeight="regular">
//                             Click on a marker for more information about the packet
//                         </VuiTypography>
//                     )}
//                 </VuiBox>
//             </Card>
//         </div>
//     );
// };

// export default OfflineMap;




import React, { useEffect, useState, useRef } from "react";
import { MapContainer, CircleMarker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet.offline";
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import { Card, Select, MenuItem } from "@mui/material";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const OfflineMap = ({ lastPackets = [], maxBuzzCount, minBuzzCount, maxSpecies1Count, minSpecies1Count, maxSpecies2Count, minSpecies2Count }) => {
    const [map, setMap] = useState(null);
    const [packets, setPackets] = useState(lastPackets);
    const initialPosition = [-41.0243015, -71.8205756]; // initialized to puerto blest
    const [selectedPacket, setSelectedPacket] = useState(null);
    const [selectedOption, setSelectedOption] = useState("totalBuzzCount");
    const [renderTrigger, setRenderTrigger] = useState(false); // Dummy state to force re-render
    const markersRef = useRef(new Map()); // Ref to store markers

    useEffect(() => {
        // console.log("updating lastPackets in offline map")
        setPackets(lastPackets);
    }, [lastPackets]);

    // useEffect(() => {
    //     // console.log("Updated packets:", packets);
    // }, [packets]);

    useEffect(() => {
        console.log("Packets data:", packets);
      }, [packets]);
      

    // useEffect(() => {
    //     if (map) {
    //         const tileLayerOffline = L.tileLayer.offline(
    //             "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    //             {
    //                 attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    //                 subdomains: ["a", "b", "c"],
    //             }
    //         ).addTo(map);
    //     }
    // }, [map]);

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
        setRenderTrigger(!renderTrigger); // Toggle renderTrigger to force re-render
    };

    const getOpacity = (packet) => {
        switch (selectedOption) {
            case "species1Count":
                console.log("packet.systemSummaryPacket.buzzIntervalData.species_1Count.low", packet.systemSummaryPacket.buzzIntervalData.species_1Count.low);
                return parseFloat(packet.systemSummaryPacket.buzzIntervalData.species_1Count.low - minSpecies1Count) / (maxSpecies1Count - minSpecies1Count);
            case "species2Count":
                console.log("packet.systemSummaryPacket.buzzIntervalData.species_2Count.low", packet.systemSummaryPacket.buzzIntervalData.species_2Count.low);
                return parseFloat(packet.systemSummaryPacket.buzzIntervalData.species_2Count.low - minSpecies2Count) / (maxSpecies2Count - minSpecies2Count);
            case "totalBuzzCount":
                console.log("packet.systemSummaryPacket.buzzIntervalData.buzzCount.low", packet.systemSummaryPacket.buzzIntervalData.buzzCount.low);
            default:
                return parseFloat(packet.systemSummaryPacket.buzzIntervalData.buzzCount.low - minBuzzCount) / (maxBuzzCount - minBuzzCount);
        }
    };

    const getBuzzCount = (packet) => {
        switch (selectedOption) {
            case "species1Count":
                return packet.systemSummaryPacket.buzzIntervalData.species_1Count.low;
            case "species2Count":
                return packet.systemSummaryPacket.buzzIntervalData.species_2Count.low;
            case "totalBuzzCount":
            default:
                return packet.systemSummaryPacket.buzzIntervalData.buzzCount.low;
        }
    };

    const updateMarkers = () => {
        console.log("updating markers", markersRef)
        // Clear previous markers
        // markersRef.current.forEach(marker => {
        //     console.log("iterating through current markers")
        //     if (map) {
        //         console.log("removing marker, ", marker);
        //         map.removeLayer(marker);
        //     }
        // });
        // markersRef.current.clear();

        {packets && (() => {
            const markers = [];
            for (const index in packets) {
                if (packets.hasOwnProperty(index)) {
                    const packet = packets[index]; // Access the value associated with the key
                    console.log("in map, last packet index", index);
                    console.log("in map, packet.systemSummaryPacket.location.lat", packet.systemSummaryPacket.location.lat)
                    console.log("in map, packet.systemSummaryPacket.location.lon", packet.systemSummaryPacket.location.lon)

                    console.log("in map, packet.systemSummaryPacket.location.lat / 10000000", packet.systemSummaryPacket.location.lat / 10000000)
                    console.log("in map, packet.systemSummaryPacket.location.lon / 10000000", packet.systemSummaryPacket.location.lon / 10000000)
                    // console.log("buzzCountInterval ", packet.systemSummaryPacket.buzzCountInterval);
                    console.log("maxBuzzCount ", maxBuzzCount);
                    console.log("minBuzzCount ", minBuzzCount);
                    console.log("maxSpecies1Count ", maxSpecies1Count);
                    console.log("minSpecies1Count ", minSpecies1Count); 
                    console.log("maxSpecies2Count ", maxSpecies2Count);
                    console.log("minSpecies2Count ", minSpecies2Count);

                    console.log("opacity ", getOpacity(packet));

                    const uid = packet.header.systemUid;
                    const lat = packet.systemSummaryPacket.location.lat / 10000000;
                    const lon = packet.systemSummaryPacket.location.lon / 10000000;

                    // only add another marker if the uid is not already in the map or the lat/lon is different
                    if (!markersRef.current.has(`${uid}-small`) || markersRef.current.get(`${uid}-small`).props.center[0] !== lat || markersRef.current.get(`${uid}-small`).props.center[1] !== lon) {
                        console.log("adding new marker, ", `${uid}-small`)
                        // remove previous marker if it exists
                        if (markersRef.current.has(`${uid}-small`)) {
                            // deleting old marker
                            console.log("deleting old marker, ", `${uid}-small`)
                            map.removeLayer(markersRef.current.get(`${uid}-small`));
                            map.removeLayer(markersRef.current.get(`${uid}-large`));
                        }

                        // Larger marker with valid opacity
                        if (!isNaN(getOpacity(packet))) {
                            const largeMarker = (
                                <CircleMarker
                                    key={`${renderTrigger}-${uid}-large`} // Use renderTrigger and UID to force re-render
                                    center={[lat, lon]}
                                    radius={40}
                                    weight={1}
                                    opacity={getOpacity(packet)}
                                    fillOpacity={getOpacity(packet)}
                                    color="#f1a307"
                                    eventHandlers={{
                                        click: () => {
                                            setSelectedPacket(packet);
                                        }
                                    }}
                                >
                                    <Popup>
                                        <div>
                                            <p><strong>UID:</strong> {packet.header.systemUid}</p>
                                            <p><strong>Buzz count:</strong> {getBuzzCount(packet)}</p>
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            );
                            markersRef.current.set(`${uid}-large`, largeMarker);
                        }

                        // Smaller marker to indicate device location
                        const smallMarker = (
                            <CircleMarker
                                key={`${renderTrigger}-${uid}-small`} // Use renderTrigger and UID to force re-render
                                center={[lat, lon]}
                                radius={5} // Set a visible radius
                                weight={1}
                                opacity={1}
                                color="#df6100"
                                eventHandlers={{
                                    click: () => {
                                        setSelectedPacket(packet);
                                    }
                                }}
                            >
                                <Popup>
                                    <div>
                                        <p><strong>UID:</strong> {packet.header.systemUid}</p>
                                        <p><strong>Buzz count:</strong> {getBuzzCount(packet)}</p>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        );
                        markersRef.current.set(`${uid}-small`, smallMarker);

                    }

                    
                }
            
            }
            return markers;
        })()}

        
    }

    useEffect(() => {
        updateMarkers();
    }, [packets, selectedOption, renderTrigger]);

    return (
        <div style={{ display: 'flex' }}>
            <Card style={{ flex: 3, marginRight: '10px', position: 'relative' }}>
                <MapContainer
                    key={renderTrigger} // Use renderTrigger to force re-render
                    center={initialPosition}
                    zoom={13}
                    whenCreated={setMap}
                    style={{ height: "500px", width: "100%" }}
                    ref={setMap}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {Array.from(markersRef.current.values())}
                </MapContainer>
                <VuiBox
                    sx={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        zIndex: 1000,
                        backgroundColor: 'white',
                        padding: '5px',
                    }}
                >
                    <Select
                        value={selectedOption}
                        onChange={handleSelectChange}
                        sx={{
                            width: '150px' // Adjust the width as needed
                        }}
                    >
                        <MenuItem value="totalBuzzCount">Total Buzz Count</MenuItem>
                        <MenuItem value="species1Count">Species 1 Count</MenuItem>
                        <MenuItem value="species2Count">Species 2 Count</MenuItem>
                    </Select>
                </VuiBox>
            </Card>
            <Card style={{ flex: 1, width: '300px' }}>
                <VuiBox mb="10px">
                    <VuiTypography variant="lg" color="white" fontWeight="bold" mb="40px">
                        Map Overview
                    </VuiTypography>
                    {selectedPacket ? (
                        <div>
                            <VuiTypography variant="h6" color="white" mb="15px">
                                Packet Information
                            </VuiTypography>
                            <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
                                <strong>UID:</strong> {selectedPacket?.header?.systemUid ?? 'N/A'}
                            </VuiTypography>
                            <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
                                <strong>Buzz Count:</strong> {selectedPacket?.systemSummaryPacket?.buzzIntervalData.buzzCount.low ?? 'N/A'}
                            </VuiTypography>
                            <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
                                <strong>Latitude:</strong> {selectedPacket?.systemSummaryPacket?.location?.lat / 10000000 ?? 'N/A'}
                            </VuiTypography>
                            <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
                                <strong>Longitude:</strong> {selectedPacket?.systemSummaryPacket?.location?.lon / 10000000 ?? 'N/A'}
                            </VuiTypography>
                            <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
                                <strong>Elevation:</strong> {selectedPacket?.systemSummaryPacket?.location?.elev ?? 'N/A'}
                            </VuiTypography>
                            <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
                                <strong>Classifier Version:</strong> {selectedPacket?.systemSummaryPacket?.classifierVersion ?? 'N/A'}
                            </VuiTypography>
                            <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
                                <strong>Transmission Interval M:</strong> {selectedPacket?.systemSummaryPacket?.trasmissionIntervalM ?? 'N/A'}
                            </VuiTypography>
                            <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
                                <strong>Species 1 Count:</strong> {selectedPacket?.systemSummaryPacket?.buzzIntervalData.species_1Count.low ?? 'N/A'}
                            </VuiTypography>
                            <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
                                <strong>Species 2 Count:</strong> {selectedPacket?.systemSummaryPacket?.buzzIntervalData.species_2Count.low ?? 'N/A'}
                            </VuiTypography>
                            <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
                                <strong>Temperature:</strong> {(selectedPacket?.systemSummaryPacket?.temperature).toFixed(1) ?? 'N/A'}
                            </VuiTypography>
                            <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
                                <strong>Relative Humidity:</strong> {(selectedPacket?.systemSummaryPacket?.humidity).toFixed(1) ?? 'N/A'} %
                            </VuiTypography>
                            <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
                                <strong>Gas:</strong> {(selectedPacket?.systemSummaryPacket?.gas).toFixed(1) ?? 'N/A'}
                            </VuiTypography>
                        </div>
                    ) : (
                        <VuiTypography color="white" variant="body2" fontWeight="regular">
                            Click on a marker for more information about the packet
                        </VuiTypography>
                    )}
                </VuiBox>
            </Card>
        </div>
    );
};

export default OfflineMap;









// import React, { useEffect, useState, useRef } from "react";
// import { MapContainer, CircleMarker, Popup, TileLayer } from "react-leaflet";
// import L from "leaflet";
// import "leaflet.offline";
// import 'leaflet/dist/leaflet.css';
// import icon from 'leaflet/dist/images/marker-icon.png';
// import iconShadow from 'leaflet/dist/images/marker-shadow.png';
// import VuiBox from "components/VuiBox";
// import VuiTypography from "components/VuiTypography";
// import { Card, Select, MenuItem } from "@mui/material";

// let DefaultIcon = L.icon({
//     iconUrl: icon,
//     shadowUrl: iconShadow
// });

// L.Marker.prototype.options.icon = DefaultIcon;

// const OfflineMap = ({ lastPackets = [], maxBuzzCount, minBuzzCount, maxSpecies1Count, minSpecies1Count, maxSpecies2Count, minSpecies2Count }) => {
//     const [map, setMap] = useState(null);
//     const [packets, setPackets] = useState(lastPackets);
//     const initialPosition = [-41.0243015, -71.8205756]; // initialized to puerto blest
//     const [selectedPacket, setSelectedPacket] = useState(null);
//     const [selectedOption, setSelectedOption] = useState("totalBuzzCount");
//     const [renderTrigger, setRenderTrigger] = useState(false); // Dummy state to force re-render
//     const markersRef = useRef(new Map()); // Ref to store markers

//     useEffect(() => {
//         // console.log("updating lastPackets in offline map")
//         setPackets(lastPackets);
//     }, [lastPackets]);

//     // useEffect(() => {
//     //     // console.log("Updated packets:", packets);
//     // }, [packets]);

//     useEffect(() => {
//         console.log("Packets data:", packets);
//       }, [packets]);
      

//     useEffect(() => {
//         if (map) {
//             const tileLayerOffline = L.tileLayer.offline(
//                 "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
//                 {
//                     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//                     subdomains: ["a", "b", "c"],
//                 }
//             ).addTo(map);
//         }
//     }, [map]);

//     const handleSelectChange = (event) => {
//         setSelectedOption(event.target.value);
//         setRenderTrigger(!renderTrigger); // Toggle renderTrigger to force re-render
//     };

//     const getOpacity = (packet) => {
//         switch (selectedOption) {
//             case "species1Count":
//                 console.log("packet.systemSummaryPacket.buzzIntervalData.species_1Count.low", packet.systemSummaryPacket.buzzIntervalData.species_1Count.low);
//                 return parseFloat(packet.systemSummaryPacket.buzzIntervalData.species_1Count.low - minSpecies1Count) / (maxSpecies1Count - minSpecies1Count);
//             case "species2Count":
//                 console.log("packet.systemSummaryPacket.buzzIntervalData.species_2Count.low", packet.systemSummaryPacket.buzzIntervalData.species_2Count.low);
//                 return parseFloat(packet.systemSummaryPacket.buzzIntervalData.species_2Count.low - minSpecies2Count) / (maxSpecies2Count - minSpecies2Count);
//             case "totalBuzzCount":
//                 console.log("packet.systemSummaryPacket.buzzIntervalData.buzzCount.low", packet.systemSummaryPacket.buzzIntervalData.buzzCount.low);
//             default:
//                 return parseFloat(packet.systemSummaryPacket.buzzIntervalData.buzzCount.low - minBuzzCount) / (maxBuzzCount - minBuzzCount);
//         }
//     };

//     const getBuzzCount = (packet) => {
//         switch (selectedOption) {
//             case "species1Count":
//                 return packet.systemSummaryPacket.buzzIntervalData.species_1Count.low;
//             case "species2Count":
//                 return packet.systemSummaryPacket.buzzIntervalData.species_2Count.low;
//             case "totalBuzzCount":
//             default:
//                 return packet.systemSummaryPacket.buzzIntervalData.buzzCount.low;
//         }
//     };

//     return (
//         <div style={{ display: 'flex' }}>
//             <Card style={{ flex: 3, marginRight: '10px', position: 'relative' }}>
//                 <MapContainer
//                     key={renderTrigger} // Use renderTrigger to force re-render
//                     center={initialPosition}
//                     zoom={13}
//                     whenCreated={setMap}
//                     style={{ height: "500px", width: "100%" }}
//                 >
//                     <TileLayer
//                         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                     />
//                     {console.log("packets in map", packets)}
//                     {packets && (() => {
//                         const markers = [];
//                         for (const index in packets) {
//                             if (packets.hasOwnProperty(index)) {
//                                 const packet = packets[index]; // Access the value associated with the key
//                                 console.log("in map, last packet index", index);
//                                 console.log("in map, packet.systemSummaryPacket.location.lat", packet.systemSummaryPacket.location.lat)
//                                 console.log("in map, packet.systemSummaryPacket.location.lon", packet.systemSummaryPacket.location.lon)

//                                 console.log("in map, packet.systemSummaryPacket.location.lat / 10000000", packet.systemSummaryPacket.location.lat / 10000000)
//                                 console.log("in map, packet.systemSummaryPacket.location.lon / 10000000", packet.systemSummaryPacket.location.lon / 10000000)
//                                 // console.log("buzzCountInterval ", packet.systemSummaryPacket.buzzCountInterval);
//                                 console.log("maxBuzzCount ", maxBuzzCount);
//                                 console.log("minBuzzCount ", minBuzzCount);
//                                 console.log("maxSpecies1Count ", maxSpecies1Count);
//                                 console.log("minSpecies1Count ", minSpecies1Count); 
//                                 console.log("maxSpecies2Count ", maxSpecies2Count);
//                                 console.log("minSpecies2Count ", minSpecies2Count);

//                                 console.log("opacity ", getOpacity(packet));

//                                 if (!isNaN(getOpacity(packet))) { // only push larger circle if we have a valid opacity
//                                     markers.push(
//                                         <CircleMarker
//                                             key={`${renderTrigger}-${index}`} // Use renderTrigger and index to force re-render
//                                             center={[packet.systemSummaryPacket.location.lat / 10000000, packet.systemSummaryPacket.location.lon / 10000000]}
//                                             radius={40}
//                                             weight={1}
//                                             opacity={getOpacity(packet)}
//                                             fillOpacity={getOpacity(packet)}
//                                             color="#f1a307"
//                                             eventHandlers={{
//                                                 click: () => {
//                                                     setSelectedPacket(packet);
//                                                 }
//                                             }}
//                                         >
//                                             <Popup>
//                                                 <div>
//                                                     <p><strong>UID:</strong> {packet.header.systemUid}</p>
//                                                     <p><strong>Buzz count:</strong> {getBuzzCount(packet)}</p>
//                                                 </div>
//                                             </Popup>
//                                         </CircleMarker>
//                                     );
//                                 }
                                

//                                 // push a dot marker just so we know device locations
//                                 markers.push(
//                                     <CircleMarker
//                                             key={`${renderTrigger}-${index}`} // Use renderTrigger and index to force re-render
//                                             center={[packet.systemSummaryPacket.location.lat / 10000000, packet.systemSummaryPacket.location.lon / 10000000]}
//                                             radius={5} // Set a visible radius
//                                             weight={1}
//                                             opacity={1}
//                                             color="#df6100"
//                                             eventHandlers={{
//                                                 click: () => {
//                                                     setSelectedPacket(packet);
//                                                 }
//                                             }}
//                                         >
//                                             <Popup>
//                                                 <div>
//                                                     <p><strong>UID:</strong> {packet.header.systemUid}</p>
//                                                     <p><strong>Buzz count:</strong> {getBuzzCount(packet)}</p>
//                                                 </div>
//                                             </Popup>
//                                         </CircleMarker>
//                                 );
//                             }
                        
//                         }
//                         return markers;
//                     })()}
//                 </MapContainer>
//                 <VuiBox
//                     sx={{
//                         position: 'absolute',
//                         top: '20px',
//                         right: '20px',
//                         zIndex: 1000,
//                         backgroundColor: 'white',
//                         padding: '5px',
//                     }}
//                 >
//                     <Select
//                         value={selectedOption}
//                         onChange={handleSelectChange}
//                         sx={{
//                             width: '150px' // Adjust the width as needed
//                         }}
//                     >
//                         <MenuItem value="totalBuzzCount">Total Buzz Count</MenuItem>
//                         <MenuItem value="species1Count">Species 1 Count</MenuItem>
//                         <MenuItem value="species2Count">Species 2 Count</MenuItem>
//                     </Select>
//                 </VuiBox>
//             </Card>
//             <Card style={{ flex: 1, width: '300px' }}>
//                 <VuiBox mb="10px">
//                     <VuiTypography variant="lg" color="white" fontWeight="bold" mb="40px">
//                         Map Overview
//                     </VuiTypography>
//                     {selectedPacket ? (
//                         <div>
//                             <VuiTypography variant="h6" color="white" mb="15px">
//                                 Packet Information
//                             </VuiTypography>
//                             <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
//                                 <strong>UID:</strong> {selectedPacket?.header?.systemUid ?? 'N/A'}
//                             </VuiTypography>
//                             <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
//                                 <strong>Buzz Count:</strong> {selectedPacket?.systemSummaryPacket?.buzzIntervalData.buzzCount.low ?? 'N/A'}
//                             </VuiTypography>
//                             <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
//                                 <strong>Latitude:</strong> {selectedPacket?.systemSummaryPacket?.location?.lat / 10000000 ?? 'N/A'}
//                             </VuiTypography>
//                             <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
//                                 <strong>Longitude:</strong> {selectedPacket?.systemSummaryPacket?.location?.lon / 10000000 ?? 'N/A'}
//                             </VuiTypography>
//                             <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
//                                 <strong>Elevation:</strong> {selectedPacket?.systemSummaryPacket?.location?.elev ?? 'N/A'}
//                             </VuiTypography>
//                             <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
//                                 <strong>Classifier Version:</strong> {selectedPacket?.systemSummaryPacket?.classifierVersion ?? 'N/A'}
//                             </VuiTypography>
//                             <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
//                                 <strong>Transmission Interval M:</strong> {selectedPacket?.systemSummaryPacket?.trasmissionIntervalM ?? 'N/A'}
//                             </VuiTypography>
//                             <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
//                                 <strong>Species 1 Count:</strong> {selectedPacket?.systemSummaryPacket?.buzzIntervalData.species_1Count.low ?? 'N/A'}
//                             </VuiTypography>
//                             <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
//                                 <strong>Species 2 Count:</strong> {selectedPacket?.systemSummaryPacket?.buzzIntervalData.species_2Count.low ?? 'N/A'}
//                             </VuiTypography>
//                             <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
//                                 <strong>Temperature:</strong> {(selectedPacket?.systemSummaryPacket?.temperature).toFixed(1) ?? 'N/A'}
//                             </VuiTypography>
//                             <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
//                                 <strong>Relative Humidity:</strong> {(selectedPacket?.systemSummaryPacket?.humidity).toFixed(1) ?? 'N/A'} %
//                             </VuiTypography>
//                             <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
//                                 <strong>Gas:</strong> {(selectedPacket?.systemSummaryPacket?.gas).toFixed(1) ?? 'N/A'}
//                             </VuiTypography>
//                         </div>
//                     ) : (
//                         <VuiTypography color="white" variant="body2" fontWeight="regular">
//                             Click on a marker for more information about the packet
//                         </VuiTypography>
//                     )}
//                 </VuiBox>
//             </Card>
//         </div>
//     );
// };

// export default OfflineMap;





