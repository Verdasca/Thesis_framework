var Parameter = require('../models/parameter');

//Create a parameter
module.exports.create = function (req, res) {
	var parameter = new Parameter(req.body);
	parameter.save(function (err, result) {
	    res.json(result);
	});
}

//Get all parameters
module.exports.get = function (req, res) {
    // use mongoose to get all parameters in the database
    Parameter.find(function(err, parameters) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err){
            res.send(err);    
        }
        res.json(parameters); // return all parameters in JSON format
    });
}

module.exports.findById = function (req, res) {  
    return Parameter.findById(req.params.id, function (err, parameter) {
      if (!err) {
            res.jsonp(parameter);
      } else {
            console.log(err);
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
            }else{
                console.log(parameter);
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
                throw new Error(err);
            }
            res.send(parameter);

        });
}
