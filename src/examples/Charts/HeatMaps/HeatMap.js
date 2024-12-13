import React from "react";
import ReactApexChart from "react-apexcharts";

class HeatMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: [],
      chartOptions: {},
    };
  }

  componentDidMount() {
    const { heatMapData, heatMapOptions } = this.props;

    this.setState({
      chartData: heatMapData,
      chartOptions: heatMapOptions,
    });

    console.log("component mounted")
  }

  // Add componentDidUpdate to watch for prop changes
  componentDidUpdate(prevProps) {
    if (prevProps.heatMapData !== this.props.heatMapData) {
      this.setState({
        chartData: this.props.heatMapData,
      });
    }
    if (prevProps.heatMapOptions !== this.props.heatMapOptions) {
      this.setState({
        chartOptions: this.props.heatMapOptions,
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
        type="heatmap"
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


export default HeatMap;
