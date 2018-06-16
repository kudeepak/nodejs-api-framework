const envConfig = require('./config/env.config.js');
const HOST = envConfig.host;
const PORT = envConfig.port;
const express = require('express');
const bodyParser = require('body-parser');
const jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
const morgan = require('morgan');
const VerifyToken = require('./util/verifyJWT.js');
//SETTING BASE PATH TO USE IN REQUIRE DYNAMICALLY FOR ROUTERS
global.__base = __dirname + '/';

// Configuring the database
const dbConfig = require('./config/database.config.js');
const secConfig = require('./config/secret.config.js');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.db_url)
.then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

// create express app
const app = express();
app.set('superSecret', secConfig.secret); // secret variable
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

// Require routes DYNAMICALLY FROM ROUTES FOLDER.
app.use(function(req, res, next) {
    //TO MAKE MODULAR CHANGE IN THE PATH 
    var r = req.originalUrl.split('/');
    var route = __base + 'app/routes/' + r[1] + '.routes.js'
    require(route)(app);
    return next();
});

// use morgan to log requests to the console
app.use(morgan('dev'));

// listen for requests
app.listen(PORT, HOST, () => {
    console.log("Server is listening on port " + PORT + " and host " + HOST);
});