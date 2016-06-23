var Project = require('../models/project');

//Create a project
module.exports.create = function (req, res) {
	var project = new Project(req.body);
	project.save(function (err, result) {
	    res.json(result);
	});
}

//Get all projects
module.exports.get = function (req, res) {
    // use mongoose to get all projects in the database
    Project.find(function(err, projects) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err){
            res.send(err);    
        }
        res.json(projects); // return all projects in JSON format
    });
}

module.exports.findById = function (req, res) {  
    return Project.findById(req.params.id, function (err, project) {
      if (!err) {
            res.jsonp(project);
      } else {
            console.log(err);
      }
    });
}

//Delete a project
module.exports.delete = function(req, res){
        Project.remove({
            _id : req.params.id
        }, function(err, project) {
            if (err) {
                throw new Error(err);
            }
            res.send(project);

        });
}