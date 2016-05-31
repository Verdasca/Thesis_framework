var Criterion = require('../models/criterion');

//Create a criterion
module.exports.create = function (req, res) {
	var criterion = new Criterion(req.body);
	criterion.save(function (err, result) {
	    res.json(result);
	});
}

//Get all criterions
module.exports.get = function (req, res) {
    // use mongoose to get all criterions in the database
    Criterion.find(function(err, criterions) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err){
            res.send(err);    
        }
        res.json(criterions); // return all criteria in JSON format
    });
}

module.exports.findById = function (req, res) {  
    return Criterion.findById(req.params.id, function (err, criterion) {
      if (!err) {
            res.jsonp(criterion);
      } else {
            console.log(err);
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
            }else{
                console.log(criterion);
                res.send(criterion);
            }       
    });
}

//Delete an criterion
module.exports.delete = function(req, res){
        Criterion.remove({
            _id : req.params.id
        }, function(err, criterion) {
            if (err) {
                throw new Error(err);
            }
            res.send(criterion);

        });
}