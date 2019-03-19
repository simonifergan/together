const mongoService = require('./mongo.service');

const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
    getById,
    add,
    update,
    remove
}

const toysCollection = 'toys';


function query(filterBy) {
    // default sortBy descending title
    let sortBy = { title: 1 };

    // try with mongo 
    filterBy.title = (filterBy.title) ? new RegExp(filterBy.title, 'gi') : { $exists: true };
    filterBy.type = (filterBy.type) ? new RegExp(filterBy.type, 'gi') : { $exists: true };
    filterBy.price = (filterBy.price) ? { $lte: parseInt(filterBy.price) } : { $exists: true };
    if (filterBy.inStock === 'true') filterBy.inStock = true;
    else if (filterBy.inStock === 'false') filterBy.inStock = false;
    else filterBy.inStock = { $exists: true };
    if (filterBy.sortBy && filterBy.order) sortBy = { [filterBy.sortBy]: parseInt(filterBy.order) };


    filterBy = {
        $and: [

            {
                $or: [{ title: filterBy.title }, { type: filterBy.type }]
            },
            { price: filterBy.price },
            { inStock: filterBy.inStock }
        ]
    }

    return mongoService.connect()
        .then(db => db.collection(toysCollection)
            .find(filterBy)
            .sort(sortBy)
            .toArray()
        );

}

function getById(id) {
    const _id = new ObjectId(id);
    return mongoService.connect()
        .then(db => db.collection(toysCollection).findOne({ _id }));
}

function add(toy) {
    return mongoService.connect()
        .then(db => db.collection(toysCollection).insertOne(toy))
        .then(mongoRes => {
            toy._id = mongoRes.insertedId;
            return toy;
        });
}

function update(toy) {
    const strId = toy._id;
    toy._id = new ObjectId(toy._id);

    return mongoService.connect()
        .then(db => db.collection(toysCollection).updateOne({ _id: toy._id }, { $set: toy }))
        .then(mongoRes => {
            toy._id = strId;
            return toy;
        });
}

function remove(id) {
    const _id = new ObjectId(id);
    return mongoService.connect()
        .then(db => db.collection(toysCollection).remove({ _id }));
}

