//routes for the workspace page
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', function($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider) {

    $routeProvider
            //.otherwise('/home')
            // route for the workspace page
            .when('/', {
                templateUrl : 'workspace.html',
                controller  : 'mainController',
                redirectTo  : "/home" 
            })
            .when('/home', {
                template : '<div id="content"><h1>Welcome to MCDA Framework</h1></div>'
            });
            
            // route for the workspace page
            // .when('/criterion', {
            //     templateUrl : 'views/criterion.html',
            //     //templateUrl : 'templates/views/criterion.html',
            //     controller  : 'criterionsController'
            // })
            
            // // route for the workspace page
            // .when('/alternative', {
            //     templateUrl : 'views/alternative.html',
            //     controller  : 'alternativesController'
            // })
            
            // // route for the workspace page
            // .when('/performance', {
            //     templateUrl : 'views/performance.html',
            //     controller  : 'performancesController'
            // });
            
            // route for the workspace page
            // .when('/configurations', {
            //     templateUrl : 'views/configurations.html',
            //     controller  : 'configurationsController'
            // });
            
    $locationProvider.html5Mode(true);

    // $stateProvider
    // .state('alternative', {
    //     url: "alternative/:id",
    //     templateUrl: 'alternative.html',
    //     controller: 'alternativesController'
    // })
    // .state('projects.html', {
    //     url: "projects.html",
    //     params: {
    //         id: null
    //     },
    //     templateUrl: 'projects.html',  
    //     controller: 'projectsController'
    // })
    // .state('criterion.html', {
    //     url: "criterion.html/project/:id",
    //     templateUrl: 'criterion.html',
    //     controller: 'criterionsController'
    // });

}]);
