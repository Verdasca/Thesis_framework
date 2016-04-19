var mongoose = require('mongoose');

module.exports = mongoose.model('Criterion', {
  name: { type: String, required: true, unique: true},
  description: {type : String, default: ''},
  direction: {type : String, default: ''},
  measure: {type : String, default: ''},
  weight: {type : Number, default: ''},
  rank: {type : Number, default: ''}	
});
