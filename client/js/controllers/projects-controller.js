var app = angular.module("projects-controller", ['ngRoute', 'ui.router', 'ngResource', 'ngSanitize', 'ngCsv', 'appRoutes', 'mainCtrl', 'ui']);

app.controller('projectsController', ['$scope', '$http', '$resource', '$state', '$stateParams', '$window', '$location', function ($scope, $http, $resource, $state, $stateParams, $window, $location) {

var Projects = $resource('/api/projects');

$scope.userId = $location.search().userId;

$scope.data = {
    repeatSelect: 'notSelected',
    availableOptions: [
      {id: 'notSelected', name: '<-- Select method for the project -->'},
      {id: 'Electre Tri-C', name: 'Electre Tri-C'},
      {id: 'Order By', name: 'Order By'},
      {id: 'Void', name: 'Void'}
    ],
};

var refresh = function(){
  $http.get('/api/projects/' + $scope.userId ).success(function(data) {
    console.log('I got the data I requested');
      $scope.user = data;
      $scope.projects = data.projects;
    });  
}

$http.get('/api/projects/' + $scope.userId ).success(function(data) {
  $scope.user = data;
  $scope.projects = data.projects;
  })
  .error(function(data) {
    console.log('Error: ' + data);
});


//Create project
$scope.createProject = function (nameValid) {
  if($scope.data.repeatSelect == 'notSelected'){
    //If method was not selected don't create project
    document.getElementById("noMethod").style.display = 'block';
    document.getElementById("noName").style.display = 'none';
  }else if(!nameValid){
    //If name empty don't create project
    document.getElementById("noName").style.display = 'block';
    document.getElementById("noMethod").style.display = 'none';
  }else{
    document.getElementById("noMethod").style.display = 'none';
    document.getElementById("noName").style.display = 'none';
    var i = $scope.user._id;
    var project = new Projects();
    project.name = $scope.project.name; 
    project.methodChosen = $scope.data.repeatSelect;
    $http.post('/api/projects/' + i, project).success(function(response) {
      $scope.project.name = '';
      refresh();
    });
  }
}

//Delete project
$scope.deleteProject = function(project) {
  var i = $scope.user._id;
  var id = project._id;
  if(project.methodChosen == 'Order By'){
    // Delete project folder
    $http.get('/deleteProject/' + id ).success(function(data) {
    })
  }
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
  project.dateSet = new Date();
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

// Open project and go to the right section according to the method chosen
$scope.openProject = function (project){
  var id = project._id;
  var method = project.methodChosen;
  var username = $scope.user.username;
  if(method == 'Order By'){
    // Create project folder
    $http.get('/createProject/' + id ).success(function(data) {
    })
  }
  switch (method) {
    case 'Electre Tri-C':
      $window.location.href = '/description.html?projectId='+id+'&n='+username; 
      break;
    case 'Order By':
      $window.location.href = '/description_orderBy.html?projectId='+id+'&n='+username; 
      break;
    case 'Void':
      $window.location.href = '/descriptionVoid.html?projectId='+id+'&n='+username; 
      break;
    default:
      break;
  }
  //$window.location.href = '/description.html?projectId='+id+'&n='+username; 
}

// Clone/duplicate a project with a different name but with the same data
$scope.cloneProject = function(project){
  var i = $scope.user._id;
  var id = project._id;
  $http.get('/api/cloneproject/' + i + '/' + id).success(function(data) {
    refresh();
    })
    .error(function(data) {
      console.log('Error: ' + data);
      refresh();
  });
}

}]);
