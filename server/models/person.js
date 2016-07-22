// grab the mongoose module
var mongoose = require('mongoose');

// define our person model
module.exports = mongoose.model('Person', {
    name : { type: String, required: true},
    age : {type : Number, required: true}
});