const chatService = require('../services/chat.service');
module.exports = (app) => {

    // EXPERIMENT WITH CHATS DB
    app.get('/api/chat', async (req, res) => {
        const {userId} = req.query
        // console.log('userId:', userId);
        try {
            const chats = await chatService.query(userId);
            console.log('chats:', chats);
            res.json(chats);
        } catch {
            res.status(404).end();
        }

    });

    app.put('/api/chat/:chatId', async (req, res) => {
        const msg = req.body;
        const { chatId } = req.params;
        try {
            const isSuccess = await chatService.addMsg(msg, chatId)
            res.json(isSuccess);
        } catch {
            res.status(500).end('We have a problem');
        }
    })
}