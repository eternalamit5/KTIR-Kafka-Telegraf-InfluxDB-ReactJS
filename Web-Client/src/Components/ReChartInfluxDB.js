import React, { useState, useEffect } from "react";
import { InfluxDB } from "@influxdata/influxdb-client";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Area
} from "recharts";

const token = "GVQw3QSbQbvI3OdShlY4MiItQejnirHDyii-7E6AF4w_OTJV1jArBFz6JzdoWkKjSTD9kjrB_RJ_IC3vb2208A==";
const org = "ORG";
const url = "http://localhost:8086";

// let query = `from(bucket: "sensor")
//   |> range(start: -30m)
//   |> filter(fn: (r) => r["_measurement"] == "airSensors")
//   |> filter(fn: (r) => r["_field"] == "humidity" or r["_field"] == "temperature" )
//   |> filter(fn: (r) => r["sensor_id"] == "TLM0102")
//   |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
//   |> yield(name: "results")
// `;


let query = `from(bucket: "system_state")
  |> range(start: -30m)
  |> filter(fn: (r) => r["_measurement"] == "kafka_consumer")
  |> filter(fn: (r) => r["_field"] == "pressure" or r["_field"] == "temperature" )
  |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
  |> yield(name: "results")
`;

export const InfuxChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    let res = [];
    const influxQuery = async () => {
      //create InfluxDB client
      const queryApi = await new InfluxDB({ url, token }).getQueryApi(org);
      //make query
      await queryApi.queryRows(query, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          //push rows from query into an array object
          res.push(o);
        },
        complete() {
          let finalData = []

          for (let i = 0; i < res.length; i++) {
            let point = {};
            point["pressure"] = res[i]["pressure"];
            point["temperature"] = res[i]["temperature"];

            point["name"] = res[i]["_time"];
            finalData.push(point);
          }
          setData(finalData);
        },
        error(error) {
          console.log("query failed- ", error);
        }
      });
    };

    influxQuery();
  }, []);
  return (
    <div>
      <h1>Influx Chart</h1>
      <ComposedChart width={900} height={400} data={data}>
        <CartesianGrid />
        <Tooltip />
        <Line
          stroke="#0ff770"
          strokeWidth={1}
          dataKey="temperature"
          dot={false}
        />
        <Area stroke="#bf04b3" fill="#f235e6" dataKey="pressure" />
        <XAxis hide dataKey="name" />
        <YAxis />
      </ComposedChart>
    </div>
  );
};

export default InfuxChart;