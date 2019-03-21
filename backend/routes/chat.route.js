const chatService = require('../services/chat.service');
module.exports = (app) => {

    // EXPERIMENT WITH CHATS DB
    app.get('/api/chat', async (req, res) => {
        try {
            const chats = await chatService.query();
            res.json(chats);
        } catch {
            res.status(404).end();
        }

    });

    app.put('/api/chat/:chatId', async (req, res) => {
        console.log('Hi, I am here');
        const msg = req.body;
        const { chatId } = req.params;
        console.log(msg, chatId);
        try {
            const isSuccess = await chatService.addMsg(msg, chatId)
            res.json(isSuccess);
        } catch {
            res.status(500).end('We have a problem');
        }
    })


}
