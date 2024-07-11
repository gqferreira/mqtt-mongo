# MQTT with MongoDB

This Node.js project connects to an MQTT broker, captures data from specific topics, and saves it into a MongoDB database. The Node.js project also provides API endpoints for specific queries. This project use Docker container.

## Prerequisites

- Node.js (v20 or higher)
- MongoDB (v7 or higher)
- MQTT Broker (such as Mosquitto)

## Clone

1. Clone the repository:

 ```bash
 git clone https://github.com/gqferreira/mqtt-mongo.git
 cd mqtt-mongodb
 ```

1. Install dependencies (only if you intend to run without Docker):

 ```bash
 npm install
 ```

1. Configure environment variables by creating a `.env` file in the root of the project with the following content:

 ```ini
 MQTT_URL=mqtt://test.mosquitto.org
 MQTT_PORT=1883
 MQTT_TOPIC=mqtt-mongo
 MQTT_USERNAME=
 MQTT_PASSWORD=
 MONGODB_URI=mongodb://db-telemetry:27017
 MONGODB_DB=iot
 ```

1. Run project (only if you intend to run without Docker):

```bash
npm run dev
```

## Project Structure
```plaintext
- mqtt-mongo/
  |- mqtt/
     |- mqttClient.js
  |- mongodb/
     |- mongoClient.js
  |- routes/
     |- telemetryRoutes.js
     |- deviceRoutes.js
  |- .env
  |- .gitignore
  |- app.js
  |- config.js
  |- docker-compose.yml
  |- Dockerfile
  |- LICENCE
  |- package-lock.json
  |- package.json
  |- swagger.js
  
```

## Usage with Docker

To start the project, run:

```bash
sudo docker-compose -p telemetry up -d
```

You can access the application documentation by going to: localhost:3001/api-docs

You can connect to the database (e.g. with NoSQL Booster) at the following address: localhost:27018

To stop the project, run:

```bash
sudo docker-compose -p telemetry down
```

To rebuild after changes if you change Dockerfile (need start again after):
```bash
sudo docker-compose -p telemetry build
```

If you wish, you can access the application container in interactive mode and use PM2 to monitor the application logs:
```bash
docker exec -it app-telemetry bash
pm2 monit
```

If you wish, you can access the database container in interactive mode and use mongosh to query the collections documents.
```bash
docker exec -it db-telemetry bash
mongosh
use iot
```

## Database:

The telemetry collection in the database should be named `telemetry` and have the following structure:
```javascript
use iot

db.telemetry.insertOne(
    {
        "date": ISODate('2024-06-12T10:09:00Z'),
        "light": 3500,
        "temperature": 1900,
        "device": {
            "$ref": "device",
            "$id": ObjectId("000000000000000000000001"),
            "$db": "iot"
        }
    }
);
```

```javascript
db.device.insertOne(
    {
        "channel": 'mqtt-mongo',
        "description": 'Environmental light and temperature monitoring system',
        "status": true
    }
);
```