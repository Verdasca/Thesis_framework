var app = angular.module("criterions-controller", ['ngRoute', 'ui.router', 'ngResource', 'ngSanitize', 'ngCsv', 'appRoutes', 'mainCtrl', 'ui']);

app.controller('criterionsController', ['$scope', '$http', '$resource', '$timeout', '$location', '$window', function ($scope, $http, $resource, $timeout, $location, $window) {

var Criterions = $resource('/api/criterions');

$scope.projectID = $location.search().projectId;
$scope.username = $location.search().n;
$scope.criteriaDone = false;
$scope.alternativesDone = false;
$scope.configurationsDone = false;

// Hide loader
$('#loading').hide();

var refresh = function(){
  $http.get('/api/criterions/' + $scope.projectID).success(function(response) {
    console.log('I got the data I requested');
      $scope.project = response;
      $scope.criterions = response.criteria;
      checkStatus();
  });  
}

// Update status to see if the execute button can be pressed
var checkStatus = function(){
  if($scope.project.criteria.length == 0){
    document.getElementById('sectionsCriteria').style.backgroundColor = '#ff3333';
    $scope.criteriaDone = false;
  }else{
    document.getElementById('sectionsCriteria').style.backgroundColor = '#6fdc6f';
    $scope.criteriaDone = true;
  }
  if($scope.criteriaDone && $scope.alternativesDone && $scope.performanceDone && $scope.configurationsDone){
    document.getElementById('buttonDiviz').disabled = false;
  } else{
    document.getElementById('buttonDiviz').disabled = true;
  }
}

//Get the data from criterions in mongoDB
$http.get('/api/criterions/' + $scope.projectID).success(function(data) {
  $scope.project = data;
  $scope.criterions = data.criteria;
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
      document.getElementById('buttonDiviz').disabled = false;
    } else{
      document.getElementById('buttonDiviz').disabled = true;
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

//Create criterion
$scope.createCriterion = function () {
  // var criterion = new Criterions();
  // criterion.name = $scope.criterion.name;
  // criterion.description = $scope.criterion.description;
  // criterion.direction = $scope.criterion.direction;
  // criterion.measure = $scope.criterion.measure;
  // criterion.weight = $scope.criterion.weight;
  // criterion.indifference = $scope.criterion.indifference;
  // criterion.preference = $scope.criterion.preference;
  // criterion.veto = $scope.criterion.veto;
  // criterion.$save(function (result) {
  //   $scope.criterions.push(result);
  //   $scope.criterion.name = '';
  //   $scope.criterion.description = '';
  //   $scope.criterion.direction = '';
  //   $scope.criterion.measure = '';
  //   $scope.criterion.weight = '';
  //   $scope.criterion.indifference = '';
  //   $scope.criterion.preference = '';
  //   $scope.criterion.veto = '';
  // })
  var i = $scope.project._id;
  var criterion = new Criterions();
  criterion.name = $scope.criterion.name;
  criterion.description = $scope.criterion.description;
  criterion.direction = $scope.criterion.direction;
  criterion.measure = $scope.criterion.measure;
  criterion.weight = $scope.criterion.weight;
  criterion.indifference = $scope.criterion.indifference;
  criterion.preference = $scope.criterion.preference;
  criterion.veto = $scope.criterion.veto;
  $http.post('/api/criterions/' + i, criterion).success(function(response) {
    refresh();
    $scope.criterion.name = '';
    $scope.criterion.description = '';
    $scope.criterion.direction = '';
    $scope.criterion.measure = '';
    $scope.criterion.weight = '';
    $scope.criterion.indifference = '';
    $scope.criterion.preference = '';
    $scope.criterion.veto = '';
    refresh();
    $scope.submitted=false;
  });
  $scope.updateProject();
}  

//Delete criterion
$scope.deleteCriterion = function(criterion) {
  var i = $scope.project._id;
  var id = criterion._id;
  $http.delete('/api/criterion/' + i + '/' + id)
    .success(function(data) {
      var idx = $scope.criterions.indexOf(criterion);
      if (idx >= 0) {
        $scope.criterions.splice(idx, 1);
      }
      $scope.updateProject();
      refresh();
    })
    .error(function(data) {
      var idx = $scope.criterions.indexOf(criterion);
      if (idx >= 0) {
        $scope.criterions.splice(idx, 1);
      }
      $scope.updateProject();
      refresh();
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
    $scope.criterion.indifference = '';
    $scope.criterion.preference = '';
    $scope.criterion.veto = '';
  });
  $scope.updateProject();
}

//Update the value and reset model
$scope.updateCriterion2 = function(criterion) {
  var i = criterion._id;
  criterion.name = $scope.model.name;
  criterion.description = $scope.model.description;
  criterion.direction = $scope.model.direction;
  criterion.measure = $scope.model.measure;
  criterion.weight = $scope.model.weight;
  criterion.indifference = $scope.model.indifference;
  criterion.preference = $scope.model.preference;
  criterion.veto = $scope.model.veto;
  $http.get('/api/criterion/' + i).success(function(response) {
        $scope.criterion = response;
    });

  $http.put('/api/criterion/' + i, criterion).success(function(response) {
    refresh();
    $scope.criterion.name = '';
    $scope.criterion.description = '';
    $scope.criterion.direction = '';
    $scope.criterion.measure = '';
    $scope.criterion.weight = '';
    $scope.criterion.indifference = '';
    $scope.criterion.preference = '';
    $scope.criterion.veto = '';
  });
  $scope.updateProject();
  $scope.reset();
}

// Create model that will contain the criterion to edit
$scope.model = {};

// gets the template to ng-include for a table row / item
$scope.getTemplate = function (criterion) {
  var i = criterion._id;
  //console.log('Do getTemplate on: '+i);
  //console.log('Id from model criterion copied: '+$scope.model.name);
  // if(i === null || i === 'undefined' || i === ''){
  //   return 'display';
  // }
  if (i === $scope.model._id){ 
    //console.log('Edit mode.');
    return 'edit';
  }else{ 
    return 'display';
  }
}

$scope.editCriterion2 = function (criterion) {
  var i = criterion._id;
  $scope.model = angular.copy(criterion);
  //console.log('Criterion: '+i+ ' copied.');
  //var c = angular.copy(criterion);
  //$scope.model.push(c);
  //$scope.model.push({id: i, name:criterion.name, description:criterion.description, direction:criterion.direction, measure:criterion.measure, weight:criterion.weight, indifference:criterion.indifference, preference:criterion.preference, veto:criterion.veto});
  //console.log($scope.model);
  //console.log($scope.model._id);
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
    // Show loader when execute button was clicked
    $('#loading').show();
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

// Used for drag/drop criteria order... to do the weight thing
// $timeout( function(){ 
//   $scope.criterionCopy = [];
//   $scope.criterionCopy = $scope.criterions;
//   var fixHelperModified = function(e, tr) {
//     var $originals = tr.children();
//     var $helper = tr.clone();
//     $helper.children().each(function(index)
//     {
//       $(this).width($originals.eq(index).width())
//     });
//     return $helper;
// };

// $("#sort2 tbody").sortable({
//     helper: fixHelperModified 
    
// }).disableSelection();
// }, 900);

}]);

// function addWhiteCard(){
//   var table = document.getElementById("sort2").getElementsByTagName('tbody')[0];
//   var row = table.insertRow(0);
//   row.setAttribute("style", "cursor: move;");
//   var cell1 = row.insertCell(0);
//   var cell2 = row.insertCell(1);
//   var cell3 = row.insertCell(2);
//   cell1.innerHTML = "";
//   cell2.innerHTML = 0;
//   cell3.innerHTML = 'White Card';
// }

//Export criterion into a .csv file 
app.directive('exportCriterionToCsv',function(){
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var el = element[0];
          element.bind('click', function(e){
            //var table = e.target.nextElementSibling;
            var table = document.getElementById("criterionTbl");
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
                download:'criterion.csv'
            }).appendTo('body')
            a[0].click()
            a.remove();
          });
      }
    }
});

//Export criterion into a .csv file without rank
app.directive('exportCriterionToCsvWithoutThresholds',function(){
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var el = element[0];
          element.bind('click', function(e){
            //var table = e.target.nextElementSibling;
            var table = document.getElementById("criterionTbl");
            var csvString = '';
            for(var i=0; i<table.rows.length;i++){
              if(i == 1){
                //Ignore save/update line
              }else{
                var rowData = table.rows[i].cells;
                for(var j=0; j<rowData.length-4;j++){ //number of columns to export
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
                download:'criterion.csv'
            }).appendTo('body')
            a[0].click()
            a.remove();
          });
      }
    }
});

//Export criterion into a .csv file without rank and weight
app.directive('exportCriterionToCsvWithoutWeight',function(){
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var el = element[0];
          element.bind('click', function(e){
            //var table = e.target.nextElementSibling;
            var table = document.getElementById("criterionTbl");
            var csvString = '';
            for(var i=0; i<table.rows.length;i++){
              if(i == 1){
                //Ignore save/update line
              }else{
                var rowData = table.rows[i].cells;
                for(var j=0; j<rowData.length-5;j++){ //number of columns to export
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
                download:'criterion.csv'
            }).appendTo('body')
            a[0].click()
            a.remove();
          });
      }
    }
});

