var mongoose = require( 'mongoose' );

exports.create = function( req, res ) {
    var User = mongoose.model('User');
    var Project = mongoose.model('Project');

    var admin = new User({
        username: "admin",
        password: "admin",
        name: "User Example Test"
    });

    var project = new Project({
        name: "Project 1 Test"
        });
      
    project.save(function (err) {
        if (err) return handleError(err);
        // thats it!
    });

    admin.projects.push(project);

    admin.save(function (err) {
      if (err) return handleError(err);

    });


    res.send('Create complete.');
};

exports.get = function( req, res ) {
    var User = mongoose.model('User');

    User
        .findOne({ username: 'admin' })
        .populate('projects') // only works if we pushed refs to children
        .exec(function (err, user) {
          if (err) return handleError(err);
          console.log(user);
    })

    res.send('Get complete.');
};

