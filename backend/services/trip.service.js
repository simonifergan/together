const mongoService = require('./mongo.service');

const ObjectId = require('mongodb').ObjectId;

const chatService = require('./chat.service');

module.exports = {
    query,
    getById,
    getByUserId,
    add,
    update,
    updateUserOnTrip,
    remove,
    getTrending,
    getByActivity,
    getRecommended,
    getTripsByCountry
}

const tripsCollection = 'trips';
const usersCollection = 'users';

async function getRecommended(prefs) {
    console.log(prefs);
    
    const gender = prefs.gender
    var minBirthDate
    var maxBirthDate
    const yearInMs = 365*24*3600*1000
    switch (prefs.age) {
        case 1:
            minBirthDate = Date.now() - 24*yearInMs
            maxBirthDate = Date.now() - 18*yearInMs
            break;
        case 2:
            minBirthDate = Date.now() - 30*yearInMs
            maxBirthDate = Date.now() - 24*yearInMs
            break;
        case 3:
            minBirthDate = Date.now() - 40*yearInMs
            maxBirthDate = Date.now() - 30*yearInMs
            break;
        case 4:
            minBirthDate = Date.now() - 99*yearInMs
            maxBirthDate = Date.now() - 40*yearInMs
            break;
    }
    console.log('minmax birthdates:', minBirthDate, maxBirthDate);
    
    const activities = prefs.activities
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
                        // birthdate: 0,
                    },
                },
            },
            {
                $unwind: '$user'
            },
            {
                $addFields: {
                    matchGrade: {
                        $add: [
                            {
                                $reduce: {
                                    input: activities,
                                    initialValue: 0,
                                    in: {
                                        $cond: {
                                            if: {
                                                $in: ['$$this', '$activities']
                                            },
                                            then: { $add: ['$$value', 0.1] },
                                            else: { $add: ['$$value', 0] }
                                        }
                                    }
                                }
                            },
                            {
                                $cond: {
                                    if: {
                                        $eq: [gender, '$user.gender']
                                    },
                                    then: 1,
                                    else: 0
                                }
                            },
                            {
                                $cond: {
                                    if: {
                                        $and: [
                                            { $lte: ['$user.birthdate', maxBirthDate] },
                                            { $gte: ['$user.birthdate', minBirthDate] }
                                        ]
                                    },
                                    then: 1,
                                    else: 0
                                }
                            },
                        ]
                    }
                }
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
                $sort: { matchGrade: -1 }
            },
            {
                $limit: 10
            }
        ]).toArray()
        return trips
    } catch {

    }
}

async function getTrending() {
    console.log('getting trending');
    
    try {
        const db = await mongoService.connect()
        const trips = await db.collection(tripsCollection).aggregate([
            {
                $match: { $expr: { $gt: [{ $subtract: ['$groupSize', { $size: '$members' }]} ,0] } }
            },
            {
                $addFields: {
                    // trendGrade: { $subtract: ['$groupSize', { $size: '$members' }]}
                    trendGrade: { $add: [{ $sqrt: { $divide: [{ $size: '$members' }, '$groupSize'] } }, { $divide: [1, { $subtract: ['$groupSize', { $size: '$members' }] }] }, { $divide: [{ $size: '$pending' }, 5] }] }
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

async function query(searchQuery, tripDate) {
    const dateMatch = tripDate ? {'startsAt': tripDate} : {}
    searchQuery = new RegExp(searchQuery, 'i')    
    try {
        const db = await mongoService.connect()
        const trips = await db.collection(tripsCollection).aggregate([
            {
                $match: { $or: [
                    { 'destinations.cities': { $regex: searchQuery} },
                    { 'desc': { $regex: searchQuery} },
                    { 'title': { $elemMatch: { $regex: searchQuery } } },
                    { 'activities': { $elemMatch: { $regex: searchQuery } } }
                ]}
            },
            {
                $match: dateMatch
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
            }
        ]).toArray()
        return trips
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

async function getTripsByCountry(country) {    
    const db = await mongoService.connect()
    const trips = await db.collection(tripsCollection).find({
        'destinations.countries': {
            $all: [country]
        }
    }).toArray()
    return trips
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
    const chatId = trip.chatId;
    const user = trip.user;
    trip._id = new ObjectId(trip._id);
    trip.userId = new ObjectId(trip.userId);
    trip.members = trip.members.map(member => {
        return new ObjectId(member._id);
    });
    trip.pending = trip.pending.map(pendingUser => new ObjectId(pendingUser));
    trip.chatId = new ObjectId(chatId);
    delete trip.user;
    return mongoService.connect()
        .then(db => db.collection(tripsCollection).updateOne({ _id: trip._id }, { $set: trip }))
        .then(async mongoRes => {
            trip._id = tripId;
            trip.userId = userId
            trip.members = members;
            trip.pending = pending;
            trip.chatId = chatId;
            trip.user = user;
            const res = await chatService.updateTripChat(chatId, chatMembers);
            return trip;
        });
}

async function updateUserOnTrip({ trip, user, action }) {
    const objTripId = new ObjectId(trip._id);
    
    const objUserId = new ObjectId(user._id);
    try {
        const db = await mongoService.connect()
        var res;
        if (action === 'remove from members') {
            trip.users = trip.users.filter(currUser => currUser._id !== user._id);
            res = await db.collection(tripsCollection).updateOne({ _id: objTripId }, { $pull: { members: objUserId } });
            await chatService.updateTripChat(trip.chatId, trip.users);
        } else if (action === 'remove from pending') {
            res = await db.collection(tripsCollection).updateOne({ _id: objTripId }, { $pull: { pending: objUserId } })
        } else if (action === 'request') {
            res = await db.collection(tripsCollection).updateOne({ _id: objTripId }, { $push: { pending: objUserId } })
        }
        console.log('trip on trip service: ', trip);
        
        return trip;
    } catch {
        // TODO simon
    }
}

function remove(id) {
    const _id = new ObjectId(id);
    return mongoService.connect()
        .then(db => db.collection(tripsCollection).remove({ _id }));
}