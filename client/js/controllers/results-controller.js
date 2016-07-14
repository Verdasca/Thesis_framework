var app = angular.module("results-controller", ['ngRoute', 'ui.router', 'ngResource', 'ngSanitize', 'ngCsv', 'appRoutes', 'mainCtrl', 'ui']);

app.controller('resultsController', ['$scope', '$http', '$resource', '$location', '$window', function ($scope, $http, $resource, $location, $window) {

$scope.projectID = $location.search().projectId;
$scope.username = $location.search().n;
$scope.criteriaDone = false;
$scope.alternativesDone = false;
$scope.configurationsDone = false;

// Hide loader
$('#loading').hide();

$http.get('/api/userFind/' + $scope.username).success(function(data) {
  $scope.user = data;
  })
  .error(function(data) {
    console.log('Error: ' + data);
});  

$http.get('/api/project/' + $scope.projectID).success(function(data) {
  $scope.project = data;
  $scope.results = data.results; 
  if($scope.project.criteria.length == 0){
      document.getElementById('sectionsCriteria').style.backgroundColor = '#ff3333';
      $scope.criteriaDone = false;
    }else{
      document.getElementById('sectionsCriteria').style.backgroundColor = '#6fdc6f';
      $scope.criteriaDone = true;
    }
    if($scope.project.alternatives.length == 0 || $scope.project.performancetables.length == 0){
      document.getElementById('sectionsAlternatives').style.backgroundColor = '#ff3333';
      $scope.alternativesDone = false;
    }else{
      document.getElementById('sectionsAlternatives').style.backgroundColor = '#6fdc6f';
      $scope.alternativesDone = true;
    }
    if($scope.project.profiletables.length == 0 || $scope.project.categories.length == 0 || $scope.project.parameters.length == 0){
      document.getElementById('sectionsConfigurations').style.backgroundColor = '#ff3333';
      $scope.configurationsDone = false;
    }else{
      document.getElementById('sectionsConfigurations').style.backgroundColor = '#6fdc6f';
      $scope.configurationsDone = true;
    }
    if($scope.criteriaDone && $scope.alternativesDone && $scope.configurationsDone){
      document.getElementById('buttonDiviz').disabled = false;
    } else{
      document.getElementById('buttonDiviz').disabled = true;
    }
  })
  .error(function(data) {
    console.log('Error: ' + data);
});

var refresh = function(){
  $http.get('/api/project/' + $scope.projectID).success(function(data) {
    $scope.project = data;
    $scope.results = data.results; 
    })
    .error(function(data) {
      console.log('Error: ' + data);
  });
}

// Change section and give the project id as argument
$scope.changeSection = function(name){
  var id = $scope.projectID;
  var sectionName = name;
  var n = $scope.username;
  var projectName = $scope.project.name;
  if(sectionName == 'divizServer'){
    // Show loader when execute button was clicked
    $('#loading').show();
    $window.location.href = 'http://vps288667.ovh.net:5010/electreTriC/?projectId='+id+'&n='+n+'&project='+projectName;     
  }else{
    $window.location.href = '/'+sectionName+'.html?projectId='+id+'&n='+n;  
  }
}

// Go back to project section
$scope.projectSection = function(){
  var id = $scope.user._id;
  $window.location.href = '/projects.html?userId='+id;  
}

//Update dateSet of the project when there are changes
$scope.updateProject = function() {
  $scope.project.dateSet = new Date();
  var project = $scope.project
  var i = $scope.project._id;

  $http.put('/api/project/' + i, project).success(function(response) {

  });
}

//Delete result
$scope.deleteResult = function(result, identifier) {
  var i = $scope.project._id;
  var id = identifier;
  $http.delete('/api/projects/' + i + '/' + id)
    .success(function() {
      console.log("success");
      var idx = $scope.results.indexOf(result);
      if (idx >= 0) {
        $scope.results.splice(idx, 1);
      }
      $scope.updateProject();
      refresh();
    })
    .error(function() {
      var idx = $scope.results.indexOf(result);
      if (idx >= 0) {
        $scope.results.splice(idx, 1);
      }
      $scope.updateProject();
      refresh();
    });
}

}]);

//Export results into a .csv file 
app.directive('exportResultsToCsv',function(){
    return {
      restrict: 'A',
      // Get the id of the result table to be exported
      scope: {
        values: '=values'
      },
      link: function (scope, element, attrs) {
        var el = element[0];
          element.bind('click', function(e){
            //var table = e.target.nextElementSibling;
            var table = document.getElementById("resultsTable"+scope.values);
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

// // Load file result
// function loadXMLDoc() {
//   	var xmlhttp = new XMLHttpRequest();
//   	xmlhttp.open("GET", "./out/assignments.xml", true);  
//  	xmlhttp.onreadystatechange = function() {
// 	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
// 	    		showResults(xmlhttp);
// 	    }
//   	};
//   xmlhttp.send();
// }

// // Get content from assignments.xml, which has the results
// function showResults(xml) {
//   var alternatives, categories, xmlDoc;
//   // Get tbody from result table
//   var table = document.getElementById("resultsTable").getElementsByTagName('tbody')[0];
//   xmlDoc = xml.responseXML;
//   // If file does not exist... show message error
//   if(xmlDoc == null){
// 	var xmlhttp = new XMLHttpRequest();
//     // If results file does not exist it means there are errors during the method execution, open the error message
//   	xmlhttp.open("GET", "./out/messages.xml", true);  
//     xmlhttp.onreadystatechange = function() {
// 	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
// 	    	showErrorMessage(xmlhttp);
// 	    }
//   	};
//   	xmlhttp.send();
//   	return false;
//   } 
//   // Get all alternatives ids
//   alternatives = xmlDoc.getElementsByTagName("alternativeID");
//   // Get all categories min and max
//   categories = xmlDoc.getElementsByTagName("categoryID");
//   // Auxiliar to get the right categories for each alternative
//   var categoryNum = 0;
//   for (var i = 0; i< alternatives.length; i++) {
//   	//Insert new row to the table and the results for each cell according to the alternative
//   	var row = table.insertRow(i);
//   	var cell1 = row.insertCell(0);
// 	var cell2 = row.insertCell(1);
// 	var cell3 = row.insertCell(2);
// 	cell1.innerHTML = alternatives[i].childNodes[0].nodeValue;
// 	cell2.innerHTML = categories[categoryNum].childNodes[0].nodeValue;
// 	cell3.innerHTML = categories[categoryNum+1].childNodes[0].nodeValue;
// 	categoryNum = categoryNum + 2;
//   }
// }

// // Get content from messages.xml
// function showErrorMessage(xml){
// 	var errorMessage, txt, xmlDoc;
// 	var table = document.getElementById("resultsTable").getElementsByTagName('tbody')[0];
// 	xmlDoc = xml.responseXML;
// 	txt = '';
// 	errorMessage = xmlDoc.getElementsByTagName("text");
// 	for (var i = 0; i< errorMessage.length; i++) {
// 		txt += errorMessage[i].childNodes[0].nodeValue + ' <br/>';
// 	}
// 	table.innerHTML = txt;
// }

