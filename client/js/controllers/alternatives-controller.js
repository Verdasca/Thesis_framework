var app = angular.module("alternatives-controller", ['ngRoute', 'ui.router', 'ngResource', 'ngSanitize', 'ngCsv', 'appRoutes', 'mainCtrl', 'ui']);

app.controller('alternativesController', ['$scope', '$http', '$resource', '$location', '$window', function ($scope, $http, $resource, $location, $window) {

var Alternatives = $resource('/api/alternatives');

$scope.projectID = $location.search().projectId;
$scope.username = $location.search().n;

var refresh = function(){
  $http.get('/api/alternatives/' + $scope.projectID).success(function(response) {
    console.log('I got the data I requested');
      $scope.project = response;
      $scope.alternatives = response.alternatives;
    });  
}

$http.get('/api/alternatives/' + $scope.projectID).success(function(data) {
  $scope.project = data;
  $scope.alternatives = data.alternatives;
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
    refresh();
  });

  $scope.updateProject();

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
  var i = $scope.project._id;
  var id = alternative._id;
  $http.delete('/api/alternative/' + i + '/' + id)
    .success(function() {
      console.log("success");
      var idx = $scope.alternatives.indexOf(alternative);
      if (idx >= 0) {
        $scope.alternatives.splice(idx, 1);
      }
      $scope.updateProject();
      refresh();
    })
    .error(function() {
      //console.log('Error: ' + i);
      var idx = $scope.alternatives.indexOf(alternative);
      if (idx >= 0) {
        $scope.alternatives.splice(idx, 1);
      }
      $scope.updateProject();
      refresh();
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
  $scope.updateProject();
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
  $scope.updateProject();
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

//Update dateSet of the project when there are changes
$scope.updateProject = function() {
  $scope.project.dateSet = new Date();
  var project = $scope.project
  var i = $scope.project._id;

  $http.put('/api/project/' + i, project).success(function(response) {

  });
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


