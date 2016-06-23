var mongoose = require( 'mongoose' );
var _ = require( 'lodash' );
var fs = require('fs');
//var foodData = require('./alternatives.json');
//var foodData = require('./altempty.json');
//var Food = require('./server/models/alternative');

exports.reset = function( req, res ) {
//module.exports = function() { 
    // get refs to the models we defined above

    // connect to our mongoDB database 
    //mongoose.connect(db.url);
    //mongoose.alternatives.remove({});

    //var foodData = require('./alternatives.json');
    var alternativesData = require('./users/alternatives.json');
    var Alternative = mongoose.model('Alternative');
    //mongoose.Food.find().remove();
    //Food.remove().exec();
    
    // clear all existing documents from the collections
    Alternative.find().remove();
    //Food.remove({});
    // populate the foods collection from json data
    // nothing fancy here as Food documents do not reference anything else
    for( var i = 0; i < alternativesData.length; i++ ) {
        new Alternative( alternativesData[ i ] ).save();
    }

    if(alternativesData.length == 0){
        Alternative.remove().exec();
    }

    res.send('Import complete.');
    // now that the collection is populated we iterate over it
    // Food.find( function( err, foods ) {
    //     var foodMap = {};

    //     // store _ids of Food documents that Mongo generated upon insert
    //     for( var i = 0; i < foods.length; i++ ) {
    //         var food = foods[i];
    //         // I am mapping the ids to the food names because the LogEntry
    //         // JSON data contained this field thanks to the original source
    //         // data's structure (a spreadsheet).
    //         // You could utilize a more sophisticated lookup here if necessary.
    //         foodMap[ food.name ] = food._id;
    //     }
    // } );

    //res.redirect( "/" );
};

exports.createProject = function(req, res){
    var dir = './users';

    // If folder does not exist
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    
    // Things do avoid when getting data from a collection
    var usersProjection = { 
        __v: false,
        _id: false
    };

    var Alternative = mongoose.model('Alternative');
    Alternative.find({}, usersProjection, function (err, alternatives) {
        if(err){
            return console.error(err);
        }else{
            console.log(alternatives);
            var data = JSON.stringify(alternatives);
            fs.writeFile(dir+'/alternatives.json', data, function(err) {});
        } 
    });  
    //fs.writeFile(dir+'/test.txt', data, function(err) {})
    res.send('Project created.');
};