require('dotenv').config();

module.exports = {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB: process.env.MONGODB_DB,
    MQTT_URL: process.env.MQTT_URL,
    MQTT_PORT: process.env.MQTT_PORT,
    MQTT_TOPIC: process.env.MQTT_TOPIC,
    MQTT_USERNAME: process.env.MQTT_USERNAME,
    MQTT_PASSWORD: process.env.MQTT_PASSWORD,
};