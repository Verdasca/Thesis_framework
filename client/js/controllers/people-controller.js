var app = angular.module("people-controller", ['ngRoute', 'ui.router', 'ngResource', 'ngSanitize', 'appRoutes', 'ui']);

app.controller('peopleController', ['$scope', '$http', '$resource', '$location', '$window', '$timeout', 'orderByFilter', function ($scope, $http, $resource, $location, $window, $timeout, orderBy) {

var People = $resource('/api/people');

// Get project Id and username
$scope.projectID = $location.search().projectId;
$scope.username = $location.search().n;
// Booleans to check if all data set required are done, if alll are done the execute button can be clicked
$scope.peopleDone = false;

// Hide loader
$('#loading').hide();
$('#importing').hide();

// Types of ordering
$scope.data = {
    repeatSelect: 'notSelected',
    availableOptions: [
      {id: 'notSelected', name: '<-- Select type of order -->'},
      {id: 'Ascending', name: 'Ascending'},
      {id: 'Descending', name: 'Descending'}
    ],
};

$http.get('/api/userFind/' + $scope.username).success(function(data) {
  $scope.user = data;
  })
  .error(function(data) {
    console.log('Error: ' + data);
});  

$http.get('/api/people/' + $scope.projectID).success(function(data) {
  $scope.project = data;
  $scope.people = data.people;
  $scope.results = data.results;
  if($scope.project.orderType == ""){
    // Do nothing, the order type is empty
  }else{
    $scope.data.repeatSelect = $scope.project.orderType;
  }
  //See if person set is done or not, if not cannot execute method
  if($scope.project.people.length == 0 || $scope.project.orderType == ""){
    document.getElementById('sectionsData').style.backgroundColor = '#ff3333';
    $scope.peopleDone = false;
  }else{
    document.getElementById('sectionsData').style.backgroundColor = '#6fdc6f';
    $scope.peopleDone = true;
  }
  if($scope.peopleDone){
    document.getElementById('buttonDiviz').disabled = false;
  } else{
    document.getElementById('buttonDiviz').disabled = true;
  }
  })
  .error(function(data) {
    console.log('Error: ' + data);
});

var refresh = function(){
  $http.get('/api/people/' + $scope.projectID).success(function(data) {
    $scope.project = data; 
    $scope.people = data.people;
    })
    .error(function(data) {
      console.log('Error: ' + data);
  });
}

// Create model that will contain the alternative to edit
$scope.model = {};

// gets the template to ng-include for a table row / item
$scope.getTemplate = function (person) {
  var i = person._id;
  if (i === $scope.model._id){ 
    return 'edit';
  }else{ 
    return 'display';
  }
}

$scope.editPerson = function (person) {
  var i = person._id;
  $scope.model = angular.copy(person);
}

// Reset model
$scope.reset = function () {
  $scope.model = {};
}

// Change section and give the project id as argument
$scope.changeSection = function(name){
  var id = $scope.projectID;
  var sectionName = name;
  var n = $scope.username;
  var projectName = $scope.project.name;
  $('#loading').show();
  $window.location.href = '/'+sectionName+'.html?projectId='+id+'&n='+n;  
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

// Update status to see if the execute button can be pressed
var checkStatus = function(){
  // See if person set is done or not, if not cannot execute method
  if($scope.people.length == 0 || $scope.project.orderType == ""){
    document.getElementById('sectionsData').style.backgroundColor = '#ff3333';
    $scope.peopleDone = false;
  }else{
    document.getElementById('sectionsData').style.backgroundColor = '#6fdc6f';
    $scope.peopleDone = true;
  }
  if($scope.peopleDone){
    document.getElementById('buttonDiviz').disabled = false;
  } else{
    document.getElementById('buttonDiviz').disabled = true;
  }
}

//Create person
$scope.createPerson = function () {
  var i = $scope.project._id;
  var person = new People();
  person.name = $scope.people.name;
  person.age = $scope.people.age;
  $http.post('/api/people/'+i, person).success(function(response) {
    $scope.people.name = '';
    $scope.people.age = '';
    refresh();
    $scope.submitted=false;
    refresh();
  });
  $scope.updateProject();
  checkStatus();
}

//Delete person
$scope.deletePerson = function(person) {
  var i = $scope.project._id;
  var id = person._id;
  $http.delete('/api/person/' + i + '/' + id)
    .success(function() {
      console.log("success");
      var idx = $scope.people.indexOf(person);
      if (idx >= 0) {
        $scope.people.splice(idx, 1);
      }
      $scope.updateProject();
      checkStatus();
      refresh();
    })
    .error(function() {
      //console.log('Error: ' + i);
      var idx = $scope.people.indexOf(person);
      if (idx >= 0) {
        $scope.people.splice(idx, 1);
      }
      $scope.updateProject();
      checkStatus();
      refresh();
    });
}

//Update the value and reset model
$scope.updatePerson = function(person) {
  var i = person._id;
  person.name = $scope.model.name;
  person.age = $scope.model.age;
  $http.put('/api/person/' + i, person).success(function(response) {
    refresh();
    $scope.people.name = '';
    $scope.people.age = '';
  });
  $scope.updateProject();
  $scope.reset();
}

// Update order type
$scope.updateOrderType = function(data){
  var id = data;
  //console.log(id);
  if(id == "notSelected"){
    $scope.project.orderType = "";
  }else{
    $scope.project.orderType = id;
  }
  var project = $scope.project
  var i = $scope.project._id;
  $http.put('/api/project/' + i, project).success(function(response) {

  });
  $scope.updateProject();
  checkStatus();
}

// Delete all people if exist
$scope.deletePeople = function(){
  $('#importing').show();
  var i = $scope.project._id;
  $scope.updateProject();
  if($scope.project.people.length == 0){
    console.log('There are no people to delete...');
    // Import data
    Upload();
  }else{
    //Delete all people 
    $http.delete('/api/people/' + i)
      .success(function() {
        console.log("Done deleting all people.");
        refresh();
        // Import data
        $timeout( function(){ Upload(); }, 1000);
      })
      .error(function() {
        //console.log('Error: fail deletes' );
        $('#importing').hide();
    });
  }
}

//Create person when importing
$scope.createPersonImport = function (personName, personAge) {
  var i = $scope.project._id;
  var person = new People();
  person.name = personName;
  person.age = personAge;
  $http.post('/api/people/'+i, person).success(function(response) {
    refresh();
    console.log('Done creating person.');
    checkStatus();
    $('#importing').hide();
  });
}

// Upload file to get the people data
function Upload(){
  var fileUpload = document.getElementById("fileUpload");
  var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
  if (regex.test(fileUpload.value.toLowerCase())) {
    if (typeof (FileReader) != "undefined") {
      var reader = new FileReader();
      reader.onload = function (e) {
        var table = document.createElement("table");
        var rows = e.target.result.split("\n");
        //Check number of rows
        var numRows = rows.length;
        if(numRows <= 1){
          console.log('Number of rows insufficient.');
          alert("CSV file was rejected: number of rows are incorrect.\n\nNumber of rows = 1 header line + total number of people. Example:\n\nName, Age\nperson name 1, age\nperson name 2, age\nand so on...");
          $('#importing').hide();
          return 0;
        }
        //Check number of columns
        var numColumns = 2;
        var c = rows[1].split(",");
        var numCells = c.length;
        //console.log('CSV cell size: ' + numCells);
        if(numCells != numColumns){
          console.log('Number of columns are incorrect.');
          alert("CSV file was rejected: number of columns are incorrect.\n\nNumber of columns = 1 for names + 1 for age. Example:\n\nName, Age\nperson name 1, age\nperson name 2, age\nand so on...");
          $('#importing').hide();
          return 0;    
        }
        for (var i = 1; i < rows.length; i++) {
          var row = table.insertRow(-1);
          var cells = rows[i].split(",");
          //for (var j = 0; j < 1; j++) {
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          cell1.innerHTML = cells[0];
          cell2.innerHTML = cells[1];
          // If it is a alternative, create it and save it on DB
          if(cell1.innerHTML == '' || cell1.innerHTML == null || cell2.innerHTML == '' || cell2.innerHTML == null){
            // Do nothing - ignore because its an empty line or as no name/age, it requires both to create
          }else{
            $scope.createPersonImport(cells[0],cells[1]);
          }
          //}
        }
        table.className = 'table table-bordered horizontal';
        table.id = 'persTable';
        var dvCSV = document.getElementById("dvCSV");
        dvCSV.innerHTML = "";
        dvCSV.appendChild(table);
      }
      reader.readAsText(fileUpload.files[0]);
    } else {
      alert("This browser does not support HTML5.");
      $('#importing').hide();
    }
  } else {
      alert("Please upload a valid CSV file.");
      $('#importing').hide();
  }
}

$scope.propertyName = 'age'; // Order by age
$scope.reverse = false; // Ascending
// Execute order people function when execute button is clicked
$scope.executeMethod = function(){
  $('#loading').show();
  $http.get('/api/people/' + $scope.projectID).success(function(data) {
    $scope.project2 = data;
    $scope.people2 = data.people;
    // See which type of order was chosen
    if($scope.project2.orderType == "Ascending"){
      $scope.reverse = false;
    }else if($scope.project2.orderType == "Descending"){
      $scope.reverse = true;
    }else{
      // Error, order type not chosen
      document.getElementById("errorMethod").style.display = "block";
    }
    $scope.peopleOrdered = orderBy($scope.people2, $scope.propertyName, $scope.reverse);
    document.getElementById("resultsTable").style.display = "inline-table";
    document.getElementById("explanation").style.display = "block";
    document.getElementById("methodButtons").style.display = "inline-table";
    document.getElementById("labelResult").style.display = "inline-block";
    document.getElementById("resultName").style.display = "inline-block";
    $('#loading').hide();
  })
  .error(function(data) {
    console.log('Error: ' + data);
    document.getElementById("errorMethod").style.display = "block";
  });
}

// Save result 
$scope.saveResult = function(){ 
  var n = $scope.username;
  // Update nº executions
  var resId = $scope.project.numExecutions;
  var type = $scope.project.orderType;
  $scope.project.numExecutions = resId + 1;
  $scope.project.dateSet = new Date();
  var project = $scope.project;
  var projectID = $scope.project._id;
  $http.put('/api/project/' + projectID, project).success(function(response) {
  });
  // Create new result
  var name = $scope.resName;
  $scope.newResult = {
    id: resId, 
    resName: name, 
    date: new Date(),
    orderPeople: type
  };
  //console.log('N: '+resId+' and name: '+name);
  $http.put('/api/projectAddResult/' + projectID, $scope.newResult).success(function(response) {
    var table = document.getElementById("resultsTable").getElementsByTagName('tbody')[0];
    var numRows = table.rows.length;
    for (var i = 1; i < numRows; i++) {
      //console.log('Name: '+table.rows[i].cells[0].innerHTML+' age: '+table.rows[i].cells[1].innerHTML);
      var res = {
        name: table.rows[i].cells[0].innerHTML,
        age: parseInt(table.rows[i].cells[1].innerHTML)
      };
      // Add data into result
      $http.put('/api/projectSaveResult/'+ resId +'/'+ projectID, res).success(function(response) {
      });
    }
    $window.location.href = '/results_orderPeople.html?projectId='+projectID+'&n='+n;  
  });
}

//Delete result
$scope.deleteResult = function(result, identifier) {
  var i = $scope.project._id;
  var id = identifier;
  $http.delete('/api/projects/' + i + '/' + id)
    .success(function() {
      console.log("success");
      var idx = $scope.results.indexOf(result);
      if (idx >= 0) {
        $scope.results.splice(idx, 1);
      }
      $scope.updateProject();
      refreshResults();
    })
    .error(function() {
      var idx = $scope.results.indexOf(result);
      if (idx >= 0) {
        $scope.results.splice(idx, 1);
      }
      $scope.updateProject();
      refreshResults();
    });
}

var refreshResults = function(){
  $http.get('/api/project/' + $scope.projectID).success(function(data) {
    $scope.project = data;
    $scope.results = data.results; 
    })
    .error(function(data) {
      console.log('Error: ' + data);
  });
}

}]);

// Function example used to export data from a table into csv, can change function to export only certain rows or columns 
//Export data into a .csv file 
app.directive('exportPeopleToCsv',function(){
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var el = element[0];
          element.bind('click', function(e){
            //var table = e.target.nextElementSibling;
            var table = document.getElementById("peopleTbl");
            var csvString = '';
            for(var i=0; i<table.rows.length;i++){
              if(i == 1){
                //Ignore save/update line
              }else{
                var rowData = table.rows[i].cells;
                for(var j=0; j<rowData.length-1;j++){ //number of columns to export
                  csvString = csvString + rowData[j].innerHTML + ",";
                }
                csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
                csvString = csvString + "\n";
              }
          }
            csvString = csvString.substring(0, csvString.length - 1);
            var a = $('<a/>', {
                style:'display:none',
                href:'data:application/octet-stream;base64,'+btoa(csvString),
                download:'people.csv'
            }).appendTo('body')
            a[0].click()
            a.remove();
          });
      }
    }
});

// Function example to export the results
//Export results into a .csv file 
app.directive('exportResultsToCsv',function(){
    return {
      restrict: 'A',
      // Get the id of the result table to be exported
      scope: {
        values: '=values'
      },
      link: function (scope, element, attrs) {
        var el = element[0];
          element.bind('click', function(e){
            var table = document.getElementById('resultsTable'+scope.values);
            var csvString = '';
            for(var i=0; i<table.rows.length;i++){
                var rowData = table.rows[i].cells;
                for(var j=0; j<rowData.length; j++){ //number of columns to export
                  csvString = csvString + rowData[j].innerHTML + ",";
                }
                csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
                csvString = csvString + "\n";
            }
            csvString = csvString.substring(0, csvString.length - 1);
            var a = $('<a/>', {
                style:'display:none',
                href:'data:application/octet-stream;base64,'+btoa(csvString),
                download: 'order_people_results.csv'
            }).appendTo('body')
            a[0].click()
            a.remove();
          });
      }
    }
});

