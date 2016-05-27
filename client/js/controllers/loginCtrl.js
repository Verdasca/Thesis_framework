var app = angular.module("loginCtrl", []);

app.controller('loginController', function($scope) {

    $scope.submit = function(){
        var uname = $scope.username;
        var pass = $scope.password;
        if($scope.username == 'admin' && $scope.password == 'admin'){
            $scope.errorMessage = '';
            window.location = '/workspace.html';    
        }else if($scope.username == null || $scope.password == null){
            //Nothing happens - message already appears    
        }else{
            $scope.errorMessage = 'Incorrect username or password!';
        }    
    }

});