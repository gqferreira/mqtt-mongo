// app.js
const express = require('express');
const app = express();
const telemetryRoutes = require('./routes/telemetryRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
require('./mqtt/mqttClient');

const { swaggerUi, specs } = require('./swagger');

app.use(express.json());
app.use('/telemetry', telemetryRoutes);
app.use('/device', deviceRoutes);

// Swagger config
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Documentation available at http://localhost:${port}/api-docs`);
});
