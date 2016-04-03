// public/js/appRoutes.js

//routes for the index/main page
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

            // route for the home page
            .when('/home', {
                templateUrl : 'views/home.html',
                controller  : 'mainController'
            })

            // route for the about page
            .when('/about', {
                templateUrl : 'views/about.html',
                controller  : 'aboutController'
            })

            // route for the contact page
            .when('/contact', {
                templateUrl : 'views/contact.html',
                controller  : 'contactController'
            })

            // route for the login page
            .when('/login', {
                templateUrl : 'views/login.html',
                controller  : 'loginController'
            })
            
            // route for the register/sign up page
            .when('/register', {
                templateUrl : 'views/register.html',
                controller  : 'registerController'
            });
            
    $locationProvider.html5Mode(true);

}]);

//routes for the workspace page
angular.module('workspaceRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

            // route for the home page
            .when('/workspace', {
                templateUrl : 'workspace.html',
                controller  : 'mainController'
            });
            
    $locationProvider.html5Mode(true);

}]);