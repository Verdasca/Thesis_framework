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
	results: [{
		result: [{ 
			identifier : Number,
			name : { type: String, default: 'Results' },
			resultDate: { type: Date, default: Date.now},
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
			}]
		}]
	}]
});

