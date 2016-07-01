var User = require('../models/user');

//Create a user
module.exports.create = function (req, res) {
	var user = new User(req.body);
	user.save(function (err, result) {
	    res.json(result);
	});
}

//Get all users
module.exports.get = function (req, res) {
    // use mongoose to get all users in the database
    User.find(function(err, users) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err){
            res.send(err);    
        }
        res.json(users); // return all users in JSON format
    });
}

module.exports.findById = function (req, res) {  
    return User.findById(req.params.id, function (err, user) {
      if (!err) {
            res.jsonp(user);
      } else {
            //console.log(err);
            res.send(err);
      }
    });
}

module.exports.findByUsername = function (req, res) {
    User.findOne({ username: req.params.username }, function(err, user) {
        if (!err) {
            res.jsonp(user);
        } else {
            res.send(err);
        }
    });
}

//Delete an user
// TODO (don't forget): deleting users is not implemented on the framework yet, but when it is:
// all projects related to the user need to be deleted (see delete project example)
module.exports.delete = function(req, res){
        User.remove({
            _id : req.params.id
        }, function(err, user) {
            if (err) {
                res.send(err);
                //throw new Error(err);
            }
            res.send(user);

        });
}