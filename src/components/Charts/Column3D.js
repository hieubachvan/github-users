// STEP 1 - Include Dependencies
// Include react
import React from "react";
import ReactDOM from "react-dom";

// Include the react-fusioncharts component
import ReactFC from "react-fusioncharts";

// Include the fusioncharts library
import FusionCharts from "fusioncharts";

// Include the chart type
import Column2D from "fusioncharts/fusioncharts.charts";

// Include the theme as fusion
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

// Adding the chart and theme as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts, Column2D, FusionTheme);

// STEP 3 - Creating the JSON object to store the chart configurations

const chartComponent = ({ data }) => {
  const chartConfigs = {
    type: "Column2D", // The chart type
    width: "100%", // Width of the chart
    height: "400", // Height of the chart
    dataFormat: "json", // Data type
    dataSource: {
      // Chart Configuration
      chart: {
        //Set the chart caption
        caption: "Most Popular",
        //Set the chart subcaption
        subCaption: "In MMbbl = One Million barrels",
        //Set the x-axis name
        xAxisName: "Repos",
        //Set the y-axis name
        yAxisName: "Stars",
        xAxisNameFontSize: "16px",
        yAxisNameFontSize: "16px",
        theme: "fusion",
      },
      // Chart Data
      data: data,
    },
  };
  return <ReactFC {...chartConfigs} />;
};

export default chartComponent;
