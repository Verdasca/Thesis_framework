<!-- MCDA Framework structure -->

- server 					<!-- backend part -->
----- models				<!-- contains all models to be needed - schema strutures -->
----- controllers     		<!-- controllers between mongoose and node js -->
- config					<!-- databases to be used -->
----- db.js 				<!-- example of the path of a database being used -->
----- app.js 				<!-- example of the path of ports being used -->
- node_modules              <!-- created by npm install, contains all libs necessary for backend (use bower to install libs) -->
- client                    <!-- all frontend and angular stuff -->
----- css					<!-- all css files of each method -->
----- js
---------- controllers      <!-- angular controllers -->
---------- app.js           <!-- angular application - set up to use all the components created-->
---------- appRoutes.js     <!-- angular routes - put together which controllers belong to which view -->
---------- sortable.js     	<!-- sortable functions -->
----- img					<!-- images used -->
----- libs                  <!-- created by bower install -->
----- views 				<!-- different views/content for the workspace.html -->
----- home.html				<!-- main page -->
- .bowerrc                  <!-- tells bower where to put files (public/libs) -->
- bower.json                <!-- tells bower which files we need -->
- package.json              <!-- tells npm which packages we need -->
- server.js                 <!-- set up our node application -->


Starter kit + begin tutorial: https://scotch.io/tutorials/setting-up-a-mean-stack-single-page-application