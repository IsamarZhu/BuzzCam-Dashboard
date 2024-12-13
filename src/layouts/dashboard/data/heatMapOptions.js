// export const heatMapOptionsDashboard = {
//     chart: {
//         // height: 450,
//         type: 'heatmap',
//     },
//     dataLabels: {
//         enabled: false
//     },
//     tooltip: {
//         theme: "dark",
//       },
//     colors: ['#C74026',
//         '#28B74A',
//         '#2A46B3',
//         '#B19C0E',
//         '#6A2D8D',
//         '#159C7C',
//         '#C63C30',
//         '#28A45C'],
//     xaxis: {
//         type: 'category',
//         categories: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '01:00', '01:30'],
//         labels: {
//             style: {
//                 colors: "#c8cfca",
//                 fontSize: "10px",
//             },
//         },
//     },
//     yaxis: {
//         labels: {
//             style: {
//                 colors: "#c8cfca",
//                 fontSize: "10px",
//             },
//         },
//     },
//     grid: {
//         padding: {
//             right: 20
//         }
//     },
//     // plotOptions: {
//     //     heatmap: {
//     //         radius: 15,
//     //         // useFillColorAsStroke: true,
//     //     }
//     // },
//     stroke: {
//         // show: false,
//         colors: ["#001638"],
//         // width: 4
//     },
//     theme: {
//         mode: 'dark', 
//     }
// };

export const heatMapOptionsDashboard = {
    chart: {
        type: 'heatmap',
        background: 'transparent', // Set background to transparent
    },
    dataLabels: {
        enabled: false
    },
    tooltip: {
        theme: "dark",
        style: {
            fontSize: "12px",
            color: "#FFFFFF",
        },
        onDatasetHover: {
            highlightDataSeries: true,
        },
    },
    colors: [
        '#c71e04',  // temp
        '#1a5ec9',  // humidity
        '#73d9b8',  // pressure
        '#8e53b0',  // gas
        '#e04fa6',  // pm
        '#dba400',  // light
    ],
    xaxis: {
        type: 'category',
        categories: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '01:00', '01:30'],
        labels: {
            style: {
                colors: "#FFFFFF", // Changed to white for contrast
                fontSize: "12px",
            },
        },
    },
    yaxis: {
        labels: {
            style: {
                colors: "#FFFFFF", // Changed to white for contrast
                fontSize: "12px",
            },
        },
    },
    grid: {
        padding: {
            right: 20
        },
        borderColor: '#001F3F', // Dark blue for grid lines
        row: {
            colors: undefined, // Remove any row color background
            opacity: 0.5 // Optional: Adjust opacity for row colors if needed
        }
    },
    stroke: {
        show: true, // Enable stroke to show borders
        colors: ['#001F3F'], // Set border color to transparent
        width: 0.5 // Adjust width as needed
    },
    // theme: {
    //     mode: 'dark',
    // }
};
