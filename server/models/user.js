var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
  username: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  name: { type : String, default: ''},
  projects : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
});

