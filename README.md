# KTIR-Kafka-Telegraf-InfluxDB-ReactJS Stack
KTIR Stack = Kafka + Telegraf + InfluxDB + ReactJS Stack


## 1. Web Server

It quickly creates the KTI stack with __basic__ user authentication for all
components in the stack. This case provides the most basic level security, where username and passwords
are required for all the components.

### Send Sensor Data

- run the Python script `SendTempPressure.py` present in the folder DataSender/SendTempPressure.py. This script sends the random temperature and pressure values every 5 sec to the Kafka topic.
  
## Environment Variables & Configuration Files

### Authentication

- Use the `variables.env` file present in the conf folder to change the default username and passwords for the stack components.

### Kafka

- Sensor data like temperature and pressure are published continuously to the Kafka topic.

### Kafdrop

- Kafdrop is a web UI for viewing Kafka topics and browsing consumer groups. Here it is used to see the sensor data present in the Kafka topics at port 9000.

### Telegraf

- Adapt the `topics`, `database` in the `conf/telegraf/telegraf.conf` according to your requirements
- In the current project two topics are created in the Kafka broker i.e; "states1" and "states2"


## Steps to Bring the KTIS WebServer Stack Up


1. Bring the stack up:

        sudo docker compose -f docker-compose-test2.yml --env-file conf/variables.env up --pull always
    

## Component Availability

|   Component  |  Credentials (username:password)  |                         Endpoint                         |
|:---------:|:-----------------:|:-----------------------------------------------------------------------------------------------------:| 

| `KafDrop` | none                                                | Browser: `http://localhost:9000`|


| `influxdb`| `influx-admin:ThisIsNotThePasswordYouAreLookingFor` | Browser: `http://localhost:8086`|


## Component Logs
- For `kafka`, `kafdrop` , `telegraf`, `influxdb`,  stdout Logs:

        docker-compose -f docker-compose-test2.yml logs -f kafka1
        # OR
        docker-compose -f docker-compose-test2.yml logs -f kafdrop
        # OR
        docker-compose -f docker-compose-test2.yml logs -f telegraf
        # OR
        docker-compose -f docker-compose-test2.yml logs -f influxdb


## Component Ports

| Component   | Port  |
| ----------  | ----- |
| `influxdb`  | 8086 (internal)  |
| `telegraf`  | n/a (internal)  |
| `kafka` | 9092 (internal), 9093 (external) |
| `kafdrop`   | 9000 |


### Telegraf

The configuration file (`telegraf.conf`) will use the following environment variables to write data into
InfluxDB

    INFLUXDB_USER=influx-admin
    INFLUXDB_USER_PASSWORD=ThisIsNotThePasswordYouAreLookingFor

The data will be written to a database called `system_state` (also called as Bucket in the variable.env file)

Telegraf will use the following environment variables to subscribe to Kafka Broker

  urls = ["http://influxdb:8086"] ## Docker-Compose internal address
  token = "random_token" ## token name
  organization = "ORG" ## orga name
  bucket = "system_state" ## bucket name / db name


### InfluxDB

- You can control the admin user and password via `DOCKER_INFLUXDB_INIT_USERNAME` and `DOCKER_INFLUXDB_INIT_PASSWORD` variables in `variables.env`

# Snapshots

- Random Sensor data like temperature and pressure sent by the Python script:
  
![image](https://github.com/eternalamit5/KTIS-Kafka-Telegraf-InfluxDB-ReactJS/assets/44448083/e560d810-b4e3-46d5-aa2c-b3f23c05cd59)


- Kafdrop web UI: `http://localhost:9000`
Here we can see the data present in the Kafka Topic. Here states1 and states2 are the two topics where temperature and pressure data are being sent.



![Screenshot from 2023-07-07 15-02-04](https://github.com/eternalamit5/KTIS-Kafka-Telegraf-InfluxDB-ReactJS/assets/44448083/8c3f678b-ec11-4e9c-a1ac-2692ca22f2bd)




![Screenshot from 2023-07-07 15-02-31](https://github.com/eternalamit5/KTIS-Kafka-Telegraf-InfluxDB-ReactJS/assets/44448083/3017dafd-d0ad-4a14-9714-d8e9aa63acf3)





![Screenshot from 2023-07-07 15-02-52](https://github.com/eternalamit5/KTIS-Kafka-Telegraf-InfluxDB-ReactJS/assets/44448083/c7f02366-b104-4010-badb-dcc0bfba3350)













- InfluxDB Dashboard: `http://localhost:8086` (username:`influx-admin` | password: `admin:ThisIsNotThePasswordYouAreLookingFor`)

  
![Screenshot from 2023-07-06 15-56-57](https://github.com/eternalamit5/KTIS-Kafka-Telegraf-InfluxDB-ReactJS/assets/44448083/d1bbb7b0-7278-4ef0-a99e-0997c9a5795c)



## 2. Web Client



  
### Snashot of the Web Client output. The graph shows the temperature and pressure data coming from InfluxDB.

![image](https://github.com/eternalamit5/KTIR-Kafka-Telegraf-InfluxDB-ReactJS/assets/44448083/056d00f5-b6c2-48cc-ad6e-ed880af1d66e)








