var app = angular.module("description-controller", ['ngRoute', 'ui.router', 'ngResource', 'ngSanitize', 'appRoutes', 'mainCtrl', 'ui']);

app.controller('descriptionController', ['$scope', '$http', '$resource', '$location', '$window', function ($scope, $http, $resource, $location, $window) {

$scope.projectID = $location.search().projectId;
$scope.username = $location.search().n

$http.get('/api/project/' + $scope.projectID).success(function(data) {
    $scope.project = data;
    if($scope.project.criteria.length == 0){
      document.getElementById('sectionsCriteria').style.backgroundColor = '#ff3333';
    }else{
      document.getElementById('sectionsCriteria').style.backgroundColor = '#6fdc6f';
    }
    if($scope.project.alternatives.length == 0){
      document.getElementById('sectionsAlternatives').style.backgroundColor = '#ff3333';
    }else{
      document.getElementById('sectionsAlternatives').style.backgroundColor = '#6fdc6f';
    }
    if($scope.project.performancetables.length == 0){
      document.getElementById('sectionsPerformances').style.backgroundColor = '#ff3333';
    }else{
      document.getElementById('sectionsPerformances').style.backgroundColor = '#6fdc6f';
    }
    if($scope.project.profiletables.length == 0 || $scope.project.categories.length == 0 || $scope.project.parameters.length == 0){
      document.getElementById('sectionsConfigurations').style.backgroundColor = '#ff3333';
    }else{
      document.getElementById('sectionsConfigurations').style.backgroundColor = '#6fdc6f';
    }
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
  var projectName = $scope.project.name;
  if(sectionName == 'divizServer'){
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

}]);