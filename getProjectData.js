var mongoose = require( 'mongoose' );
var Project = mongoose.model('Project');

exports.getAlternatives = function( req, res ) {
    Project
        .findOne({ _id: '576ab8a48eba049903fb9c9f' })
        .populate('alternatives') // only works if we pushed refs to children
        .exec(function (err, project) {
          if (err){
          	res.send(err);
          }
          //console.log(project._id);
          console.log(project);
          //console.log(project.alternatives);
          res.json(project);
    });
};

// exports.addAlternative = function(req, res){
// 	var project = new Project(req.body);
//     //project.alternatives.push(alternative);
//     project.save(function (err, result) {
//         res.json(result);
//     });

//     // project.save(function(err){
//     //     console.log(project.alternatives); // is just an object id
//     //     project.alternatives = user; // still only attaches the object id due to Mongoose magic
//     //     console.log(project._creator); // Again: is just an object id
//     //     // I really want book._creator to be a user without having to go back to the db ... any suggestions?
//     // });
// }

// module.exports.add = function (req, res) {
//   Project.findOne({ _id:req.params.id})
//     .populate('alternatives')
//     .exec(function (err, project) {
//       if (err){
//         res.send(err);
//       }

//       console.log('ID: '+ req.params.id);
//       console.log('-------------------------');
//       console.log('Project: ' + project);
//       console.log('-------------------------');
//       console.log('Req: '+ req);
//       console.log('-------------------------');
//       console.log('Alternatives: '+ req.alternatives);
//       console.log('-------------------------');
//       console.log('Body: '+ req.body);
//       console.log('-------------------------');
//       console.log('Pro alts: '+ req.body);
//       console.log('-------------------------');
//       console.log(project.alternatives);
//       console.log('-------------+++++++-----------');
//       project.alternatives.push(req);
//       project.save();
//       res.send('Get complete.'+project+' -'+req);
//   });
// }