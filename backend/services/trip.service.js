const mongoService = require('./mongo.service');

const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
    getById,
    add,
    update,
    remove,
    joinTrip
}

const tripsCollection = 'trips';
const usersCollection = 'users';


async function query() {
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
                        interestedIn: 0,
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
                        interestedIn: 0,
                        proposals: 0,
                        tripPrefs: 0,
                        birthdate: 0,
                    }
                }
            },       
        ]).toArray()
        return trips;
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
                        interestedIn: 0,
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
                        interestedIn: 0,
                        proposals: 0,
                        tripPrefs: 0,
                        birthdate: 0,
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
// async function getById(id) {
//     const _id = new ObjectId(id);
//     try {
//         const db = await mongoService.connect();
//         const trip = await db.collection(tripsCollection).findOne({ _id });
//         const userId = new ObjectId(trip.userId);
//         const user = await db.collection(usersCollection).findOne({ _id: userId });
//         delete user._id;
//         delete user.password;
//         trip.user = user;
//         return trip;
//     } catch {
//         return null;
//     }

//     // .then(db => db.collection(tripsCollection).findOne({ _id }));

// }

function add(trip) {
    const userId = trip.userId;
    const members = [...trip.members];
    trip.userId = new ObjectId(userId);
    trip.members = trip.members.map(userId => new ObjectId(userId));
    return mongoService.connect()
        .then(db => db.collection(tripsCollection).insertOne(trip))
        .then(mongoRes => {
            trip._id = mongoRes.insertedId;
            trip.userId = userId;
            trip.members = members;
            return trip;
        });
}

function update(trip) {
    const tripId = trip._id;
    const members = [...trip.members];
    const userId = trip.userId;
    trip._id = new ObjectId(trip._id);
    trip.userId = new ObjectId(trip.userId);
    trip.members = trip.members.map(member => new ObjectId(member._id));
    return mongoService.connect()
        .then(db => db.collection(tripsCollection).updateOne({ _id: trip._id }, { $set: trip }))
        .then(mongoRes => {
            trip._id = tripId;
            trip.userId = userId
            trip.members = members;
            return trip;
        });
}

function remove(id) {
    const _id = new ObjectId(id);
    return mongoService.connect()
        .then(db => db.collection(tripsCollection).remove({ _id }));
}

async function joinTrip(tripId, userId) {
    [userId, tripId] = [new ObjectId(userId), new ObjectId(tripId)]
    const db = await mongoService.connect();
    const trip = await db.collection(tripsCollection).updateOne({ _id: tripId }, { $push: { "members": userId }})
    return trip;
}
 

// async function joinTrip(tripId, userId) {
//     [userId, tripId] = [new ObjectId(userId), new ObjectId(tripId)]
//     const db = await mongoService.connect();
//     const trip = await db.collection(tripsCollection).findOneAndUpdate({ _id: tripId }, { $push: { interestedUsers: userId }}, {returnNewDocument: true})
//     console.log(trip);
//     return trip;
// }