const mongoService = require('./mongo.service');

const ObjectId = require('mongodb').ObjectId;
var bcrypt = require('bcryptjs');

module.exports = {
    query,
    login,
    signup,
    getById,
    update,
    remove
}

const usersCollection = 'users';

function query() {


    return mongoService.connect()
        .then(db => db.collection(usersCollection)
            .find({})
            .sort()
            .toArray()
        );

}

function login(credentials) {

    return mongoService.connect()
        .then(db => db.collection(usersCollection)
            .findOne({email: credentials.email})
        )
        .then(user => {
            if (!user) return null;
            return bcrypt.compare(credentials.password, user.password,(err, res) => {
                delete user.password;
                return user;
            });
        });
}

function getById(id) {
    const _id = new ObjectId(id);
    return mongoService.connect()
        .then(db => db.collection(usersCollection).findOne({ _id }))
        .then(user => {
            if (user) delete user.password;
            return user;
        });
}

function signup(user) {
    console.log(user.email)
    return mongoService.connect()
        .then(db =>
            db.collection(usersCollection).findOne({ email: user.email })
                .then(res => {
                    if (!res) {
                        return bcrypt.genSalt(10, function (err, salt) {
                            bcrypt.hash(user.password, salt, (err, hash) => {
                                user.password = hash;
                                return db.collection(usersCollection).insertOne(user);
                            });
                        });
                    }
                    else throw ('Username already taken');
                }))
        .then(mongoRes => {
            delete user.password;
            return user;
        });
}

function update(user) {
    const strId = user._id;
    user._id = new ObjectId(user._id);

    return mongoService.connect()
        .then(db => db.collection(usersCollection).updateOne({ _id: user._id }, { $set: user }))
        .then(mongoRes => {
            user._id = strId;
            return user;
        });
}

function remove(id) {
    const _id = new ObjectId(id);
    return mongoService.connect()
        .then(db => db.collection(usersCollection).remove({ _id }));
}

