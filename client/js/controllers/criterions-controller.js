var app = angular.module("criterions-controller", ['ngRoute', 'ngResource', 'ngSanitize', 'ngCsv', 'appRoutes', 'mainCtrl', 'ui']);

app.controller('criterionsController', ['$scope', '$http', '$resource', function ($scope, $http, $resource) {

var Criterions = $resource('/api/criterions');

var refresh = function(){
  $http.get('/api/criterions').success(function(response) {
    console.log('I got the data I requested');
        $scope.criterions = response;
    });  
}

//Get the data from criterions in mongoDB
$http.get('/api/criterions').success(function(data) {
  $scope.criterions = data;
  })
  .error(function(data) {
    console.log('Error: ' + data);
});  

//Create criterion
$scope.createCriterion = function () {
  var criterion = new Criterions();
  criterion.name = $scope.criterion.name;
  criterion.description = $scope.criterion.description;
  criterion.direction = $scope.criterion.direction;
  criterion.measure = $scope.criterion.measure;
  criterion.weight = $scope.criterion.weight;
  criterion.indifference = $scope.criterion.indifference;
  criterion.preference = $scope.criterion.preference;
  criterion.veto = $scope.criterion.veto;
  criterion.$save(function (result) {
    $scope.criterions.push(result);
    $scope.criterion.name = '';
    $scope.criterion.description = '';
    $scope.criterion.direction = '';
    $scope.criterion.measure = '';
    $scope.criterion.weight = '';
    $scope.criterion.indifference = '';
    $scope.criterion.preference = '';
    $scope.criterion.veto = '';
  })
}  

//Delete criterion
$scope.deleteCriterion = function(criterion) {
  var i = criterion._id;
  $http.delete('/api/criterion/' + i)
    .success(function(data) {
      var idx = $scope.criterions.indexOf(criterion);
      if (idx >= 0) {
        $scope.criterions.splice(idx, 1);
      }
    })
    .error(function(data) {
      //console.log('Error: ' + data);
      var idx = $scope.criterions.indexOf(criterion);
      if (idx >= 0) {
        $scope.criterions.splice(idx, 1);
      }
    });
}

//Edit criterion
$scope.editCriterion = function(criterion) {
  var i = criterion._id;
  console.log(i);
  $http.get('/api/criterion/' + i).success(function(response) {
        $scope.criterion = response;
    });
}

//Then save it or update it
$scope.updateCriterion = function() {
  console.log($scope.criterion._id);
  $http.put('/api/criterion/' + $scope.criterion._id, $scope.criterion).success(function(response) {
    refresh();
    $scope.criterion.name = '';
    $scope.criterion.description = '';
    $scope.criterion.direction = '';
    $scope.criterion.measure = '';
    $scope.criterion.weight = '';
    $scope.criterion.indifference = '';
    $scope.criterion.preference = '';
    $scope.criterion.veto = '';
  });
}

}]);

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
                download:'criterion.csv'
            }).appendTo('body')
            a[0].click()
            a.remove();
          });
      }
    }
});

//Export criterion into a .csv file without rank
app.directive('exportCriterionToCsvWithoutThresholds',function(){
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var el = element[0];
          element.bind('click', function(e){
            //var table = e.target.nextElementSibling;
            var table = document.getElementById("criterionTbl");
            var csvString = '';
            for(var i=0; i<table.rows.length;i++){
              if(i == 1){
                //Ignore save/update line
              }else{
                var rowData = table.rows[i].cells;
                for(var j=0; j<rowData.length-4;j++){ //number of columns to export
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
              if(i == 1){
                //Ignore save/update line
              }else{
                var rowData = table.rows[i].cells;
                for(var j=0; j<rowData.length-5;j++){ //number of columns to export
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
                download:'criterion.csv'
            }).appendTo('body')
            a[0].click()
            a.remove();
          });
      }
    }
});
