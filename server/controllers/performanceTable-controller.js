var PerformanceTable = require('../models/performanceTable');

//Create a performanceTable
module.exports.create = function (req, res) {
	var performance = new PerformanceTable(req.body);
	performance.save(function (err, result) {
	    res.json(result);
	});
}

//Get all performances
module.exports.get = function (req, res) {
    // use mongoose to get all performances in the database
    PerformanceTable.find(function(err, performances) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err){
            res.send(err);    
        }
        res.json(performances); // return all performances in JSON format
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
                console.log(performance);
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
        PerformanceTable.remove({}, function(err, performance) {
            if (err) {
                throw new Error(err);
            }
            res.send(performance);
        });
}
