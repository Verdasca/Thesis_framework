//routes for the workspace page
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
            // route for the workspace page
            .when('/', {
                templateUrl : 'workspace.html',
                controller  : 'mainController'
            })
            
            // route for the workspace page
            .when('/criterion', {
                templateUrl : 'views/criterion.html',
                controller  : 'criterionsController'
            })
            
            // route for the workspace page
            .when('/alternative', {
                templateUrl : 'views/alternative.html',
                controller  : 'alternativesController'
            })
            
            // route for the workspace page
            .when('/performance', {
                templateUrl : 'views/performance.html',
                controller  : 'performancesController'
            })
            
            // route for the workspace page
            .when('/configurations', {
                templateUrl : 'views/configurations.html',
                controller  : 'configurationsController'
            });
            
    $locationProvider.html5Mode(true);

}]);
