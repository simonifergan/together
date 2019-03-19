const userService = require('../services/user.service');


module.exports = (app) => {
    // all users
    app.get('/user', (req, res) => {
        userService.query()
            .then(users => res.json(users))
            .catch(err => res.end(err));
    });

    app.get('/user/:userId', (req, res) => {
        const {userId} = req.params;
        userService.getById(userId)
        .then(user => {
            if (user) return res.json(user);
            else res.status(404).end();
        })
    });

    app.post('/login', (req, res) => {
        const credentials = req.body;
        userService.login(credentials)
            .then((user) => {
                if (!user) return res.status(401).end();
                req.session.user = user;
                res.json(user)
            })
            .catch(err => res.end(err));
    });

    app.post('/signup', (req, res) => {
        const newUser = req.body;
        userService.signup(newUser)
            .then(user => {
                req.session.user = user;
                res.json(user);
            })
            .catch(err => res.status(409).end());
    });

    app.post('/logout', (req, res) => {
        req.session.user = null;
        res.end();
    });

}