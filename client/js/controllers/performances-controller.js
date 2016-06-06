var app = angular.module("performances-controller", ['ngRoute', 'ngResource', 'ngSanitize', 'ngCsv', 'appRoutes', 'mainCtrl', 'ui']);

app.controller('performancesController', ['$scope', '$http', '$resource', '$timeout', function ($scope, $http, $resource, $timeout) {

//Get the data from criterions in mongoDB
$http.get('/api/criterions').success(function(data) {
  $scope.criterions = data;
  })
  .error(function(data) {
    console.log('Error: ' + data);
}); 

//Get the data from alternatives in mongoDB
$http.get('/api/alternatives').success(function(data) {
  $scope.alternatives = data;
  })
  .error(function(data) {
    console.log('Error: ' + data);
});   

var Performances = $resource('/api/performances');

//Get the data from performances in mongoDB
$http.get('/api/performances').success(function(data) {
  $scope.performances = data;
  })
  .error(function(data) {
    console.log('Error: ' + data);
});

var refresh = function(){
  $http.get('/api/performances').success(function(response) {
    console.log('I got the data I requested');
        $scope.performances = response;
    });  
}  

//Create performance
$scope.createPerformance = function () {
  var performance = new Performances();
  performance.alternative = $scope.performance.alternative;
  performance.criterion = $scope.performance.criterion;
  performance.value = $scope.performance.value;
  performance.$save(function (result) {
    $scope.performances.push(result);
    $scope.performance.alternative = '';
    $scope.performance.criterion = '';
    $scope.performance.value = '';
  })
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

$scope.init = function (numAlt, numCri, altName, criName) {
  // $http.get('/api/alternatives').success(function(data) {
  //   $scope.alts = data;
  // })
  // $http.get('/api/criterions').success(function(data) {
  //   $scope.cris = data;
  // })
$http.get('/api/performances').success(function(data) {
  $scope.perf = data;
  })
$scope.teste2 = numAlt + numCri + altName + criName;
  var numAlternatives = numAlt;
  var numCriteria = numCri;
  //for (var i = 5; i < numAlternatives; i++) {
    //var alt = dataA[i].name;
    //var alt = $scope.alts[i].name;
    //for(var j = 0; j < numCriteria; j++){
      //var cri = $scope.cris[j].name;
      var performance = new Performances();
      performance.alternative = altName;
      performance.criterion = criName;
      performance.value = 0;
      performance.$save(function (result) {
        $scope.perf.push(result);
      })
    }
  //}
//}


//$scope.perfs = Performances.query();
//Create performance
$scope.createPerformance2 = function (alternative, criterion, numAlt, numCri) {
  //var n = alternative.name; var c = criterion.name; 
  // var i = alternative._id;
  // console.log(i);
  // $http.get('/api/alternative/' + i).success(function(response) {
  //       $scope.alternative = response.name;
  //   });
  // var ii = criterion._id;
  // console.log(i);
  // $http.get('/api/criterion/' + ii).success(function(response) {
  //       $scope.criterion = response.name;
  //   });
  //var x = 0;
  //Get performances data 



  var x = $scope.alternatives;
  console.log(x);
  var xx = $scope.criterions;
  console.log(xx);
  var xxx = $scope.performances;
  console.log(xxx);
  var xxxx = $scope.performances.length;
  console.log(xxxx);
  var i = 0;
  //See if performances data is empty
  if(i == $scope.performances.length || $scope.performances.length == 'undefined' || $scope.performances.length == null || $scope.performances.length == []){
    var numExistingPerformances = i;
  }else{
    var numExistingPerformances = $scope.performances.length;
  }
  var rightNumPerformances = numAlt*numCri;
  console.log(rightNumPerformances); //Number of performances that should be on the database 
  console.log(numExistingPerformances); //Number of performances that actual exist
  //Create performances if performances on mongodb is empty or with the incorrect number of elements
  if(rightNumPerformances == numExistingPerformances){
      console.log("Don't create performance");
      //Nothing changed on the number of criteria and alternatives
  }else{
    if(numExistingPerformances == 0){
      //If it's empty create all perfomances
      //Create a performance
      console.log("Create performance");
      var performance = new Performances();
      performance.alternative = alternative.name;
      performance.criterion = criterion.name;
      performance.value = 0;
      performance.$save(function (result) {
        $scope.performances.push(result);
      })
    }else{
      //Delete all performances if it's length is not equal to zero or rightNumPerformances before creating all of them
      //deletePerformance2(); da problema pk execute varias vezes no ng-repeat
    }
  }

//   x = $http.get('/api/performances').length;
//   console.log(x);
//   var Pp = $resource('/api/performances');
//   $scope.allP = Pp.query();
//   var p = $scope.allP.length;
// console.log(p);
//TODO: ver como consigo descobrir se a collecao ta vazia ou não, pk vazia ta a dar erro
  //Check if any alternative or criterion was added or deleted
  //console.log(!numPerf);
  //console.log(numPerf);
  //var l2 = Performances.count;
  //var l = Performances.length;
  //console.log(numPerf);
  //console.log($scope.per.length);
  //console.log(l2);
  //console.log($scope.performances.count);
  ////console.log('vazio');
    //var numExistingPerformances = 0;
  //}else{
  //var numExistingPerformances = $scope.performances.length;
  //}
  // if(l == 'undefined' ||  l == null ||  l == '' || l == 0){
  //   console.log('vazio');
  //   var numExistingPerformances = 0;
  // }else{
  //   var numExistingPerformances = $scope.performances.length;
  // }
  //console.log($scope.per);
  
  //var i = $scope.performances.length;
  //console.log($scope.performances.count);
  //console.log($scope.performances);
  // if( i == 'undefined' ||  i == null ||  i == '' || i == 0){
  //    var numExistingPerformances = 0;
  //  } else{
      //var numExistingPerformances = $scope.performances.length;
  //  }
  //console.log(rightNumPerformances); //Number of performances that should be on the database 
  //console.log(numExistingPerformances);
    //if(rightNumPerformances == numExistingPerformances){
      //console.log("Don't create performance");
      //Nothing changed on the number of criteria and alternatives
    //}else{

      //Create a performance
      // console.log("Create performance");
      // var performance = new Performances();
      // performance.alternative = alternative.name;
      // performance.criterion = criterion.name;
      // performance.value = 0;
      // performance.$save(function (result) {
      //   $scope.performances.push(result);
      // })

    //}
}

//$scope.firstTime = true;
//Delete performance
$scope.deletePerformance2 = function() {
  // var first = $scope.firstTime; 
  // var numC = $scope.criterions.length;
  // console.log(numC);
  // var numA = $scope.alternatives.length;
  // console.log(numA);  
  //var numP = $scope.performances.length;
  // var numP = t;
  // console.log(numP);
  // if(numP == numC*numA || numP == 0){
  //   //Do nothing
  //   $scope.firstTime = false;
  // }else if(!first){
  //   //Do nothing
  // }else{
  //   $scope.firstTime = false;
  //Delete all performances 
  //Note it works but for some reason it prints the error message
  $http.delete('/api/performances')
    .success(function() {
      console.log("success");
    })
    .error(function() {
      //console.log('Error: fail deletes' );
    });
    refresh();
  //}
}

// At the beginning see if alternatives or criteria where change to update the performance table 
$scope.confirmPerformance  = function() {
  var numCriteria = $scope.criterions.length;
  var numAlternatives = $scope.alternatives.length;
  var rightNumPerformances = numCriteria * numAlternatives;
  var numExistingPerformances = $scope.performances.length;
  console.log('Number of performances that should exist: ' + rightNumPerformances);
  console.log('Actual number of performances now: ' + numExistingPerformances);
  // Confirm size of table more than once, just to be sure that it was updated
  for(var i = 0; i < 2; i++){
    if(numExistingPerformances == rightNumPerformances){
      console.log('Performance Table is current.');
    }else{
      //If number of criteria or alternatives was changed, update performance table
      $scope.deletePerformance2();
      console.log('Performance Table has been updated.');
    }
  }
}

// Time to execute the performance table review 
$timeout( function(){ $scope.confirmPerformance(); }, 400);

//Update the value 
$scope.updatePerformance2 = function(performance) {
  var i = performance._id;
  console.log(i);
  //console.log($scope.performances.length);
  $http.get('/api/performance/' + i).success(function(response) {
        $scope.performance = response;
    });
  //console.log(performance.value);
  //console.log(performance);
  //console.log($scope.performance._id);
  //var value = performance.value;
  //$scope.performance.value = performance.value;
  $http.put('/api/performance/' + i, performance).success(function(response) {
    //refresh();
  });
}

}]);

// app.run(function($scope, $timeout) {
//     console.log('starting run');
//     $timeout(function() { $scope.confirmPerformance(); }, 3000);
// });
