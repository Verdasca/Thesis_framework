var ProfileTable = require('../models/profileTable');
var mongoose = require( 'mongoose' );
var Project = mongoose.model('Project');

//Create a profile
module.exports.create = function (req, res) {
	var profile = new ProfileTable(req.body);
	profile.save(function (err, result) {
	    //res.json(result);
	});

    // Associate/save the new profile to the project
    Project.findOne({ _id:req.params.id})
    .populate('profiletables')
    .exec(function (err, project) {
      if (err){
        res.send(err);
      }
      // First push then save to do the association
      project.profiletables.push(profile);
      project.save();
      res.send('Create profile complete.');
    });
}

//Get all profiles
module.exports.get = function (req, res) {
    // use mongoose to get all profiles in the database
    // ProfileTable.find(function(err, profiles) {
    //     // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    //     if (err){
    //         res.send(err);    
    //     }
    //     res.json(profiles); // return all profiles in JSON format
    // });

    Project
        .findOne({ _id: req.params.id })
        .populate('profiletables') // only works if we pushed refs to children
        .exec(function (err, project) {
          if (err){
            res.send(err);
          }
          //console.log(project);
          res.json(project);
    });
}

module.exports.findById = function (req, res) {  
    return ProfileTable.findById(req.params.id, function (err, profile) {
      if (!err) {
            res.jsonp(profile);
      } else {
            console.log(err);
            res.send(err);
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
                res.send(err);
            }else{
                //console.log(profile);
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

//Delete all profiles
exports.deleteAll = function(req, res) {
    // ProfileTable.remove({}, function(err, profile) {
    //     if (err) {
    //         throw new Error(err);
    //     }
    //     res.send(profile);
    // });

    Project.findOne({ _id:req.params.id })
        .populate('profiletables')
        .exec(function (err, project) {
            if (err){
                res.send(err);
            }
            var profiles = project.profiletables;
            Project.update({ _id:req.params.id }, {'$pullAll': {profiletables: profiles }})
              .exec(function(err) {
                ProfileTable.remove({ _id: { $in: profiles }}, function(err, numberRemoved) {
                  // The identified profiles are now removed.
                });
              });
            res.send('Delete all profiles complete.');
    });
}
