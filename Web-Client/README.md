## 1. Web Client


- The Web Client requests the sensor data from the InfluxDB database using the API and visualizes the sensor data like Temperature and Pressure using Rechart Library in the ReactJS app.
  
##setup react envirnoment (Done once per PC)
1.	$ sudo apt get update
2.	$ sudo apt install nodejs
3.	$ node --version
4.	$ npm --version
5.	$ npm install -g create-react-app

## Install the below Libraries

$ npm install --save react-bootstrap bootstrap

## To Run the WebClient

`npm start`

### Query data from InfluxDB  

- Here’s a simple Flux query that follows the above structure:

```
from(bucket: "example-bucket")            // ?? Source
  |> range(start: -1d)                    // ?? Filter on time
  |> filter(fn: (r) => r._field == "foo") // ?? Filter on column values
  |> group(columns: ["sensorID"])         // ?? Shape
  |> mean()                               // ?? Process
  
```

### Visualize data with Recharts

```
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

const token = "GVQw3QSbQbvI3OdShlY4MiItQejnirHDyii-7E6AF4w_O1jArBFz6JzdoWkKjSTD9kjrB_RJ_IC3vb2208A=="; // update this token
const org = "ORG";
const url = "http://localhost:8086";

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

```

### Snashot of the Web Client output. The graph shows the temperature and pressure data coming from InfluxDB.

![image](https://github.com/eternalamit5/KTIR-Kafka-Telegraf-InfluxDB-ReactJS/assets/44448083/056d00f5-b6c2-48cc-ad6e-ed880af1d66e)


