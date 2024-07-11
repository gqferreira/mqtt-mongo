// routes/deviceRoutes.js
const express = require('express');
const router = express.Router();
const validator = require('joi');

const { insertDevice } = require('../mongodb/mongoClient');

/**
 * @author Gustavo Ferreira
 * @copyright Pomulo Ltd.
 * @version 1.0
 * @since 1.0
 * @date 2024-06-13
 * @swagger
 * tags:
 *   - name: Device
 *     description: Operations related to device management
 * 
 * /device:
 *   post:
 *     summary: Route that accepts necessary data to register a telemetry device in the database.
 *     tags: [Device]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               channel:
 *                 type: string
 *                 example: "FATEC"
 *               description:
 *                 type: string
 *                 example: "ESP32 with light and temperature sensor"
 *     responses:
 *       201:
 *         description: Device successfully inserted
 *       400:
 *         description: Required fields were not provided
 *       500:
 *         description: Error inserting device into the database
 */
router.post('/', async (req, res) => {
    try {

        // Define validation schema with Joi
        const deviceSchema = validator.object({
            channel: validator.string().required(),
            description: validator.string().required()
        });

        // Validate if the received form has the required fields filled
        const { error, value } = deviceSchema.validate(req.body);

        if (error) {
            res.status(400).json({ message: 'Required fields were not provided', details: error.details });
        } else {
            let success = await insertDevice(req.body);
            if (success) {
                res.status(201).json({ message: 'Document successfully inserted' });
            } else {
                res.status(500).json({ message: 'Error inserting device into the database' });
            }
        }

    } catch (error) {
        console.error('Error inserting document into MongoDB:', error);
        res.status(500).json({ message: 'Error inserting document into MongoDB' });
    }
});

module.exports = router;
