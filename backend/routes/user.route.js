const userService = require('../services/user.service');

const BASE = '/api';

module.exports = (app) => {
    // all users
    app.get(`${BASE}/user`, (req, res) => {
        userService.query()
            .then(users => res.json(users))
            .catch(err => res.end(err));
    });

    app.post(`${BASE}/user`, (req, res) => {
        const {userIds} = req.body
        userService.query(userIds)
            .then(users => res.json(users))
            .catch(err => res.end(err));
    });

    app.get(`${BASE}/user/:userId`, (req, res) => {
        const {userId} = req.params;
        userService.getById(userId)
        .then(user => {
            if (user) return res.json(user);
            else res.status(404).end();
        })
    });

    app.put(`${BASE}/user/:userId`, async (req, res) => {
        const userToUpdate = req.body;
        try {
            const updatedUser = await userService.update(userToUpdate);
            if (updatedUser) return res.json(updatedUser);
        } catch(err) {
            res.status(err).end();
        }
    })

    // remove trip from pendingIn to memberIn
    app.patch(`${BASE}/user_trip/:userId`, (req, res) => {
        
        const userToTripId = req.body;
        
        userService.updateTripToUser(userToTripId)
            .then(updatedUser => {
                if (updatedUser) return res.json(updatedUser);
                else res.status(404).end();
            })

    })

    // Add or remove user from userId likes array
    app.patch(`${BASE}/user_like/:userId`, async (req, res) => {
        console.log('HI')
        const {userId} = req.params;
        const like = req.body;
        console.log(userId, like)
        try {
            const isSuccess = await userService.updateLikesToUser(userId, like)
            res.json('Success');
        } catch {
            res.status(404).end();
        }
    })

    app.post(`${BASE}/login`, async (req, res) => {
        const credentials = req.body;
        // IF USER LOGGED IN WITH FACEBOOK:
        if (credentials && credentials.facebookId) {
            // return res.end();
            try {
                const user = await userService.loginWithFacebook(credentials);
                req.session.user = user;
                if (user) return res.json(user);
                else throw new Error ('Problem with authentication');
            } catch (err) {
                return res.status(401).end(err);
            }
        }

        // IF USER LOGGED IN THROUGH OUR WEBSITE
        userService.login(credentials)
            .then((user) => {
                if (!user) return res.status(401).end();
                req.session.user = user;
                // console.log('user logged:', user);
                
                res.json(user)
            })
            .catch(err => res.end(err));
    });

    app.post(`${BASE}/signup`, (req, res) => {
        const newUser = req.body;
        userService.signup(newUser)
            .then(user => {
                req.session.user = user;
                res.json(user);
            })
            .catch(err => {
                if (err === 409) return res.status(409).end();
                else if (err === 401) return res.status(401).end();
            });
    });

    app.post(`${BASE}/logout`, (req, res) => {
        delete req.session.user;
        res.end();
    });

}