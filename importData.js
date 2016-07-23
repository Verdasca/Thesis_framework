var mongoose = require( 'mongoose' );
var _ = require( 'lodash' );
//var fs = require('fs');
var fs = require('fs-extra')

// Create empty folder with the name of the project _id when the user creates a new project
exports.createProject = function(req, res){
    var dir = './Projects';
    var name = req.params.id;
    var dirName = dir + '/'+ name;
    // If folder does not exist, create the folder plus data and result folder
    if (!fs.existsSync(dirName)){
        fs.mkdirSync(dirName);
        fs.mkdirSync(dirName+'/data');
        fs.mkdirSync(dirName+'/results');
    }
    res.send('Project folder created.');
};

// Delete project folder when the user deletes the entire project
exports.deleteProject = function(req, res){
    var dir = './Projects';
    var name = req.params.id;
    var dirName = dir + '/'+ name;
    fs.removeSync(dirName);
    res.send('Project folder deleted.');
};

// Get the project's data
exports.getData = function(req, res){
    var dir = './Projects';
    var name = req.params.id;
    var dirName = dir + '/'+ name;
    if (fs.existsSync(dirName+'/data/data.json')){
        //var data = require(dirName+'/data/data.json');
        //var data = fs.readFile(dirName+'/data/data.json');
        fs.readFile(dirName+'/data/data.json', 'utf8', function(err, data) {  
            if (err) throw err;
            res.send(data);
        });
        //res.json(data);
    }else{
        res.send('No data...');
    }
};

// Save the project's data
exports.saveData = function(req, res){
    //console.log(req.body);
    var dir = './Projects';
    var name = req.params.id;
    var dirName = dir + '/'+ name + '/data';
    fs.writeJson(dirName+'/data.json', req.body, function (err) {
      //console.log(err)
    })
    res.send('Data saved.');
};

// Save the results
exports.saveDataResults = function(req, res){
    console.log(req.body);
    var dir = './Projects';
    var name = req.params.id;
    var number = req.params.nameId;
    var jsonFile = 'data'+number+'.json'
    var dirName = dir + '/'+ name + '/results';
    fs.writeJson(dirName+'/'+jsonFile, req.body, function (err) {
      console.log(err)
    })
    res.send('Result saved.');
};

// Get result
exports.getDataResult = function(req, res){
    var dir = './Projects';
    var name = req.params.id;
    var number = req.params.nameId;
    var dirName = dir + '/'+ name;
    if (fs.existsSync(dirName+'/results')){
        fs.readFile(dirName+'/results/data'+number+'.json', 'utf8', function(err, data) {  
            if (err) throw err;
            res.send(data);
        });
        //res.json(data);
    }else{
        res.send('No data...');
    }
};

// Delete result file
exports.deleteResult = function(req, res){
    var dir = './Projects';
    var name = req.params.id;
    var number = req.params.nameId;
    var dirName = dir + '/'+ name;
    fs.removeSync(dirName+'/results/data'+number+'.json');
    res.send('Result file deleted.');
};

// exports.createProject = function(req, res){
//     var dir = './Projects';
//     // If folder does not exist
//     if (!fs.existsSync(dir)){
//         fs.mkdirSync(dir);
//     }
    
//     // Things do avoid when getting data from a collection
//     var usersProjection = { 
//         __v: false,
//         _id: false
//     };

//     var Alternative = mongoose.model('Alternative');
//     Alternative.find({}, usersProjection, function (err, alternatives) {
//         if(err){
//             return console.error(err);
//         }else{
//             console.log(alternatives);
//             var data = JSON.stringify(alternatives);
//             fs.writeFile(dir+'/alternatives.json', data, function(err) {});
//         } 
//     });  
//     //fs.writeFile(dir+'/test.txt', data, function(err) {})
//     res.send('Project created.');
// };
// Save json data on DB
// exports.reset = function( req, res ) {
// //module.exports = function() { 
//     // get refs to the models we defined above

//     // connect to our mongoDB database 
//     //mongoose.connect(db.url);
//     //mongoose.alternatives.remove({});

//     //var foodData = require('./alternatives.json');
//     var alternativesData = require('./users/alternatives.json');
//     var Alternative = mongoose.model('Alternative');
//     //mongoose.Food.find().remove();
//     //Food.remove().exec();
    
//     // clear all existing documents from the collections
//     Alternative.find().remove();
//     //Food.remove({});
//     // populate the foods collection from json data
//     // nothing fancy here as Food documents do not reference anything else
//     for( var i = 0; i < alternativesData.length; i++ ) {
//         new Alternative( alternativesData[ i ] ).save();
//     }

//     if(alternativesData.length == 0){
//         Alternative.remove().exec();
//     }

//     res.send('Import complete.');
//     // now that the collection is populated we iterate over it
//     // Food.find( function( err, foods ) {
//     //     var foodMap = {};

//     //     // store _ids of Food documents that Mongo generated upon insert
//     //     for( var i = 0; i < foods.length; i++ ) {
//     //         var food = foods[i];
//     //         // I am mapping the ids to the food names because the LogEntry
//     //         // JSON data contained this field thanks to the original source
//     //         // data's structure (a spreadsheet).
//     //         // You could utilize a more sophisticated lookup here if necessary.
//     //         foodMap[ food.name ] = food._id;
//     //     }
//     // } );

//     //res.redirect( "/" );
// };