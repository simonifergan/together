const mongoService = require('./mongo.service');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
    add
}

const notificationCollection = 'notifications';

async function query() {
    const db = await mongoService.connect()
    const notifications = await db.collection(notificationCollection).find({}).toArray()
    return notifications;
}

async function add(notification) {
    const db = await mongoService.connect()
    const addedNotification = await db.collection(notificationCollection).insert({notification})
    return addedNotification;
}