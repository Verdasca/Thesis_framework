var Project = require('../models/project');
var mongoose = require( 'mongoose' );
var User = mongoose.model('User');
var Parameter = require('../models/parameter');
var Alternative = require('../models/alternative');
var Criterion = require('../models/criterion');
var Category = require('../models/category');
var Performance = require('../models/performanceTable');
var Profile = require('../models/profileTable');

//Create a project
module.exports.create = function (req, res) {
	var project = new Project(req.body);
	project.save(function (err, result) {
	    //res.json(result);
	});

    // Associate/save the new project to the user
    User.findOne({ _id:req.params.id })
        .populate('projects')
        .exec(function (err, user) {
        if (err){
          res.send(err);
        }
        // First push then save to do the association
        user.projects.push(project);
        user.save();
        res.send('Create project complete.');
    });
}

//Get all projects of the user
module.exports.get = function (req, res) {
    // // use mongoose to get all projects in the database
    // Project.find(function(err, projects) {
    //     // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    //     if (err){
    //         res.send(err);    
    //     }
    //     res.json(projects); // return all projects in JSON format
    // });

    User
        .findOne({ _id: req.params.id })
        .populate('projects') // only works if we pushed refs to children
        .exec(function (err, user) {
          if (err){
            res.send(err);
          }
          //console.log(user);
          res.json(user);
    });
}

module.exports.findById = function (req, res) {  
    return Project.findById(req.params.id, function (err, project) {
      if (!err) {
            res.jsonp(project);
      } else {
            console.log(err);
            res.send(err);
      }
    });
}

//Edit a project
module.exports.edit = function (req, res) {
    Project.findOneAndUpdate({
            _id:req.params.id
        },
        {$set:{ name:req.body.name }},
        {upsert:true},
        function(err,project){
            if(err){
                console.log('error occured');
                res.send(err);
            }else{
                //console.log(project);
                res.send(project);
            }       
    });
}

//Delete a project
module.exports.delete = function(req, res){
        // Project.remove({
        //     _id : req.params.id
        // }, function(err, project) {
        //     if (err) {
        //         throw new Error(err);
        //     }
        //     res.send(project);

        // });

    var project = req.params.projectId;
    // Before deleting the project, all the data associated with the project must be deleted as well
    //Delete all associated parameters
    Project.findOne({ _id: project })
        .populate('parameters')
        .exec(function (err, project) {
            if (err){
                //res.send(err);
            }
            var parameter = project.parameters;
            Project.update({ _id: project }, {'$pullAll': {parameters: parameter }})
              .exec(function(err) {
                Parameter.remove({ _id: { $in: parameter }}, function(err, numberRemoved) {
                  // The identified parameter are now removed.
                });
            });
    });
    //Delete all associated alternatives
    Project.findOne({ _id: project })
        .populate('alternatives')
        .exec(function (err, project) {
            if (err){
                //res.send(err);
            }
            var alternative = project.alternatives;
            Project.update({ _id: project }, {'$pullAll': {alternatives: alternative }})
              .exec(function(err) {
                Alternative.remove({ _id: { $in: alternative }}, function(err, numberRemoved) {
                  // The identified alternative are now removed.
                });
            });
    });
    //Delete all associated criteria
    Project.findOne({ _id: project })
        .populate('criteria')
        .exec(function (err, project) {
            if (err){
                //res.send(err);
            }
            var criterion = project.criteria;
            Project.update({ _id: project }, {'$pullAll': {criteria: criterion }})
              .exec(function(err) {
                Criterion.remove({ _id: { $in: criterion }}, function(err, numberRemoved) {
                  // The identified criterion are now removed.
                });
            });
    });
    //Delete all associated categories
    Project.findOne({ _id: project })
        .populate('categories')
        .exec(function (err, project) {
            if (err){
                //res.send(err);
            }
            var category = project.categories;
            Project.update({ _id: project }, {'$pullAll': {categories: category }})
              .exec(function(err) {
                Category.remove({ _id: { $in: category }}, function(err, numberRemoved) {
                  // The identified category are now removed.
                });
            });
    });
    //Delete all associated performances
    Project.findOne({ _id: project })
        .populate('performancetables')
        .exec(function (err, project) {
            if (err){
                //res.send(err);
            }
            var performance = project.performancetables;
            Project.update({ _id: project }, {'$pullAll': {performancetables: performance }})
              .exec(function(err) {
                Performance.remove({ _id: { $in: performance }}, function(err, numberRemoved) {
                  // The identified performance are now removed.
                });
            });
    });
    //Delete all associated profiles
    Project.findOne({ _id: project })
        .populate('profiletables')
        .exec(function (err, project) {
            if (err){
                //res.send(err);
            }
            var profile = project.profiletables;
            Project.update({ _id: project }, {'$pullAll': {profiletables: profile }})
              .exec(function(err) {
                Profile.remove({ _id: { $in: profile }}, function(err, numberRemoved) {
                  // The identified profile are now removed.
                });
            });
    });
    //console.log('ID user: '+req.params.id+' id project: '+req.params.projectId);
    User.update({ '_id' :req.params.id }, {$pull: { projects: project }} )
      .exec(function(err) {
        Project.remove({ '_id' : project }, function(err, numberRemoved) {
            // The identified project is now removed.
        });
    });

    res.send('Delete project plus respective parameters complete.');

}