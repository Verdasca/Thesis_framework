var app = angular.module("results-controller", ['ngRoute', 'ngResource', 'ngSanitize', 'ngCsv', 'appRoutes', 'mainCtrl', 'ui']);

app.controller('resultsController', ['$scope', '$http', '$resource', function ($scope, $http, $resource) {

// $scope.reset = function () {
//   console.log('Executing reset function...');
//   $http.get('/importData').success(function(data) {
//     //$scope.criterions = data;
//     console.log('Reset of DB done...');
//     })
//     .error(function(data) {
//       console.log('Error: ' + data);
//   });  
// }

// $scope.create = function () {
//   console.log('Executing create function...');
//   $http.get('/createProject').success(function(data) {
//     //$scope.criterions = data;
//     console.log('Create folder and file done...');
//     })
//     .error(function(data) {
//       console.log('Error: ' + data);
//   });  
// }

$scope.create = function () {
  console.log('Executing create function...');
  $http.get('/createUserProject').success(function(data) {
    //$scope.criterions = data;
    console.log('Create user and project done...');
    })
    .error(function(data) {
      console.log('Error: ' + data);
  });  
}

$scope.get = function () {
  console.log('Executing create function...');
  $http.get('/createUserProjectGet').success(function(data) {
    //$scope.criterions = data;
    console.log('Get user and project done...');
    })
    .error(function(data) {
      console.log('Error: ' + data);
  });  
}

}]);

//Export results into a .csv file 
app.directive('exportResultsToCsv',function(){
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var el = element[0];
          element.bind('click', function(e){
            //var table = e.target.nextElementSibling;
            var table = document.getElementById("resultsTable");
            var csvString = '';
            for(var i=0; i<table.rows.length;i++){
                var rowData = table.rows[i].cells;
                for(var j=0; j<rowData.length; j++){ //number of columns to export
                  csvString = csvString + rowData[j].innerHTML + ",";
                }
                csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
                csvString = csvString + "\n";
          	}
            csvString = csvString.substring(0, csvString.length - 1);
            var a = $('<a/>', {
                style:'display:none',
                href:'data:application/octet-stream;base64,'+btoa(csvString),
                download:'electre_Tri_C_results.csv'
            }).appendTo('body')
            a[0].click()
            a.remove();
          });
      }
    }
});

// Load file result
function loadXMLDoc() {
  	var xmlhttp = new XMLHttpRequest();
  	xmlhttp.open("GET", "./out/assignments.xml", true);  
 	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	    		showResults(xmlhttp);
	    }
  	};
  xmlhttp.send();
}

// Get content from assignments.xml, which has the results
function showResults(xml) {
  var alternatives, categories, xmlDoc;
  // Get tbody from result table
  var table = document.getElementById("resultsTable").getElementsByTagName('tbody')[0];
  xmlDoc = xml.responseXML;
  // If file does not exist... show message error
  if(xmlDoc == null){
	var xmlhttp = new XMLHttpRequest();
    // If results file does not exist it means there are errors during the method execution, open the error message
  	xmlhttp.open("GET", "./out/messages.xml", true);  
    xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	    	showErrorMessage(xmlhttp);
	    }
  	};
  	xmlhttp.send();
  	return false;
  } 
  // Get all alternatives ids
  alternatives = xmlDoc.getElementsByTagName("alternativeID");
  // Get all categories min and max
  categories = xmlDoc.getElementsByTagName("categoryID");
  // Auxiliar to get the right categories for each alternative
  var categoryNum = 0;
  for (var i = 0; i< alternatives.length; i++) {
  	//Insert new row to the table and the results for each cell according to the alternative
  	var row = table.insertRow(i);
  	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	cell1.innerHTML = alternatives[i].childNodes[0].nodeValue;
	cell2.innerHTML = categories[categoryNum].childNodes[0].nodeValue;
	cell3.innerHTML = categories[categoryNum+1].childNodes[0].nodeValue;
	categoryNum = categoryNum + 2;
  }
}

// Get content from messages.xml
function showErrorMessage(xml){
	var errorMessage, txt, xmlDoc;
	var table = document.getElementById("resultsTable").getElementsByTagName('tbody')[0];
	xmlDoc = xml.responseXML;
	txt = '';
	errorMessage = xmlDoc.getElementsByTagName("text");
	for (var i = 0; i< errorMessage.length; i++) {
		txt += errorMessage[i].childNodes[0].nodeValue + ' <br/>';
	}
	table.innerHTML = txt;
}

