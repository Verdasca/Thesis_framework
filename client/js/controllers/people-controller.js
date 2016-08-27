var app = angular.module("people-controller", ['ngRoute', 'ui.router', 'ngResource', 'appRoutes']);

app.controller('peopleController', ['$scope', '$http', '$resource', '$location', '$window', '$timeout', 'orderByFilter', function ($scope, $http, $resource, $location, $window, $timeout, orderBy) {

var People = $resource('/api/people');

// Get project Id and username
$scope.projectID = $location.search().projectId;
$scope.username = $location.search().n;
// Booleans to check if all data set required are done, if alll are done the execute button can be clicked
$scope.peopleDone = false;
// Boolean needed if we are on section person set to update the data
$scope.peoleTblImported = false;

// Hide loader
$('#importing').hide();
$('#executing').hide();

// Types of ordering
$scope.data = {
    repeatSelect: 'notSelected',
    availableOptions: [
      {id: 'notSelected', name: '<-- Select type of order -->'},
      {id: 'Ascending', name: 'Ascending'},
      {id: 'Descending', name: 'Descending'}
    ],
};

// Types of attributes
$scope.data2 = {
    repeatSelect2: 'notSelected',
    availableOptions2: [
      {id: 'notSelected', name: '<-- Select attribute to order -->'},
      {id: 'Name', name: 'Name'},
      {id: 'Age', name: 'Age'}
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
  if($scope.project.orderAttribute == ""){
    // Do nothing, the order parameter is empty
  }else{
    $scope.data2.repeatSelect2 = $scope.project.orderAttribute;
  }
  //See if person set is done or not, if not cannot execute method
  if($scope.project.people.length == 0 || $scope.project.orderType == "" || $scope.project.orderAttribute == ""){
    document.getElementById('sectionsData').style.backgroundColor = '#ff3333';
    $scope.peopleDone = false;
  }else{
    document.getElementById('sectionsData').style.backgroundColor = '#6fdc6f';
    $scope.peopleDone = true;
  }
  if($scope.project.people.length == 0 || $scope.project.orderType == "" || $scope.project.orderAttribute == ""){
    document.getElementById('sectionsResults').style.backgroundColor = '#ff3333';
  } else{
    document.getElementById('sectionsResults').style.backgroundColor = '#6fdc6f';
  }
  // if($location.path() == '/results_orderPeople.html'){
  //   if($scope.people.length == 0 || $scope.project.orderType == "" || $scope.project.orderAttribute == ""){
  //     document.getElementById('methodButtons').disabled = true;
  //   } else{
  //     document.getElementById('methodButtons').disabled = false;
  //   }
  //   if(document.getElementById("resultName").value == ""){
  //     document.getElementById("methodButtons").disabled=true;
  //   }else{
  //     document.getElementById("methodButtons").disabled=false;
  //   }
  // }
  $('#loading').hide();
  })
  .error(function(data) {
    console.log('Error: ' + data);
});

// Refresh the page current data after closing the import section (so the data on the page is actualized with the imported data)
$scope.refreshBeforeClosing = function(){
  $('#loading').show();
  $scope.updateProject();
  $http.get('/api/project/' + $scope.projectID).success(function(data) {
    $scope.project = data;
    $http.get('/api/people/' + $scope.projectID).success(function(data) {
      $scope.people = data.people;
      if($scope.people.length == 0 || $scope.project.orderType == "" || $scope.project.orderAttribute == ""){
        document.getElementById('sectionsData').style.backgroundColor = '#ff3333';
        $scope.peopleDone = false;
      }else{
        document.getElementById('sectionsData').style.backgroundColor = '#6fdc6f';
        $scope.peopleDone = true;
      }
      if($scope.people.length == 0 || $scope.project.orderType == "" || $scope.project.orderAttribute == ""){
        document.getElementById('sectionsResults').style.backgroundColor = '#ff3333';
      } else{
        document.getElementById('sectionsResults').style.backgroundColor = '#6fdc6f';
      }
      $('#loading').hide();
    })
    .error(function(data) {
      console.log('Error: ' + data);
    }); 
  })
  .error(function(data) {
    console.log('Error: ' + data);
  });
}


var refresh = function(){
  $http.get('/api/people/' + $scope.projectID).success(function(data) {
    $scope.project = data; 
    $scope.people = data.people;
    $scope.results = data.results;
    })
    .error(function(data) {
      console.log('Error: ' + data);
  });
}

// Update the name and notes from the result
$scope.editResults = function(res, id){
  var projectID = $scope.project._id;
  var pro = {name: res.name, notes: res.resultNotes};
  $http.put('/api/editResults/' + id + '/' + projectID, pro).success(function(response) {

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
  if($scope.people.length == 0 || $scope.project.orderType == "" || $scope.project.orderAttribute == ""){
      document.getElementById('sectionsData').style.backgroundColor = '#ff3333';
      $scope.peopleDone = false;
    }else{
      document.getElementById('sectionsData').style.backgroundColor = '#6fdc6f';
      $scope.peopleDone = true;
    }
    if($scope.people.length == 0 || $scope.project.orderType == "" || $scope.project.orderAttribute == ""){
      document.getElementById('sectionsResults').style.backgroundColor = '#ff3333';
    } else{
      document.getElementById('sectionsResults').style.backgroundColor = '#6fdc6f';
    }
  //   if($location.path() == '/results_orderPeople.html'){
  //     if($scope.people.length == 0 || $scope.project.orderType == "" || $scope.project.orderAttribute == ""){
  //       document.getElementById('methodButtons').disabled = true;
  //     } else{
  //       document.getElementById('methodButtons').disabled = false;
  //     }
  //     if(document.getElementById("resultName").value == ""){
  //       document.getElementById("methodButtons").disabled=true;
  //     }else{
  //       document.getElementById("methodButtons").disabled=false;
  //     }
  // }
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

// Update order attribute
$scope.updateOrderAttribute = function(data){
  var id = data;
  if(id == "notSelected"){
    $scope.project.orderAttribute = "";
  }else{
    $scope.project.orderAttribute = id;
  }
  var project = $scope.project
  var i = $scope.project._id;
  $http.put('/api/project/' + i, project).success(function(response) {

  });
  $scope.updateProject();
  checkStatus();
} 

$scope.reverse = false; // Ascending
// Execute order people function when execute button is clicked
$scope.executeMethod = function(){
  $('#executing').show();
  document.getElementById("reportMessage").style.display = "none";
  $scope.propertyName = $scope.project.orderAttribute; // Order attribute
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
    }
    $scope.peopleOrdered = orderBy($scope.people2, $scope.propertyName, $scope.reverse);
    $scope.saveResult($scope.peopleOrdered);
  })
  .error(function(data) {
    console.log('Error: ' + data);
    $('#executing').hide();
  });
}

// Save result 
$scope.saveResult = function(results){ 
  var n = $scope.username;
  // Update nº executions
  var resId = $scope.project.numExecutions;
  var type = $scope.project.orderType;
  var attribute = $scope.project.orderAttribute;
  var datas = results;
  var notes = document.getElementById("resultNotes").value;
  $scope.project.numExecutions = resId + 1;
  $scope.project.dateSet = new Date();
  var project = $scope.project;
  var projectID = $scope.project._id;
  $http.put('/api/project/' + projectID, project).success(function(response) {
  });
  // Create new result
  var name = document.getElementById("resultName").value;
  $scope.newResult = {
    id: resId, 
    resName: name, 
    date: new Date(),
    orderTypes: type,
    orderAttributes: attribute,
    resultNotes: notes
  };
  //console.log('N: '+resId+' and name: '+name);
  $http.put('/api/projectAddResult/' + projectID, $scope.newResult).success(function(response) {
    var numRows = datas.length;
    for (var i = 0; i < numRows; i++) {
      //console.log('Name: '+datas[i].name+' age: '+datas[i].age);
      //$timeout( function(){
        console.log('Name: '+datas[i].name+' age: '+datas[i].age);
      var res = {
        name: datas[i].name,
        age: parseInt(datas[i].age)
      };
      // Add data into result
      $http.put('/api/projectSaveResult/'+ resId +'/'+ projectID, res).success(function(response) {
        document.getElementById("resultName").value = "";
        document.getElementById("resultNotes").value = "";
        refresh();
      });
      //}, 2000);
    }
    document.getElementById("reportMessage").style.display = "block";
    document.getElementById("reportMessage").innerHTML = "Execution complete and result saved.";
    $('#executing').hide();
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
    //$scope.project = data;
    //$scope.people = data.people;
    $scope.results = data.results; 
    })
    .error(function(data) {
      console.log('Error: ' + data);
  });
}

//Reload the data from the result into the current data of the project
$scope.reloadData = function(result, identifier) {
  $('#loading').show();
  document.getElementById("reportMessage").style.display = "none";
  var i = $scope.project._id;
  var id = identifier;
  var dataResult = result;
  if($scope.project.people.length == 0){
      console.log('There are no people to delete...');
  }else{
    //Delete all current people 
    $http.delete('/api/people/' + i)
      .success(function() {
        console.log("Done deleting all people.");
      })
      .error(function() {
        //console.log('Error: fail deletes' );
    });
  }
  // Reload data
  $http.post('/api/reloadProjectOrderPeople/' + i + '/' + id, dataResult).success(function(response) {
    refreshReload();
    document.getElementById("reportMessage").style.display = "block";
    document.getElementById("reportMessage").innerHTML = "Reload complete.";
    //$('#loading').hide();
  });
}

// Refresh after reload
var refreshReload = function(){
  $timeout( function(){
  $http.get('/api/people/' + $scope.projectID).success(function(data) {
  $scope.project = data;
  $scope.people = data.people;
  $scope.results = data.results;
  if($scope.project.orderType == ""){
    // Do nothing, the order type is empty
  }else{
    $scope.data.repeatSelect = $scope.project.orderType;
  }
  if($scope.project.orderAttribute == ""){
    // Do nothing, the order parameter is empty
  }else{
    $scope.data2.repeatSelect2 = $scope.project.orderAttribute;
  }
  //See if person set is done or not, if not cannot execute method
  if($scope.project.people.length == 0 || $scope.project.orderType == "" || $scope.project.orderAttribute == ""){
    document.getElementById('sectionsData').style.backgroundColor = '#ff3333';
    $scope.peopleDone = false;
  }else{
    document.getElementById('sectionsData').style.backgroundColor = '#6fdc6f';
    $scope.peopleDone = true;
  }
  if($scope.project.people.length == 0 || $scope.project.orderType == "" || $scope.project.orderAttribute == ""){
    document.getElementById('sectionsResults').style.backgroundColor = '#ff3333';
  } else{
    document.getElementById('sectionsResults').style.backgroundColor = '#6fdc6f';
  }
  $('#loading').hide();
  })
  .error(function(data) {
    console.log('Error: ' + data);
});
  }, 1000);
}

// Start import when clicking on import button
// First delete existing current data before importing and see which data was selected to import
$scope.importData = function(){
  $('#importing').show();
  document.getElementById("importMessage").style.display = "none";
  document.getElementById("importMessageError").style.display = "none";
  var i = $scope.project._id;
  var elements = document.getElementsByName("dataType");
  if(elements[0].checked){
    console.log('Importing people...');
    if($scope.project.people.length == 0){
      console.log('There are no people to delete...');
      // Import data
      UploadPeople();
    }else{
      //Delete all current people 
      $http.delete('/api/people/' + i)
        .success(function() {
          console.log("Done deleting all people.");
          // Import data
          UploadPeople();
        })
        .error(function() {
          //console.log('Error: fail deletes' );
          $('#importing').hide();
      });
    }
  }else{
    document.getElementById("importMessageError").innerHTML = "Data to import not selected.";
    document.getElementById("importMessageError").style.display = "block";
    $('#importing').hide(); 
  }
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
$scope.createPersonImport = function (person) {
  var i = $scope.projectID;
  var newPerson = new People();
  newPerson.name = person.name;
  newPerson.age = person.age;
  $http.post('/api/people/'+i, newPerson).success(function(response) {
    //console.log('Done creating person.');
  });
}

// Upload file to get the data for the people 
function UploadPeople(){
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
          document.getElementById("importMessageError").innerHTML = "CSV file rejected: number of rows are incorrect or insufficient. Check the CSV file structure example below.";
          document.getElementById("importMessageError").style.display = "block";
          $('#importing').hide();
          return 0;
        }
        //Check number of columns
        var c = rows[0].split(",");
        var numCells = c.length;
        if(numCells > 2 || numCells == 0){
          document.getElementById("importMessageError").innerHTML = "CSV file rejected: number of columns are incorrect or insufficient. Check the CSV file structure example below.";
          document.getElementById("importMessageError").style.display = "block";
          $('#importing').hide();
          return 0;    
        }
        for (var i = 1; i < rows.length; i++) {
          var row = table.insertRow(-1);
          var cells = rows[i].split(",");
          var person = {name:"", age:0};
          if(cells[0] == '' || cells[0] == null){
            // Do nothing - no person name, don't create
          }else{
            person.name = cells[0];
            person.age = cells[1];
            $scope.createPersonImport(person);
          }
        }
        table.className = 'table table-bordered horizontal';
        table.id = 'auxTable';
        // var dvCSV = document.getElementById("dvCSV");
        // dvCSV.innerHTML = "";
        // dvCSV.appendChild(table);
        $timeout( function(){ $('#importing').hide(); }, 1000);
        document.getElementById("importMessage").innerHTML = "Successfully imported people.";
        document.getElementById("importMessage").style.display = "block";
        $scope.peoleTblImported = true;
      }
      reader.readAsText(fileUpload.files[0]);
    } else {
      //alert("This browser does not support HTML5.");
      document.getElementById("importMessageError").innerHTML = "This browser does not support HTML5.";
      document.getElementById("importMessageError").style.display = "block";
      $('#importing').hide();
    }
  } else {
      //alert("Please upload a valid CSV file.");
      document.getElementById("importMessageError").innerHTML = "Please upload a valid CSV file.";
      document.getElementById("importMessageError").style.display = "block";
      $('#importing').hide();
  }
}

//Select all checkboxes from the export result options
$scope.selectAll = function(id){
  var idList = id;
  document.getElementById("res"+idList).checked = true;
  document.getElementById("note"+idList).checked = true;
}

//Unselect all checkboxes from the export result options
$scope.selectNone = function(id){
  var idList = id;
  document.getElementById("res"+idList).checked = false;
  document.getElementById("note"+idList).checked = false;
}

//Select all checkboxes from the import section
$scope.selectAllImport = function(){
  document.getElementById("importPeople").checked = true;
}

//Unselect all checkboxes from the import section
$scope.selectNoneImport = function(){
  document.getElementById("importPeople").checked = false;
}

//Select all checkboxes from the export section
$scope.selectAllExport = function(){
  document.getElementById("exportCri").checked = true;
}

//Unselect all checkboxes from the export section
$scope.selectNoneExport  = function(){
  document.getElementById("exportCri").checked = false;
}

$scope.defineAttribute = function(attribute) {
  if(attribute == "Age"){
    return 'personAge';
  }else{
    return 'personName';
  }
  //return '\''+attribute+'\'';
}

$scope.defineOrder = function(type) {
  if(type == "Descending"){
    return true;
  }else{
    return false;
  }
}
    
}]);

// Function to export the results
//Export everything into a .csv file 
app.directive('exportEverythingToCsv',function($timeout){
    return {
      restrict: 'A',
      // Get the id of the result table to be exported
      scope: {
        values: '=values',
        names: '=names'
      },
      link: function (scope, element, attrs) {
        $timeout( function(){
        var el = element[0];
        element.bind('click', function(e){
          var zip = new JSZip();
          if(document.getElementById('res'+scope.values).checked == true){
            var table = document.getElementById("resultsTable"+scope.values);
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
            zip.file(scope.names+"/results.csv", csvString);
          }
          if(document.getElementById('note'+scope.values).checked == true){
            var notes = document.getElementById("notes"+scope.values).children[0].value;
            var csvString = 'Notes:';
            csvString = csvString + "\n";
            csvString = csvString + notes;
            zip.file(scope.names+"/notes.txt", csvString);
          }
          if(document.getElementById('res'+scope.values).checked == true || document.getElementById('note'+scope.values).checked == true){
            zip.generateAsync({type:"blob"})
            .then(function(content) {
                // see FileSaver.js
                saveAs(content, scope.names+".zip");
            });
          }
        });
      }, 1000);
      }
    }
});

//Export into a .csv file 
app.directive('exportToCsv',function($http, $location){
    return {
      restrict: 'A',
      scope: {
        names: '=names'
      },
      link: function (scope, element, attrs) {
        var id = $location.search().projectId;
        var el = element[0];
        var elements = document.getElementsByName("dataBox");
        element.bind('click', function(e){
          var zip = new JSZip();
          document.getElementById("exportMessage").style.display = "none";
          document.getElementById("exportMessageError").style.display = "none";
          if(elements[0].checked){
            $http.get('/api/people/' + id).success(function(data) {
            var peopleUpdated = data.people;
            if(peopleUpdated.length == 0){
              document.getElementById("exportMessageError").innerHTML = "No data to export.";
              document.getElementById("exportMessageError").style.display = "block"; 
            }else{
              var csvString = '';
              csvString = csvString + 'Name,Age';
              csvString = csvString + "\n";
              for(var i=0; i < peopleUpdated.length; i++){
                  var rowData = peopleUpdated[i];
                  // Get the data
                  csvString = csvString + rowData.name + ",";
                  csvString = csvString + rowData.age + ",";
                  csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
                  csvString = csvString + "\n";
              }
              csvString = csvString.substring(0, csvString.length - 1);
              zip.file(scope.names+"/people.csv", csvString);
              zip.generateAsync({type:"blob"})
              .then(function(content) {
                  // see FileSaver.js
                  saveAs(content, scope.names+".zip");
              });
              document.getElementById("exportMessage").innerHTML = "Export successfully.";
              document.getElementById("exportMessage").style.display = "block";
            }
            })
          }else{
            document.getElementById("exportMessageError").innerHTML = "Data to export not selected.";
            document.getElementById("exportMessageError").style.display = "block";
          }
        });
      }
    }
});

