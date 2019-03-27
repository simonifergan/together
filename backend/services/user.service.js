const mongoService = require('./mongo.service');
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcryptjs');

module.exports = {
    query,
    login,
    loginWithFacebook,
    signup,
    getById,
    update,
    updateTripToUser,
    remove
}

const usersCollection = 'users';
const tripsCollection = 'trips';

function query(userIds) {
    let mongoQuery = {}
    if (userIds) {
        userIds = userIds.map(userId => new ObjectId(userId))
        mongoQuery = { _id: { $in: userIds } }
    }
    return mongoService.connect()
        .then(db => db.collection(usersCollection)
            .find(mongoQuery)
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

async function loginWithFacebook(user) {
    try {
        const db = await mongoService.connect();
        const userInDB = await db.collection(usersCollection).findOne({ email: user.email });
        if (!userInDB) {
            const { insertedId } = await db.collection(usersCollection).insertOne(user);
            user._id = insertedId;
            return user;
        } else {
            if (userInDB.facebookId === user.facebookId) return userInDB;
            else throw new Error('User already exists, please log in using your Username and Password');
        }
    } catch (err) {
        throw err;
    }

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

async function update(user) {
    const strId = user._id;
    const trips = [...user.trips];
    const pendingIn = [...user.pendingIn];
    const likes = [...likes];

    user._id = new ObjectId(user._id);
    user.trips = user.trips.map(tripId => new ObjectId(tripId))
    user.pendingIn = user.pendingIn.map(tripId => new ObjectId(tripId))
    user.likes = user.likes.map(userId => new ObjectId(userId))
    try {
        const db = await mongoService.connect()
        let loadedUser = await db.collection(usersCollection).findOne({ _id: user._id })
        if (!loadedUser) throw 404;
        if (!user.newPassword) {
            delete user.confirmPassword;
            delete user.newPassword;
            // get old hash
            user.password = loadedUser.password;
        } else {
            const isAuth = await bcrypt.compare(user.confirmPassword, loadedUser.password);
            if (isAuth) {
                try {
                    const salt = await bcrypt.genSalt(10)
                    const hashedPassword = await bcrypt.hash(user.newPassword, salt);
                    user.password = hashedPassword;
                    delete user.confirmPassword;
                    delete user.newPassword;
                } catch {
                    throw 404;
                }
            } else throw 401;
        }
        let updatedUser = await db.collection(usersCollection).updateOne({ _id: user._id }, { $set: user })
        updatedUser._id = strId;
        updatedUser.trips = trips;
        updatedUser.pendingIn = pendingIn;
        updatedUser.likes = likes;
        delete updatedUser.password;
        return updatedUser;
    } catch (err){
        throw err;
    }
}

async function updateTripToUser({ tripId, user, action }) {
    const objTripId = new ObjectId(tripId);
    const objUserId = new ObjectId(user._id)
    try {
        const db = await mongoService.connect()
        var user;
        console.log('action:', action);

        if (action === 'request') {
            user = await db.collection(usersCollection).updateOne({ _id: objUserId }, { $push: { pendingIn: objTripId } })
        } else if (action === 'approve') {
            user = await db.collection(usersCollection).updateOne({ _id: objUserId }, { $pull: { pendingIn: objTripId } })
            user = await db.collection(usersCollection).updateOne({ _id: objUserId }, { $push: { memberIn: objTripId } })
        } else if (action === 'remove from pending') {
            user = await db.collection(usersCollection).updateOne({ _id: objUserId }, { $pull: { pendingIn: objTripId } })
        } else { // admin can remove member after approved
            user = await db.collection(usersCollection).updateOne({ _id: objUserId }, { $pull: { memberIn: objTripId } })
        }
        return user;
    } catch {

    }
}

function remove(id) {
    const _id = new ObjectId(id);
    return mongoService.connect()
        .then(db => db.collection(usersCollection).remove({ _id }));
}




// scrap code:

// async function updateTripToUser({tripId, user}) {
//     const objTripId = new ObjectId(tripId);
//     const objUserId = new ObjectId(user._id)
//     try {
//         const db = await mongoService.connect()
//         var user = await db.collection(usersCollection).findOne({_id: objUserId});
//         const idxTripInPending = user.pendingIn.findIndex(trip => trip._id === tripId);
//         const idxTripInMember = user.memberIn.findIndex(trip => trip._id === tripId);
//         console.log('idxTripInPending:', idxTripInPending, ', idxTripInMember:', idxTripInMember);

//         if (idxTripInPending === -1 && idxTripInMember === -1) {
//             console.log('not pending not member - insert to pending');
//             user.pendingIn.push(tripId);
//         } else if (idxTripInPending !== -1 && idxTripInMember === -1) {
//             user.pendingIn.splice(idxTripInPending, 1);
//             user.memberIn.push(tripId);
//         } else if (idxTripInPending === -1 && idxTripInMember !== -1) {
//             user.memberIn.splice(idxTripInMember, 1);
//         }
//         await db.collection(usersCollection).updateOne({_id: objUserId}, {$set: user});
//         return user;
//     } catch {

//     }
// }