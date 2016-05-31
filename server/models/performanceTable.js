var mongoose = require('mongoose');

module.exports = mongoose.model('PerformanceTable', {
  alternative: { type : String, required: true, default: ''},
  criterion: {type : String, required: true, default: ''},
  value: {type : Number, required: true, default: ''}	
});