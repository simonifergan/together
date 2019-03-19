const proposalService = require('../services/proposal.service');

const BASE_URL = '/api/proposal'
module.exports = (app) => {
    // Query proposals' list
    app.get(BASE_URL, (req, res) => {
        proposalService.query()
            .then(proposals => res.json(proposals))
            .catch(err => res.end(err));
    });

    // Get single proposal by id
    app.get(`${BASE_URL}/:proposalId`, (req, res) => {
        const { proposalId } = req.params;
        proposalService.getById(proposalId)
            .then(proposal => {
                res.json(proposal);
            })
    });

    function checkAdmin(req, res, next) {
        if (!req.session.user || !req.session.user.isAdmin) return res.end('Not admin');
        next();
    }

    // Delete by Id
    app.delete(`${BASE_URL}/:proposalId`, checkAdmin, (req, res) => {

        const { proposalId } = req.params;
        proposalService.remove(proposalId)
            .then(() => {
                res.end(`Toy: ${proposalId} was successfully deleted.`);
            })
    });

    // Add a new proposal
    app.post(BASE_URL, checkAdmin, (req, res) => {
        const proposal = req.body;
        proposalService.add(proposal)
            .then(proposal => {
                res.json(proposal);
            })
    });
    
    // Update existing proposal
    app.put(`${BASE_URL}/:proposalId`, checkAdmin, (req, res) => {
        const proposal = req.body;
        proposalService.update(proposal)
            .then((updatedToy) => {
                res.json(updatedToy);
            })
    });
}