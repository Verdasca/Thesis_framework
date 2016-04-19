app.controller('configurationsController', ['$scope', '$http', '$resource', function ($scope, $http, $resource) {

//Get the data from criterions in mongoDB
$http.get('/api/criterions').success(function(data) {
  $scope.criterions = data;
  })
  .error(function(data) {
    console.log('Error: ' + data);
});  

}]);