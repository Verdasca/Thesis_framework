var mongoose = require('mongoose');

module.exports = mongoose.model('Category', {
  name: { type: String, required: true},
  rank: {type : Number, default: ''},
  action: {type : String, default: ''}	
});