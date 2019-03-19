const toyService = require('../services/toy.service');


module.exports = (app) => {
    // Query toys' list
    app.get('/toy', (req, res) => {
        const filterBy = req.query;
        toyService.query(filterBy)
            .then(toys => res.json(toys))
            .catch(err => res.end(err));
    });

    // Get single toy by id
    app.get('/toy/:toyId', (req, res) => {
        const { toyId } = req.params;
        toyService.getById(toyId)
            .then(toy => {
                res.json(toy);
            })
    });

    function checkAdmin(req, res, next) {
        if (!req.session.user || !req.session.user.isAdmin) return res.end('Not admin');
        next();
    }

    // Delete by Id
    app.delete('/toy/:toyId', checkAdmin, (req, res) => {

        const { toyId } = req.params;
        toyService.remove(toyId)
            .then(() => {
                res.end(`Toy: ${toyId} was successfully deleted.`);
            })
    });

    // Add a new toy
    app.post('/toy', checkAdmin, (req, res) => {
        const toy = req.body;
        toyService.add(toy)
            .then(toy => {
                res.json(toy);
            })
    });
    
    // Update existing toy
    app.put('/toy/:toyId', checkAdmin, (req, res) => {
        const toy = req.body;
        toyService.update(toy)
            .then((updatedToy) => {
                res.json(updatedToy);
            })
    });
}