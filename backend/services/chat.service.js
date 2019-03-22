const mongoService = require('./mongo.service');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
    addMsg,
}

const chatsCollection = 'chats';
const usersCollection = 'users';

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
                        tripPreferences: 0,
                        interestedIn: 0,
                        proposals: 0,
                        tripPrefs: 0,
                        birthdate: 0,
                    },

                },
            },
        ]).toArray()
        return chats;
    } catch {

    }
}

async function addMsg({msg, chatId}) {
    chatId = new ObjectId(chatId);
    msg.sender = new ObjectId(msg.sender);
    try {
        const db = await mongoService.connect();
        const res = await db.collection(chatsCollection).update(
            { _id: chatId },
            {
                $push: {
                    msgs: msg
                }
            }
        )
        return res;
    } catch(err) {
        return 'We had a problem';
    }

}