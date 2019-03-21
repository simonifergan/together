const mongoService = require('./mongo.service');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
    addMsg,
}

const chatsCollection = 'chats';
const usersCollection = 'users';

async function query(userId) {
    console.log('userId:', userId);

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
    console.log(msg, chatId)
    chatId = new ObjectId(chatId);
    msg.sender = new ObjectId(msg.sender);
    console.log('OBJECT IDS', chatId, msg.sender);
    try {
        console.log('Hi');
        const db = await mongoService.connect();
        const res = await db.collection(chatsCollection).update(
            { _id: chatId },
            {
                $push: {
                    msgs: msg
                }
            }
        )
        console.log(res);
        return res;
    } catch(err) {
        console.log(err);
        return 'We had a problem';
    }

}