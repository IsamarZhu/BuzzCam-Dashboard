// /*!

// =========================================================
// * Vision UI Free React - v1.0.0
// =========================================================

// * Product Page: https://www.creative-tim.com/product/vision-ui-free-react
// * Copyright 2021 Creative Tim (https://www.creative-tim.com/)
// * Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

// * Design and Coded by Simmmple & Creative Tim

// =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// */

// export const lineChartOptionsDashboard = {
//   // chart: {
//   //   toolbar: {
//   //     show: false,
//   //   },
//   // },
//   chart: {
//     id: 'realtime',
//     type: 'line',
//     animations: {
//       enabled: true,
//       easing: 'linear',
//       dynamicAnimation: {
//         speed: 1000
//       }
//     },
//     toolbar: {
//       show: false
//     },
//     zoom: {
//       enabled: false
//     }
//   },
//   tooltip: {
//     theme: "dark",
//     x: {
//       format: 'dd MMM yyyy'
//     }
//   },
//   dataLabels: {
//     enabled: false,
//   },
//   stroke: {
//     curve: "smooth",
//   },
//   xaxis: {
//     type: "datetime",
//     // range: 12,

//     // categories: [
//     //   "Jan",
//     //   "Feb",
//     //   "Mar",
//     //   "Apr",
//     //   "May",
//     //   "Jun",
//     //   "Jul",
//     //   "Aug",
//     //   "Sep",
//     //   "Oct",
//     //   "Nov",
//     //   "Dec",
//     // ],
//     labels: {
//       style: {
//         colors: "#c8cfca",
//         fontSize: "10px",
//       },
//     },
//     axisBorder: {
//       show: false,
//     },
//     axisTicks: {
//       show: false,
//     },
//   },
//   yaxis: {
//     labels: {
//       style: {
//         colors: "#c8cfca",
//         fontSize: "10px",
//       },
//     },
//   },
//   legend: {
//     show: false,
//   },
//   grid: {
//     strokeDashArray: 5,
//     borderColor: "#56577A",
//   },
//   fill: {
//     type: "gradient",
//     gradient: {
//       shade: "dark",
//       type: "vertical",
//       shadeIntensity: 0,
//       gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
//       inverseColors: true,
//       opacityFrom: 0.8,
//       opacityTo: 0,
//       stops: [],
//     },
//     colors: ["#0075FF", "#2CD9FF"],
//   },
//   colors: ["#0075FF", "#2CD9FF"],
// };

export const lineChartOptionsDashboard = {
  chart: {
    id: 'realtime',
    type: 'area', // Update this to match with the component
    animations: {
      enabled: true,         // Enable animations
      easing: 'easeinout',   // Easing function
      speed: 800,            // Duration of the animation in ms
      animateGradually: {
        enabled: true,
        delay: 150            // Gradually animate the lines
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350            // Animation speed for dynamic updates
      }
    },
    toolbar: {
      show: false,
    },
    zoom: {
      autoScaleYaxis: true
    }
  },
  tooltip: {
    theme: "dark",
    x: {
      format: 'dd MMM yyyy',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },
  xaxis: {
    type: "datetime", // Correctly handles timestamps in UNIX format (milliseconds)
    labels: {
      datetimeUTC: false, // Display the dates in local time
      style: {
        colors: "#c8cfca",
        fontSize: "10px",
      },
      // You can use a custom formatter for better control
      formatter: function (value) {
        return new Date(value).toLocaleString(); // Format the timestamp into a readable date-time
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    tooltip: {
      enabled: true,
      formatter: function (value) {
        return new Date(value).toLocaleString(); // Show the date in tooltip as well
      },
    },
    tickAmount: 3,
  },
  yaxis: {
    forceNiceScale: true,
    labels: {
      formatter: function (val) {
        return Math.round(val); // Round to integer
      },
      style: {
        colors: "#c8cfca",
        fontSize: "10px",
      },
    },
  },
  legend: {
    show: false,
  },
  grid: {
    strokeDashArray: 5,
    borderColor: "#56577A",
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      type: "vertical",
      opacityFrom: 0.8,
      opacityTo: 0,
      stops: [],
    },
    colors: ["#0075FF", "#2CD9FF"],
  },
  colors: ["#0075FF", "#2CD9FF"],
};

