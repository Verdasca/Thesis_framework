var app = angular.module("alternatives-controller", ['ngRoute', 'ngResource', 'ngSanitize', 'ngCsv', 'appRoutes', 'mainCtrl', 'ui']);

app.controller('alternativesController', ['$scope', '$http', '$resource', function ($scope, $http, $resource) {

var Alternatives = $resource('/api/alternatives');

var refresh = function(){
  $http.get('/api/alternatives').success(function(response) {
    console.log('I got the data I requested');
        $scope.alternatives = response;
    });  
}

$http.get('/api/alternatives').success(function(data) {
  $scope.alternatives = data;
  })
  .error(function(data) {
    console.log('Error: ' + data);
});


  // $scope.createAlternative = function () {
  //   var alternative = new Alternative();
  //   alternative.name = $scope.alternativeName;
  //   alternative.description = $scope.alternativeDescription;
  //   alternative.$save(function (result) {
  //     $scope.alternatives.push(result);
  //     $scope.alternativeName = '';
  //     $scope.alternativeDescription = ''
  //   });
  // } 

//Create alternative
$scope.createAlternative = function () {
  var alternative = new Alternatives();
  alternative.name = $scope.alternative.name;
  alternative.description = $scope.alternative.description;
  alternative.$save(function (result) {
    $scope.alternatives.push(result);
    $scope.alternative.name = '';
    $scope.alternative.description = '';
  })
}

//Delete alternative
$scope.deleteAlternative = function(alternative) {
  var i = alternative._id;
  $http.delete('/api/alternative/' + i)
    .success(function() {
      console.log("success");
      var idx = $scope.alternatives.indexOf(alternative);
      if (idx >= 0) {
        $scope.alternatives.splice(idx, 1);
      }
    })
    .error(function() {
      //console.log('Error: ' + i);
      var idx = $scope.alternatives.indexOf(alternative);
      if (idx >= 0) {
        $scope.alternatives.splice(idx, 1);
      }
    });
}

  // $scope.deleteAlternative = function(alternative) {
  //   var idx = $scope.alternatives.indexOf(alternative);
  //   if (idx >= 0) {
  //     $scope.alternatives.splice(idx, 1);
  //   }
  //   alternative.$remove('/api/alternative/' + alternative.id);
  // };

// $scope.deleteAlternative = function(idx) {
//   var person_to_delete = $scope.alternatives[idx];
// var Alternative2 = $resource('/api/alternative/' + person_to_delete.id);
//   Alternative2.delete({ id: person_to_delete.id }, function (success) {
//     $scope.alternatives.splice(idx, 1);
//   });
// };

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
}

$scope.getAlternatives = function(){
$http.get('/api/alternatives').success(function(data) {
  $scope.alternatives = data;
  })
  .error(function(data) {
    console.log('Error: ' + data);
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
              var rowData = table.rows[i].cells;
              for(var j=0; j<rowData.length-2;j++){ //number of columns to export
                csvString = csvString + rowData[j].innerHTML + ",";
              }
              csvString = csvString.substring(0,csvString.length); // -1); //delete the last values which is a coma (,)
              csvString = csvString + "\n";
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
              var rowData = table.rows[i].cells;
              for(var j=0; j<rowData.length-1;j++){ //number of columns to export
                csvString = csvString + rowData[j].innerHTML + ",";
              }
              csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
              csvString = csvString + "\n";
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


