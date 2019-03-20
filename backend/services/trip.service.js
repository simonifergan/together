const mongoService = require('./mongo.service');

const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
    getById,
    add,
    update,
    remove
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
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"

                }

            }, { $unwind: "$user" }
        ]).toArray()
        return trips;
    } catch {

    }
}

// function query() {
//     return mongoService.connectToDb()
//         .then(db => {
//             const collection = db.collection('trips');
//             return collection.aggregate([
//                 {
//                     $lookup:
//                     {
//                         from: "users",
//                         localField: "userId",
//                         foreignField: "_id",
//                         as: "user"
 
//                     }
 
//                 }, { "$unwind": "$user" }
//             ]).toArray()
//         })
//  }

function getById(id) {
    const _id = new ObjectId(id);
    return mongoService.connect()
        .then(db => db.collection(tripsCollection).findOne({ _id }));
}

function add(trip) {
    return mongoService.connect()
        .then(db => db.collection(tripsCollection).insertOne(trip))
        .then(mongoRes => {
            trip._id = mongoRes.insertedId;
            return trip;
        });
}

function update(trip) {
    const strId = trip._id;
    trip._id = new ObjectId(trip._id);

    return mongoService.connect()
        .then(db => db.collection(tripsCollection).updateOne({ _id: trip._id }, { $set: trip }))
        .then(mongoRes => {
            trip._id = strId;
            return trip;
        });
}

function remove(id) {
    const _id = new ObjectId(id);
    return mongoService.connect()
        .then(db => db.collection(tripsCollection).remove({ _id }));
}

