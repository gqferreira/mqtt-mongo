// routes/telemetryRoutes.js
const express = require('express');
const router = express.Router();
const { listTelemetry } = require('../mongodb/mongoClient');


/**
 * @author Gustavo Ferreira
 * @copyright Pomulo Ltd.
 * @version 1.0
 * @since 1.0
 * @date 2024-06-13
 * @swagger
 * tags:
 *   - name: Telemetry
 *     description: Operations related to telemetry queries
 * 
 * /telemetry/{channel}:
 *   get:
 *     summary: Lists the last 100 telemetry entries for a specific channel
 *     tags: [Telemetry]
 *     parameters:
 *       - in: path
 *         name: channel
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the channel for which telemetry entries should be listed
 *     responses:
 *       200:
 *         description: Successfully retrieved list of telemetry entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     example: "12:34:56 12/06/2024"
 *                   light:
 *                     type: number
 *                     example: 150
 *                   temperature:
 *                     type: number
 *                     example: 22.5
 *                   channel:
 *                     type: string
 *                     example: "FATEC"
 *                   description:
 *                     type: string
 *                     example: "ESP32 with light and temperature sensor"
 *       500:
 *         description: Error querying telemetry entries
 */
router.get('/:channel', async (req, res) => {
    console.log("Lists the last 100 telemetry entries for a specific channel");
    let channel = req.params.channel;
    let telemetries = await listTelemetry(channel);
    res.send(telemetries);
});

/**
 * @author Gustavo Ferreira
 * @copyright Pomulo Ltd.
 * @version 1.0
 * @since 1.0
 * @date 2024-06-13
 * @swagger
 * 
 * /telemetry:
 *   get:
 *     summary: Lists the last 100 telemetry entries from all channels
 *     tags: [Telemetry]
 *     responses:
 *       200:
 *         description: Successfully retrieved list of telemetry entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     example: "12:34:56 12/06/2024"
 *                   light:
 *                     type: number
 *                     example: 150
 *                   temperature:
 *                     type: number
 *                     example: 22.5
 *                   channel:
 *                     type: string
 *                     example: "FATEC"
 *                   description:
 *                     type: string
 *                     example: "ESP32 with light and temperature sensor"
 *       500:
 *         description: Error querying telemetry entries
 */
router.get('/', async (req, res) => {
    console.log("Lists the last 100 telemetry entries from all channels")
    let telemetries = await listTelemetry();
    res.send(telemetries);
});

module.exports = router;
