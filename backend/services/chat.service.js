const mongoService = require('./mongo.service');

module.exports = {
    query,
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