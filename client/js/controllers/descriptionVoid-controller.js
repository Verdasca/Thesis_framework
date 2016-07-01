var app = angular.module("descriptionVoid-controller", ['ngRoute', 'ui.router', 'ngResource', 'ngSanitize', 'appRoutes', 'mainCtrl', 'ui']);

app.controller('descriptionVoidController', ['$scope', '$http', '$resource', '$location', '$window', function ($scope, $http, $resource, $location, $window) {

$scope.projectID = $location.search().projectId;
$scope.username = $location.search().n

$http.get('/api/project/' + $scope.projectID).success(function(data) {
  $scope.project = data;
  })
  .error(function(data) {
    console.log('Error: ' + data);
});

$http.get('/api/userFind/' + $scope.username).success(function(data) {
  $scope.user = data;
  })
  .error(function(data) {
    console.log('Error: ' + data);
});  

// Change section and give the project id as argument
$scope.changeSection = function(name){
  var id = $scope.projectID;
  var sectionName = name;
  var n = $scope.username;
  // if(sectionName == 'divizServer'){
  //   $window.location.href = 'http://vps288667.ovh.net:5010?projectId='+id+'&n='+n;    
  // }else{
    $window.location.href = '/'+sectionName+'.html?projectId='+id+'&n='+n;  
  //}
}

// Go back to project section
$scope.projectSection = function(){
  var id = $scope.user._id;
  $window.location.href = '/projects.html?userId='+id;  
}

}]);