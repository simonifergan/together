const mongoService = require('./mongo.service');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
    add
}

const notificationsCollection = 'notifications';
const tripsCollection = 'trips';
const usersCollection = 'users';

async function query() {
    const db = await mongoService.connect()
    // const notifications = await db.collection(notificationCollection).find({}).toArray()
    const notifications = await db.collection(notificationsCollection)
        .aggregate([
            {
                $lookup:
                {
                    from: usersCollection,
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                },
            },
            {
                $project: {
                    user: {
                        _id: 0,
                        password: 0,
                        email: 0,
                        tripPreferences: 0,
                        interestedIn: 0,
                        proposals: 0,
                        tripPrefs: 0,
                        birthdate: 0,
                        gender: 0
                    },

                },
            },
            {
                $unwind: '$user'
            },
            {
                $lookup: {
                    from: tripsCollection,
                    localField: 'tripId',
                    foreignField: '_id',
                    as: 'trip'
                },

            },
            {
                $project: {
                    trip: {
                        userId: 0,
                        desc: 0,
                        destinations: 0,
                        createdAt: 0,
                        startsAt: 0,
                        duration: 0,
                        openTo: 0,
                        members: 0,
                        activities: 0,
                        groupSize: 0,
                        comments: 0,
                        pending: 0,
                    }
                }
            },
            {
                $unwind: '$trip'
            },
        ]).sort({createdAt: -1}).toArray()
    return notifications;
}

async function add(notification) {
    const db = await mongoService.connect()
    notification.userId = new ObjectId(notification.userId);
    notification.tripId = new ObjectId(notification.tripId);
    const { insertedId } = await db.collection(notificationsCollection).insertOne(notification)

    notification._id = insertedId;
    notification.user = await db.collection(usersCollection).findOne({_id: notification.userId})
    return notification;
}