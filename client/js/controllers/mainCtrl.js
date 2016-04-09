var app = angular.module("mainCtrl", []);

app.controller('mainController', function($scope,$location) {
        $scope.changeView = function(view){
            $location.path(view); // path not hash
        }
        
        $scope.logout = function(){
            window.location = '/login.html';
        }   
});
