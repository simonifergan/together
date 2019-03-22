const notificationService = require('../services/notification.service');
module.exports = (app) => {
    
    app.get('/api/notification', async (req, res) => {
        try {            
            const notification = await notificationService.query();
            res.json(notification);
        } catch {
            res.status(404).end();
        }
    });
}