var Parameter = require('../models/parameter');
var mongoose = require( 'mongoose' );
var Project = mongoose.model('Project');

//Create a parameter
module.exports.create = function (req, res) {
	var parameter = new Parameter(req.body);
	parameter.save(function (err, result) {
	    //res.json(result);
	});

    // Associate/save the new parameter to the project
    Project.findOne({ _id:req.params.id})
    .populate('parameters')
    .exec(function (err, project) {
      if (err){
        res.send(err);
      }
      // First push then save to do the association
      project.parameters.push(parameter);
      project.save();
      res.send('Create parameter complete.');
    });
}

//Get all parameters
module.exports.get = function (req, res) {
    // use mongoose to get all parameters in the database
    // Parameter.find(function(err, parameters) {
    //     // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    //     if (err){
    //         res.send(err);    
    //     }
    //     res.json(parameters); // return all parameters in JSON format
    // });

    Project
        .findOne({ _id: req.params.id })
        .populate('parameters') // only works if we pushed refs to children
        .exec(function (err, project) {
          if (err){
            res.send(err);
          }
          //console.log(project);
          res.json(project);
    });
}

module.exports.findById = function (req, res) {  
    return Parameter.findById(req.params.id, function (err, parameter) {
      if (!err) {
            res.jsonp(parameter);
      } else {
            console.log(err);
            res.send(err);
      }
    });
}

//Edit a parameter
module.exports.edit = function (req, res) {
	Parameter.findOneAndUpdate({
            _id:req.params.id
        },
        {$set:{credibility:req.body.credibility}},
        {upsert:true},
        function(err,parameter){
            if(err){
                console.log('error occured');
                res.send(err);
            }else{
                //console.log(parameter);
                res.send(parameter);
            }       
    });
}

//Delete a parameter
module.exports.delete = function(req, res){
        Parameter.remove({
            _id : req.params.id
        }, function(err, parameter) {
            if (err) {
              res.send(err);
              //throw new Error(err);
            }
            res.send(parameter);

        });
}

//Delete all parameters
exports.deleteAll = function(req, res) {
    Project.findOne({ _id:req.params.id })
        .populate('parameters')
        .exec(function (err, project) {
            if (err){
                res.send(err);
            }
            var parameter = project.parameters;
            Project.update({ _id:req.params.id }, {'$pullAll': {parameters: parameter }})
              .exec(function(err) {
                Parameter.remove({ _id: { $in: parameter }}, function(err, numberRemoved) {
                  // The identified parameter are now removed.
                });
            });
            res.send('Delete all parameters complete.');
    });
}