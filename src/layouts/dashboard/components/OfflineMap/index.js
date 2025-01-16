import React, { useEffect, useRef, useState } from "react";
import { MapContainer, CircleMarker, Circle, Marker, Popup, TileLayer } from "react-leaflet";

import L from "leaflet";
import "leaflet.offline";

import 'leaflet/dist/leaflet.css';


import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import { Card} from "@mui/material";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const OfflineMap = ({ lastPackets, maxBuzzCount, minBuzzCount }) => {
    const [map, setMap] = useState(null);
    const [packets, setPackets] = useState(lastPackets);
    const initialPosition = [-41.0243015, -71.8205756]; // initialized to puerto blest
    const opacities = [0.2, 0.3, 0.4, 0.5, 0.6, 0.67, 0.7, 0.75, 0.8, 1.0];
    const [selectedPacket, setSelectedPacket] = useState(null);

    useEffect(() => {
        console.log("updating lastPackets in offline map")
        setPackets(lastPackets);
    }, [lastPackets]);

    useEffect(() => {
        console.log("Updated packets:", packets);
    }, [packets]);
    

    useEffect(() => {
        if (map) {
            const tileLayerOffline = L.tileLayer.offline(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    subdomains: ["a", "b", "c"],
                }
            ).addTo(map);
        }
    }, [map]);

    

    // return (
    //     <MapContainer
    //         center={initialPosition}
    //         zoom={13}
    //         whenCreated={setMap}
    //         style={{ height: "500px", width: "100%" }}
    //     >
    //         <TileLayer
    //             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //         />
    //         {/* Render markers for the last 10 locations */}

            
    //         {lastPackets && (() => {
    //             // const opacity = opacities[index] || opacities[opacities.length - 1];
    //             return (
    //                 <Marker
    //                     key={index}
    //                     position={[lastPackets.systemSummaryPacket.location.lat, lastPackets.systemSummaryPacket.location.lon]}
    //                     icon={createIcon()}
    //                     eventHandlers={{
    //                         add: (e) => {
    //                             // Set opacity using the _icon property when the marker is added to the map
    //                             e.target._icon.style.opacity = 0.8;
    //                         }
    //                     }}
    //                 >
    //                     <Popup>
    //                         <div>
    //                             <p><strong>UID:</strong> {location.uid}</p>
    //                             <p><strong>Time:</strong> {location.time.toLocaleString()}</p>
    //                         </div>
    //                     </Popup>
    //                 </Marker>
    //             );
    //         })}
    //     </MapContainer>
    // );

    return (
        <div style={{ display: 'flex' }}>
            <Card style={{ flex: 3, marginRight: '10px' }}>
                <MapContainer
                    center={initialPosition}
                    zoom={13}
                    whenCreated={setMap}
                    style={{ height: "500px", width: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {console.log("packets in map", packets)}
                    {packets && (() => {
                        const markers = [];
                        for (const index in packets) {
                            if (packets.hasOwnProperty(index)) {
                                const packet = packets[index]; // Access the value associated with the key
                                console.log("in map, last packet index", index);
                                console.log("buzzCountInterval ", packet.systemSummaryPacket.buzzCountInterval);
                                console.log("maxBuzzCount ", maxBuzzCount);
                                console.log("minBuzzCount ", minBuzzCount);
                                console.log("opacity ", parseFloat(packet.systemSummaryPacket.buzzCountInterval - minBuzzCount) / (maxBuzzCount - minBuzzCount));
                                markers.push(
                                    <CircleMarker
                                        key={index}
                                        center={[packet.systemSummaryPacket.location.lat, packet.systemSummaryPacket.location.lon]}
                                        radius={40}
                                        weight={1}
                                        opacity={parseFloat(packet.systemSummaryPacket.buzzCountInterval - minBuzzCount) / (maxBuzzCount - minBuzzCount)}
                                        fillOpacity={parseFloat(packet.systemSummaryPacket.buzzCountInterval - minBuzzCount) / (maxBuzzCount - minBuzzCount)}
                                        color="blue"
                                        eventHandlers={{
                                            click: () => {
                                                setSelectedPacket(packet);
                                            }
                                        }}
                                    >
                                        <Popup>
                                            <div>
                                                <p><strong>UID:</strong> {packet.header.systemUid}</p>
                                                <p><strong>Buzz count:</strong> {packet.systemSummaryPacket.buzzCountInterval}</p>
                                            </div>
                                        </Popup>
                                    </CircleMarker>
                                );
                            }
                        }
                        return markers;
                    })()}
                </MapContainer>
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
                                <strong>Buzz Count:</strong> {selectedPacket?.systemSummaryPacket?.buzzCountInterval ?? 'N/A'}
                            </VuiTypography>
                            <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
                                <strong>Latitude:</strong> {selectedPacket?.systemSummaryPacket?.location?.lat ?? 'N/A'}
                            </VuiTypography>
                            <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
                                <strong>Longitude:</strong> {selectedPacket?.systemSummaryPacket?.location?.lon ?? 'N/A'}
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
                                <strong>Species 1 Count:</strong> {selectedPacket?.systemSummaryPacket?.species_1CountInterval ?? 'N/A'}
                            </VuiTypography>
                            <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
                                <strong>Species 2 Count:</strong> {selectedPacket?.systemSummaryPacket?.species_2CountInterval ?? 'N/A'}
                            </VuiTypography>
                            <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
                                <strong>Temperature:</strong> {selectedPacket?.systemSummaryPacket?.temperature ?? 'N/A'}
                            </VuiTypography>
                            <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
                                <strong>Humidity:</strong> {selectedPacket?.systemSummaryPacket?.humidity ?? 'N/A'}
                            </VuiTypography>
                            <VuiTypography color="white" variant="body2" fontWeight="regular" mb="12px">
                                <strong>Gas:</strong> {selectedPacket?.systemSummaryPacket?.gas ?? 'N/A'}
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




// import React, { useEffect, useRef, useState } from "react";
// import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import "leaflet.offline";

// const myAPIKey = "cb58ef736ce746bfba7e86b1bcc4e181";

// const createIcon = () => {
//     return L.icon({
//         iconUrl: `https://api.geoapify.com/v1/icon/?type=material&color=%23ff7100&icon=paw&iconType=awesome&iconSize=large&scaleFactor=2&apiKey=${myAPIKey}`,
//         iconSize: [31, 46],
//         iconAnchor: [15.5, 42],
//         popupAnchor: [0, -35],
//         shadowSize: [41, 41],
//     });
// };

// const OfflineMap = ({ lastTenLocations }) => {
//     const [map, setMap] = useState(null);
//     const initialPosition = [42.36058226915706, -71.08731546241223];
//     const opacities = [0.2, 0.3, 0.4, 0.5, 0.6, 0.67, 0.7, 0.75, 0.8, 1.0];

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

//     return (
//         <MapContainer
//             center={initialPosition}
//             zoom={13}
//             whenCreated={setMap}
//             style={{ height: "500px", width: "100%" }}
//         >
//             <TileLayer
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             />
//             {/* Render markers for the last 10 locations */}
//             {lastTenLocations && lastTenLocations.map((location, index) => {
//                 const opacity = opacities[index] || opacities[opacities.length - 1];
//                 return (
//                     <Marker
//                         key={index}
//                         position={[location.loc.latitude, location.loc.longitude]}
//                         icon={createIcon()}
//                         eventHandlers={{
//                             add: (e) => {
//                                 // Set opacity using the _icon property when the marker is added to the map
//                                 e.target._icon.style.opacity = opacity;
//                             }
//                         }}
//                     >
//                         <Popup>
//                             <div>
//                                 <p><strong>UID:</strong> {location.uid}</p>
//                                 <p><strong>Time:</strong> {location.time.toLocaleString()}</p>
//                             </div>
//                         </Popup>
//                     </Marker>
//                 );
//             })}
//         </MapContainer>
//     );
// };

// export default OfflineMap;

