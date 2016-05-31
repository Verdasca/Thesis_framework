var ProfileTable = require('../models/profileTable');

//Create a profile
module.exports.create = function (req, res) {
	var profile = new ProfileTable(req.body);
	profile.save(function (err, result) {
	    res.json(result);
	});
}

//Get all profiles
module.exports.get = function (req, res) {
    // use mongoose to get all profiles in the database
    ProfileTable.find(function(err, profiles) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err){
            res.send(err);    
        }
        res.json(profiles); // return all profiles in JSON format
    });
}

module.exports.findById = function (req, res) {  
    return ProfileTable.findById(req.params.id, function (err, profile) {
      if (!err) {
            res.jsonp(profile);
      } else {
            console.log(err);
      }
    });
}

//Edit a profile
module.exports.edit = function (req, res) {
	ProfileTable.findOneAndUpdate({
            _id:req.params.id
        },
        {$set:{action:req.body.action, criterion:req.body.criterion, value:req.body.value}},
        {upsert:true},
        function(err,profile){
            if(err){
                console.log('error occured');
            }else{
                console.log(profile);
                res.send(profile);
            }       
    });
}

//Delete a profile
module.exports.delete = function(req, res){
        ProfileTable.remove({
            _id : req.params.id
        }, function(err, profile) {
            if (err) {
                throw new Error(err);
            }
            res.send(profile);

        });
}
