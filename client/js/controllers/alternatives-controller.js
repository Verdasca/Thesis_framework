var app = angular.module("alternatives-controller", ['ngRoute', 'ngResource', 'ngSanitize', 'ngCsv', 'appRoutes', 'mainCtrl', 'ui']);

app.controller('alternativesController', ['$scope', '$http', '$resource', function ($scope, $http, $resource) {

var Alternatives = $resource('/api/alternatives');
//var Projects = $resource('/getProjectData/alternatives');

var refresh = function(){
  $http.get('/api/alternatives').success(function(response) {
    console.log('I got the data I requested');
      $scope.project = response;
      $scope.alternatives = response.alternatives;
    });  
}

$http.get('/api/alternatives').success(function(data) {
  $scope.project = data;
  $scope.alternatives = data.alternatives;
  })
  .error(function(data) {
    console.log('Error: ' + data);
});


//Create alternative
$scope.createAlternative = function () {
  // var alternative = new Alternatives();
  // alternative.name = $scope.alternative.name;
  // alternative.description = $scope.alternative.description;
  // alternative.$save(function (result) {
  //   $scope.alternatives.push(result);
  //   $scope.alternative.name = '';
  //   $scope.alternative.description = '';
  // })
  var i = $scope.project._id;
  var alternative = new Alternatives();
  alternative.name = $scope.alternative.name;
  alternative.description = $scope.alternative.description;
  $http.post('/api/alternatives/'+i, alternative).success(function(response) {
    //$scope.project.alternatives.push(alternative);
    //$scope.alternatives.push(alternative);
    refresh();
    $scope.alternative.name = '';
    $scope.alternative.description = '';
  });

  //$scope.project.alternatives.push(alternative);
  //$scope.project.save();
  // var i = $scope.project._id;
  // $http.post('/getProjectData/'+ i, alternative).success(function(response) {
  //   $scope.project.alternatives.push(alternative);
  // });

  // var project = new Projects();
  // //project.alternatives.push(alternative);
  // project.$save(function (result) {
  //   $scope.project.alternatives.push(alternative);
  // })
}

//Delete alternative
$scope.deleteAlternative = function(alternative) {
  var i = alternative._id;
  $http.delete('/api/alternative/' + i)
    .success(function() {
      console.log("success");
      var idx = $scope.alternatives.indexOf(alternative);
      if (idx >= 0) {
        $scope.alternatives.splice(idx, 1);
      }
    })
    .error(function() {
      //console.log('Error: ' + i);
      var idx = $scope.alternatives.indexOf(alternative);
      if (idx >= 0) {
        $scope.alternatives.splice(idx, 1);
      }
    });
}

//Edit alternative
$scope.editAlternative = function(alternative) {
  var i = alternative._id;
  console.log(i);
  $http.get('/api/alternative/' + i).success(function(response) {
        $scope.alternative = response;
    });
}

//Then save it or update it
$scope.updateAlternative = function() {
  console.log($scope.alternative._id);
  $http.put('/api/alternative/' + $scope.alternative._id, $scope.alternative).success(function(response) {
    refresh();
    $scope.alternative.name = '';
    $scope.alternative.description = '';
  });
}

//Update the value and reset model
$scope.updateAlternative2 = function(alternative) {
  var i = alternative._id;
  alternative.name = $scope.model.name;
  alternative.description = $scope.model.description;
  $http.get('/api/alternative/' + i).success(function(response) {
        $scope.alternative = response;
    });

  $http.put('/api/alternative/' + i, alternative).success(function(response) {
    refresh();
    $scope.alternative.name = '';
    $scope.alternative.description = '';
  });
  $scope.reset();
}

// Create model that will contain the alternative to edit
$scope.model = {};

// gets the template to ng-include for a table row / item
$scope.getTemplate = function (alternative) {
  var i = alternative._id;
  if (i === $scope.model._id){ 
    return 'edit';
  }else{ 
    return 'display';
  }
}

$scope.editAlternative2 = function (alternative) {
  var i = alternative._id;
  $scope.model = angular.copy(alternative);
}

// Reset model
$scope.reset = function () {
  $scope.model = {};
}

}]);

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
              if(i == 1){
                //Ignore save/update line
              }else{
                var rowData = table.rows[i].cells;
                for(var j=0; j<rowData.length-2;j++){ //number of columns to export
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
                download:'alternatives.csv'
            }).appendTo('body')
            a[0].click()
            a.remove();
          });
      }
    }
});


