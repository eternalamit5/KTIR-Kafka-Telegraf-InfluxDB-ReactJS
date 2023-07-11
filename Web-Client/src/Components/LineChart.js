import React from 'react';

import {
  LineChart,
  Line,
  Tooltip,
  CartesianGrid,
  YAxis,
  Legend
} from "recharts";

const data = [
  {
    name: "requests",
    count: 1500
  },
  {
    name: "requests",
    count: 1720
  },
  {
    name: "requests",
    count: 1650
  },
  {
    name: "requests",
    count: 1510
  },
  {
    name: "requests",
    count: 1400
  }
];
export const LineChartComponent = () => {
  return (
    <LineChart width={400} height={400} data={data}>
      <Line type="monotone" dataKey="count" />
      <CartesianGrid />
      <YAxis />
      <Legend verticalAlign="top" height={30} />
      <Tooltip />
    </LineChart>
  );
};

export default LineChartComponent;
