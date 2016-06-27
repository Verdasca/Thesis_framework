var PerformanceTable = require('../models/performanceTable');
var mongoose = require( 'mongoose' );
var Project = mongoose.model('Project');

//Create a performanceTable
module.exports.create = function (req, res) {
	var performance = new PerformanceTable(req.body);
	performance.save(function (err, result) {
	    //res.json(result);
	});
    // Associate/save the new performance to the project
    Project.findOne({ _id:req.params.id })
    .populate('performancetables')
    .exec(function (err, project) {
      if (err){
        res.send(err);
      }
      // First push then save to do the association
      project.performancetables.push(performance);
      project.save();
      res.send('Create performance complete.');
    });
}

//Get all performances
module.exports.get = function (req, res) {
    // use mongoose to get all performances in the database
    // PerformanceTable.find(function(err, performances) {
    //     // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    //     if (err){
    //         res.send(err);    
    //     }
    //     res.json(performances); // return all performances in JSON format
    // });

    Project
        .findOne({ _id: req.params.id })
        .populate('performancetables') // only works if we pushed refs to children
        .exec(function (err, project) {
          if (err){
            res.send(err);
          }
          //console.log(project);
          res.json(project);
    });
}

module.exports.findById = function (req, res) {  
    return PerformanceTable.findById(req.params.id, function (err, performance) {
      if (!err) {
            res.jsonp(performance);
      } else {
            console.log(err);
      }
    });
}

//Edit a performance
module.exports.edit = function (req, res) {
	PerformanceTable.findOneAndUpdate({
            _id:req.params.id
        },
        {$set:{alternative:req.body.alternative, criterion:req.body.criterion, value:req.body.value}},
        {upsert:true},
        function(err,performance){
            if(err){
                console.log('error occured');
            }else{
                //console.log(performance);
                res.send(performance);
            }       
    });
}

//Delete a performance
module.exports.delete = function(req, res){
        PerformanceTable.remove({
            _id : req.params.id
        }, function(err, performance) {
            if (err) {
                throw new Error(err);
            }
            res.send(performance);

        });
}

//Delete all performances
exports.deleteAll = function(req, res) {
    // PerformanceTable.remove({}, function(err, performance) {
    //     if (err) {
    //         throw new Error(err);
    //     }
    //     res.send(performance);
    // });
    Project.findOne({ _id:req.params.id })
        .populate('performancetables')
        .exec(function (err, project) {
            if (err){
                res.send(err);
            }
            //var i = project.performancetables[0]._id;
            var performances = project.performancetables;
            //console.log(project.performancetables[0]._id);
            //project.performancetables[0].remove();
            // PerformanceTable.remove({
            //     _id : i
            // }, function(err, performance) {
            //     if (err) {
            //         //throw new Error(err);
            //     }
            //     //res.send(performance);

            // });
        
            Project.update({ _id:req.params.id }, {'$pullAll': {performancetables: performances }})
              .exec(function(err) {
                PerformanceTable.remove({ _id: { $in: performances }}, function(err, numberRemoved) {
                  // The identified performances are now removed.
                });
            });
            res.send('Delete all performances complete.');
    });
}
