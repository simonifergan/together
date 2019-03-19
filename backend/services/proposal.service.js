const mongoService = require('./mongo.service');

const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
    getById,
    add,
    update,
    remove
}

const proposalsCollection = 'proposals';


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
        .then(db => db.collection(proposalsCollection)
            .find({})
            .sort()
            .toArray()
        );

}

function getById(id) {
    const _id = new ObjectId(id);
    return mongoService.connect()
        .then(db => db.collection(proposalsCollection).findOne({ _id }));
}

function add(proposal) {
    return mongoService.connect()
        .then(db => db.collection(proposalsCollection).insertOne(proposal))
        .then(mongoRes => {
            proposal._id = mongoRes.insertedId;
            return proposal;
        });
}

function update(proposal) {
    const strId = proposal._id;
    proposal._id = new ObjectId(proposal._id);

    return mongoService.connect()
        .then(db => db.collection(proposalsCollection).updateOne({ _id: proposal._id }, { $set: proposal }))
        .then(mongoRes => {
            proposal._id = strId;
            return proposal;
        });
}

function remove(id) {
    const _id = new ObjectId(id);
    return mongoService.connect()
        .then(db => db.collection(proposalsCollection).remove({ _id }));
}

