// init port
const PORT = process.env.PORT || 3003;

// Import modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const webpush = require('web-push');

const publicKey= 'BPTudf_2kdiCXX7F-mK4JfEvnRCRmyk7yNPKPwj4NjqcudODMIeCdQE7x8fi6J3VVz0-TF51963WyhansbFZiEc';
const privateKey = 'jUPH-cWH6gKwpP3GTnXhmpDZx9eUBcC3nq-lcqTwNCQ'
webpush.setVapidDetails(
    'mailto:travel@travelmaker.app',
    publicKey,
    privateKey
)

// Import Routes
const tripRoute = require('./routes/trip.route')
const userRoute = require('./routes/user.route')
const chatRoute = require('./routes/chat.route')
const notificationRoute = require('./routes/notification.route')

// app initiation
const app = express()
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true // enable set cookie
}));
app.use(cookieParser());
app.use(session({
    secret: 'Three can keep a secret if two of them are dead.',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use(express.static('public'));


// Use routes
tripRoute(app);
userRoute(app);
chatRoute(app);
notificationRoute(app);

app.get('/', (req, res) => {
    res.send('Hello Travel Maker Backend!')
})

app.post('/subscribe', (req, res) => {
        const subscription = req.body;
        console.log(subscription);
        // send 201 status
        res.status(201).json({'see':'see this?'});

        // create payload
        const payload = JSON.stringify({ title: 'Push test'});

        setTimeout( () => {
            webpush.sendNotification(subscription, payload)
            .then(something => {
                console.log('WORKED?')
            })
            .catch(err => console.log(err));
        }, 10000)

})

// Init sockets
const socketService = require('./services/socket.service.js')
const server = app.listen(PORT, () => console.log(`Travel Maker app listening on port ${PORT}`))
const io = require('socket.io')(server);

// Use socket services
socketService(io);

