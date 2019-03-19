const reviewService = require('../services/review.service.js');
const BASE = '/review';

module.exports = (app) => {
    app.get(BASE, (req, res) => {
        reviewService.query(req.query)
            .then( reviews => {
                res.json(reviews)
            })
    })

    app.post(BASE, (req,res) => {
        var review ={
            userId : req.session.user._id,
            toyId : req.body.toyId,
            content: req.body.content
        }
        reviewService.add(review)
            .then(review => {
                // TODO: return with user and toy info:
                res.json(review)
            })
    })
}


