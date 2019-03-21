const mongoService = require('./mongo.service');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
    addMsg,
}

const chatsCollection = 'chats';
const usersCollection = 'users';

async function query() {
    try {
        const db = await mongoService.connect()
        const chats = await db.collection(chatsCollection).aggregate([
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

async function addMsg(msg, chatId) {
    console.log(msg, chatId)
    chatId = new ObjectId(chatId);
    msg.sender = new ObjectId(msg.sender);
    console.log('OBJECT IDS', chatId, msg.sender);
    try {
        console.log('Hi');
        const res = await db.collection(chatsCollection).update(
            { _id: chatId },
            {
                $push: {
                    msgs: {
                        $each: [msg],
                    }
                }
            }
        )
        return res;
    } catch {
        return 'We had a problem';
    }

}