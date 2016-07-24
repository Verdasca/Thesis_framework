var app = angular.module("results-controller", ['ngRoute', 'ui.router', 'ngResource', 'ngSanitize', 'ngCsv', 'appRoutes', 'ui']);

app.controller('resultsController', ['$scope', '$http', '$resource', '$location', '$window', '$timeout', function ($scope, $http, $resource, $location, $window, $timeout) {

$scope.projectID = $location.search().projectId;
$scope.username = $location.search().n;
$scope.criteriaDone = false;
$scope.alternativesDone = false;
$scope.configurationsDone = false;

// Hide loader
$('#importing').hide();
$('#executing').hide();

$http.get('/api/userFind/' + $scope.username).success(function(data) {
  $scope.user = data;
  })
  .error(function(data) {
    console.log('Error: ' + data);
});  

$http.get('/api/project/' + $scope.projectID).success(function(data) {
  $scope.project = data;
  $scope.results = data.results; 
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
      document.getElementById('methodButtons').disabled = false;
    } else{
      document.getElementById('methodButtons').disabled = true;
    }
    if(document.getElementById("resultName").value == ""){
      document.getElementById("methodButtons").disabled=true;
    }else{
      document.getElementById("methodButtons").disabled=false;
    }
    $('#loading').hide();
  })
  .error(function(data) {
    console.log('Error: ' + data);
});

var refresh = function(){
  $http.get('/api/project/' + $scope.projectID).success(function(data) {
    $scope.project = data;
    $scope.results = data.results; 
    })
    .error(function(data) {
      console.log('Error: ' + data);
  });
}

// Change section and give the project id as argument
$scope.changeSection = function(name){
  var id = $scope.projectID;
  var sectionName = name;
  var n = $scope.username;
  var nameResult = document.getElementById("resultName").value;
  var projectName = $scope.project.name;
  if(sectionName == 'divizServer'){
    // Show loader when execute button was clicked
    $('#executing').show();
    $window.location.href = 'http://vps288667.ovh.net:5010/electreTriC/?projectId='+id+'&n='+n+'&project='+projectName+'&resName='+nameResult;   
    //$window.location.href = 'http://localhost:5000/electreTriC/?projectId='+id+'&n='+n+'&project='+projectName+'&resName='+nameResult;     
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

//Delete result
$scope.deleteResult = function(result, identifier) {
  var i = $scope.project._id;
  var id = identifier;
  $http.delete('/api/projects/' + i + '/' + id)
    .success(function() {
      console.log("success");
      var idx = $scope.results.indexOf(result);
      if (idx >= 0) {
        $scope.results.splice(idx, 1);
      }
      $scope.updateProject();
      refresh();
    })
    .error(function() {
      var idx = $scope.results.indexOf(result);
      if (idx >= 0) {
        $scope.results.splice(idx, 1);
      }
      $scope.updateProject();
      refresh();
    });
}

// Refresh the page current data after closing the import section (so the data on the page is actualized with the imported data)
$scope.refreshBeforeClosing = function(){
  $('#loading').show();
  checkStatus();
  $scope.updateProject();
  refresh();
  $('#loading').hide();
}

var checkStatus = function(){
$http.get('/api/project/' + $scope.projectID).success(function(data) {
  $scope.project = data;
  $scope.results = data.results; 
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
      document.getElementById('methodButtons').disabled = false;
    } else{
      document.getElementById('methodButtons').disabled = true;
    }
    if(document.getElementById("resultName").value == ""){
      document.getElementById("methodButtons").disabled=true;
    }else{
      document.getElementById("methodButtons").disabled=false;
    }
    $('#loading').hide();
  })
  .error(function(data) {
    console.log('Error: ' + data);
});  
}

// gets the template to ng-include for a table row / item
$scope.getTemplate = function (result) {
  var i = result.identifier;
  var errorMessage = result.methodError;
  // If everything went ok with the method, show results
  if (errorMessage === 'Everything OK. No errors.'){ 
    return 'showResults';
  // If not show message error
  }else{ 
    return 'showError';
  }
}

}]);

app.filter('split', function() {
  return function(input, splitChar, splitIndex) {
    // do some bounds checking here to ensure it has that index
    return input.split(splitChar)[splitIndex];
  }
});  

//Export results into a .csv file 
app.directive('exportResultsToCsv',function(){
    return {
      restrict: 'A',
      // Get the id of the result table to be exported
      scope: {
        values: '=values',
        tableName: '@tbl'
      },
      link: function (scope, element, attrs) {
        var el = element[0];
          element.bind('click', function(e){
            var fileName = "";
            switch(scope.tableName) {
              case "resultsTable":
                  fileName = 'electre_Tri_C_results.csv';
                  break;
              case "criTable":
                  fileName = 'electre_Tri_C_criteria.csv';
                  break;
              case "altTable":
                  fileName = 'electre_Tri_C_alternatives.csv';
                  break;
              case "perfTable":
                  fileName = 'electre_Tri_C_performances.csv';
                  break;
              case "catTable":
                  fileName = 'electre_Tri_C_categories.csv';
                  break;
              case "paramsTable":
                  fileName = 'electre_Tri_C_parameters.csv';
                  break;
              case "profTable":
                  fileName = 'electre_Tri_C_profiles.csv';
                  break;
            }
            var table = document.getElementById(scope.tableName+scope.values);
            var csvString = '';
            for(var i=0; i<table.rows.length;i++){
                var rowData = table.rows[i].cells;
                for(var j=0; j<rowData.length; j++){ //number of columns to export
                  csvString = csvString + rowData[j].innerHTML + ",";
                }
                csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
                csvString = csvString + "\n";
          	}
            csvString = csvString.substring(0, csvString.length - 1);
            var a = $('<a/>', {
                style:'display:none',
                href:'data:application/octet-stream;base64,'+btoa(unescape(encodeURIComponent(csvString))),
                //href:'data:application/octet-stream;base64,'+btoa(csvString), changed because it gives errors if a character is not recognized
                download: fileName
            }).appendTo('body')
            a[0].click()
            a.remove();
          });
      }
    }
});

//Export everything into a .csv file 
app.directive('exportEverythingToCsv',function($timeout){
    return {
      restrict: 'A',
      // Get the id of the result table to be exported
      scope: {
        values: '=values'
      },
      link: function (scope, element, attrs) {
        $timeout( function(){
        var el = element[0];
        element.bind('click', function(e){
          if(document.getElementById('res'+scope.values).checked == true){
            var table = document.getElementById("resultsTable"+scope.values);
            var csvString = '';
            for(var i=0; i<table.rows.length;i++){
                var rowData = table.rows[i].cells;
                for(var j=0; j<rowData.length; j++){ //number of columns to export
                  csvString = csvString + rowData[j].innerHTML + ",";
                }
                csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
                csvString = csvString + "\n";
            }
            csvString = csvString.substring(0, csvString.length - 1);
            var a = $('<a/>', {
                style:'display:none',
                href:'data:application/octet-stream;base64,'+btoa(unescape(encodeURIComponent(csvString))),
                download:'electre_Tri_C_results.csv'
            }).appendTo('body')
            a[0].click()
            a.remove();
          }
        });
        element.bind('click', function(e){
          if(document.getElementById('cri'+scope.values).checked == true){
            var table = document.getElementById("criTable"+scope.values);
            var csvString = '';
            for(var i=0; i<table.rows.length;i++){
                var rowData = table.rows[i].cells;
                for(var j=0; j<rowData.length; j++){ //number of columns to export
                  csvString = csvString + rowData[j].innerHTML + ",";
                }
                csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
                csvString = csvString + "\n";
            }
            csvString = csvString.substring(0, csvString.length - 1);
            var a = $('<a/>', {
                style:'display:none',
                href:'data:application/octet-stream;base64,'+btoa(unescape(encodeURIComponent(csvString))),
                download:'electre_Tri_C_criteria.csv'
            }).appendTo('body')
            a[0].click()
            a.remove();
          }
        });
        element.bind('click', function(e){
          if(document.getElementById('alt'+scope.values).checked == true){
            var table = document.getElementById("altTable"+scope.values);
            var csvString = '';
            for(var i=0; i<table.rows.length;i++){
                var rowData = table.rows[i].cells;
                for(var j=0; j<rowData.length; j++){ //number of columns to export
                  csvString = csvString + rowData[j].innerHTML + ",";
                }
                csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
                csvString = csvString + "\n";
            }
            csvString = csvString.substring(0, csvString.length - 1);
            var a = $('<a/>', {
                style:'display:none',
                href:'data:application/octet-stream;base64,'+btoa(unescape(encodeURIComponent(csvString))),
                download:'electre_Tri_C_alternatives.csv'
            }).appendTo('body')
            a[0].click()
            a.remove();
          }
        });
        element.bind('click', function(e){
          if(document.getElementById('per'+scope.values).checked == true){
            var table = document.getElementById("perfTable"+scope.values);
            var csvString = '';
            for(var i=0; i<table.rows.length;i++){
                var rowData = table.rows[i].cells;
                for(var j=0; j<rowData.length; j++){ //number of columns to export
                  csvString = csvString + rowData[j].innerHTML + ",";
                }
                csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
                csvString = csvString + "\n";
            }
            csvString = csvString.substring(0, csvString.length - 1);
            var a = $('<a/>', {
                style:'display:none',
                href:'data:application/octet-stream;base64,'+btoa(unescape(encodeURIComponent(csvString))),
                download:'electre_Tri_C_performances.csv'
            }).appendTo('body')
            a[0].click()
            a.remove();
          }
        });
        element.bind('click', function(e){
          if(document.getElementById('cat'+scope.values).checked == true){
            var table = document.getElementById("catTable"+scope.values);
            var csvString = '';
            for(var i=0; i<table.rows.length;i++){
                var rowData = table.rows[i].cells;
                for(var j=0; j<rowData.length; j++){ //number of columns to export
                  csvString = csvString + rowData[j].innerHTML + ",";
                }
                csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
                csvString = csvString + "\n";
            }
            csvString = csvString.substring(0, csvString.length - 1);
            var a = $('<a/>', {
                style:'display:none',
                href:'data:application/octet-stream;base64,'+btoa(unescape(encodeURIComponent(csvString))),
                download:'electre_Tri_C_categories.csv'
            }).appendTo('body')
            a[0].click()
            a.remove();
          }
        });
        element.bind('click', function(e){
          if(document.getElementById('par'+scope.values).checked == true){
            var table = document.getElementById("paramsTable"+scope.values);
            var csvString = '';
            for(var i=0; i<table.rows.length;i++){
                var rowData = table.rows[i].cells;
                for(var j=0; j<rowData.length; j++){ //number of columns to export
                  csvString = csvString + rowData[j].innerHTML + ",";
                }
                csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
                csvString = csvString + "\n";
            }
            csvString = csvString.substring(0, csvString.length - 1);
            var a = $('<a/>', {
                style:'display:none',
                href:'data:application/octet-stream;base64,'+btoa(unescape(encodeURIComponent(csvString))),
                download:'electre_Tri_C_parameters.csv'
            }).appendTo('body')
            a[0].click()
            a.remove();
          }
        });
        element.bind('click', function(e){
          if(document.getElementById('pro'+scope.values).checked == true){
            var table = document.getElementById("profTable"+scope.values);
            var csvString = '';
            for(var i=0; i<table.rows.length;i++){
                var rowData = table.rows[i].cells;
                for(var j=0; j<rowData.length; j++){ //number of columns to export
                  csvString = csvString + rowData[j].innerHTML + ",";
                }
                csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
                csvString = csvString + "\n";
            }
            csvString = csvString.substring(0, csvString.length - 1);
            var a = $('<a/>', {
                style:'display:none',
                href:'data:application/octet-stream;base64,'+btoa(unescape(encodeURIComponent(csvString))),
                download:'electre_Tri_C_profiles.csv'
            }).appendTo('body')
            a[0].click()
            a.remove();
          }
        });
      }, 1000);
      }
    }
});
