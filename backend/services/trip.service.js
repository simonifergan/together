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


function query() {
    // // default sortBy descending title
    // let sortBy = { title: 1 };

    // // try with mongo 
    // filterBy.title = (filterBy.title) ? new RegExp(filterBy.title, 'gi') : { $exists: true };
    // filterBy.type = (filterBy.type) ? new RegExp(filterBy.type, 'gi') : { $exists: true };
    // filterBy.price = (filterBy.price) ? { $lte: parseInt(filterBy.price) } : { $exists: true };
    // if (filterBy.inStock === 'true') filterBy.inStock = true;
    // else if (filterBy.inStock === 'false') filterBy.inStock = false;
    // else filterBy.inStock = { $exists: true };
    // if (filterBy.sortBy && filterBy.order) sortBy = { [filterBy.sortBy]: parseInt(filterBy.order) };


    // filterBy = {
    //     $and: [

    //         {
    //             $or: [{ title: filterBy.title }, { type: filterBy.type }]
    //         },
    //         { price: filterBy.price },
    //         { inStock: filterBy.inStock }
    //     ]
    // }



    return mongoService.connect()
        .then(db => db.collection(tripsCollection)
            .find({})
            .sort()
            .toArray()
        );

}

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
    trip.userId = new ObjectId(trip.userId);

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

