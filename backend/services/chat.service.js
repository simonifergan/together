const mongoService = require('./mongo.service');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
    createChat,
    addMsg,
    updateTripChat,
}

const chatsCollection = 'chats';
const usersCollection = 'users';
const tripsCollection = 'trips';

async function query(userId) {
    userId = new ObjectId(userId)
    try {
        const db = await mongoService.connect()
        const chats = await db.collection(chatsCollection).aggregate([
            {
                $match: {
                    users: userId
                }
            },
            {
                $lookup:
                {
                    from: usersCollection,
                    localField: 'users',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            {
                $project: {
                    users: {
                        password: 0,
                        email: 0,
                        pendingIn: 0,
                        memberIn: 0,
                        proposals: 0,
                        tripPrefs: 0,
                        birthdate: 0,
                    },

                },
            },
            {
                $lookup:
                {
                    from: tripsCollection,
                    localField: '_id',
                    foreignField: 'chatId',
                    as: 'tripTitle'
                }
            },
            {
                $project: {
                    tripTitle: {
                        title: 1
                    },

                },
            },
            {
                $unwind: '$tripTitle'
            }
        ]).toArray()
        return chats;
    } catch {

    }
}

async function createChat(chat) {
    chat.users = chat.users.map(user => new ObjectId(user));
    try {
        const db = await mongoService.connect();
        const { insertedId } = await db.collection(chatsCollection).insertOne(chat);
        chat._id = insertedId;
        chat.users = await Promise.all(chat.users.map(async _id => { 
            const userInfo =  db.collection(usersCollection).findOne({ _id });
            return userInfo;
        }));
        chat.users = chat.users.map(user => {
            delete user.email;
            delete user.password;
            delete user.tripPrefs;
            delete user.pendingIn;
            delete user.proposals;

            return user
        })
        return chat;
    } catch {
        console.log('major error');
    }
}

async function updateTripChat(chatId, users) {
    chatId = new ObjectId(chatId);
    users = users.map(userId => new ObjectId(userId));
    try {
        const db = await mongoService.connect();
        const res = await db.collection(chatsCollection).updateOne(
            {_id: chatId},
            {
                $set : {
                    users
                }
            }
        ) 
    } catch {

    }

}

async function addMsg({ msg, chatId }) {
    chatId = new ObjectId(chatId);
    msg.sender = new ObjectId(msg.sender);
    try {
        const db = await mongoService.connect();
        const res = await db.collection(chatsCollection).updateOne(
            { _id: chatId },
            {
                $push: {
                    msgs: msg
                }
            }
        )
        return res;
    } catch (err) {
        return 'We had a problem';
    }

}