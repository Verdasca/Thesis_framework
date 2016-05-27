// Server file

// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose       = require('mongoose');

var alternativesController = require('./server/controllers/alternatives-controller');
var criterionsController = require('./server/controllers/criterions-controller');

// configuration ===========================================
var node_env = process.env.NODE_ENV;
    
// config files
var db = require('./config/db');
var appConfig = require('./config/app');

// set our port
var port = appConfig.ports[node_env]|| 8080; 

// connect to our mongoDB database 
mongoose.connect(db.url);     //uncomment when setting up or ned to use database

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

// set the static files location /client/img will be /img for users
app.use(express.static(__dirname + '/client')); 
//app.use(express.static(__dirname + '/templates/client')); 

//REST API ==================================================================
//Alternative 
app.get('/api/alternatives', alternativesController.get);
app.get('/api/alternative/:id', alternativesController.findById);
app.post('/api/alternatives', alternativesController.create);
app.put('/api/alternative/:id', alternativesController.edit);
app.delete('/api/alternative/:id', alternativesController.delete);
//Criterion 
app.get('/api/criterions', criterionsController.get);
app.get('/api/criterion/:id', criterionsController.findById);
app.post('/api/criterions', criterionsController.create);
app.put('/api/criterion/:id', criterionsController.edit);
app.delete('/api/criterion/:id', criterionsController.delete);

// frontend routes =========================================================
// route to handle all angular requests
app.get('*', function(req, res) {
	res.sendfile(__dirname + '/client/workspace.html');
	//res.sendfile(__dirname + '/templates/client/workspace.html'); // load our client/workspace.html file
});

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);               

// shoutout to the user                     
console.log('Magic happens on port ' + port);

// expose app           
exports = module.exports = app;  