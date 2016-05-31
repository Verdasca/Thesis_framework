var mongoose = require('mongoose');

module.exports = mongoose.model('ProfileTable', {
  action: { type : String, required: true, default: ''},
  criterion: {type : String, required: true, default: ''},
  value: {type : Number, required: true, default: ''}	
});