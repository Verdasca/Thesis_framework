var Alternative = require('../models/alternative');
var mongoose = require( 'mongoose' );
var Project = mongoose.model('Project');

//Create an alternative
module.exports.create = function (req, res) {
	var alternative = new Alternative(req.body);
	alternative.save(function (err, result) {
	 //res.json(result);
  });
  // Associate/save the new alternative to the project
  Project.findOne({ _id:req.params.id })
  .populate('alternatives')
  .exec(function (err, project) {
    if (err){
      res.send(err);
    }
    // console.log('Alt: '+alternative);
    // console.log('ID: '+ req.params.id);
    // console.log('-------------------------');
    // console.log('Project: ' + project);
    // First push then save to do the association
    project.alternatives.push(alternative);
    project.save();
    // console.log('-------------------------');
    // console.log(project.alternatives);
    // console.log('-------------------------');
    res.send('Create alternative complete.');
  });
}

//Get all alternatives
module.exports.get = function (req, res) {
    // use mongoose to get all alternatives in the database
    // Alternative.find(function(err, alternatives) {
    //     // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    //     if (err){
    //         res.send(err);    
    //     }
    //     res.json(alternatives); // return all alternatives in JSON format
    // });

    Project
        .findOne({ _id: req.params.id })
        .populate('alternatives') // only works if we pushed refs to children
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
    return Alternative.findById(req.params.id, function (err, alternative) {
      if (!err) {
            res.jsonp(alternative);
      } else {
            console.log(err);
            res.send(err);
      }
    });
}

//Edit an alternative
module.exports.edit = function (req, res) {
	Alternative.findOneAndUpdate({
            _id:req.params.id
        },
        {$set:{name:req.body.name, description:req.body.description}},
        {upsert:true},
        function(err,alternative){
            if(err){
                console.log('error occured');
                res.send(err);
            }else{
                //console.log(alternative);
                res.send(alternative);
            }       
    });
}

//Delete an alternative
module.exports.delete = function(req, res){
        // Alternative.remove({
        //     _id : req.params.id
        // }, function(err, alternative) {
        //     if (err) {
        //         throw new Error(err);
        //     }
        //     res.send(alternative);

        // });

  var alternative = req.params.alternativeId;
  Project.update({ '_id' :req.params.id }, {$pull: { alternatives: alternative }} )
    .exec(function(err) {
      Alternative.remove({ '_id' : alternative }, function(err, numberRemoved) {
      // The identified alternative is now removed.
    });
  });
  res.send('Delete alternative complete.');        
}