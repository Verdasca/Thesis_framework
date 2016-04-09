var myapp = angular.module('criterionCtrl', ['ui']);

myapp.controller('criterionController', function ($scope) {
    $scope.list = ["one", "two", "thre", "four", "five", "six"];
    
    $scope.logout = function(){
            window.location = '/login.html';
    }  
    
    $scope.criterions=[
        {
            "name" : "test",
            "description" : "nada",
            "direction" : "",
            "measure" : "",
            "weight" : "0",
            "rank" : ""
        }
    ];
    
});

angular.element(document).ready(function() {
  angular.bootstrap(document, ['criterionCtrl']);
});