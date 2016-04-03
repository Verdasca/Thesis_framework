// public/js/controllers/MainCtrl.js

// create the module and name it MainCtrl + create the controller and inject Angular's $scope
var app = angular.module("mainCtrl", []);

app.controller('mainController', function($scope) {
    $scope.logout = function(){
        window.location.href = 'http://localhost:8080/home'; 
    }    
});