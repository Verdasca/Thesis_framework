var app = angular.module("performances-controller", ['ngRoute', 'ngResource', 'ngSanitize', 'ngCsv', 'appRoutes', 'mainCtrl', 'ui']);

app.controller('performancesController', ['$scope', '$http', '$resource', function ($scope, $http, $resource) {

var Performances = $resource('/api/performances');

//Get the data from performances in mongoDB
$http.get('/api/performances').success(function(data) {
  $scope.performances = data;
  })
  .error(function(data) {
    console.log('Error: ' + data);
});

var refresh = function(){
  $http.get('/api/performances').success(function(response) {
    console.log('I got the data I requested');
        $scope.performances = response;
    });  
}  

//Create performance
$scope.createPerformance = function () {
  var performance = new Performances();
  performance.alternative = $scope.performance.alternative;
  performance.criterion = $scope.performance.criterion;
  performance.value = $scope.performance.value;
  performance.$save(function (result) {
    $scope.performances.push(result);
    $scope.performance.alternative = '';
    $scope.performance.criterion = '';
    $scope.performance.value = '';
  })
}

//Delete performance
$scope.deletePerformance = function(performance) {
  var i = performance._id;
  $http.delete('/api/performance/' + i)
    .success(function() {
      console.log("success");
      var idx = $scope.performances.indexOf(performance);
      if (idx >= 0) {
        $scope.performances.splice(idx, 1);
      }
    })
    .error(function() {
      //console.log('Error: ' + i);
      var idx = $scope.performances.indexOf(performance);
      if (idx >= 0) {
        $scope.performances.splice(idx, 1);
      }
    });
}

//Edit performance
$scope.editPerformance = function(performance) {
  var i = performance._id;
  console.log(i);
  $http.get('/api/performance/' + i).success(function(response) {
        $scope.performance = response;
    });
}

//Then save it or update it
$scope.updatePerformance = function() {
  console.log($scope.performance._id);
  $http.put('/api/performance/' + $scope.performance._id, $scope.performance).success(function(response) {
    refresh();
    $scope.performance.alternative = '';
    $scope.performance.criterion = '';
    $scope.performance.value = '';
  });
}

}]);

