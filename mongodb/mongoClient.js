// mongodb/mongoClient.js
const { MongoClient, ObjectId } = require('mongodb');
const { MONGODB_URI, MONGODB_DB } = require('../config');

/**
 * Function that retrieves a specific device from the database
 * @param {*} channel 
 * @returns 
 */
async function getDevice(channel) {
    const client = new MongoClient(MONGODB_URI);
    try {
        // Connect to MongoDB
        await client.connect();
        console.log('MongoDB connected');
        // Select the database and collection
        const database = client.db(MONGODB_DB);
        const collection = database.collection('device');

        // Document to be inserted/updated
        const filter = { "channel": channel }; // Filter to find the document

        // Query the document
        const device = await collection.findOne(filter);
        return device;

    } catch (e) {
        console.error('Error while querying a document:', e);
        return false;
    } finally {
        // Fechar a conexão
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}

/**
 * Function that inserts telemetry variables into the database
 * @param {*} telemetry 
 */
async function insertTelemetry(telemetry, device) {
    const client = new MongoClient(MONGODB_URI);
    try {
        // Connect to MongoDB
        await client.connect();
        console.log('Connected to MongoDB');

        // Select the database and collection
        const database = client.db(MONGODB_DB);
        const collection = database.collection('telemetry');

        const { light } = telemetry
        const { temperature } = telemetry

        // Document to be inserted
        const documento = {
            date: new Date(),
            light: light,
            temperature: temperature,
            device: {
                $ref: "device",
                $id: new ObjectId(device._id),
                $db: MONGODB_DB
            }
        };

        // Insert the document
        const result = await collection.insertOne(documento);
        console.log(`Document inserted with _id: ${result.insertedId}`);

    } catch (e) {
        console.error('Error inserting document:', e);
    } finally {
        // Close the connection
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}


/**
 * Function that receives an object with the device information
 * that needs to be registered.
 * If the device already exists, it will be updated.
 * @param {*} device 
 */
async function insertDevice(device) {
    const client = new MongoClient(MONGODB_URI);
    try {
        // Connect to MongoDB
        await client.connect();
        console.log('Connected to MongoDB');

        // Select the database and collection
        const database = client.db(MONGODB_DB);
        const collection = database.collection('device');

        // Document to be inserted/updated
        const filter = { "channel": device.channel }; // Filter to find the document
        const update = {
            $set: {
                channel: device.channel,
                description: device.description,
                status: true
            }
        };

        // Insert or update the document
        const result = await collection.updateOne(filter, update, { upsert: true });
        if (result.upsertedCount > 0) {
            console.log(`Document inserted with _id: ${result.upsertedId._id}`);
        } else {
            console.log('Document updated');
        }

        return true;
    } catch (e) {
        console.error('Error inserting document:', e);
        return false;
    } finally {
        // Close the connection
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}

/**
 * Function that lists the last 100 telemetry entries.
 * @param {*} channel 
 * @returns 
 */
async function listTelemetry(channel) {

    const client = new MongoClient(MONGODB_URI);

    try {
        // Connect to MongoDB
        await client.connect();
        console.log('Connected to MongoDB');

        // Select the database and collection
        const database = client.db(MONGODB_DB);
        const collection = database.collection('telemetry');

        let pipeline = [];

        pipeline.push({
            $lookup: {
                from: "device",
                localField: "device.$id",
                foreignField: "_id",
                as: "device"
            }
        });

        if (channel) {
            pipeline.push({ $match: { "device.channel": channel }});
        }

        pipeline.push({ $unwind: "$device" });
        pipeline.push({ $match: { "device.status": true }});
        pipeline.push({ $sort: { date: -1 } });

        pipeline.push({
            $project: {
                _id: false,
                date: {
                    $dateToString: {
                        format: "%H:%M:%S %d/%m/%Y",
                        date: "$date",
                        timezone: "-03:00" // Adds timezone configuration for UTC
                    }
                },
                light: true,
                temperature: true,
                channel: "$device.channel",
                description: "$device.description"
            }
        });
        pipeline.push({ $limit: 100  });

        const results = await collection.aggregate(pipeline).toArray();
        return results;

    } catch (e) {
        console.error('Error querying telemetry:', e);
        return false;
    } finally {
        // Close the connection
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}

module.exports = { getDevice, insertTelemetry, insertDevice, listTelemetry};
