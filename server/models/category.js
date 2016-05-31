var mongoose = require('mongoose');

module.exports = mongoose.model('Category', {
  name: { type: String, required: true, unique: true},
  rank: {type : Number, default: ''},
  action: {type : String, default: ''}	
});