var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var CriterionSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  direction: String,
  measure: String,
  weight: Number,
  rank: Number
});

module.exports = mongoose.model('Criterion', CriterionSchema);