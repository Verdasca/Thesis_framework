var app = angular.module("configurations-controller", ['ngRoute', 'ui.router', 'ngResource', 'ngSanitize', 'ngCsv', 'appRoutes', 'ui']);

app.controller('configurationsController', ['$scope', '$http', '$resource', '$timeout', 'orderByFilter', '$location', '$window', function ($scope, $http, $resource, $timeout, orderBy, $location, $window) {

$scope.projectID = $location.search().projectId;
$scope.username = $location.search().n;
$scope.criteriaDone = false;
$scope.alternativesDone = false;
$scope.configurationsDone = false;

var Categories = $resource('/api/categories');
var Parameters = $resource('/api/parameters');
var Profiles = $resource('/api/profiles');

// Hide loader and importing
$('#importing').hide();

//Get all data when loading body
$scope.run = function () {
  //Get the data from criterions in mongoDB
  $http.get('/api/criterions/' + $scope.projectID).success(function(data) {
    $scope.project = data;
    $scope.criterions = data.criteria;
    })
    .error(function(data) {
      console.log('Error: ' + data);
  }); 

  //Get the data from categories in mongoDB
  $http.get('/api/categories/' + $scope.projectID).success(function(data) {
    $scope.project = data;
    $scope.categories = data.categories;
    })
    .error(function(data) {
      console.log('Error: ' + data);
  });  

  //Get the data from profiles in mongoDB
  $http.get('/api/profiles/' + $scope.projectID).success(function(data) {
    $scope.project = data;
    $scope.profiles = data.profiletables;
    })
    .error(function(data) {
      console.log('Error: ' + data);
  });
}

$http.get('/api/userFind/' + $scope.username).success(function(data) {
  $scope.user = data;
  })
  .error(function(data) {
    console.log('Error: ' + data);
});  

//Get the data from criterions in mongoDB
$http.get('/api/criterions/' + $scope.projectID).success(function(data) {
  $scope.project = data;
  $scope.criterions = data.criteria;
  })
  .error(function(data) {
    console.log('Error: ' + data);
});    

// Refresh the page current data after closing the import section (so the data on the page is actualized with the imported data)
$scope.refreshBeforeClosing = function(){
  $('#loading').show();
  $scope.updateProject();
  refresh();
  refreshCriteria();
  refreshParameter();
  refreshProfiles();
  $timeout( function(){
    $scope.chunksCat = [];
    $scope.chunksCat = $scope.categories;
    //Update profile table if necessary
    $scope.confirmProfile(); 
    refreshProfiles();
  }, 1000);
}

// Reset profile perf. table if criteria or categories were imported
$scope.refreshNewProfileBeforeClosing = function(){
  $('#loading').show();
  $scope.updateProject();
  refresh();
  refreshCriteria();
  refreshParameter();
  refreshProfiles();
  $scope.resetProfileTable();
}

// Refresh profile perf. table if imported
$scope.refreshProfilesBeforeClosing = function(){
  $('#loading').show();
  $scope.updateProject();
  $http.get('/api/parameters/' + $scope.projectID).success(function(data) {
    $scope.parameters = data.parameters;
  })
  $http.get('/api/criterions/' + $scope.projectID).success(function(data) {
    $scope.criterions = data.criteria;
    $http.get('/api/categories/' + $scope.projectID).success(function(data) {
      $scope.project = data;
      $scope.categories = data.categories;
      $http.get('/api/profiles/' + $scope.projectID).success(function(data) {
        $scope.profiles = data.profiletables;
        $scope.chunksCat = [];
        $scope.chunksCat = $scope.categories;
        //Order profiles by action before slicing it
        $scope.profiles2 = orderBy($scope.profiles, $scope.propertyName, $scope.reverse);
        //Get all profiles to put them inside a table
        var i, l = $scope.profiles.length;
        var x = $scope.criterions.length;
        // Slice the profiles results so it can be put inside a table numAlternativeXnumCriteria
        $scope.chunks = [];
        for ( i = 0; i < l; i += x) {
            $scope.chunks.push( $scope.profiles2.slice(i, i + x));
        }
        console.log('Done slicing profiles');
        $('#loading').hide();
      });  
    }); 
  });
}

var refreshCriteria = function(){
  $http.get('/api/criterions/' + $scope.projectID).success(function(data) {
    //console.log('I got the data I requested');
    $scope.project = data;
    $scope.criterions = data.criteria;
  });  
}  

//Get the data from categories in mongoDB
$http.get('/api/categories/' + $scope.projectID).success(function(data) {
  $scope.project = data;
  $scope.categories = data.categories;
  //Get the data from profiles in mongoDB
  $http.get('/api/profiles/' + $scope.projectID).success(function(data) {
      $scope.profiles = data.profiletables;
      // Time to execute the profile table review 
      $timeout( function(){
          $scope.chunksCat = [];
          refresh();
          refreshCriteria(); 
          refreshProfiles();
          $scope.chunksCat = $scope.categories;
          //Update profile table if necessary
          $scope.confirmProfile(); 
          refreshProfiles();
      }, 500);
    })
    .error(function(data) {
      console.log('Error: ' + data);
  });
  if($scope.project.criteria.length == 0){
      document.getElementById('sectionsCriteria').style.backgroundColor = '#ff3333';
      $scope.criteriaDone = false;
    }else{
      document.getElementById('sectionsCriteria').style.backgroundColor = '#6fdc6f';
      $scope.criteriaDone = true;
    }
    if($scope.project.alternatives.length == 0 || $scope.project.performancetables.length == 0){
      document.getElementById('sectionsAlternatives').style.backgroundColor = '#ff3333';
      $scope.alternativesDone = false;
    }else{
      document.getElementById('sectionsAlternatives').style.backgroundColor = '#6fdc6f';
      $scope.alternativesDone = true;
    }
    if($scope.project.profiletables.length == 0 || $scope.project.categories.length == 0 || $scope.project.parameters.length == 0){
      document.getElementById('sectionsConfigurations').style.backgroundColor = '#ff3333';
      $scope.configurationsDone = false;
    }else{
      document.getElementById('sectionsConfigurations').style.backgroundColor = '#6fdc6f';
      $scope.configurationsDone = true;
    }
    if($scope.criteriaDone && $scope.alternativesDone && $scope.configurationsDone){
      document.getElementById('sectionsResults').style.backgroundColor = '#6fdc6f';
    } else{
      document.getElementById('sectionsResults').style.backgroundColor = '#ff3333';
    }
  })
  .error(function(data) {
    console.log('Error: ' + data);
});

var refresh = function(){
  $http.get('/api/categories/' + $scope.projectID).success(function(data) {
    $scope.project = data;
    $scope.categories = data.categories;
    //checkStatus();
  });  
}  

// Update status to see if the execute button can be pressed
var checkStatus = function(){
  if($scope.project.profiletables.length == 0 || $scope.project.categories.length == 0 || $scope.project.parameters.length == 0){
    document.getElementById('sectionsConfigurations').style.backgroundColor = '#ff3333';
    $scope.configurationsDone = false;
  }else{
    document.getElementById('sectionsConfigurations').style.backgroundColor = '#6fdc6f';
    $scope.configurationsDone = true;
  }
  if($scope.criteriaDone && $scope.alternativesDone && $scope.configurationsDone){
    document.getElementById('sectionsResults').style.backgroundColor = '#6fdc6f';
  } else{
    document.getElementById('sectionsResults').style.backgroundColor = '#ff3333';
  }
}

//Create category
$scope.createCategory = function () {
  $('#loading').show();
  // var category = new Categories();
  // category.name = $scope.category.name;
  // category.rank = $scope.category.rank;
  // category.action = $scope.category.action;
  // category.$save(function (result) {
  //   $scope.categories.push(result);
  //   $scope.category.name = '';
  //   $scope.category.rank = '';
  //   $scope.category.action = '';
  // })

  var i = $scope.project._id;
  var rank = $scope.categories.length + 1;
  var category = new Categories();
  category.name = $scope.category.name;
  category.rank = rank;
  category.action = $scope.category.action;
  $http.post('/api/categories/' + i, category).success(function(response) {
    refresh();
    $scope.category.name = '';
    $scope.category.action = '';
    $scope.submitted=false; 
    $scope.resetProfileTable();
  });
  $scope.updateProject();
}

//Delete category
$scope.deleteCategory = function(category) {
  $('#loading').show();
  var i = $scope.project._id;
  var id = category._id;
  var r = confirm("Are you sure you want to delete the category "+category.name+ "?");
  if(r){
    $http.delete('/api/category/' + i + '/' + id)
      .success(function() {
        console.log("success");
        var idx = $scope.categories.indexOf(category);
        if (idx >= 0) {
          $scope.categories.splice(idx, 1);
        }
        $scope.updateProject();
        refresh();
        checkStatus();
        $scope.resetProfileTable();
      })
      .error(function() {
        //console.log('Error: ' + i);
        var idx = $scope.categories.indexOf(category);
        if (idx >= 0) {
          $scope.categories.splice(idx, 1);
        }
        $scope.updateProject();
        refresh();
        checkStatus();
      });
  }else{
    $('#loading').hide();
  }
}

//Edit category
$scope.editCategory = function(category) {
  var i = category._id;
  console.log(i);
  $http.get('/api/category/' + i).success(function(response) {
        $scope.category = response;
    });
}

//Then save it or update it
$scope.updateCategory = function() {
  //console.log($scope.category._id);
  $http.put('/api/category/' + $scope.category._id, $scope.category).success(function(response) {
    refresh();
    $scope.category.name = '';
    $scope.category.action = '';
  });
}


//Update the value and reset model
$scope.updateCategory2 = function(category) {
  $('#loading').show();
  var i = category._id;
  category.name = $scope.model.name;
  category.action = $scope.model.action;
  $http.get('/api/category/' + i).success(function(response) {
        $scope.category = response;
  });

  $http.put('/api/category/' + i, category).success(function(response) {
    refresh();
    $scope.category.name = '';
    $scope.category.action = '';
  });
  $scope.updateProject();
  $scope.reset();
}

// Create model that will contain the category to edit
$scope.model = {};

// gets the template to ng-include for a table row / item
$scope.getTemplate = function (category) {
  var i = category._id;
  if (i === $scope.model._id){ 
    return 'edit';
  }else{ 
    return 'display';
  }
}

$scope.editCategory2 = function (category) {
  var i = category._id;
  $scope.model = angular.copy(category);
}

// Reset model
$scope.reset = function () {
  $scope.model = {};
}

// Up category rank
$scope.upRank = function (category) {
  var i = category._id;
  var rank = category.rank;
  var nextRank = category.rank - 1;
  if(category.rank == 1){
    // Do nothing, its already the higher rank possible
    return 0;
  }else{
    // Get category with the next rank to switch ranks and save changes on DB
    $http.get('/api/categoryRank/' + $scope.projectID +'/'+ nextRank).success(function(data) {
      $scope.category2 = data;
      $scope.category2[0].rank = rank;
      //console.log('category id: '+ $scope.category2[0]._id +' and actual cat:'+i);
      $http.put('/api/category/' + $scope.category2[0]._id, $scope.category2[0]).success(function(response) {
        refresh();
      });
      category.rank = nextRank;
      $http.put('/api/category/' + i, category).success(function(response) {
        refresh();
      });
    })
    .error(function(data) {
      console.log('Error: ' + data);
  }); 
  }
}

// Down category rank
$scope.downRank = function (category) {
  var i = category._id;
  var rank = category.rank;
  var previousRank = category.rank + 1;
  if(category.rank == $scope.project.categories.length){
    // Do nothing, its already the lowest rank possible (size of categories)
    return 0;
  }else{
    // Get category with the next rank to switch ranks and save changes on DB
    $http.get('/api/categoryRank/' + $scope.projectID +'/'+ previousRank).success(function(data) {
      $scope.category2 = data;
      $scope.category2[0].rank = rank;
      $http.put('/api/category/' + $scope.category2[0]._id, $scope.category2[0]).success(function(response) {
        refresh();
      });
      category.rank = previousRank;
      $http.put('/api/category/' + i, category).success(function(response) {
        refresh();
      });
    })
    .error(function(data) {
      console.log('Error: ' + data);
  }); 
  }
}

//Then save it or update it
$scope.updateCategory = function() {
  //console.log($scope.category._id);
  $http.put('/api/category/' + $scope.category._id, $scope.category).success(function(response) {
    refresh();
    $scope.category.name = '';
    $scope.category.action = '';
  });
}

//Get parameter in mongoDB
$http.get('/api/parameters/' + $scope.projectID).success(function(data) {
  $scope.project = data;
  $scope.parameters = data.parameters;
  })
  .error(function(data) {
    console.log('Error: ' + data);
}); 

var refreshParameter = function(){
  $http.get('/api/parameters/' + $scope.projectID).success(function(response) {
    $scope.project = response;
    $scope.parameters = response.parameters;
    //checkStatus();
  });  
}  

//Create parameter
$scope.createParameter = function () {
  // var parameter = new Parameters();
  // parameter.credibility = 0.7;
  // parameter.$save(function (result) {
  //   $scope.parameters.push(result);
  // })

  var i = $scope.project._id;
  var parameter = new Parameters();
  parameter.credibility = 0.7;
  $http.post('/api/parameters/' + i, parameter).success(function(response) {
    refreshParameter();
  });
  $scope.updateProject();
}

//Then save it or update it
$scope.updateParameter = function(parameter) {
  var i = parameter._id;
  $http.get('/api/parameter/' + i).success(function(response) {
        $scope.parameter = response;
    });

  $http.put('/api/parameter/' + i, parameter).success(function(response) {
    //refreshParameter();
  });
  $scope.updateProject();
}

var refreshProfiles = function(){
  $http.get('/api/profiles/' + $scope.projectID).success(function(data) {
    $scope.project = data;
    $scope.profiles = data.profiletables;
    //checkStatus();
  });  
}  

//Create profile
$scope.createProfile = function () {
  // var profile = new Profiles();
  // profile.action = $scope.profile.action;
  // profile.criterion = $scope.profile.criterion;
  // profile.value = $scope.profile.value;
  // profile.$save(function (result) {
  //   $scope.profiles.push(result);
  //   $scope.profile.action = '';
  //   $scope.profile.criterion = '';
  //   $scope.profile.value = '';
  // })

  var i = $scope.project._id;
  var profile = new Profiles();
  profile.action = $scope.profile.action;
  profile.criterion = $scope.profile.criterion;
  profile.value = $scope.profile.value;
  $http.post('/api/profiles/' + i, profile).success(function(response) {
    refreshProfiles();
    $scope.profile.action = '';
    $scope.profile.criterion = '';
    $scope.profile.value = '';
  });
}

//Delete profile
$scope.deleteProfile = function(profile) {
  var i = profile._id;
  $http.delete('/api/profile/' + i)
    .success(function() {
      console.log("success");
      var idx = $scope.profiles.indexOf(profile);
      if (idx >= 0) {
        $scope.profiles.splice(idx, 1);
      }
    })
    .error(function() {
      //console.log('Error: ' + i);
      var idx = $scope.profiles.indexOf(profile);
      if (idx >= 0) {
        $scope.profiles.splice(idx, 1);
      }
    });
}

//Edit profile
$scope.editProfile = function(profile) {
  var i = profile._id;
  console.log(i);
  $http.get('/api/profile/' + i).success(function(response) {
        $scope.profile = response;
    });
}

//Then save it or update it
$scope.updateProfile = function() {
  console.log($scope.profile._id);
  $http.put('/api/profile/' + $scope.profile._id, $scope.profile).success(function(response) {
    refreshProfiles();
    $scope.profile.action = '';
    $scope.profile.criterion = '';
    $scope.profile.value = '';
  });
}


// Count the profiles created
$scope.j = 0;
//Create all profiles
$scope.createProfile2 = function (category, criterion, numCat, numCri) {
  refresh();
  refreshProfiles();
  var x = $scope.categories.length;
  //console.log(x);
  var xx = $scope.criterions.length;
  //console.log(xx);
  // var xxx = $scope.profiles;
  // console.log(xxx);
  // var xxxx = $scope.profiles.length;
  // console.log(xxxx);
  var i = 0;
  //See if profiles data is empty
  if(i == $scope.profiles.length || $scope.profiles.length == 'undefined' || $scope.profiles.length == null || $scope.profiles.length == []){
    var numExistingProfiles = i;
  }else{
    var numExistingProfiles = $scope.profiles.length;
  }
  var rightNumProfiles = x*xx;
  console.log(rightNumProfiles); //Number of profiles that should be on the database 
  console.log(numExistingProfiles); //Number of profiles that actual exist
  
  //Create profiles if profiles on mongodb is empty or with the incorrect number of elements
  if(rightNumProfiles == numExistingProfiles){
      console.log("Don't create profile");
      //Nothing changed on the number of criteria and categories
  }else{
    if(numExistingProfiles == 0){
        //If it's empty create all profiles
        //Create a profile
        console.log("Create profile");
        $scope.j = $scope.j + 1;
        console.log($scope.j);
        if($scope.j > rightNumProfiles){
            // It creates double number of rightNumProfiles for some reason because the caregories length changes for a ng-repeat
            console.log('Stop creating more profiles...');
            if($scope.j == rightNumProfiles*2){
              $scope.resetChunks();
            }
            return 0;
        }

        var i = $scope.project._id;
        var profile = new Profiles();
        profile.action = category.action;
        profile.criterion = criterion.name;
        profile.value = 0;
        $http.post('/api/profiles/' + i, profile).success(function(response) {
          //refreshProfiles();
        });
        // See if it's the last performance to create if it is update the performance table
        if($scope.j == rightNumProfiles){
            console.log('Last profile being created...');
            refreshProfiles();
            $scope.resetChunks();
        }
    }else{
      //Delete all profiles if it's length is not equal to zero or rightNumProfiles before creating all of them
      //deleteProfile2(); 
    }
  }
}

//Update the value 
$scope.updateProfile2 = function(profile) {
  var i = profile._id;
  $http.get('/api/profile/' + i).success(function(response) {
        $scope.profile = response;
    });

  $http.put('/api/profile/' + i, profile).success(function(response) {
    refreshProfiles();
  });
  $scope.updateProject();
}

//Delete profiles
$scope.deleteProfile2 = function() {
  var i = $scope.project._id;
  //Delete all profiles 
  //Note it works but for some reason it prints the error message
  $http.delete('/api/profiles/' + i)
    .success(function() {
      console.log("success");
      refreshProfiles();
      checkStatus();
    })
    .error(function() {
      //console.log('Error: fail deletes' );
      refreshProfiles();
      checkStatus();
    });
}

$scope.propertyName = 'action';
$scope.reverse = false;
$scope.confirmProfile  = function() {
  var numCriteria = $scope.criterions.length;
  var numCategories = $scope.categories.length;
  var rightNumProfiles = numCriteria * numCategories;
  var numExistingProfiles = $scope.profiles.length;
  console.log('Number of profiles that should exist: ' + rightNumProfiles);
  console.log('Actual number of profiles now: ' + numExistingProfiles);
  // Confirm size of table more than once, just to be sure that it was updated
  //for(var i = 0; i < 2; i++){
    if(numExistingProfiles == rightNumProfiles){
        console.log('Performance Table is current.');
        //Order profiles by action before slicing it
        $scope.profiles2 = orderBy($scope.profiles, $scope.propertyName, $scope.reverse);
        //Get all profiles to put them inside a table
        var i, l = $scope.profiles.length;
        var x = $scope.criterions.length;
        // Slice the profiles results so it can be put inside a table numAlternativeXnumCriteria
        $scope.chunks = [];
        for ( i = 0; i < l; i += x) {
            $scope.chunks.push( $scope.profiles2.slice(i, i + x));
        }
        console.log('Done slicing profiles');
        $('#loading').hide();
    }else{
      if(numExistingProfiles == 0){

      }else{
        //If number of criteria or alternatives was changed, update profile table
        $scope.deleteProfile2();
      }
      console.log('Profile Table has been updated.');
      $('#loading').hide();
    }
  //}
}

// If a category is created or deleted or even updated, update profile table from 0
$scope.resetProfileTable  = function() {
    $timeout( function(){
        $scope.j = 0;
        $scope.deleteProfile2();
        // Get categories updated
        $scope.chunksCat = [];
        refresh();
        refreshProfiles();
        $scope.chunksCat = $scope.categories;
        console.log('Profile Table has been updated.');
        $('#loading').hide();
    }, 800);
}

$scope.resetChunks  = function() {
    $timeout( function(){ 
        $scope.profiles2 = orderBy($scope.profiles, $scope.propertyName, $scope.reverse);
        //Show all values on profile table
        var i, l = $scope.profiles.length;
        var x = $scope.criterions.length;
        // Slice the profiles results so it can be put inside a table numCategoriesXnumCriteria
        $scope.chunks = [];
        for ( i = 0; i < l; i += x) {
            $scope.chunks.push( $scope.profiles2.slice(i, i + x));
        }
        var numCriteria = $scope.criterions.length;
        var numCategories = $scope.categories.length;
        var rightNumProfiles = numCriteria * numCategories;
        refreshProfiles();
        var numExistingProfiles = $scope.profiles.length;
        console.log('Number of profiles that should exist: ' + rightNumProfiles);
        console.log('Actual number of profiles now: ' + numExistingProfiles);
        console.log('Done slicing profiles');
        $('#loading').hide();
    }, 1700);
}

// Change section and give the project id as argument
$scope.changeSection = function(name){
  var id = $scope.projectID;
  var sectionName = name;
  var n = $scope.username;
  var projectName = $scope.project.name;
  if(sectionName == 'divizServer'){
    // Show loader when execute button was clicked
    $('#loading').show();
    //$window.location.href = 'http://vps288667.ovh.net:5010/electreTriC/?projectId='+id+'&n='+n+'&project='+projectName;      
  }else{
    $window.location.href = '/'+sectionName+'.html?projectId='+id+'&n='+n;  
  }
}

// Go back to project section
$scope.projectSection = function(){
  var id = $scope.user._id;
  $window.location.href = '/projects.html?userId='+id;  
}

//Update dateSet of the project when there are changes
$scope.updateProject = function() {
  $scope.project.dateSet = new Date();
  var project = $scope.project
  var i = $scope.project._id;

  $http.put('/api/project/' + i, project).success(function(response) {

  });
}

}]);

//Export categories into a .csv file 
// app.directive('exportCategoriesToCsv',function(){
//     return {
//       restrict: 'A',
//       link: function (scope, element, attrs) {
//         var el = element[0];
//           element.bind('click', function(e){
//             //var table = e.target.nextElementSibling;
//             var table = document.getElementById("categoryTbl");
//             var csvString = '';
//             for(var i=0; i<table.rows.length;i++){
//               if(i == 1){
//                 //Ignore save/update line
//               }else{
//                 var rowData = table.rows[i].cells;
//                 for(var j=1; j<rowData.length-1;j++){ //number of columns to export
//                   csvString = csvString + rowData[j].innerHTML + ",";
//                 }
//                 csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
//                 csvString = csvString + "\n";
//               }
//           }
//             csvString = csvString.substring(0, csvString.length - 1);
//             var a = $('<a/>', {
//                 style:'display:none',
//                 href:'data:application/octet-stream;base64,'+btoa(csvString),
//                 download:'categories.csv'
//             }).appendTo('body')
//             a[0].click()
//             a.remove();
//           });
//       }
//     }
// });

//Export profile table into a .csv file 
// app.directive('exportProfileToCsv',function(){
//     return {
//       restrict: 'A',
//       link: function (scope, element, attrs) {
//         var el = element[0];
//           element.bind('click', function(e){
//             //var table = e.target.nextElementSibling;
//             var table = document.getElementById("profileTable");
//             var csvString = '';
//             for(var i=0; i<table.rows.length;i++){
//                 var rowData = table.rows[i].cells;
//                 for(var j=0; j<rowData.length;j++){ //number of columns to export
//                   // See if it's a header value or a first column value
//                   if(i == 0 || j == 0){ 
//                     csvString = csvString + rowData[j].innerHTML + ",";
//                   }else{
//                     csvString = csvString + rowData[j].children[0].value + ",";
//                   }
//                 }
//                 csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
//                 csvString = csvString + "\n";
//           }
//             csvString = csvString.substring(0, csvString.length - 1);
//             var a = $('<a/>', {
//                 style:'display:none',
//                 href:'data:application/octet-stream;base64,'+btoa(csvString),
//                 download:'profile_table.csv'
//             }).appendTo('body')
//             a[0].click()
//             a.remove();
//           });
//       }
//     }
// });

