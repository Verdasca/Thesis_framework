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
  criterion.rank = $scope.criterion.rank;
  criterion.$save(function (result) {
    $scope.criterions.push(result);
    $scope.criterion.name = '';
    $scope.criterion.description = '';
    $scope.criterion.direction = '';
    $scope.criterion.measure = '';
    $scope.criterion.weight = '';
    $scope.criterion.rank = '';
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
  });
}

}]);

// $scope.list = ["one", "two", "thre", "four", "five", "six"];


// angular.element(document).ready(function() {
//   angular.bootstrap(document, ['criterionsController']);
// });