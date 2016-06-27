var app = angular.module("registerCtrl", ['ngResource']);

app.controller('registerController', [ '$scope', '$http', '$resource', function($scope, $http, $resource) {

    var User = $resource('/api/users');
    $scope.userinfo = {username: '', password: '', name: ''};

    $scope.createUser = function(){
        $scope.userinfo.name = $scope.name;
        $scope.userinfo.username = $scope.username;
        $scope.userinfo.password = $scope.password;
        var user = new User();
        user.name = $scope.userinfo.name;
        user.username = $scope.userinfo.username;
        user.password = $scope.userinfo.password;
        $http.post('/api/users', user).success(function(response) {
            $scope.name = '';
            $scope.username = '';
            $scope.password = '';
        });
        $scope.doneMessage = 'Sign up complete!';
    }

}]);