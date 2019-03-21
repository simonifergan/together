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

    })


}
