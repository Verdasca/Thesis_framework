var app = angular.module("loginCtrl", []);

app.controller('loginController', [ '$scope', '$http', function($scope, $http) {

    // $scope.submit = function(){
    //     var uname = $scope.username;
    //     var pass = $scope.password;
    //     if($scope.username == 'admin' && $scope.password == 'admin'){
    //         $scope.errorMessage = '';
    //         window.location = '/projects.html';    
    //     }else if($scope.username == null || $scope.password == null){
    //         //Nothing happens - message already appears    
    //     }else{
    //         $scope.errorMessage = 'Incorrect username or password!';
    //     }    
    // }

    $scope.errorMessage = '';
    $scope.user = {username: '', password: ''};

    $scope.authenticate = function(){
        $scope.user.username = $scope.username;
        $scope.user.password = $scope.password;
        $http.post('/api/authenticate', $scope.user).success(function(data) {
            console.log(data);
            if(data.success){
                //window.location = '/projects.html?token='+data.token;
                window.location = '/projects.html';
            }else{
                $scope.errorMessage = data.message;
            }
        })
        .error(function(data) {
            $scope.errorMessage = 'Incorrect username or password!';
            console.log('Error: ' + data);
        }); 
    }

}]);