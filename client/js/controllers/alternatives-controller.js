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

}]);