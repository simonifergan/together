const tripService = require('../services/trip.service');
const BASE_URL = '/api/trip'

module.exports = (app) => {

    // Query trips' list
    app.get(BASE_URL, (req, res) => {
        let { tripDate } = req.query
        let { searchQuery } = req.query
        if (!searchQuery) searchQuery = '';
        tripService.query(searchQuery, tripDate)
            .then(trips => res.json(trips))
            .catch(err => res.end(err));
    });

    // Get trending trips
    app.get(`${BASE_URL}/trending`, (req, res) => {
        tripService.getTrending()
            .then(trips => res.json(trips))
            .catch(err => res.end(err));
    });

    // Get recommended trips
    app.post(`${BASE_URL}/recommended`, (req, res) => {
        const prefs = req.body;
        tripService.getRecommended(prefs)
            .then(trips => res.json(trips))
            .catch(err => res.end(err));
    });

    // Get trips by activity
    app.get(`${BASE_URL}/activity`, (req, res) => {
        const { activity } = req.query
        tripService.getByActivity(activity)
            .then(trips => res.json(trips))
            .catch(err => res.end(err));
    })

    // Get single trip by id
    app.get(`${BASE_URL}/:tripId`, (req, res) => {
        const { tripId } = req.params;
        tripService.getById(tripId)
            .then(trip => {
                res.json(trip);
            })
    });

    // Get trips by user Id 
    app.get(`${BASE_URL}/user/:userId`, async (req, res) => {
        const { userId } = req.params;
        try {
            const trips = await tripService.getByUserId(userId);
            if (trips.length) res.json(trips);
            else res.status(404).end('User has no trips');
        } catch (err) {
            console.log(err);
            res.status(404).end('There was a problem');
        }

    });

    // Get trips by countryCode
    app.get(`${BASE_URL}/country/:countryCode`, async (req, res) => {
        const { countryCode } = req.params;
        const trips = await tripService.getTripsByCountry(countryCode);
        res.json(trips);
    });

    // Delete by Id
    app.delete(`${BASE_URL}/:tripId`, isUser, checkUser, (req, res) => {
        const { tripId } = req.params;
        tripService.remove(tripId)
            .then(() => {
                res.json(`Trip: ${tripId} was successfully deleted.`);
            })
    });

    // Add a new trip
    app.post(BASE_URL, isUser, (req, res) => {
        const trip = req.body;
        tripService.add(trip)
            .then(trip => {
                res.json(trip);
            })
    });

    // Update existing trip
    app.put(`${BASE_URL}/:tripId`, isUser, checkUser, (req, res) => {
        console.log('passed middleware');
        const trip = req.body;
        tripService.update(trip)
            .then(updatedTrip => {
                res.json(updatedTrip);
            })
    });

    // Toggle user between pending and members' lists
    app.patch(`${BASE_URL}/trip_user/:tripId`, (req, res) => {
        const userIdToTrip = req.body;
        tripService.updateUserOnTrip(userIdToTrip)
            .then(updatedTrip => {
                if (updatedTrip) return res.json(updatedTrip);
                else res.status(404).end();
            })

    })

    // MIDDLEWARE:

    // For further use: when user is an admin
    function checkAdmin(req, res, next) {
    if (!req.session.user || !req.session.user.isAdmin) return res.end('Not admin');
    next();

    }

    function isUser(req, res, next) {
        if (!req.session.user) return res.status(401).end();
        next();
    }

    // Check if trip belongs to user
    // Gets latest update in db and verifies
    async function checkUser(req, res, next) {
        const {tripId} = req.params;
        if (!tripId) return res.status(404).end();
        const trip = await tripService.getById(tripId);
        trip.userId = trip.userId.toString();
        if (req.session.user._id !== trip.userId) return res.status(403).end();
        next();
    }

}