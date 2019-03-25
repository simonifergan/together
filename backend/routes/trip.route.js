const tripService = require('../services/trip.service');
const BASE_URL = '/api/trip'

module.exports = (app) => {
    // Query trips' list
    app.get(BASE_URL, (req, res) => {        
        let {searchQuery} = req.query
        if (!searchQuery) searchQuery = '';
        tripService.query(searchQuery)
            .then(trips => res.json(trips))
            .catch(err => res.end(err));
    });

    app.get(`${BASE_URL}/trending`, (req, res) => {        
        tripService.getTrending()
            .then(trips => res.json(trips))
            .catch(err => res.end(err));
    });
    
    // Get single trip by id
    app.get(`${BASE_URL}/:tripId`, (req, res) => {
        const { tripId } = req.params;
        tripService.getById(tripId)
            .then(trip => {
                res.json(trip);
            })
    });

    // Get trips by user Id 
    app.get(`${BASE_URL}/user/:userId`, async (req,res) => {
        const {userId} = req.params;
        try {
            const trips = await tripService.getByUserId(userId);
            if (trips.length) res.json(trips);
            else res.status(404).end('User has no trips');
        } catch(err) {
            console.log(err);
            res.status(404).end('There was a problem');
        }

    });

    // For further use: when user is an admin
    function checkAdmin(req, res, next) {
        if (!req.session.user || !req.session.user.isAdmin) return res.end('Not admin');
        next();
    }

    // Delete by Id
    app.delete(`${BASE_URL}/:tripId`, (req, res) => {
        const { tripId } = req.params;
        tripService.remove(tripId)
            .then(() => {
                res.json(`Trip: ${tripId} was successfully deleted.`);
            })
    });

    // Add a new trip
    app.post(BASE_URL, (req, res) => {
        const trip = req.body;
        tripService.add(trip)
            .then(trip => {
                res.json(trip);
            })
    });

    // Update existing trip
    app.put(`${BASE_URL}/:tripId`, (req, res) => {
        const trip = req.body;
        tripService.update(trip)
            .then((updatedToy) => {
                res.json(updatedToy);
            })
    });
}