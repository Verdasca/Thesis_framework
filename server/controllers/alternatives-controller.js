var Alternative = require('../models/alternative');

//Create an alternative
module.exports.create = function (req, res) {
	var alternative = new Alternative(req.body);
	alternative.save(function (err, result) {
	    res.json(result);
	});
}

// module.exports.list = function (req, res) {
// 	Alternative.find({}, function (err, results) {
//     	res.json(results);
//   	});
// }

//Get all alternatives
module.exports.get = function (req, res) {
    // use mongoose to get all alternatives in the database
    Alternative.find(function(err, alternatives) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err){
            res.send(err);    
        }
        res.json(alternatives); // return all alternatives in JSON format
    });
}

module.exports.findById = function (req, res) {  
    return Alternative.findById(req.params.id, function (err, alternative) {
      if (!err) {
            res.jsonp(alternative);
      } else {
            console.log(err);
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
            }else{
                console.log(alternative);
                res.send(alternative);
            }       
    });
}


// module.exports.delete = function(req, res){
//   Alternative.findByIdAndRemove(req.params.id, function(err, alternative) {
//     if (err) {
//       throw new Error(err);
//     }
//     res.send(alternative);
//   });
// }

// module.exports.delete = function(req, res){
//     Alternative.remove({_id: req.params.id}, function(err){
//         res.json({result: err ? 'error' : 'ok'});
//     })
// }

//Delete an alternative
module.exports.delete = function(req, res){
        Alternative.remove({
            _id : req.params.id
        }, function(err, alternative) {
            if (err) {
                throw new Error(err);
            }
            res.send(alternative);

        });
}