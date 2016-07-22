var Criterion = require('../models/criterion');
var mongoose = require( 'mongoose' );
var Project = mongoose.model('Project');

//Create a criterion
module.exports.create = function (req, res) {
	var criterion = new Criterion(req.body);
	criterion.save(function (err, result) {
	    //res.json(result);
	});
    // Associate/save the new criterion to the project
    Project.findOne({ _id:req.params.id})
    .populate('criteria')
    .exec(function (err, project) {
      if (err){
        res.send(err);
      }
      // First push then save to do the association
      project.criteria.push(criterion);
      project.save();
      res.send('Create criterion complete.');
    });
}

//Get all criterions
module.exports.get = function (req, res) {
    // use mongoose to get all criterions in the database
    // Criterion.find(function(err, criterions) {
    //     // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    //     if (err){
    //         res.send(err);    
    //     }
    //     res.json(criterions); // return all criteria in JSON format
    // });

    Project
        .findOne({ _id: req.params.id })
        .populate('criteria') // only works if we pushed refs to children
        .exec(function (err, project) {
          if (err){
            res.send(err);
          }
          //console.log(project._id);
          //console.log(project);
          //console.log(project.alternatives);
          res.json(project);
    });
}

module.exports.findById = function (req, res) {  
    return Criterion.findById(req.params.id, function (err, criterion) {
      if (!err) {
            res.jsonp(criterion);
      } else {
            console.log(err);
            res.send(err);
      }
    });
}

//Edit a criterion
module.exports.edit = function (req, res) {
	Criterion.findOneAndUpdate({
            _id:req.params.id
        },
        {$set:{name:req.body.name, description:req.body.description, direction:req.body.direction, measure:req.body.measure, weight:req.body.weight, rank:req.body.rank, indifference:req.body.indifference, preference:req.body.preference, veto:req.body.veto}},
        {upsert:true},
        function(err,criterion){
            if(err){
                console.log('error occured');
                res.send(err);
            }else{
                //console.log(criterion);
                res.send(criterion);
            }       
    });
}

//Delete an criterion
module.exports.delete = function(req, res){
  // Criterion.remove({
  //   _id : req.params.id
  // }, function(err, criterion) {
  // if (err) {
  //   throw new Error(err);
  // }
  // res.send(criterion);
  // });

  var criterion = req.params.criterionId;
  Project.update({ '_id' :req.params.id }, {$pull: { criteria: criterion }} )
    .exec(function(err) {
      Criterion.remove({ '_id' : criterion }, function(err, numberRemoved) {
          // The identified criterion is now removed.
      });
  });
  res.send('Delete criterion complete.');
}

//Delete all criteria
exports.deleteAll = function(req, res) {
    Project.findOne({ _id:req.params.id })
        .populate('criteria')
        .exec(function (err, project) {
            if (err){
                res.send(err);
            }
            var criterion = project.criteria;
            Project.update({ _id:req.params.id }, {'$pullAll': {criteria: criterion }})
              .exec(function(err) {
                Criterion.remove({ _id: { $in: criterion }}, function(err, numberRemoved) {
                  // The identified criteria are now removed.
                });
            });
            res.send('Delete all criteria complete.');
    });
}
