var Category = require('../models/category');

//Create a category
module.exports.create = function (req, res) {
	var category = new Category(req.body);
	category.save(function (err, result) {
	    res.json(result);
	});
}

//Get all categories
module.exports.get = function (req, res) {
    // use mongoose to get all categories in the database
    Category.find(function(err, categories) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err){
            res.send(err);    
        }
        res.json(categories); // return all categories in JSON format
    });
}

module.exports.findById = function (req, res) {  
    return Category.findById(req.params.id, function (err, category) {
      if (!err) {
            res.jsonp(category);
      } else {
            console.log(err);
      }
    });
}

//Edit a category
module.exports.edit = function (req, res) {
	Category.findOneAndUpdate({
            _id:req.params.id
        },
        {$set:{name:req.body.name, rank:req.body.rank, action:req.body.action}},
        {upsert:true},
        function(err,category){
            if(err){
                console.log('error occured');
            }else{
                console.log(category);
                res.send(category);
            }       
    });
}

//Delete a category
module.exports.delete = function(req, res){
        Category.remove({
            _id : req.params.id
        }, function(err, category) {
            if (err) {
                throw new Error(err);
            }
            res.send(category);

        });
}
