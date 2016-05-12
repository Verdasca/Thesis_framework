var app = angular.module('sampleApp', ['ngRoute', 'ngResource', 'ngSanitize', 'ngCsv', 'appRoutes', 'mainCtrl', 'ui']);

//Export alternatives into a .csv file without the description column 
app.directive('exportAlternativesToCsvWithoutDescription',function(){
  	return {
    	restrict: 'A',
    	link: function (scope, element, attrs) {
    		var el = element[0];
	        element.bind('click', function(e){
	        	//var table = e.target.nextElementSibling;
	        	var table = document.getElementById("alternativeTbl");
	        	var csvString = '';
	        	for(var i=0; i<table.rows.length;i++){
	        		var rowData = table.rows[i].cells;
	        		for(var j=0; j<rowData.length-2;j++){ //number of columns to export
	        			csvString = csvString + rowData[j].innerHTML + ",";
	        		}
	        		csvString = csvString.substring(0,csvString.length); // -1); //delete the last values which is a coma (,)
	        		csvString = csvString + "\n";
			    }
	         	csvString = csvString.substring(0, csvString.length - 1);
	         	var a = $('<a/>', {
		            style:'display:none',
		            href:'data:application/octet-stream;base64,'+btoa(csvString),
		            download:'alternatives.csv'
		        }).appendTo('body')
		        a[0].click()
		        a.remove();
	        });
    	}
  	}
});


//Export alternatives into a .csv file 
app.directive('exportAlternativesToCsv',function(){
  	return {
    	restrict: 'A',
    	link: function (scope, element, attrs) {
    		var el = element[0];
	        element.bind('click', function(e){
	        	//var table = e.target.nextElementSibling;
	        	var table = document.getElementById("alternativeTbl");
	        	var csvString = '';
	        	for(var i=0; i<table.rows.length;i++){
	        		var rowData = table.rows[i].cells;
	        		for(var j=0; j<rowData.length-1;j++){ //number of columns to export
	        			csvString = csvString + rowData[j].innerHTML + ",";
	        		}
	        		csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
	        		csvString = csvString + "\n";
			    }
	         	csvString = csvString.substring(0, csvString.length - 1);
	         	var a = $('<a/>', {
		            style:'display:none',
		            href:'data:application/octet-stream;base64,'+btoa(csvString),
		            download:'alternatives.csv'
		        }).appendTo('body')
		        a[0].click()
		        a.remove();
	        });
    	}
  	}
});

//Export criterion into a .csv file 
app.directive('exportCriterionToCsv',function(){
  	return {
    	restrict: 'A',
    	link: function (scope, element, attrs) {
    		var el = element[0];
	        element.bind('click', function(e){
	        	//var table = e.target.nextElementSibling;
	        	var table = document.getElementById("criterionTbl");
	        	var csvString = '';
	        	for(var i=0; i<table.rows.length;i++){
	        		var rowData = table.rows[i].cells;
	        		for(var j=0; j<rowData.length-1;j++){ //number of columns to export
	        			csvString = csvString + rowData[j].innerHTML + ",";
	        		}
	        		csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
	        		csvString = csvString + "\n";
			    }
	         	csvString = csvString.substring(0, csvString.length - 1);
	         	var a = $('<a/>', {
		            style:'display:none',
		            href:'data:application/octet-stream;base64,'+btoa(csvString),
		            download:'criterion.csv'
		        }).appendTo('body')
		        a[0].click()
		        a.remove();
	        });
    	}
  	}
});

//Export criterion into a .csv file without rank
app.directive('exportCriterionToCsvWithoutRank',function(){
  	return {
    	restrict: 'A',
    	link: function (scope, element, attrs) {
    		var el = element[0];
	        element.bind('click', function(e){
	        	//var table = e.target.nextElementSibling;
	        	var table = document.getElementById("criterionTbl");
	        	var csvString = '';
	        	for(var i=0; i<table.rows.length;i++){
	        		var rowData = table.rows[i].cells;
	        		for(var j=0; j<rowData.length-2;j++){ //number of columns to export
	        			csvString = csvString + rowData[j].innerHTML + ",";
	        		}
	        		csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
	        		csvString = csvString + "\n";
			    }
	         	csvString = csvString.substring(0, csvString.length - 1);
	         	var a = $('<a/>', {
		            style:'display:none',
		            href:'data:application/octet-stream;base64,'+btoa(csvString),
		            download:'criterion.csv'
		        }).appendTo('body')
		        a[0].click()
		        a.remove();
	        });
    	}
  	}
});

//Export criterion into a .csv file without rank and weight
app.directive('exportCriterionToCsvWithoutWeight',function(){
  	return {
    	restrict: 'A',
    	link: function (scope, element, attrs) {
    		var el = element[0];
	        element.bind('click', function(e){
	        	//var table = e.target.nextElementSibling;
	        	var table = document.getElementById("criterionTbl");
	        	var csvString = '';
	        	for(var i=0; i<table.rows.length;i++){
	        		var rowData = table.rows[i].cells;
	        		for(var j=0; j<rowData.length-3;j++){ //number of columns to export
	        			csvString = csvString + rowData[j].innerHTML + ",";
	        		}
	        		csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
	        		csvString = csvString + "\n";
			    }
	         	csvString = csvString.substring(0, csvString.length - 1);
	         	var a = $('<a/>', {
		            style:'display:none',
		            href:'data:application/octet-stream;base64,'+btoa(csvString),
		            download:'criterion.csv'
		        }).appendTo('body')
		        a[0].click()
		        a.remove();
	        });
    	}
  	}
});
