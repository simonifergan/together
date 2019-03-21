const mongoService = require('./mongo.service');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
}

const notificationCollection = 'notifications';

async function query() {
    const db = await mongoService.connect()
    const notifications = await db.collection(notificationCollection).find({}).toArray()
    return notifications;
}
