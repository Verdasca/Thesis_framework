var Category = require('../models/category');
var mongoose = require( 'mongoose' );
var Project = mongoose.model('Project');

//Create a category
module.exports.create = function (req, res) {
	var category = new Category(req.body);
	category.save(function (err, result) {
	    //res.json(result);
	});
    // Associate/save the new category to the project
    Project.findOne({ _id:req.params.id})
    .populate('categories')
    .exec(function (err, project) {
      if (err){
        res.send(err);
      }
      // First push then save to do the association
      project.categories.push(category);
      project.save();
      res.send('Create category complete.');
    });
}

//Get all categories
module.exports.get = function (req, res) {
    // // use mongoose to get all categories in the database
    // Category.find(function(err, categories) {
    //     // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    //     if (err){
    //         res.send(err);    
    //     }
    //     res.json(categories); // return all categories in JSON format
    // });

    Project
        .findOne({ _id: req.params.id })
        .populate('categories') // only works if we pushed refs to children
        .exec(function (err, project) {
          if (err){
            res.send(err);
          }
          //console.log(project);
          res.json(project);
    });
}

module.exports.findById = function (req, res) {  
    return Category.findById(req.params.id, function (err, category) {
      if (!err) {
            res.jsonp(category);
      } else {
            console.log(err);
            res.send(err);
      }
    });
}

// Find category by rank
module.exports.findByRank = function (req, res) {  
  var categoryRank = req.params.rank;
  Project.findOne({ _id: req.params.id })
    .populate({path:'categories', match: { 'rank': categoryRank }})
      .exec(function(err, project) {
          //console.log(project.categories);
          //console.log(project.categories[0]._id);
          if (err){
            res.send(err);
          }
          res.send(project.categories);
  });
  //res.send('Got category requested.');   
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
                res.send(err);
            }else{
                //console.log(category);
                res.send(category);
            }       
    });
}

//Delete a category
module.exports.delete = function(req, res){
        // Category.remove({
        //     _id : req.params.id
        // }, function(err, category) {
        //     if (err) {
        //         throw new Error(err);
        //     }
        //     res.send(category);

        // });

  var category = req.params.categoryId;
  Project.update({ '_id' :req.params.id }, {$pull: { categories: category }} )
    .exec(function(err) {
      Category.remove({ '_id' : category }, function(err, numberRemoved) {
      // The identified category is now removed.
    });
  });
  res.send('Delete category complete.');   
}
