var app = angular.module("performanceCtrl", []);

app.controller('performanceController', function($scope,$location) {
        $scope.changeView = function(view){
            $location.path(view); // path not hash
        }
        
        $scope.logout = function(){
            window.location = '/login.html';
        }   
});