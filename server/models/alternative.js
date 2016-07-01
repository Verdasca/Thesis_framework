// grab the mongoose module
var mongoose = require('mongoose');

// define our alternative model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Alternative', {
    name : { type: String, required: true},
    description : {type : String, default: ''}
});

