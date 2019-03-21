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
    })
}