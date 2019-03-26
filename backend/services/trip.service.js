const mongoService = require('./mongo.service');

const ObjectId = require('mongodb').ObjectId;

const chatService = require('./chat.service');

module.exports = {
    query,
    getById,
    getByUserId,
    add,
    update,
    remove,
    getTrending,
    getByActivity,
    getRecommended
}

const tripsCollection = 'trips';
const usersCollection = 'users';

async function getRecommended() {

}

async function getTrending() {
    try {
        const db = await mongoService.connect()
        const trips = await db.collection(tripsCollection).aggregate([
            {
                $addFields: {
                    trendGrade: { $add: [{ $sqrt: { $divide: [{ $size: '$members' }, '$groupSize'] } }, { $divide: [1, { $subtract: ['$groupSize', { $size: '$members' }] }] }, { $divide: [{ $size: '$pending' }, 5] }] }
                    // trendGrade: { $divide: [{$size: '$members'}, '$groupSize'] }
                }
            },
            {
                $lookup:
                {
                    from: usersCollection,
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $project: {
                    user: {
                        _id: 0,
                        password: 0,
                        email: 0,
                        tripPreferences: 0,
                        pendingIn: 0,
                        proposals: 0,
                        tripPrefs: 0,
                        birthdate: 0,
                    },
                },
            },
            {
                $unwind: '$user'
            },
            {
                $lookup: {
                    "from": usersCollection,
                    "foreignField": "_id",
                    "localField": "members",
                    "as": "members",
                }
            },
            {
                $project: {
                    members: {
                        password: 0,
                        email: 0,
                        tripPreferences: 0,
                        pendingIn: 0,
                        proposals: 0,
                        tripPrefs: 0,
                        birthdate: 0,
                    }
                }
            },
            {
                $sort: { trendGrade: -1 }
            },
            {
                $limit: 10
            }
        ]).toArray()
        return trips
    } catch {

    }
}

async function query(searchQuery) {
    try {
        const db = await mongoService.connect()
        const trips = await db.collection(tripsCollection).aggregate([
            {
                $lookup:
                {
                    from: usersCollection,
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'

                }
            },
            {
                $project: {
                    user: {
                        _id: 0,
                        password: 0,
                        email: 0,
                        tripPreferences: 0,
                        pendingIn: 0,
                        proposals: 0,
                        tripPrefs: 0,
                        birthdate: 0,
                    },

                },
            },
            {
                $unwind: '$user'
            },
            {
                $lookup: {
                    "from": usersCollection,
                    "foreignField": "_id",
                    "localField": "members",
                    "as": "members",
                }
            },
            {
                $project: {
                    members: {
                        password: 0,
                        email: 0,
                        tripPreferences: 0,
                        pendingIn: 0,
                        proposals: 0,
                        tripPrefs: 0,
                        birthdate: 0,
                    }
                }
            }
        ]).toArray()
        const regex = new RegExp(searchQuery, 'i')
        return trips.filter(trip => {
            return trip.destinations.some(destination => Object.values(destination).some(value => regex.test(value))) ||
                regex.test(trip.desc) ||
                regex.test(trip.title) ||
                trip.activities.some(activity => regex.test(activity))
        });
    } catch {

    }
}

async function getByActivity(activity) {
    try {
        const db = await mongoService.connect()
        const trips = await db.collection(tripsCollection).aggregate([
            {
                $lookup:
                {
                    from: usersCollection,
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'

                }
            },
            {
                $project: {
                    user: {
                        _id: 0,
                        password: 0,
                        email: 0,
                        tripPreferences: 0,
                        pendingIn: 0,
                        proposals: 0,
                        tripPrefs: 0,
                        birthdate: 0,
                    },

                },
            },
            {
                $unwind: '$user'
            },
            {
                $lookup: {
                    "from": usersCollection,
                    "foreignField": "_id",
                    "localField": "members",
                    "as": "members",
                }
            },
            {
                $project: {
                    members: {
                        password: 0,
                        email: 0,
                        tripPreferences: 0,
                        pendingIn: 0,
                        proposals: 0,
                        tripPrefs: 0,
                        birthdate: 0,
                    }
                }
            }
        ]).toArray()

        return trips.filter(trip => {
            return trip.activities.some(tripActivity => tripActivity === activity)
        });
    } catch {

    }
}

async function getById(tripId) {
    const _id = new ObjectId(tripId);
    try {
        const db = await mongoService.connect()
        const trip = await db.collection(tripsCollection).aggregate([
            {
                $match: { _id }
            },
            {
                $lookup: {
                    "from": usersCollection,
                    "foreignField": "_id",
                    "localField": "members",
                    "as": "members",
                }
            },
            {
                $project: {
                    members: {
                        password: 0,
                        email: 0,
                        tripPreferences: 0,
                        pendingIn: 0,
                        proposals: 0,
                        tripPrefs: 0,
                        birthdate: 0,
                    }
                }
            },
            {
                $lookup:
                {
                    from: usersCollection,
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
 
                }
            },
            {
                $project: {
                    user: {
                        _id: 0,
                        password: 0,
                        email: 0,
                        tripPreferences: 0,
                        pendingIn: 0,
                        proposals: 0,
                        tripPrefs: 0,
                    },
                },
            },
            {
                $unwind: '$user'
            },
        ]).toArray()
        return trip[0];
    } catch {
        return null;
    }
 }

async function getByUserId(id) {
    const userId = new ObjectId(id);
    try {
        const db = await mongoService.connect();
        const trips = await db.collection(tripsCollection).aggregate([
            {
                $match: { userId }
            },
            {
                $lookup: {
                    "from": usersCollection,
                    "foreignField": "_id",
                    "localField": "members",
                    "as": "members",
                }
            },
            {
                $project: {
                    members: {
                        password: 0,
                        email: 0,
                        tripPreferences: 0,
                        pendingIn: 0,
                        proposals: 0,
                        tripPrefs: 0,
                        birthdate: 0,
                    }
                }
            },
            {
                $lookup: {
                    "from": usersCollection,
                    "foreignField": "_id",
                    "localField": "pending",
                    "as": "pending",
                }
            },
            {
                $project: {
                    pending: {
                        password: 0,
                        email: 0,
                        tripPreferences: 0,
                        pendingIn: 0,
                        proposals: 0,
                        tripPrefs: 0,
                        birthdate: 0,
                    }
                }
            },

        ])
            .sort({ createdAt: -1 }).toArray();
        return trips;

    } catch {
        throw 'Could not connect to Database';
    }
}

async function add(trip) {
    const userId = trip.userId;
    const members = [...trip.members];
    const pending = [...trip.pending];
    trip.userId = new ObjectId(userId);
    trip.members = trip.members.map(userId => new ObjectId(userId));
    trip.pending = trip.pending.map(pendingUser => new ObjectId(pendingUser._id));
    let chat = {
        users: [userId],
        msgs: [],
    };
    try {
        chat = await chatService.createChat(chat);
        trip.chatId = chat._id;

    } catch {
        // TODO: Could not create chat
    } 
    return mongoService.connect()
        .then(db => db.collection(tripsCollection).insertOne(trip))
        .then(mongoRes => {
            trip._id = mongoRes.insertedId;
            trip.userId = userId;
            trip.members = members;
            trip.pending = pending;
            return trip;
        });
}

function update(trip) {
    const tripId = trip._id;
    const members = [...trip.members];
    const pending = [...trip.pending];
    const userId = trip.userId;
    const chatMembers = [...(trip.members.map(member => member._id)), userId];
    trip._id = new ObjectId(trip._id);
    trip.userId = new ObjectId(trip.userId);
    trip.members = trip.members.map(member => new ObjectId(member._id));
    trip.pending = trip.pending.map(pendingUser => new ObjectId(pendingUser));
    return mongoService.connect()
        .then(db => db.collection(tripsCollection).updateOne({ _id: trip._id }, { $set: trip }))
        .then(async mongoRes => {
            trip._id = tripId;
            trip.userId = userId
            trip.members = members;
            trip.pending = pending;
            const res = await chatService.updateTripChat(trip.chatId, chatMembers);

            return trip;
        });
}

function remove(id) {
    const _id = new ObjectId(id);
    return mongoService.connect()
        .then(db => db.collection(tripsCollection).remove({ _id }));
}