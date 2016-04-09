app.factory('Api', ['$resource', function($resource) {

    return {
        // call to get all nerds
        get : function() {
            return $http.get('/criterions');
        },


                // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new nerd
        create : function(criterionData) {
            return $http.post('/criterion', criterionData);
        },

        // call to DELETE a nerd
        delete : function(id) {
            return $http.delete('/criterion/' + id);
        }

        Alternative: $resource('/api/alternative/:id', {id: '@id'})
    }       

}]);