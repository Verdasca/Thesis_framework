// Server file

// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var morgan		     = require('morgan');
var methodOverride = require('method-override');
var mongoose       = require('mongoose');
var jwt            = require('jsonwebtoken'); // used to create, sign, and verify tokens
var User           = require('./server/models/user'); // get our mongoose model

var usersController = require('./server/controllers/users-controller');
var projectsController = require('./server/controllers/projects-controller');
var alternativesController = require('./server/controllers/alternatives-controller');
var criterionsController = require('./server/controllers/criterions-controller');
var categoriesController = require('./server/controllers/categories-controller');
var parametersController = require('./server/controllers/parameters-controller');
var performanceTableController = require('./server/controllers/performanceTable-controller');
var profileTableController = require('./server/controllers/profileTable-controller');

// Function to reset DB and get the correct data + create/delete folders and projects 
//var importData = require('./importData.js');
//var createUserProject = require('./createUserProject.js');
//var getProjectData = require('./getProjectData.js');

// configuration ===========================================
var node_env = process.env.NODE_ENV;
    
// config files
var db = require('./config/db');
var appConfig = require('./config/app');

// set our port
var port = appConfig.ports[node_env]|| 8080; 

// connect to our mongoDB database 
mongoose.connect(db.url);  
app.set('superSecret', db.secret); // secret variable  

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: true })); 
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 

// use morgan to log requests to the console
//app.use(morgan('dev'));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

app.use(function(req, res, next) {
res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// set the static files location /client/img will be /img for users
app.use(express.static(__dirname + '/client')); 
//app.use(express.static(__dirname + '/templates/client')); 

//REST API ==================================================================
//User 
//app.get('/api/users', usersController.get);
app.get('/api/user/:id', usersController.findById);
app.get('/api/userFind/:username', usersController.findByUsername);
app.post('/api/users', usersController.create);
app.delete('/api/user/:id', usersController.delete);
//Project 
app.get('/api/projects/:id', projectsController.get);
app.get('/api/project/:id', projectsController.findById);
app.get('/api/cloneproject/:id/:projectId', projectsController.duplicate);
app.post('/api/projects/:id', projectsController.create);
app.put('/api/project/:id', projectsController.edit);
app.delete('/api/project/:id/:projectId', projectsController.delete);
app.delete('/api/projects/:projectId/:id', projectsController.deleteResult);
//Alternative 
app.get('/api/alternatives/:id', alternativesController.get);
app.get('/api/alternative/:id', alternativesController.findById);
app.post('/api/alternatives/:id', alternativesController.create);
app.put('/api/alternative/:id', alternativesController.edit);
app.delete('/api/alternative/:id/:alternativeId', alternativesController.delete);
app.delete('/api/alternatives/:id', alternativesController.deleteAll);
//Criterion 
app.get('/api/criterions/:id', criterionsController.get);
app.get('/api/criterion/:id', criterionsController.findById);
app.post('/api/criterions/:id', criterionsController.create);
app.put('/api/criterion/:id', criterionsController.edit);
app.delete('/api/criterion/:id/:criterionId', criterionsController.delete);
//Category 
app.get('/api/categories/:id', categoriesController.get);
app.get('/api/category/:id', categoriesController.findById);
app.get('/api/categoryRank/:id/:rank', categoriesController.findByRank);
app.post('/api/categories/:id', categoriesController.create);
app.put('/api/category/:id', categoriesController.edit);
app.delete('/api/category/:id/:categoryId', categoriesController.delete);
//Parameter 
app.get('/api/parameters/:id', parametersController.get);
app.get('/api/parameter/:id', parametersController.findById);
app.post('/api/parameters/:id', parametersController.create);
app.put('/api/parameter/:id', parametersController.edit);
app.delete('/api/parameter/:id', parametersController.delete);
//Performance Table 
app.get('/api/performances/:id', performanceTableController.get);
app.get('/api/performance/:id', performanceTableController.findById);
app.post('/api/performances/:id', performanceTableController.create);
app.put('/api/performance/:id', performanceTableController.edit);
app.delete('/api/performance/:id', performanceTableController.delete);
app.delete('/api/performances/:id', performanceTableController.deleteAll);
//Profile Table 
app.get('/api/profiles/:id', profileTableController.get);
app.get('/api/profile/:id', profileTableController.findById);
app.post('/api/profiles/:id', profileTableController.create);
app.put('/api/profile/:id', profileTableController.edit);
app.delete('/api/profile/:id', profileTableController.delete);
app.delete('/api/profiles/:id', profileTableController.deleteAll);
// Import data functions
//app.get('/importData', importData.reset);
//app.get('/createProject', importData.createProject);
//app.get('/createUserProject', createUserProject.create);
//app.get('/createUserProjectGet', createUserProject.get);
//app.get('/getProjectData/alternatives', getProjectData.getAlternatives);
// app.post('/getProjectData/:id', getProjectData.add);
//app.post('/getProjectData/alternatives', getProjectData.addAlternative);

// app.get('/setup', function(req, res) {
//   	// create a sample user
//   	var cris = new User({ 
//     	username: 'cristina', 
//     	password: 'verdasca',
//     	name: 'cristina verdasca'
//   	});

//   	// save the sample user
//   	cris.save(function(err) {
//     	if (err) throw err;

// 	console.log('User saved successfully');
//     res.json({ success: true });
//   });
// });

// =======================
// routes ================
// =======================
// basic route
// app.get('/', function(req, res) {
//     res.send('Hello! The API is at http://localhost:' + port + '/api');
// });

// API ROUTES -------------------
// get an instance of the router for api routes
var apiRoutes = express.Router(); 

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {
  // find the user
  User.findOne({
    username: req.body.username
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      	res.json({ success: false, message: 'Authentication failed. Wrong username.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
          //expiresInMinutes: 1440 // expires in 24 hours
          expiresIn: '24h'
        });

        // return the information including token as JSON
        res.json({
          success: true,
          data: user,
          userId: user._id,
          message: 'Enjoy your token!',
          token: token
        });
      }   

    }

  });
});

// route middleware to verify a token
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});   

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);



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
