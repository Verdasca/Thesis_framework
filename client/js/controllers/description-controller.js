var app = angular.module("description-controller", ['ngRoute', 'ui.router', 'ngResource', 'ngSanitize', 'appRoutes', 'ui']);

app.controller('descriptionController', ['$scope', '$http', '$resource', '$location', '$window', function ($scope, $http, $resource, $location, $window) {

$scope.projectID = $location.search().projectId;
$scope.username = $location.search().n
$scope.criteriaDone = false;
$scope.alternativesDone = false;
$scope.configurationsDone = false;

// Hide loader
$('#importing').hide();

$http.get('/api/project/' + $scope.projectID).success(function(data) {
    $scope.project = data;
    $http.get('/api/alternatives/' + $scope.projectID).success(function(data) {
      $scope.alternatives = data.alternatives;
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });  
    $http.get('/api/criterions/' + $scope.projectID).success(function(data) {
      $scope.criteria = data.criteria;
      })
      .error(function(data) {
        console.log('Error: ' + data);
    }); 
    $http.get('/api/categories/' + $scope.projectID).success(function(data) {
      $scope.categories = data.categories;
      })
      .error(function(data) {
        console.log('Error: ' + data);
    }); 
    $http.get('/api/parameters/' + $scope.projectID).success(function(data) {
      $scope.parameters = data.parameters;
      })
      .error(function(data) {
        console.log('Error: ' + data);
    }); 
    $http.get('/api/performances/' + $scope.projectID).success(function(data) {
      $scope.performancetables = data.performancetables;
      })
      .error(function(data) {
        console.log('Error: ' + data);
    });
    $http.get('/api/profiles/' + $scope.projectID).success(function(data) {
      $scope.profiletables = data.profiletables;
      })
      .error(function(data) {
        console.log('Error: ' + data);
    });
    if($scope.project.criteria.length == 0){
      document.getElementById('sectionsCriteria').style.backgroundColor = '#ff3333';
      $scope.criteriaDone = false;
    }else{
      document.getElementById('sectionsCriteria').style.backgroundColor = '#6fdc6f';
      $scope.criteriaDone = true;
    }
    if($scope.project.alternatives.length == 0 || $scope.project.performancetables.length == 0){
      document.getElementById('sectionsAlternatives').style.backgroundColor = '#ff3333';
      $scope.alternativesDone = false;
    }else{
      document.getElementById('sectionsAlternatives').style.backgroundColor = '#6fdc6f';
      $scope.alternativesDone = true;
    }
    if($scope.project.profiletables.length == 0 || $scope.project.categories.length == 0 || $scope.project.parameters.length == 0){
      document.getElementById('sectionsConfigurations').style.backgroundColor = '#ff3333';
      $scope.configurationsDone = false;
    }else{
      document.getElementById('sectionsConfigurations').style.backgroundColor = '#6fdc6f';
      $scope.configurationsDone = true;
    }
    if($scope.criteriaDone && $scope.alternativesDone && $scope.configurationsDone){
      document.getElementById('sectionsResults').style.backgroundColor = '#6fdc6f';
    } else{
      document.getElementById('sectionsResults').style.backgroundColor = '#ff3333';
    }
    $('#loading').hide();
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
    // Show loader when execute button was clicked
    $('#loading').show();
    //$window.location.href = 'http://vps288667.ovh.net:5010/electreTriC/?projectId='+id+'&n='+n+'&project='+projectName;     
  }else{
    $window.location.href = '/'+sectionName+'.html?projectId='+id+'&n='+n;  
  }
}

//Update dateSet of the project when there are changes
$scope.updateProject = function() {
  $scope.project.dateSet = new Date();
  var project = $scope.project
  var i = $scope.project._id;

  $http.put('/api/project/' + i, project).success(function(response) {

  });
}

// Go back to project section
$scope.projectSection = function(){
  var id = $scope.user._id;
  $window.location.href = '/projects.html?userId='+id;  
}

// Refresh the page current data after closing the import section (so the data on the page is actualized with the imported data)
$scope.refreshBeforeClosing = function(){
  $('#loading').show();
  $scope.updateProject();
  $http.get('/api/project/' + $scope.projectID).success(function(data) {
    $scope.project = data;
    $http.get('/api/alternatives/' + $scope.projectID).success(function(data) {
      $scope.alternatives = data.alternatives;
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });  
    $http.get('/api/criterions/' + $scope.projectID).success(function(data) {
      $scope.criteria = data.criteria;
      })
      .error(function(data) {
        console.log('Error: ' + data);
    }); 
    $http.get('/api/categories/' + $scope.projectID).success(function(data) {
      $scope.categories = data.categories;
      })
      .error(function(data) {
        console.log('Error: ' + data);
    }); 
    $http.get('/api/parameters/' + $scope.projectID).success(function(data) {
      $scope.parameters = data.parameters;
      })
      .error(function(data) {
        console.log('Error: ' + data);
    }); 
    $http.get('/api/performances/' + $scope.projectID).success(function(data) {
      $scope.performancetables = data.performancetables;
      })
      .error(function(data) {
        console.log('Error: ' + data);
    });
    $http.get('/api/profiles/' + $scope.projectID).success(function(data) {
      $scope.profiletables = data.profiletables;
      })
      .error(function(data) {
        console.log('Error: ' + data);
    });
    if($scope.project.criteria.length == 0){
      document.getElementById('sectionsCriteria').style.backgroundColor = '#ff3333';
      $scope.criteriaDone = false;
    }else{
      document.getElementById('sectionsCriteria').style.backgroundColor = '#6fdc6f';
      $scope.criteriaDone = true;
    }
    if($scope.project.alternatives.length == 0 || $scope.project.performancetables.length == 0){
      document.getElementById('sectionsAlternatives').style.backgroundColor = '#ff3333';
      $scope.alternativesDone = false;
    }else{
      document.getElementById('sectionsAlternatives').style.backgroundColor = '#6fdc6f';
      $scope.alternativesDone = true;
    }
    if($scope.project.profiletables.length == 0 || $scope.project.categories.length == 0 || $scope.project.parameters.length == 0){
      document.getElementById('sectionsConfigurations').style.backgroundColor = '#ff3333';
      $scope.configurationsDone = false;
    }else{
      document.getElementById('sectionsConfigurations').style.backgroundColor = '#6fdc6f';
      $scope.configurationsDone = true;
    }
    if($scope.criteriaDone && $scope.alternativesDone && $scope.configurationsDone){
      document.getElementById('sectionsResults').style.backgroundColor = '#6fdc6f';
    } else{
      document.getElementById('sectionsResults').style.backgroundColor = '#ff3333';
    }
    $('#loading').hide();
  })
  .error(function(data) {
    console.log('Error: ' + data);
  });
}

}]);