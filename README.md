# KTIS-Kafka-Telegraf-InfluxDB-ReactJS Stack
KTIS Stack = Kafka + Telegraf + InfluxDB + ReactJS Stack

It quickly creates the KTIS stack with __basic__ user authentication for all
components in the stack. This case provides the most basic level security, where username and passwords
are required for all the components.

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
|:---------:|:-----------------:|:-----------------------------------------------------------------------------------------------------:|     |
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

- Sensor data send by the python script:
  

- Kafdrop web UI: `http://localhost:9000`
Here we can see the data present in the Kafka Topic.  



- InfluxDB Dashboard: `http://localhost:8086` (username:`influx-admin` | password: `admin:ThisIsNotThePasswordYouAreLookingFor`)



