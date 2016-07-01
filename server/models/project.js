var mongoose = require('mongoose');

module.exports = mongoose.model('Project', {
	name: { type: String, required: true},
	creationDate: { type: Date, default: Date.now},
	dateSet: { type: Date, default: Date.now},
	methodChosen: { type: String, required: true },
	numExecutions: { type: Number, default: 0 },
	alternatives : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Alternative' }],
	criteria : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Criterion' }],
  	categories : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  	parameters : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Parameter' }],
  	performancetables : [{ type: mongoose.Schema.Types.ObjectId, ref: 'PerformanceTable' }],
	profiletables : [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProfileTable' }]
});

