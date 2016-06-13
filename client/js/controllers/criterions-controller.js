var app = angular.module("criterions-controller", ['ngRoute', 'ngResource', 'ngSanitize', 'ngCsv', 'appRoutes', 'mainCtrl', 'ui']);

app.controller('criterionsController', ['$scope', '$http', '$resource', '$timeout', function ($scope, $http, $resource, $timeout) {

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

//Update the value and reset model
$scope.updateCriterion2 = function(criterion) {
  var i = criterion._id;
  criterion.name = $scope.model.name;
  criterion.description = $scope.model.description;
  criterion.direction = $scope.model.direction;
  criterion.measure = $scope.model.measure;
  criterion.weight = $scope.model.weight;
  criterion.indifference = $scope.model.indifference;
  criterion.preference = $scope.model.preference;
  criterion.veto = $scope.model.veto;
  $http.get('/api/criterion/' + i).success(function(response) {
        $scope.criterion = response;
    });

  $http.put('/api/criterion/' + i, criterion).success(function(response) {
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
  $scope.reset();
}

// Create model that will contain the criterion to edit
$scope.model = {};

// gets the template to ng-include for a table row / item
$scope.getTemplate = function (criterion) {
  var i = criterion._id;
  //console.log('Do getTemplate on: '+i);
  //console.log('Id from model criterion copied: '+$scope.model.name);
  // if(i === null || i === 'undefined' || i === ''){
  //   return 'display';
  // }
  if (i === $scope.model._id){ 
    //console.log('Edit mode.');
    return 'edit';
  }else{ 
    return 'display';
  }
}

$scope.editCriterion2 = function (criterion) {
  var i = criterion._id;
  $scope.model = angular.copy(criterion);
  //console.log('Criterion: '+i+ ' copied.');
  //var c = angular.copy(criterion);
  //$scope.model.push(c);
  //$scope.model.push({id: i, name:criterion.name, description:criterion.description, direction:criterion.direction, measure:criterion.measure, weight:criterion.weight, indifference:criterion.indifference, preference:criterion.preference, veto:criterion.veto});
  //console.log($scope.model);
  //console.log($scope.model._id);
}

// Reset model
$scope.reset = function () {
  $scope.model = {};
}


$timeout( function(){ 
  $scope.criterionCopy = [];
  $scope.criterionCopy = $scope.criterions;
  var fixHelperModified = function(e, tr) {
    var $originals = tr.children();
    var $helper = tr.clone();
    $helper.children().each(function(index)
    {
      $(this).width($originals.eq(index).width())
    });
    return $helper;
};

$("#sort2 tbody").sortable({
    helper: fixHelperModified 
    
}).disableSelection();
}, 900);

}]);

function addRow(){
  var table = document.getElementById("sort2").getElementsByTagName('tbody')[0];
  var row = table.insertRow(0);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  cell1.innerHTML = "";
  cell2.innerHTML = 0;
  cell3.innerHTML = 'White Card';
}

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

