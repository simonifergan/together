const mongoService = require('./mongo.service')

const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
    getUserReviews,
    add,
}

const reviewsCollection = 'reviews';
const usersCollection = 'users';
const toysCollection = 'toys';

function add({ userId, toyId, content }) {
    var review = {
        userId: new ObjectId(userId),
        toyId: new ObjectId(toyId),
        content
    }
    return mongoService.connect()
        .then(db => db.collection(reviewsCollection).insertOne(review))
        .then(({ insertedId: _id }) => ({ _id, ...review }))
}

function getUserReviews(userId) {
    const id = new ObjectId(userId)
    return mongoService.connect()
        .then(db =>
            db.collection(reviewsCollection).aggregate([
                {
                    $match: { userId: id }
                },
                {
                    $lookup:
                    {
                        from: toysCollection,
                        localField: 'toyId',
                        foreignField: '_id',
                        as: 'toy'
                    }
                }, {
                    $unwind: '$toy'
                }
            ]).toArray()
        )

}


function query({ userId = null, toyId = null } = {}) {
    const criteria = {}
    if (userId) criteria.userId = new ObjectId(userId)
    if (toyId) criteria.toyId = new ObjectId(toyId)
    console.log(criteria);
    return mongoService.connect().then(db => {
        return db.collection(reviewsCollection)
            .aggregate([
                {
                    $match: criteria
                },
                {
                    $lookup:
                    {
                        from: toysCollection,
                        localField: 'toyId',
                        foreignField: '_id',
                        as: 'toy'
                    },
                },
                {
                    $project: {
                        toy: {
                            _id: 0,
                            createdAt: 0,
                        }
                    }
                },
                {
                    $unwind: '$toy'
                },
                {
                    $lookup: {
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
                            createdAt: 0,
                            password: 0,
                            isAdmin: 0
                        }
                    }
                },
                {
                    $unwind: '$user'
                },
            ]).toArray()
    })
}