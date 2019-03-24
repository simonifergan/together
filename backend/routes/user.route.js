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
        const { userIds } = req.body
        userService.query(userIds)
            .then(users => res.json(users))
            .catch(err => res.end(err));
    });

    app.get(`${BASE}/user/:userId`, (req, res) => {
        const { userId } = req.params;
        userService.getById(userId)
            .then(user => {
                if (user) return res.json(user);
                else res.status(404).end();
            })
    });

    app.put(`${BASE}/user/:userId`, (req, res) => {
        const userToUpdate = req.body;
        console.log('user.service: userToUpdate:', userToUpdate);
        userService.update(userToUpdate)
            .then(updatedUser => {
                if (updatedUser) return res.json(updatedUser);
                else res.status(404).end();
            })
    })

    app.post(`${BASE}/login`, (req, res) => {
        const credentials = req.body;
        // console.log(credentials);
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


    // PUSH NOTIFICATIONS
    app.patch(`${BASE}/user_push_sub/:userId`, async (req, res) => {
        
    })

}