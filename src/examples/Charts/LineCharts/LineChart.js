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

import React from "react";
import ReactApexChart from "react-apexcharts";

class LineChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: [],
      chartOptions: {},
    };
  }

  componentDidMount() {
    const { lineChartData, lineChartOptions } = this.props;

    this.setState({
      chartData: lineChartData,
      chartOptions: lineChartOptions,
    });

    console.log("component mounted")
  }

  // Add componentDidUpdate to watch for prop changes
  componentDidUpdate(prevProps) {
    if (prevProps.lineChartData !== this.props.lineChartData) {
      this.setState({
        chartData: this.props.lineChartData,
      });
    }
    if (prevProps.lineChartOptions !== this.props.lineChartOptions) {
      this.setState({
        chartOptions: this.props.lineChartOptions,
      });
    }
  }

  render() {
    return (
      <ReactApexChart
        // key={JSON.stringify(this.state.chartData)}  // The chart will rerender if data changes
        options={this.state.chartOptions}
        series={this.state.chartData}
        // series={sampleTemperatureData}
        type="area"
        width="100%"
        height="100%"
      />
    );
  }
}

const sampleTemperatureData = [{
  data: [
    [1638200000000, 22.1],
    [1638203600000, 22.5],
    [1638207200000, 23.0],
    [1638210800000, 23.4],
    [1638214400000, 23.7],
    [1638218000000, 23.2],
    [1638221600000, 22.8],
    [1638225200000, 23.0],
    [1638228800000, 23.4],
    [1638232400000, 23.7],
    [1638236000000, 23.2],
    [1638239600000, 22.9],
    [1638243200000, 22.7],
    [1638246800000, 22.8],
    [1638250400000, 23.1],
    [1638254000000, 23.5],
    [1638257600000, 23.8],
    [1638261200000, 24.0],
    [1638264800000, 23.7]
  ]
}];


export default LineChart;
