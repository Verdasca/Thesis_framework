var app = angular.module("orderBy-controller", ['ngRoute', 'ui.router', 'ngResource', 'appRoutes']);

app.controller('orderByController', ['$scope', '$http', '$resource', '$location', '$window', '$timeout', 'orderByFilter', function ($scope, $http, $resource, $location, $window, $timeout, orderBy) {

// Get project Id and username
$scope.projectID = $location.search().projectId;
$scope.username = $location.search().n;
// Booleans to check if all data set required are done, if alll are done the execute button can be clicked
$scope.dataDone = false;

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
      {id: 'notSelected', name: '<-- Select attribute to order -->'}
    ],
};

$scope.arrayFiles = [];
$scope.dataResults = function(number){
  $scope.arrayFiles = [];
  for (var i = 0; i < number; i++) {
    var nId = $scope.results[i].identifier;
    //console.log(nId);
    $http.get('/getDataResult/' + $scope.projectID + '/'+nId).success(function(data) {
      $scope.resultData = data;
      $scope.arrayFiles.push($scope.resultData);
    })
  }
    if($location.path() == '/results_orderBy.html'){
      $timeout( function(){ $scope.resultIntoTable(); }, 1000);
    }else if($location.path() == '/data_orderBy.html'){
      $timeout( function(){ $scope.buildDataSetTable(); }, 1000);
    }else{
      $('#loading').hide();
    }
}
$scope.dataResults2 = function(number){
  $scope.arrayFiles = [];
  for (var i = 0; i < number; i++) {
    var nId = $scope.results[i].identifier;
    //console.log(nId);
    $http.get('/getDataResult/' + $scope.projectID + '/'+nId).success(function(data) {
      $scope.resultData = data;
      $scope.arrayFiles.push($scope.resultData);
    })
  }
    if($location.path() == '/results_orderBy.html'){
      $timeout( function(){ $scope.resultIntoTable(); }, 1000);
    }else{
      $('#loading').hide();
    }
}

//Get all results data and put it on tables
$scope.resultIntoTable = function(){
  var len = $scope.results.length;
  //console.log(len);
  for (var i = 0; i < len; i++) {
    var nId = $scope.results[i].identifier;
    $("#resultsTable"+nId).children().remove();
    var data = $scope.arrayFiles[i];
    //console.log(data);
    var rows = $scope.arrayFiles[i].length;
    var cells = Object.keys(data[0]).length;
    var table = document.getElementById("resultsTable"+nId);
    var keyNamesHeader = Object.keys(data[0]);
    var row1 = table.insertRow(0);
    for (var n = 0; n < cells; n++) {
      var option = {id:'', name:''};
      var cellHeader = row1.insertCell(n);
      cellHeader.setAttribute("id", "dataHeader3");
      cellHeader.innerHTML = keyNamesHeader[n];
      option['id'] = keyNamesHeader[n];
      option['name'] = keyNamesHeader[n];
    }
    var cell = row1.insertCell(0);
    for (var w = 0; w < rows; w++) {
      var row = table.insertRow(w+1);
      var keyNames = Object.keys(data[w]);
      for (var j = 0; j < cells; j++) {
        var cell = row.insertCell(j);
        cell.setAttribute("id", "dataBody2");
        //console.log('Row: '+i+' col: '+keyNames[j]+' value: '+data[i][keyNames[j]]);
        cell.innerHTML = data[w][keyNames[j]]; 
      }
    }
    row1.deleteCell(0);
    //console.log('Done table '+i+' id'+nId);
  } 
  $('#loading').hide();
  $('#executing').hide();
}

$http.get('/api/userFind/' + $scope.username).success(function(data) {
  $scope.user = data;
  })
  .error(function(data) {
    console.log('Error: ' + data);
});  

$http.get('/api/project/' + $scope.projectID).success(function(data) {
  $scope.project = data;
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
  $http.get('/getData/' + $scope.projectID).success(function(data) {
    $scope.currentData = data;
    if($scope.currentData == 'No data...'){
      //Do nothing, no data
      if($location.path() == '/results_orderBy.html'){
        $scope.dataResults2($scope.results.length);
      }
      $scope.dataIntoTable(); 
    }else{
      $scope.dataResults($scope.results.length);
      $scope.dataIntoTable(); 
    }
    //$('#loading').hide();
  })
  .error(function(data) {
    console.log('Error: ' + data);
  });
  //See if person set is done or not, if not cannot execute method
  var table = document.getElementById("resultTbl");
  if(table.rows.length == 0 || $scope.project.orderType == "" || $scope.project.orderAttribute == ""){
    document.getElementById('sectionsData').style.backgroundColor = '#ff3333';
    $scope.dataDone = false;
  }else{
    document.getElementById('sectionsData').style.backgroundColor = '#6fdc6f';
    $scope.dataDone = true;
  }
  if(!$scope.dataDone || $scope.project.orderType == "" || $scope.project.orderAttribute == ""){
    document.getElementById('sectionsResults').style.backgroundColor = '#ff3333';
  } else{
    document.getElementById('sectionsResults').style.backgroundColor = '#6fdc6f';
  }
  // if($scope.dataDone){
  //   document.getElementById('buttonDiviz').disabled = false;
  // } else{
  //   document.getElementById('buttonDiviz').disabled = true;
  // }
  })
  .error(function(data) {
    console.log('Error: ' + data);
});

var refresh = function(){
  $http.get('/api/project/' + $scope.projectID).success(function(data) {
    $scope.project = data;
    $scope.results = data.results;
    $scope.dataResults(data.results.length);
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
  //See if person set is done or not, if not cannot execute method
  var table = document.getElementById("resultTbl");
  if(table.rows.length == 0 || $scope.project.orderType == "" || $scope.project.orderAttribute == ""){
    document.getElementById('sectionsData').style.backgroundColor = '#ff3333';
    $scope.dataDone = false;
  }else{
    document.getElementById('sectionsData').style.backgroundColor = '#6fdc6f';
    $scope.dataDone = true;
  }
  if(!$scope.dataDone || $scope.project.orderType == "" || $scope.project.orderAttribute == ""){
    document.getElementById('sectionsResults').style.backgroundColor = '#ff3333';
  } else{
    document.getElementById('sectionsResults').style.backgroundColor = '#6fdc6f';
  }
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
  $http.get('/getData/' + $scope.projectID).success(function(data) {
    $scope.currentData = data;
    // See which type of order was chosen
    if($scope.project.orderType == "Ascending"){
      $scope.reverse = false;
    }else if($scope.project.orderType == "Descending"){
      $scope.reverse = true;
    }else{
      // Error, order type not chosen
      //document.getElementById("errorMethod").style.display = "block";
    }
    $scope.dataOrdered = orderBy($scope.currentData, $scope.propertyName, $scope.reverse);
    $scope.saveResult($scope.dataOrdered);
  })
  .error(function(data) {
    console.log('Error: ' + data);
    //document.getElementById("errorMethod").style.display = "block";
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
  $http.put('/api/projectAddResult/' + projectID, $scope.newResult).success(function(response){
    $http.post('/saveDataResults/' + projectID + '/'+resId, datas).success(function(response){
      document.getElementById("resultName").value = "";
      document.getElementById("resultNotes").value = "";
      refresh();
      document.getElementById("reportMessage").style.display = "block";
      document.getElementById("reportMessage").innerHTML = "Execution complete and result saved.";
      //$('#executing').hide(); 
    });
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
      $http.get('/deleteResult/' + $scope.projectID + '/'+id).success(function(data) {
      })
      $scope.updateProject();
      refreshResults();
    })
    .error(function() {
      var idx = $scope.results.indexOf(result);
      if (idx >= 0) {
        $scope.results.splice(idx, 1);
      }
      $http.get('/deleteResult/' + $scope.projectID + '/'+id).success(function(data) {
      })
      $scope.updateProject();
      refreshResults();
    });
}

// Refresh results
var refreshResults = function(){
  $http.get('/api/project/' + $scope.projectID).success(function(data) {
    $scope.project = data;
    $scope.results = data.results; 
    $scope.dataResults(data.results.length);
    })
    .error(function(data) {
      console.log('Error: ' + data);
  });
}

// Update date table after importing
$scope.dataUpdate = function(){
  $('#loading').show();
  $http.get('/getData/' + $scope.projectID).success(function(data) {
    $scope.currentData = data;
    if(data == 'No data...'){
      //Do nothing, no data
      $('#loading').hide();
    }else{
      $scope.dataIntoTable(); 
      $('#loading').hide();
    }
    if($location.path() == '/data_orderBy.html'){
      $('#loading').show();
      $timeout( function(){ $scope.buildDataSetTable(); }, 1000);
    }
  })
  .error(function(data) {
    console.log('Error: ' + data);
  });
}

//Import data
$scope.importData = function(){
  $('#importing').show();
  document.getElementById("importMessage").style.display = "none";
  document.getElementById("importMessageError").style.display = "none";
  var elements = document.getElementsByName("dataType");
  if(elements[0].checked){
    //Import data
    UploadData();
  }else{
    document.getElementById("importMessageError").innerHTML = "Data to import not selected.";
    document.getElementById("importMessageError").style.display = "block";
    $('#importing').hide(); 
  }
}

// Upload file to get the data  
function UploadData(){
  document.getElementById("importMessage").style.display = "none";
  document.getElementById("importMessageError").style.display = "none";
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
          //alert("CSV file was rejected: number of rows are incorrect.\n\nNumber of rows = 1 header line for the criteria attributes (8 in total) + total number of data. Example:\nData attribute 1, Data attribute 1, criteria 1, criteria 2, ...\nalternative 1, value, value, ...\nalternative 2, value, value, ...\nand so on...");
          document.getElementById("importMessageError").innerHTML = "CSV file rejected: number of rows are incorrect or insufficient. Check the CSV file structure example below.";
          document.getElementById("importMessageError").style.display = "block";
          $('#importing').hide();
          return 0;
        }
        //Check number of columns
        var c = rows[0].split(",");
        var numCells = c.length;
        // if(numCells != 8){
        //   console.log('Number of columns are incorrect or do not correspond to the actual number of criteria.');
        //   //alert("CSV file was rejected: number of columns are incorrect.\n\nNumber of columns = 1 header column for alternative names + total number of criteria. Example:\n\nAlternatives Criteria, criteria 1, criteria 2, ...\nalternative 1, value, value, ...\nalternative 2, value, value, ...\nand so on...");
        //   document.getElementById("importMessageError").innerHTML = "CSV file rejected: number of columns are incorrect or insufficient. Check the CSV file structure example below.";
        //   document.getElementById("importMessageError").style.display = "block";
        //   $('#importing').hide();
        //   return 0;    
        // }
        var dataList = [];
        for (var i = 1; i < rows.length; i++) {
          var row = table.insertRow(-1);
          var cells = rows[i].split(",");
          var data = {};
          //var criterion = {name:"", description:"", direction:"", measure:"", weight:0, indifference:0,  preference:0,  veto:0};
          for (var j = 0; j < cells.length; j++) {
            data[c[j]] = cells[j];
          }
          dataList.push(data);
        }
        //console.log(dataList);
        var jsonData = angular.toJson(dataList);
        $http.post('/saveData/' + $scope.projectID, jsonData).success(function(data) {
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
        table.className = 'table table-bordered horizontal';
        table.id = 'auxTable';
        // var dvCSV = document.getElementById("dvCSV");
        // dvCSV.innerHTML = "";
        // dvCSV.appendChild(table);
        //$timeout( function(){ refreshProject(); $('#importing').hide(); }, 1000);
        document.getElementById("importMessage").innerHTML = "Successfully imported data.";
        document.getElementById("importMessage").style.display = "block";
        $scope.dataDone = true;
        $('#importing').hide();
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

// Put the data into the table
$scope.dataIntoTable = function(){
  if($scope.currentData == 'No data...'){
    if($location.path() == '/data_orderBy.html'){
      document.getElementById("createDataDiv").style.display = "block";
      $('#loading').hide();
    }else if($location.path() == '/results_orderBy.html'){
      //DO nothing
    }else{
      $('#loading').hide();
    }
  }else{
  $("#resultTbl").children().remove();
  if($scope.currentData == [] || $scope.currentData == null || $scope.currentData == ""){
    console.log($scope.currentData);
  }else{
    var data = $scope.currentData;
    var rows = $scope.currentData.length;
    var cells = Object.keys(data[0]).length;
    var table = document.getElementById("resultTbl");
    var keyNamesHeader = Object.keys(data[0]);
    var row1 = table.insertRow(0);
    $scope.data2.availableOptions2 = [{id: 'notSelected', name: '<-- Select attribute to order -->'}];
    for (var n = 0; n < cells; n++) {
      var option = {id:'', name:''};
      var cellHeader = row1.insertCell(n);
      cellHeader.setAttribute("id", "dataHeader3");
      cellHeader.innerHTML = keyNamesHeader[n];
      option['id'] = keyNamesHeader[n];
      option['name'] = keyNamesHeader[n];
      $scope.data2.availableOptions2.push(option);
    }
    for (var i = 0; i < rows; i++) {
      var row = table.insertRow(i+1);
      var keyNames = Object.keys(data[i]);
      for (var j = 0; j < cells; j++) {
        var cell = row.insertCell(j);
        cell.setAttribute("id", "dataBody2");
        //console.log('Row: '+i+' col: '+keyNames[j]+' value: '+data[i][keyNames[j]]);
        cell.innerHTML = data[i][keyNames[j]]; 
      }
    }
    checkStatus();
    //$('#loading').hide();
    }
  }
}

// Build edit table to add/delete/edit data manually if there is already data (file data exists)
$scope.buildDataSetTable = function(){
  if($scope.currentData.length == 0){
    //Do nothing, file empty
  }else{
    $("#dataTable").children().remove();
  var data = $scope.currentData;
  var rows = $scope.currentData.length;
  var cells = Object.keys(data[0]).length;
  var table = document.getElementById("dataTable");
  var keyNamesHeader = Object.keys(data[0]);
  // Add header
  var row1 = table.insertRow(0);
  var cellHeaderAction = row1.insertCell(0);
  cellHeaderAction.setAttribute("id", "dataHeader");
  cellHeaderAction.innerHTML = "Action";
  for (var n = 0; n < cells; n++) {
    var option = {id:'', name:''};
    var cellHeader = row1.insertCell(n+1);
    cellHeader.setAttribute("id", "dataHeader3");
    cellHeader.innerHTML = keyNamesHeader[n];
    option['id'] = keyNamesHeader[n];
    option['name'] = keyNamesHeader[n];
  }
  // Add row to add new data
  var row2 = table.insertRow(1);
  var cellAdd2 = row2.insertCell(0);
  //cellAdd2.setAttribute("id", "dataBody2");
  cellAdd2.innerHTML = "<input type='button' value='Add Data' onclick='createData()' class='btn btn-primary'/>";
  for (var m = 0; m < cells; m++) {
    var cellAdd = row2.insertCell(m+1);
    cellAdd.setAttribute("id", "dataBody2");
    cellAdd.innerHTML = "<input id='dataInput2' type='text' placeholder='Data' name='data' ng-model='data'/>";
  }
  // Add current data
  for (var i = 0; i < rows; i++) {
    var row = table.insertRow(i+2);
    var keyNames = Object.keys(data[i]);
    var cell1 = row.insertCell(0);
    //cell1.setAttribute("id", "dataBody2");
    //cell1.innerHTML = "<input type='button' value='Edit' ng-click='editData(this)' class='btn btn-warning'/> <input type='button' value='Delete' onclick='deleteData("+(i+2)+")' class='btn btn-danger'/> ";
    cell1.innerHTML = "<input type='button' value='Delete' onclick='deleteData("+(i+2)+")' class='btn btn-danger'/>";
    for (var j = 0; j < cells; j++) {
      var cell = row.insertCell(j+1);
      cell.setAttribute("id", "dataBody2");
      //console.log('Row: '+i+' col: '+keyNames[j]+' value: '+data[i][keyNames[j]]);
      cell.innerHTML = data[i][keyNames[j]]; 
    }
  }
  checkStatus();
  }
  $('#loading').hide();
}

// Build edit table to add/delete/edit data manually if user creates data set (file empty)
$scope.createDataSet = function(){
  $('#loading').show();
  $("#dataTable").children().remove();
  //var data = $scope.currentData;
  //var rows = $scope.currentData.length;
  //var cells = Object.keys(data[0]).length;
  var table = document.getElementById("dataTable");
  var cellsNumber = document.getElementById("attributeNumber").value;
  //var keyNamesHeader = Object.keys(data[0]);
  // Add header
  var row1 = table.insertRow(0);
  var cellHeaderAction = row1.insertCell(0);
  cellHeaderAction.setAttribute("id", "dataHeader");
  cellHeaderAction.innerHTML = "Action";
  for (var n = 0; n < cellsNumber; n++) {
    var cellHeader = row1.insertCell(n+1);
    cellHeader.setAttribute("id", "dataHeader3");
    cellHeader.innerHTML = "<input id='dataInput2' type='text' placeholder='Attribute Name' name='data'/>";
  }
  // Add row to add new data
  var row2 = table.insertRow(1);
  var cellAdd2 = row2.insertCell(0);
  //cellAdd2.setAttribute("id", "dataBody2");
  cellAdd2.innerHTML = "<input type='button' value='Add Data' onclick='createData2()' class='btn btn-primary'/>";
  for (var m = 0; m < cellsNumber; m++) {
    var cellAdd = row2.insertCell(m+1);
    cellAdd.setAttribute("id", "dataBody2");
    cellAdd.innerHTML = "<input id='dataInput2' type='text' placeholder='Data' name='data' ng-model='data'/>";
  }
  $('#loading').hide();
}


//Update data file
updateDataFile = function(jsonData){
  $http.post('/saveData/' + $scope.projectID, jsonData).success(function(data) {
  })
  .error(function(data) {
    console.log('Error: ' + data);
  }); 
  $scope.dataUpdate(); 
}

// Reload project data
$scope.reloadData = function(result, identifier){
  $('#loading').show();
  document.getElementById("reportMessage").style.display = "none";
  var i = $scope.projectID;
  var id = identifier;
  var dataResult = result;
  // Reload configurations
  $http.post('/api/reloadProjectFileMethods/' + i + '/' + id, dataResult).success(function(response) {
    $http.post('/saveDataReload/' + i +'/' + id, dataResult).success(function(data) {
      refresh();
      $scope.dataUpdate(); 
      document.getElementById("reportMessage").style.display = "block";
      document.getElementById("reportMessage").innerHTML = "Reload complete.";
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });
  })
}

//Select all checkboxes from the export result options
$scope.selectAll = function(id){
  var idList = id;
  document.getElementById("res"+idList).checked = true;
  document.getElementById("note"+idList).checked = true;
}

}]);

//Delete data
function deleteData(data){
  var d = data;
  //console.log(d);
  //Delete row
  document.getElementById("dataTable").deleteRow(d);
  var table = document.getElementById("dataTable");
  var len = table.rows.length;
  var header = table.rows[0];
  var columns = table.rows[0].cells.length;
  var dataList = [];
  for (var i = 2; i < len; i++) {
    var data = {};
    for (var j = 1; j < columns; j++) {
      data[header.cells[j].innerHTML] = table.rows[i].cells[j].innerHTML;
    }
    dataList.push(data);
  }
  var jsonData = angular.toJson(dataList);
  //console.log(jsonData);
  updateDataFile(jsonData);
}

//Add new data
function createData(){
  var table = document.getElementById("dataTable");
  var newRow = table.rows[1];
  var len = table.rows.length;
  var header = table.rows[0];
  var columns = table.rows[0].cells.length;
  var dataList = [];
  for (var i = 2; i < len; i++) {
    var data = {};
    for (var j = 1; j < columns; j++) {
      data[header.cells[j].innerHTML] = table.rows[i].cells[j].innerHTML;
    }
    dataList.push(data);
  }
  var data2 = {};
  for (var j = 1; j < columns; j++) {
      data2[header.cells[j].innerHTML] = newRow.cells[j].children[0].value;
  }
  dataList.push(data2);
  var jsonData = angular.toJson(dataList);
  updateDataFile(jsonData);
}

//Add new data if create new data set was clicked
function createData2(){
  var table = document.getElementById("dataTable");
  var newRow = table.rows[1];
  var len = table.rows.length;
  var header = table.rows[0];
  var columns = table.rows[0].cells.length;
  var dataList = [];
  var data2 = {};
  for (var j = 1; j < columns; j++) {
      data2[header.cells[j].children[0].value] = newRow.cells[j].children[0].value;
  }
  dataList.push(data2);
  var jsonData = angular.toJson(dataList);
  updateDataFile(jsonData);
}


//Export into a .csv file 
app.directive('exportToCsv',function(){
    return {
      restrict: 'A',
      scope: {
        names: '=names'
      },
      link: function (scope, element, attrs) {
        var el = element[0];
        var elements = document.getElementsByName("dataBox");
        element.bind('click', function(e){
          document.getElementById("exportMessage").style.display = "none";
          document.getElementById("exportMessageError").style.display = "none";
          var zip = new JSZip();
          if(elements[0].checked){
            var table = document.getElementById("resultTbl");
            if(table.rows.length == 0){
              document.getElementById("exportMessageError").innerHTML = "No data to export.";
              document.getElementById("exportMessageError").style.display = "block"; 
            }else{
              var csvString = '';
              for(var i=0; i<table.rows.length;i++){
                var rowData = table.rows[i].cells;
                for(var j=0; j<rowData.length;j++){ //number of columns to export
                  csvString = csvString + rowData[j].innerHTML + ",";
                }
                csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
                csvString = csvString + "\n";
              }
              csvString = csvString.substring(0, csvString.length - 1);
              zip.file(scope.names+"/data.csv", csvString);
              zip.generateAsync({type:"blob"})
              .then(function(content) {
                  // see FileSaver.js
                  saveAs(content, scope.names+".zip");
              });
              document.getElementById("exportMessage").innerHTML = "Export successfully.";
              document.getElementById("exportMessage").style.display = "block";
            }
          }else{
            document.getElementById("exportMessageError").innerHTML = "Data to export not selected.";
            document.getElementById("exportMessageError").style.display = "block"; 
          }
        });
      }
    }
});

// Export functions
//Export certain result into a .csv file 
app.directive('exportResultToCsv',function(){
    return {
      restrict: 'A',
      scope: {
        values: '=values',
        names: '=names'
      },
      link: function (scope, element, attrs) {
        var el = element[0];
          element.bind('click', function(e){
            var zip = new JSZip();
            if(document.getElementById('res'+scope.values).checked == true){
              var table = document.getElementById("resultsTable"+scope.values);
              var csvString = '';
              for(var i=0; i<table.rows.length;i++){
                var rowData = table.rows[i].cells;
                for(var j=0; j<rowData.length;j++){ //number of columns to export
                  csvString = csvString + rowData[j].innerHTML + ",";
                }
                csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
                csvString = csvString + "\n";
              }
              csvString = csvString.substring(0, csvString.length - 1);
              zip.file(scope.names+"/results.csv", csvString);
            }
            if(document.getElementById('note'+scope.values).checked == true){
              var notes = document.getElementById("notes"+scope.values).innerHTML;
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
      }
    }
});
