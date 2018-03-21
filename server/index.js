require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mc = require( `./controllers/messages_controller` );
const session = require('express-session');
const app = express();
const createInitialSession = require('./middleWares/session.js');
const filter = require('./middleWares/filter');

app.use( bodyParser.json() );
app.use( express.static( `${__dirname}/../build` ) );
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SECRET_SESSION,
    cookie: {   //setting up time to expire cookie
        maxAge: 5000
    }
}));
// console.log(session.user)

app.use((req, res, next) => {
    createInitialSession(req, res, next);
    next();
});

app.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        filter(req, res, next);
    }
    next();
});

app.post( "/api/messages", mc.create );
app.get( "/api/messages", mc.read );
app.put( "/api/messages/:id", mc.update );
app.delete( "/api/messages/:id", mc.delete );
app.get("/api/messages/history", mc.history);

const port = process.env.PORT || 3000
app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );

