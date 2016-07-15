var mongoose = require('mongoose');

module.exports = mongoose.model('Criterion', {
  name: { type: String, required: true},
  description: {type : String, default: ''},
  direction: {type : String, default: ''},
  measure: {type : String, default: ''},
  weight: {type : Number, default: 0},
  rank: {type : Number, default: ''},
  indifference: {type : Number, default: 0},
  preference: {type : Number, default: 0},
  veto: {type : Number, default: 0}
});
