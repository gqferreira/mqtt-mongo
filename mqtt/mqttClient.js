// mqtt/mqttClient.js
const mqtt = require('mqtt');
const os = require("os")

const { MQTT_URL, MQTT_PORT, MQTT_USERNAME, MQTT_PASSWORD, MQTT_TOPIC } = require('../config');
const { getDevice, insertTelemetry } = require('../mongodb/mongoClient');

const options = {
    clientId: `${os.platform}-${os.hostname}-${os.userInfo().username}`,
    port: MQTT_PORT,
    rejectUnauthorized: false,
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
};

const client = mqtt.connect(`${MQTT_URL}:${MQTT_PORT}`, options);

/**
 * Subscribing to the MQTT broker channel where
 * the telemetry data will be sent.
 */
client.subscribe(MQTT_TOPIC, function (err, success) {
    console.log(MQTT_TOPIC + " SUCCESS: ", success);
    console.log(MQTT_TOPIC + " ERROR: ", err)
});

/**
 * Event triggered when a new message arrives at the MQTT broker
 * sent on the subscribed channel.
 */
client.on("message", async function (topic, message) {
    try {
        console.log("A message has arrived");

        const telemetry = JSON.parse(message)

        let device = await getDevice(topic);
        if (device && device.status == true) {

            console.log(device);
            const { light } = telemetry
            const { temperature } = telemetry

            console.log(`The light is at ${light} and the temperature is ${temperature}`);
            insertTelemetry(telemetry, device);

        } else {
            console.log('Telemetry not inserted because the device is not registered or is deactivated');
        }
    } catch (erro) {
        console.log(erro);
        if (erro instanceof SyntaxError)
            console.log('Syntax error. A valid JSON string needs to be sent')
    }
});

module.exports = client;
