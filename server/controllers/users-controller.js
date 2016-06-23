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
            console.log(err);
      }
    });
}

//Delete an user
module.exports.delete = function(req, res){
        User.remove({
            _id : req.params.id
        }, function(err, user) {
            if (err) {
                throw new Error(err);
            }
            res.send(user);

        });
}