var app = angular.module("projects-controller", ['ngRoute', 'ui.router', 'ngResource', 'ngSanitize', 'ngCsv', 'appRoutes', 'mainCtrl', 'ui']);

app.controller('projectsController', ['$scope', '$http', '$resource', '$state', '$stateParams', '$window', function ($scope, $http, $resource, $state, $stateParams, $window) {

var Projects = $resource('/api/projects');

var refresh = function(){
  $http.get('/api/projects').success(function(response) {
    console.log('I got the data I requested');
      $scope.user = response;
      $scope.projects = response.projects;
    });  
}

$http.get('/api/projects').success(function(data) {
  $scope.user = data;
  $scope.projects = data.projects;
  })
  .error(function(data) {
    console.log('Error: ' + data);
});


//Create project
$scope.createProject = function () {
  var i = $scope.user._id;
  var project = new Projects();
  project.name = $scope.project.name;
  $http.post('/api/projects/' + i, project).success(function(response) {
    refresh();
    $scope.project.name = '';
    refresh();
  });
}

//Delete project
$scope.deleteProject = function(project) {
  var i = $scope.user._id;
  var id = project._id;
  $http.delete('/api/project/' + i + '/' + id)
    .success(function() {
      console.log("success");
      var idx = $scope.projects.indexOf(project);
      if (idx >= 0) {
        $scope.projects.splice(idx, 1);
      }
      refresh();
    })
    .error(function() {
      var idx = $scope.projects.indexOf(project);
      if (idx >= 0) {
        $scope.projects.splice(idx, 1);
      }
      refresh();
    });
}

//Update the value and reset model
$scope.updateProject2 = function(project) {
  var i = project._id;
  project.name = $scope.model.name;
  $http.get('/api/project/' + i).success(function(response) {
        $scope.project = response;
    });

  $http.put('/api/project/' + i, project).success(function(response) {
    refresh();
    $scope.project.name = '';
  });
  $scope.reset();
}

// Create model that will contain the project to edit
$scope.model = {};

// gets the template to ng-include for a table row / item
$scope.getTemplate = function (project) {
  var i = project._id;
  if (i === $scope.model._id){ 
    return 'edit';
  }else{ 
    return 'display';
  }
}

$scope.editProject2 = function (project) {
  var i = project._id;
  $scope.model = angular.copy(project);
}

// Reset model
$scope.reset = function () {
  $scope.model = {};
}

$scope.openProject = function (project){
  var id = project._id;
  //$state.go('projects.html', {id: project._id});
  //console.log('-----> ID: '+t);
  //$state.go("alternative", { "id": id});
  $window.location.href = '/workspace.html?projectId='+id; 
}

}]);
