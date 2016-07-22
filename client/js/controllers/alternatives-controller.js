var app = angular.module("alternatives-controller", ['ngRoute', 'ui.router', 'ngResource', 'ngSanitize', 'ngCsv', 'appRoutes', 'ui']);

app.controller('alternativesController', ['$scope', '$http', '$resource', '$location', '$window', '$timeout', 'orderByFilter', function ($scope, $http, $resource, $location, $window, $timeout, orderBy) {

var Alternatives = $resource('/api/alternatives');
var Performances = $resource('/api/performances');

$scope.projectID = $location.search().projectId;
$scope.username = $location.search().n;
$scope.criteriaDone = false;
$scope.alternativesDone = false;
$scope.configurationsDone = false;

// Hide loader and importing
$('#importing').hide();

//Get all data when loading body
$scope.run = function () {
  //Get the data from criterions in mongoDB
  $http.get('/api/criterions/' + $scope.projectID).success(function(data) {
    $scope.project = data;
    $scope.criterions = data.criteria;
    })
    .error(function(data) {
      console.log('Error: ' + data);
  }); 

  //Get the data from alternatives in mongoDB
  $http.get('/api/alternatives/' + $scope.projectID).success(function(data) {
    $scope.project = data;
    $scope.alternatives = data.alternatives;
    })
    .error(function(data) {
      console.log('Error: ' + data);
  });   

  //Get the data from performances in mongoDB
  $http.get('/api/performances/' + $scope.projectID).success(function(data) {
    $scope.project = data;
    $scope.performances = data.performancetables;
    })
    .error(function(data) {
      console.log('Error: ' + data);
  });

}

var refreshAlternatives = function(){
  $http.get('/api/alternatives/' + $scope.projectID).success(function(data) {
    //console.log('I got the data I requested');
    $scope.project = data;
    $scope.alternatives = data.alternatives;
  }); 
}

var refreshCriteria = function(){
  $http.get('/api/criterions/' + $scope.projectID).success(function(data) {
    $scope.criterions = data.criteria;
    })
    .error(function(data) {
      console.log('Error: ' + data);
  }); 
}

// Refresh the page current data after closing the import section (so the data on the page is actualized with the imported data)
$scope.refreshBeforeClosing = function(){
  $('#loading').show();
  $scope.updateProject();
  refreshCriteria();
  refreshAlternatives();
  refresh();
  $timeout( function(){
      $scope.chunksCat = [];
      $scope.chunksCat = $scope.alternatives;
      //Update performance table if necessary
      $scope.confirmPerformance(); 
      refresh();
  }, 1000);
}

// Reset performance table if criteria or alternatives were imported
$scope.refreshNewPerformanceBeforeClosing = function(){
  $('#loading').show();
  $scope.updateProject();
  refreshCriteria();
  refreshAlternatives();
  $scope.resetPerformanceTable();
}

// Refresh performance table if imported
$scope.refreshPerformancesBeforeClosing = function(){
  $('#loading').show();
  $scope.updateProject();
  $http.get('/api/criterions/' + $scope.projectID).success(function(data) {
    $scope.criterions = data.criteria;
    $http.get('/api/alternatives/' + $scope.projectID).success(function(data) {
      $scope.project = data;
      $scope.alternatives = data.alternatives;
      $http.get('/api/performances/' + $scope.projectID).success(function(data) {
        $scope.performances = data.performancetables;
        $scope.chunksCat = [];
        $scope.chunksCat = $scope.alternatives;
        //Order performances by alternative before slicing it
        $scope.performances2 = orderBy($scope.performances, $scope.propertyName, $scope.reverse);
        //Get all performances to put them inside a table
        var i, l = $scope.performances.length;
        var x = $scope.criterions.length;
        // Slice the performances results so it can be put inside a table numAlternativeXnumCriteria
        $scope.chunks = [];
        for ( i = 0; i < l; i += x) {
            $scope.chunks.push( $scope.performances2.slice(i, i + x));
        }
        console.log('Done slicing performances');
        $('#loading').hide();
      });  
    }); 
  });
}

// Update status to see if the execute button can be pressed
var checkStatus = function(){
  if($scope.project.alternatives.length == 0 || $scope.project.performancetables.length == 0){
    document.getElementById('sectionsAlternatives').style.backgroundColor = '#ff3333';
    $scope.alternativesDone = false;
  }else{
    document.getElementById('sectionsAlternatives').style.backgroundColor = '#6fdc6f';
    $scope.alternativesDone = true;
  } 
  // if($scope.criteriaDone && $scope.alternativesDone && $scope.configurationsDone){
  //   document.getElementById('methodButtons').disabled = false;
  // } else{
  //   document.getElementById('methodButtons').disabled = true;
  // }
}

$http.get('/api/alternatives/' + $scope.projectID).success(function(data) {
  $scope.project = data;
  $scope.alternatives = data.alternatives;
  //Get the data from criterions in mongoDB
  $http.get('/api/criterions/' + $scope.projectID).success(function(data) {
    $scope.criterions = data.criteria;
    })
    .error(function(data) {
      console.log('Error: ' + data);
  }); 
  //Get the data from performances in mongoDB
  $http.get('/api/performances/' + $scope.projectID).success(function(data) {
    $scope.performances = data.performancetables;
    // Time to execute the performance table review 
    $timeout( function(){
        $scope.chunksCat = [];
        refreshAlternatives();
        refresh();
        $scope.chunksCat = $scope.alternatives;
        //Update performance table if necessary
        $scope.confirmPerformance(); 
        refresh();
    }, 800);
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
    // if($scope.criteriaDone && $scope.alternativesDone && $scope.configurationsDone){
    //   document.getElementById('methodButtons').disabled = false;
    // } else{
    //   document.getElementById('methodButtons').disabled = true;
    // }
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
  $('#loading').show();
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
    $scope.alternative.name = '';
    $scope.alternative.description = '';
    refreshAlternatives();
    $scope.submitted=false;
    $scope.resetPerformanceTable();
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
  $('#loading').show();
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
      refreshAlternatives();
    })
    .error(function() {
      //console.log('Error: ' + i);
      var idx = $scope.alternatives.indexOf(alternative);
      if (idx >= 0) {
        $scope.alternatives.splice(idx, 1);
      }
      $scope.updateProject();
      refreshAlternatives();
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
    refreshAlternatives();
    $scope.alternative.name = '';
    $scope.alternative.description = '';
  });
  $scope.updateProject();
}

//Update the value and reset model
$scope.updateAlternative2 = function(alternative) {
  $('#loading').show();
  var i = alternative._id;
  alternative.name = $scope.model.name;
  alternative.description = $scope.model.description;
  $http.get('/api/alternative/' + i).success(function(response) {
        $scope.alternative = response;
    });

  $http.put('/api/alternative/' + i, alternative).success(function(response) {
    refreshAlternatives();
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
    // Show loader when execute button was clicked
    $('#loading').show();
    //$window.location.href = 'http://vps288667.ovh.net:5010/electreTriC/?projectId='+id+'&n='+n+'&project='+projectName;   
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

var refresh = function(){
  $http.get('/api/performances/' + $scope.projectID).success(function(data) {
      //console.log('I got the data I requested');
      $scope.project = data;
      $scope.performances = data.performancetables;
      checkStatus();
    });  
} 

//Create performance
$scope.createPerformance = function () {
  // var performance = new Performances();
  // performance.alternative = $scope.performance.alternative;
  // performance.criterion = $scope.performance.criterion;
  // performance.value = $scope.performance.value;
  // performance.$save(function (result) {
  //   $scope.performances.push(result);
  //   $scope.performance.alternative = '';
  //   $scope.performance.criterion = '';
  //   $scope.performance.value = '';
  // })
  var i = $scope.project._id;
  var performance = new Performances();
  performance.alternative = $scope.performance.alternative;
  performance.criterion = $scope.performance.criterion;
  performance.value = $scope.performance.value;
  $http.post('/api/performances/'+i, performance).success(function(response) {
    refresh();
    $scope.performance.alternative = '';
    $scope.performance.criterion = '';
    $scope.performance.value = '';
  });
  $scope.updateProject();
}

//Delete performance
$scope.deletePerformance = function(performance) {
  var i = performance._id;
  $http.delete('/api/performance/' + i)
    .success(function() {
      console.log("success");
      var idx = $scope.performances.indexOf(performance);
      if (idx >= 0) {
        $scope.performances.splice(idx, 1);
      }
    })
    .error(function() {
      //console.log('Error: ' + i);
      var idx = $scope.performances.indexOf(performance);
      if (idx >= 0) {
        $scope.performances.splice(idx, 1);
      }
    });
}

//Edit performance
$scope.editPerformance = function(performance) {
  var i = performance._id;
  console.log(i);
  $http.get('/api/performance/' + i).success(function(response) {
        $scope.performance = response;
    });
}

//Then save it or update it
$scope.updatePerformance = function() {
  console.log($scope.performance._id);
  $http.put('/api/performance/' + $scope.performance._id, $scope.performance).success(function(response) {
    refresh();
    $scope.performance.alternative = '';
    $scope.performance.criterion = '';
    $scope.performance.value = '';
  });
}

$scope.propertyName = 'alternative';
$scope.reverse = false;
// Count the performances created
$scope.j = 0;
//Create all performances
$scope.createPerformance2 = function (alternative, criterion, numAlt, numCri) {
  refreshAlternatives();
  refresh();
  var x = $scope.alternatives.length;
  // console.log(x);
  var xx = $scope.criterions.length;
  // console.log(xx);
  // var xxx = $scope.performances;
  // console.log(xxx);
  // var xxxx = $scope.performances.length;
  // console.log(xxxx);
  var i = 0;
  //See if performances data is empty
  if(i == $scope.performances.length || $scope.performances.length == 'undefined' || $scope.performances.length == null || $scope.performances.length == []){
    var numExistingPerformances = i;
  }else{
    var numExistingPerformances = $scope.performances.length;
  }
  var rightNumPerformances = x*xx;
  console.log(rightNumPerformances); //Number of performances that should be on the database 
  console.log(numExistingPerformances); //Number of performances that actual exist
  //var t = rightNumPerformances - 1; 
  
  //Create performances if performances on mongodb is empty or with the incorrect number of elements
  if(rightNumPerformances == numExistingPerformances){
      console.log("Don't create performance");
      //Nothing changed on the number of criteria and alternatives
  }else{
    if(numExistingPerformances == 0){
      //If it's empty create all performances
      //Create a performance
      console.log("Create performance");
      $scope.j = $scope.j + 1;
      console.log($scope.j);
      if($scope.j > rightNumPerformances){
        // It creates double number of rightNumPerformances because of ng-repeat
        console.log('Stop creating more performances...');
        if($scope.j == rightNumPerformances*2){
          $scope.resetChunks();
        }
        return 0;
      }
      var i = $scope.project._id;
      var performance = new Performances();
      performance.alternative = alternative.name;
      performance.criterion = criterion.name;
      performance.value = 0;
      $http.post('/api/performances/' + i, performance).success(function(response) {
        //refresh();
      });
      // See if it's the last performance to create if it is update the performance table
      if($scope.j == rightNumPerformances){
        console.log('Last performance being created...');
          refresh();
          //$scope.updateProject();
          $scope.resetChunks();
      }
    }else{
      //Delete all performances if it's length is not equal to zero or rightNumPerformances before creating all of them
      //deletePerformance2(); 
    }
  }
}

//Delete performance
$scope.deletePerformance2 = function() {
  var i = $scope.project._id;
  //Delete all performances 
  //Note it works but for some reason it prints the error message
  $http.delete('/api/performances/' + i)
    .success(function() {
      console.log("success");
      refresh();
    })
    .error(function() {
      //console.log('Error: fail deletes' );
      refresh();
  });
  //refresh();
}

// At the beginning see if alternatives or criteria where change to update the performance table 
$scope.confirmPerformance  = function() {
  var numCriteria = $scope.project.criteria.length;
  var numAlternatives = $scope.alternatives.length;
  var rightNumPerformances = numCriteria * numAlternatives;
  var numExistingPerformances = $scope.performances.length;
  console.log('Number of performances that should exist: ' + rightNumPerformances);
  console.log('Actual number of performances now: ' + numExistingPerformances);
  // Confirm size of table more than once, just to be sure that it was updated
  //for(var i = 0; i < 2; i++){
    if(numExistingPerformances == rightNumPerformances){
      console.log('Performance Table is current.');
        //Order performances by alternative before slicing it
        $scope.performances2 = orderBy($scope.performances, $scope.propertyName, $scope.reverse);
        //Get all performances to put them inside a table
        var i, l = $scope.performances.length;
        var x = $scope.criterions.length;
        // Slice the performances results so it can be put inside a table numAlternativeXnumCriteria
        $scope.chunks = [];
        for ( i = 0; i < l; i += x) {
            $scope.chunks.push( $scope.performances2.slice(i, i + x));
        }
        console.log('Done slicing performances');
        $('#loading').hide();
    }else{
      if(numExistingPerformances == 0){

      }else{
        //If number of criteria or alternatives was changed, update performance table
        $scope.deletePerformance2();
      }
      console.log('Performance Table has been updated.');
      $('#loading').hide();
    }
  //}
}

//Update the value 
$scope.updatePerformance2 = function(performance) {
  var i = performance._id;
  //console.log(i);
  $http.get('/api/performance/' + i).success(function(response) {
        $scope.performance = response;
    });

  $http.put('/api/performance/' + i, performance).success(function(response) {
    refresh();
  });
  $scope.updateProject();
}

$scope.resetChunks  = function() {
  $timeout( function(){ 
    //Order performances by alternative before slicing it
    $scope.performances2 = orderBy($scope.performances, $scope.propertyName, $scope.reverse);
    //Show all values on performance table
    var i, l = $scope.performances.length;
    var x = $scope.criterions.length;
    // Slice the performances results so it can be put inside a table numAlternativeXnumCriteria
    $scope.chunks = [];
    for ( i = 0; i < l; i += x) {
      $scope.chunks.push( $scope.performances2.slice(i, i + x));
    }
    var numCriteria = $scope.criterions.length;
    var numAlternatives = $scope.alternatives.length;
    var rightNumPerformances = numCriteria * numAlternatives;
    refresh();
    var numExistingPerformances = $scope.performances.length;
    console.log('Number of performances that should exist: ' + rightNumPerformances);
    console.log('Actual number of performances now: ' + numExistingPerformances);
    console.log('Done slicing performances');
    }, 1700);      
}

// If a alternative is created or deleted or even updated manually, update performance table from 0
$scope.resetPerformanceTable  = function() {
    $timeout( function(){
        $scope.j = 0;
        $scope.deletePerformance2();
        // Get alternatives updated
        $scope.chunksCat = [];
        refreshAlternatives();
        refresh();
        $scope.chunksCat = $scope.alternatives;
        console.log('Performance Table has been updated.');
        $('#loading').hide();
    }, 800);
}

}]);

//Export alternatives into a .csv file without the description column 
// app.directive('exportAlternativesToCsvWithoutDescription',function(){
//     return {
//       restrict: 'A',
//       link: function (scope, element, attrs) {
//         var el = element[0];
//           element.bind('click', function(e){
//             //var table = e.target.nextElementSibling;
//             var table = document.getElementById("alternativeTbl");
//             var csvString = '';
//             for(var i=0; i<table.rows.length;i++){
//               if(i == 1){
//                 //Ignore save/update line
//               }else{
//                 var rowData = table.rows[i].cells;
//                 for(var j=0; j<rowData.length-2;j++){ //number of columns to export
//                   csvString = csvString + rowData[j].innerHTML + ",";
//                 }
//                 csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
//                 csvString = csvString + "\n";
//               }
//           }
//             csvString = csvString.substring(0, csvString.length - 1);
//             var a = $('<a/>', {
//                 style:'display:none',
//                 href:'data:application/octet-stream;base64,'+btoa(csvString),
//                 download:'alternatives.csv'
//             }).appendTo('body')
//             a[0].click()
//             a.remove();
//           });
//       }
//     }
// });


//Export alternatives into a .csv file 
// app.directive('exportAlternativesToCsv',function(){
//     return {
//       restrict: 'A',
//       link: function (scope, element, attrs) {
//         var el = element[0];
//           element.bind('click', function(e){
//             //var table = e.target.nextElementSibling;
//             var table = document.getElementById("alternativeTbl");
//             var csvString = '';
//             for(var i=0; i<table.rows.length;i++){
//               if(i == 1){
//                 //Ignore save/update line
//               }else{
//                 var rowData = table.rows[i].cells;
//                 for(var j=0; j<rowData.length-1;j++){ //number of columns to export
//                   csvString = csvString + rowData[j].innerHTML + ",";
//                 }
//                 csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
//                 csvString = csvString + "\n";
//               }
//           }
//             csvString = csvString.substring(0, csvString.length - 1);
//             var a = $('<a/>', {
//                 style:'display:none',
//                 href:'data:application/octet-stream;base64,'+btoa(csvString),
//                 download:'alternatives.csv'
//             }).appendTo('body')
//             a[0].click()
//             a.remove();
//           });
//       }
//     }
// });

//Export performance table into a .csv file 
// app.directive('exportPerformanceToCsv',function(){
//     return {
//       restrict: 'A',
//       link: function (scope, element, attrs) {
//         var el = element[0];
//           element.bind('click', function(e){
//             //var table = e.target.nextElementSibling;
//             var table = document.getElementById("performanceTable");
//             var csvString = '';
//             for(var i=0; i<table.rows.length;i++){
//                 var rowData = table.rows[i].cells;
//                 for(var j=0; j<rowData.length;j++){ //number of columns to export
//                   // See if it's a header value or a first column value
//                   if(i == 0 || j == 0){ 
//                     csvString = csvString + rowData[j].innerHTML + ",";
//                   }else{
//                     csvString = csvString + rowData[j].children[0].value + ",";
//                   }
//                 }
//                 csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
//                 csvString = csvString + "\n";
//           }
//             csvString = csvString.substring(0, csvString.length - 1);
//             var a = $('<a/>', {
//                 style:'display:none',
//                 href:'data:application/octet-stream;base64,'+btoa(csvString),
//                 download:'performance_table.csv'
//             }).appendTo('body')
//             a[0].click()
//             a.remove();
//           });
//       }
//     }
// });

