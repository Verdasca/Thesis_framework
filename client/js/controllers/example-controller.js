var app = angular.module("example-controller", ['ngRoute', 'ui.router', 'ngResource', 'ngSanitize', 'appRoutes', 'ui']);

app.controller('exampleController', ['$scope', '$http', '$resource', '$location', '$window', function ($scope, $http, $resource, $location, $window) {

// Get project Id and username
$scope.projectID = $location.search().projectId;
$scope.username = $location.search().n;
// Booleans to check if all data set required are done, if alll are done the execute button can be clicked
//$scope.dataDone = false;

// Hide loader
$('#loading').hide();
$('#importing').hide();

$http.get('/api/userFind/' + $scope.username).success(function(data) {
  $scope.user = data;
  })
  .error(function(data) {
    console.log('Error: ' + data);
});  

$http.get('/api/project/' + $scope.projectID).success(function(data) {
  $scope.project = data;
  // See if data set is done or not, if not cannot execute method
  // if($scope.project.data.length == 0){
  //   document.getElementById('sectionsData').style.backgroundColor = '#ff3333';
  //   $scope.dataDone = false;
  // }else{
  //   document.getElementById('sectionsData').style.backgroundColor = '#6fdc6f';
  //   $scope.dataDone = true;
  // }
  // if($scope.dataDone){
  //   document.getElementById('buttonDiviz').disabled = false;
  // } else{
  //   document.getElementById('buttonDiviz').disabled = true;
  // }
  })
  .error(function(data) {
    console.log('Error: ' + data);
});

var refresh = function(){
  $http.get('/api/project/' + $scope.projectID).success(function(data) {
    $scope.project = data; 
    })
    .error(function(data) {
      console.log('Error: ' + data);
  });
}

// Create model that will contain the alternative to edit
$scope.model = {};

// gets the template to ng-include for a table row / item
$scope.getTemplate = function (data) {
  var i = data._id;
  if (i === $scope.model._id){ 
    return 'edit';
  }else{ 
    return 'display';
  }
}

$scope.editData2 = function (data) {
  var i = data._id;
  $scope.model = angular.copy(data);
}

// Reset model
$scope.reset = function () {
  $scope.model = {};
}

// Change section and give the project id as argument
$scope.changeSection = function(name){
  var id = $scope.projectID;
  var sectionName = name;
  var n = $scope.username;
  var projectName = $scope.project.name;
  // The divizServer is only used if the method belongs to the Diviz server methods
  //if(sectionName == 'divizServer'){
    // Show loader when execute button was clicked
    $('#loading').show();
    //$window.location.href = 'http://vps288667.ovh.net:5010/electreTriC/?projectId='+id+'&n='+n+'&project='+projectName;     
  //}else{
    $window.location.href = '/'+sectionName+'.html?projectId='+id+'&n='+n;  
  //}
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

// Update status to see if the execute button can be pressed
var checkStatus = function(){
  // See if data set is done or not, if not cannot execute method
  // if($scope.project.data.length == 0){
  //   document.getElementById('sectionsData').style.backgroundColor = '#ff3333';
  //   $scope.dataDone = false;
  // }else{
  //   document.getElementById('sectionsData').style.backgroundColor = '#6fdc6f';
  //   $scope.dataDone = true;
  // }
  // if($scope.dataDone){
  //   document.getElementById('buttonDiviz').disabled = false;
  // } else{
  //   document.getElementById('buttonDiviz').disabled = true;
  // }
}

}]);

// Function example used to export data from a table into csv, can change function to export only certain rows or columns 
//Export data into a .csv file 
app.directive('exportToCsv',function(){
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var el = element[0];
          element.bind('click', function(e){
            //var table = e.target.nextElementSibling;
            var table = document.getElementById("dataTbl");
            var csvString = '';
            for(var i=0; i<table.rows.length;i++){
              if(i == 1){
                //Ignore save/update line
              }else{
                var rowData = table.rows[i].cells;
                for(var j=0; j<rowData.length-1;j++){ //number of columns to export
                  csvString = csvString + rowData[j].innerHTML + ",";
                }
                csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
                csvString = csvString + "\n";
              }
          }
            csvString = csvString.substring(0, csvString.length - 1);
            var a = $('<a/>', {
                style:'display:none',
                href:'data:application/octet-stream;base64,'+btoa(csvString),
                download:'data.csv'
            }).appendTo('body')
            a[0].click()
            a.remove();
          });
      }
    }
});

// Function example to export the results
//Export results into a .csv file 
app.directive('exportResultsToCsv',function(){
    return {
      restrict: 'A',
      // Get the id of the result table to be exported
      scope: {
        values: '=values',
        tableName: '@tbl'
      },
      link: function (scope, element, attrs) {
        var el = element[0];
          element.bind('click', function(e){
            var fileName = "";
            switch(scope.tableName) {
              case "resultsTable":
                  fileName = 'method_name_results.csv';
                  break;
              case "dataTable":
                  fileName = 'data.csv';
                  break;
            }
            var table = document.getElementById(scope.tableName+scope.values);
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
                download: fileName
            }).appendTo('body')
            a[0].click()
            a.remove();
          });
      }
    }
});
