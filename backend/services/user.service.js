const mongoService = require('./mongo.service');
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcryptjs');

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
            .findOne({ email: credentials.email })
        )
        .then(async user => {
            if (!user) return null;
            const isAuth = await bcrypt.compare(credentials.password, user.password)
            if (isAuth) {
                delete user.password;
                return user;
            } else return null;
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

async function signup(user) {
    const db = await mongoService.connect();
    const userInDB = await db.collection(usersCollection).findOne({ email: user.email })
    if (!userInDB) {
        try {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(user.password, salt);
            user.password = hashedPassword;
            const { insertedId } = await db.collection(usersCollection).insertOne(user);
            user._id = insertedId;
            delete user.password;
            return user;
        } catch {
            throw (401);
        }
    } else throw (409);
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

