require('dotenv').load();

var express = require('express'),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser'),
    jwt = require('jsonwebtoken'),
    morgan = require('morgan'),
    path = require('path'),
    fileUpload = require('express-fileupload');

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//log every request to the database
app.use(morgan('dev'));

//middleware for file upload
app.use(fileUpload());



//CORS
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});



//server static files
app.use(express.static('public'));


// Bundle API routes.
var router = express.Router();
app.use('/api', require('./routes')(router));


// Start the server.
app.listen(port, function() {
    console.log(`The API has started on http://127.0.0.1:${port}/!`);
});
