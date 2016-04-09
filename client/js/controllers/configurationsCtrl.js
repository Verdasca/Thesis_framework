var app = angular.module("configurationsCtrl", []);

app.controller('configurationsController', function($scope,$location) {
        $scope.changeView = function(view){
            $location.path(view); // path not hash
        }
        
        $scope.logout = function(){
            window.location = '/login.html';
        }   
});