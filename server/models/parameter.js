var mongoose = require('mongoose');

module.exports = mongoose.model('Parameter', {
  credibility: { type: Number, required: true}	
});