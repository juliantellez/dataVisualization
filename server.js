// MODULES :::::::::::::::::::::::::::::::::::::::::::::::::::
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

// CONFIGURATION ::::::::::::::::::::::::::::::::::::::::::::::::
// FILES ::::::::::::::::::::::::::::::::::::::::::::::::::::::::
var port = process.env.PORT || 8080; // set port
var db = require('./config/db');
 
connectionsubject = mongoose.createConnection(db.urlSubjectViews);//connect to mongodb

// PARSE POST PARAMETERS :::::::::::::::::::::::::::::::::::::::::
app.use(bodyParser.json()); // parse application/json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// ROUTES ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
require('./app/routes')(app); 

// START APP :::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.listen(port);	
console.log('Magic happens on port ' + port); // console log
exports = module.exports = app; 						