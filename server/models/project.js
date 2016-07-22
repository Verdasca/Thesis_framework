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
	profiletables : [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProfileTable' }],
	people : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Person' }],
	orderType : { type: String, default: '' },
	decimals : { type: Number, default: 0 },
	ratioOption : { type: String, default: '' },
	ratioZ : { type: Number, default: 1 },
	ratioZMax : { type: Number, default: 1 },
	ratioZMin : { type: Number, default: 1 },
	ratioZInterval : { type: Number, default: 1 },
	ratioZ1 : { type: Number, default: 1 },
	ratioZ2 : { type: Number, default: 1 },
	ratioZ3 : { type: Number, default: 1 },
	results: [{
		identifier : Number,
		name : { type: String, default: 'Results' },
		methodError : { type: String, default: 'Everything OK. No errors.' },
		resultDate: { type: Date, default: Date.now},
		orderPeople : String,
		resultValues: [{ 
			alternativeID: String, 
  			minCategory: String,
  			maxCategory: String
		}],
		criterionValues: [{ 
			criterionName: String, 
			criterionDescription: {type : String, default: ''}, 
			direction: String, 
			measure: {type : String, default: ''},
  			weight: Number,
  			criterionRank: {type : Number, default: ''},
  			indifference: Number, 
  			preference: Number,
 			veto: Number	 
  		}],
		alternativeValues: [{ 
			alternativeName : String, 
			alternativeDescription : {type : String, default: ''} 
		}],
		categoryValues: [{  
			categoryName: String, 
  			categoryRank: Number, 
  			categoryAction: String	
		}],
		parameterValues: [{  
			credibility: Number
		}],
		performanceValues: [{ 
			performanceAlternative: String,
  			performanceCriterion: String, 
  			performanceValue: Number
		}],
		profileValues: [{  
			profileAction: String, 
  			profileCriterion: String, 
  			profileValue: Number
		}],
		personValues: [{  
			personName: String,  
  			personAge: Number
		}]
	}]
});

