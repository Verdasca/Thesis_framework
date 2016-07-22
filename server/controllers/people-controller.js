var Person = require('../models/person');
var mongoose = require( 'mongoose' );
var Project = mongoose.model('Project');

//Create a person
module.exports.create = function (req, res) {
	var person = new Person(req.body);
	person.save(function (err, result) {
	 //res.json(result);
  });
  // Associate/save the new person to the project
  Project.findOne({ _id:req.params.id })
  .populate('people')
  .exec(function (err, project) {
    if (err){
      res.send(err);
    }
    project.people.push(person);
    project.save();
    res.send('Create person complete.');
  });
}

//Get all people
module.exports.get = function (req, res) {
    Project
        .findOne({ _id: req.params.id })
        .populate('people') // only works if we pushed refs to children
        .exec(function (err, project) {
          if (err){
            res.send(err);
          }
          res.json(project);
    });
}

//Find person by id 
module.exports.findById = function (req, res) {  
    return Person.findById(req.params.id, function (err, person) {
      if (!err) {
            res.jsonp(person);
      } else {
            res.send(err);
      }
    });
}

//Edit a person
module.exports.edit = function (req, res) {
	Person.findOneAndUpdate({
            _id:req.params.id
        },
        {$set:{name:req.body.name, age:req.body.age}},
        {upsert:true},
        function(err,person){
            if(err){
                console.log('error occured');
                res.send(err);
            }else{
                res.send(person);
            }       
    });
}

//Delete a person
module.exports.delete = function(req, res){
  var person = req.params.personId;
  Project.update({ '_id' :req.params.id }, {$pull: { people: person }} )
    .exec(function(err) {
      Person.remove({ '_id' : person }, function(err, numberRemoved) {
      // The identified person is now removed.
    });
  });
  res.send('Delete person complete.');        
}

//Delete all people
exports.deleteAll = function(req, res) {
    Project.findOne({ _id:req.params.id })
        .populate('people')
        .exec(function (err, project) {
            if (err){
                res.send(err);
            }
            var person = project.people;
            Project.update({ _id:req.params.id }, {'$pullAll': {people: person }})
              .exec(function(err) {
                Person.remove({ _id: { $in: person }}, function(err, numberRemoved) {
                  // The identified people are now removed.
                });
            });
            res.send('Delete all people complete.');
    });
}