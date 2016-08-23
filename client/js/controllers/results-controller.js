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
    if($scope.criteriaDone && $scope.alternativesDone && $scope.configurationsDone){
      document.getElementById('methodButtons').disabled = false;
    } else{
      document.getElementById('methodButtons').disabled = true;
    }
    // if(document.getElementById("resultName").value == ""){
    //   document.getElementById("methodButtons").disabled=true;
    // }else{
    //   document.getElementById("methodButtons").disabled=false;
    // }
    $('#loading').hide();
  })
  .error(function(data) {
    console.log('Error: ' + data);
});

//Create performance view tables
$scope.perfTbl = function(id){
  $timeout( function(){ 
    var table = document.getElementById("perfTable"+id);
    var resultData = $scope.results[identifier=id];
    var len = resultData.alternativeValues.length;
    var lenCriteria = resultData.criterionValues.length;
    var row = table.insertRow(0);
    for (var j = 0; j <= lenCriteria; j++) {
      var cell = row.insertCell(j);
      cell.setAttribute("id", "headers");
      cell.setAttribute("style", "font-weight: bold; border-top: 0; border-bottom: 2px solid #ccc;");
      if(j == 0){
        cell.innerHTML = "Alternatives/Criteria";
      }else{
        cell.innerHTML = resultData.criterionValues[j-1].name;
      }
    }
    for (var i = 1; i <= len; i++) {
      var row = table.insertRow(i);
      var cell1 = row.insertCell(0);
      cell1.setAttribute("id", "headers");
      cell1.innerHTML = resultData.alternativeValues[i-1].name;
      for (var k = 0; k < lenCriteria; k++) {
        var cell2 = row.insertCell(k+1);
        cell2.setAttribute("id", "headers");
        for (var n = 0; n < resultData.performanceValues.length; n++) {
          if(resultData.performanceValues[n].alternative == cell1.innerHTML && resultData.performanceValues[n].criterion == table.rows[0].cells[k+1].innerHTML){
            cell2.innerHTML = resultData.performanceValues[n].value;
          }
        }
      }
    }
  }, 1000);
}

//Create profile view tables
$scope.profTbl = function(id){
  $timeout( function(){ 
    var table = document.getElementById("profTable"+id);
    var resultData = $scope.results[identifier=id];
    var len = resultData.categoryValues.length;
    var lenCriteria = resultData.criterionValues.length;
    var row = table.insertRow(0);
    for (var j = 0; j <= lenCriteria; j++) {
      var cell = row.insertCell(j);
      cell.setAttribute("id", "headers");
      cell.setAttribute("style", "font-weight: bold; border-top: 0; border-bottom: 2px solid #ccc;");
      if(j == 0){
        cell.innerHTML = "Reference Actions/Criteria";
      }else{
        cell.innerHTML = resultData.criterionValues[j-1].name;
      }
    }
    for (var i = 1; i <= len; i++) {
      var row = table.insertRow(i);
      var cell1 = row.insertCell(0);
      cell1.setAttribute("id", "headers");
      cell1.innerHTML = resultData.categoryValues[i-1].action;
      for (var k = 0; k < lenCriteria; k++) {
        var cell2 = row.insertCell(k+1);
        cell2.setAttribute("id", "headers");
        for (var n = 0; n < resultData.profileValues.length; n++) {
          if(resultData.profileValues[n].action == cell1.innerHTML && resultData.profileValues[n].criterion == table.rows[0].cells[k+1].innerHTML){
            cell2.innerHTML = resultData.profileValues[n].value;
          }
        }
      }
    }
  }, 1000);
}

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
  var notes = document.getElementById("resultNotes").value;
  var projectName = $scope.project.name;
  if(sectionName == 'divizServer'){
    // Show loader when execute button was clicked
    $('#executing').show();
    $window.location.href = 'http://vps288667.ovh.net:5010/electreTriC/?projectId='+id+'&n='+n+'&project='+projectName+'&resName='+nameResult+'&notes='+notes;   
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

//Reload the data from the result into the current data of the project
$scope.reloadData = function(result, identifier) {
  $('#loading').show();
  document.getElementById("reportMessage").style.display = "none";
  var i = $scope.project._id;
  var id = identifier;
  var dataResult = result;
  if($scope.project.alternatives.length == 0){
    console.log('There are no alternatives to delete...');
  }else{
    //Delete all current alternatives 
    $http.delete('/api/alternatives/' + i)
      .success(function() {
        console.log("Done deleting all alternatives.");
    })
      .error(function() {
        //console.log('Error: fail deletes' );
    });
  }
  if($scope.project.criteria.length == 0){
      console.log('There are no criteria to delete...');
  }else{
    //Delete all current criteria 
    $http.delete('/api/criterions/' + i)
      .success(function() {
        console.log("Done deleting all criteria.");
    })
      .error(function() {
        //console.log('Error: fail deletes' );
    });
  }
  if($scope.project.performancetables.length == 0){
    console.log('There are no performances to delete...');
  }else{
    //Delete all current performances 
    $http.delete('/api/performances/' + i)
      .success(function() {
        console.log("Done deleting all performances.");
      })
      .error(function() {
        //console.log('Error: fail deletes' );
    });
  }
  if($scope.project.categories.length == 0){
    console.log('There are no categories to delete...');
  }else{
    //Delete all current categories 
    $http.delete('/api/categories/' + i)
      .success(function() {
        console.log("Done deleting all categories.");
      })
      .error(function() {
        //console.log('Error: fail deletes' );
    });
  }
  if($scope.project.parameters.length == 0){
    console.log('There are no parameters to delete...');
  }else{
    //Delete all current parameters 
    $http.delete('/api/parameters/' + i)
      .success(function() {
        console.log("Done deleting all parameters.");
      })
      .error(function() {
        //console.log('Error: fail deletes' );
    });
  }
  if($scope.project.profiletables.length == 0){
    console.log('There are no profiles to delete...');
  }else{
    //Delete all current profiles 
    $http.delete('/api/profiles/' + i)
      .success(function() {
        console.log("Done deleting all profiles.");
      })
      .error(function() {
        //console.log('Error: fail deletes' );
    });
  }
  // Reload data
  $http.post('/api/reloadProject/' + i + '/' + id, dataResult).success(function(response) {
    refreshData();
    document.getElementById("reportMessage").style.display = "block";
    document.getElementById("reportMessage").innerHTML = "Reload complete.";
    //$('#loading').hide();
  });
}

var refreshData = function(){
$http.get('/api/project/' + $scope.projectID).success(function(data) {
  $scope.project = data;
  $scope.results = data.results; 
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
    if($scope.criteriaDone && $scope.alternativesDone && $scope.configurationsDone){
      document.getElementById('methodButtons').disabled = false;
    } else{
      document.getElementById('methodButtons').disabled = true;
    }
    $scope.perfTblCurrent();
    $scope.profTblCurrent();
    $('#loading').hide();
  })
  .error(function(data) {
    console.log('Error: ' + data);
});
}

// Refresh the page current data after closing the import section (so the data on the page is actualized with the imported data)
$scope.refreshBeforeClosing = function(){
  $('#loading').show();
  checkStatus();
  $scope.updateProject();
  refreshData();
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
      document.getElementById('sectionsResults').style.backgroundColor = '#6fdc6f';
    } else{
      document.getElementById('sectionsResults').style.backgroundColor = '#ff3333';
    }
    if($scope.criteriaDone && $scope.alternativesDone && $scope.configurationsDone){
      document.getElementById('methodButtons').disabled = false;
    } else{
      document.getElementById('methodButtons').disabled = true;
    }
    // if(document.getElementById("resultName").value == ""){
    //   document.getElementById("methodButtons").disabled=true;
    // }else{
    //   document.getElementById("methodButtons").disabled=false;
    // }
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

//Select all checkboxes from the export result options
$scope.selectAll = function(id){
  var idList = id;
  document.getElementById("res"+idList).checked = true;
  document.getElementById("cri"+idList).checked = true;
  document.getElementById("alt"+idList).checked = true;
  document.getElementById("per"+idList).checked = true;
  document.getElementById("cat"+idList).checked = true;
  document.getElementById("par"+idList).checked = true;
  document.getElementById("pro"+idList).checked = true;
  document.getElementById("note"+idList).checked = true;
}

//Unselect all checkboxes from the export result options
$scope.selectNone = function(id){
  var idList = id;
  document.getElementById("res"+idList).checked = false;
  document.getElementById("cri"+idList).checked = false;
  document.getElementById("alt"+idList).checked = false;
  document.getElementById("per"+idList).checked = false;
  document.getElementById("cat"+idList).checked = false;
  document.getElementById("par"+idList).checked = false;
  document.getElementById("pro"+idList).checked = false;
  document.getElementById("note"+idList).checked = false;
}

//Create performance view tables
$scope.perfTblCurrent = function(){
  $("#currentPerformances tbody").remove();
  $timeout( function(){ 
  if($scope.performancetables.length == 0){
    // Do nothing
  }else{
    //$timeout( function(){ 
      var table = document.getElementById("currentPerformances");
      var resultData = $scope.performancetables;
      var len = $scope.alternatives.length;
      var lenCriteria = $scope.criteria.length;
      var row = table.insertRow(0);
      for (var j = 0; j <= lenCriteria; j++) {
        var cell = row.insertCell(j);
        cell.setAttribute("id", "headers");
        cell.setAttribute("style", "font-weight: bold; border-top: 0; border-bottom: 2px solid #ccc;");
        if(j == 0){
          cell.innerHTML = "Alternatives/Criteria";
        }else{
          cell.innerHTML = $scope.criteria[j-1].name;
        }
      }
      for (var i = 1; i <= len; i++) {
        var row = table.insertRow(i);
        var cell1 = row.insertCell(0);
        cell1.setAttribute("id", "headers");
        cell1.innerHTML = $scope.alternatives[i-1].name;
        for (var k = 0; k < lenCriteria; k++) {
          var cell2 = row.insertCell(k+1);
          cell2.setAttribute("id", "headers");
          for (var n = 0; n < resultData.length; n++) {
            if(resultData[n].alternative == cell1.innerHTML && resultData[n].criterion == table.rows[0].cells[k+1].innerHTML){
              cell2.innerHTML = resultData[n].value;
            }
          }
        }
      }
    //}, 1000);
  }
  }, 1000);
}

//Create profile view tables
$scope.profTblCurrent = function(){
  $("#currentProfiles tbody").remove();
  $timeout( function(){ 
  if($scope.profiletables.length == 0){
    // Do nothing
  }else{
    //$timeout( function(){ 
      var table = document.getElementById("currentProfiles");
      var resultData = $scope.profiletables;
      var len = $scope.categories.length;
      var lenCriteria = $scope.criteria.length;
      var row = table.insertRow(0);
      for (var j = 0; j <= lenCriteria; j++) {
        var cell = row.insertCell(j);
        cell.setAttribute("id", "headers");
        cell.setAttribute("style", "font-weight: bold; border-top: 0; border-bottom: 2px solid #ccc;");
        if(j == 0){
          cell.innerHTML = "Reference Actions/Criteria";
        }else{
          cell.innerHTML = $scope.criteria[j-1].name;
        }
      }
      for (var i = 1; i <= len; i++) {
        var row = table.insertRow(i);
        var cell1 = row.insertCell(0);
        cell1.setAttribute("id", "headers");
        cell1.innerHTML = $scope.categories[i-1].action;
        for (var k = 0; k < lenCriteria; k++) {
          var cell2 = row.insertCell(k+1);
          cell2.setAttribute("id", "headers");
          for (var n = 0; n < resultData.length; n++) {
            if(resultData[n].action == cell1.innerHTML && resultData[n].criterion == table.rows[0].cells[k+1].innerHTML){
              cell2.innerHTML = resultData[n].value;
            }
          }
        }
      }
    //}, 1000);
  }
  }, 1000);
}

// Update the name and notes from the result
$scope.editResults = function(res, id){
  var projectID = $scope.project._id;
  var pro = {name: res.name, notes: res.resultNotes};
  $http.put('/api/editResults/' + id + '/' + projectID, pro).success(function(response) {

  });
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
app.directive('exportEverythingToCsv',function($timeout, $http){
    return {
      restrict: 'A',
      // Get the id of the result table to be exported
      scope: {
        values: '=values',
        names: '=names'
      },
      link: function (scope, element, attrs) {
        $timeout( function(){
        var el = element[0];
        element.bind('click', function(e){
          var zip = new JSZip();
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
            zip.file(scope.names+"/results.csv", csvString);
          }
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
            zip.file(scope.names+"/criteria.csv", csvString);
          }
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
            zip.file(scope.names+"/alternatives.csv", csvString);
          }
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
            zip.file(scope.names+"/performances.csv", csvString);
          }
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
            zip.file(scope.names+"/categories.csv", csvString);
          }
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
            zip.file(scope.names+"/parameters.csv", csvString);
          }
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
            zip.file(scope.names+"/profiles.csv", csvString);
          }
          if(document.getElementById('note'+scope.values).checked == true){
            var notes = document.getElementById("notes"+scope.values).innerHTML;
            var csvString = 'Notes:';
            csvString = csvString + "\n";
            csvString = csvString + notes;
            zip.file(scope.names+"/notes.txt", csvString);
          }
          if(document.getElementById('res'+scope.values).checked == true || document.getElementById('cri'+scope.values).checked == true || document.getElementById('alt'+scope.values).checked == true || document.getElementById('per'+scope.values).checked == true || document.getElementById('cat'+scope.values).checked == true || document.getElementById('par'+scope.values).checked == true || document.getElementById('pro'+scope.values).checked == true || document.getElementById('note'+scope.values).checked == true){
            zip.generateAsync({type:"blob"})
            .then(function(content) {
                // see FileSaver.js
                saveAs(content, scope.names+".zip");
            });
          }
        });
      }, 1000);
      }
    }
});
