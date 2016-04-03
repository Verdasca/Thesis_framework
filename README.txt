<!-- MCDA Framework structure -->

- app 						<!-- backend part -->
----- models/				<!-- contains all models to be needed - schema strutures -->
---------- nerd.js      	<!-- the nerd model to handle CRUD - an example -->
----- routes.js 			<!-- functions to be executed on the models - nodejs to DB -->
- config					<!-- databases to be used -->
----- db.js 				<!-- example of the path of a database being used -->
- node_modules              <!-- created by npm install -->
- public                    <!-- all frontend and angular stuff -->
----- css
----- js
---------- controllers      <!-- angular controllers -->
---------- services         <!-- angular services - functions that will call the backend functions -->
---------- app.js           <!-- angular application - set up to use all the components created-->
---------- appRoutes.js     <!-- angular routes - put together which controllers belong to which view -->
----- img					<!-- images used -->
----- libs                  <!-- created by bower install -->
----- views 				<!-- different views/content for the index.html -->
---------- home.html
---------- nerd.html
----- index.html			<!-- main page -->
- .bowerrc                  <!-- tells bower where to put files (public/libs) -->
- bower.json                <!-- tells bower which files we need -->
- package.json              <!-- tells npm which packages we need -->
- server.js                 <!-- set up our node application -->


Starter kit + begin tutorial: https://scotch.io/tutorials/setting-up-a-mean-stack-single-page-application