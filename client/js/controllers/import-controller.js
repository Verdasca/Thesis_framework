app.controller('importController', ['$scope', '$http', '$resource', '$location', '$window', '$timeout', 'orderByFilter', function ($scope, $http, $resource, $location, $window, $timeout, orderBy) {

$scope.projectID = $location.search().projectId;
$scope.username = $location.search().n
$scope.criteriaDone = false;
$scope.alternativesDone = false;
$scope.configurationsDone = false;

var Criterions = $resource('/api/criterions');
var Alternatives = $resource('/api/alternatives');
var Performances = $resource('/api/performances');
var Categories = $resource('/api/categories');
var Parameters = $resource('/api/parameters');
var Profiles = $resource('/api/profiles');

// Boolean needed if we are on section alternatives set and perf. table to update the data
$scope.perfTblImported = false;
// Boolean needed if we are on section criterion set to update the data because of the weight method or to update performance or profile tables
$scope.criteriaImported = false;
// Boolean needed if we are on section alternatives set and perf. table to update the data or to update performance or profile tables
$scope.alternativesImported = false;
// Boolean needed if we are on section decison configurations to update the data  or to update profile table
$scope.categoriesImported = false;
// Boolean needed if we are on section decison configurations to update the data 
$scope.proTblImported = false;

// Import section
$http.get('/api/project/' + $scope.projectID).success(function(data) {
  $scope.projectUpdated = data;
}); 

// Refresh project after importing
var refreshProject = function(){
  console.log("Checking status...");
  $http.get('/api/project/' + $scope.projectID).success(function(data) {
    $scope.projectUpdated = data;
    if($scope.projectUpdated.criteria.length == 0){
      document.getElementById('sectionsCriteria').style.backgroundColor = '#ff3333';
      $scope.criteriaDone = false;
    }else{
      document.getElementById('sectionsCriteria').style.backgroundColor = '#6fdc6f';
      $scope.criteriaDone = true;
    }
    if($scope.projectUpdated.alternatives.length == 0 || $scope.projectUpdated.performancetables.length == 0){
      document.getElementById('sectionsAlternatives').style.backgroundColor = '#ff3333';
      $scope.alternativesDone = false;
    }else{
      document.getElementById('sectionsAlternatives').style.backgroundColor = '#6fdc6f';
      $scope.alternativesDone = true;
    }
    if($scope.projectUpdated.profiletables.length == 0 || $scope.projectUpdated.categories.length == 0 || $scope.projectUpdated.parameters.length == 0){
      document.getElementById('sectionsConfigurations').style.backgroundColor = '#ff3333';
      $scope.configurationsDone = false;
    }else{
      document.getElementById('sectionsConfigurations').style.backgroundColor = '#6fdc6f';
      $scope.configurationsDone = true;
    }
    // if($scope.criteriaDone && $scope.alternativesDone && $scope.configurationsDone){
    //   document.getElementById('methodButtons').disabled = false;
    // } else{
    //   document.getElementById('methodButtons').disabled = true;
    // }
  }); 
}

// Start import when clicking on import button
// First delete existing current data before importing and see which data was selected to import
$scope.importData = function(){
  $('#importing').show();
  document.getElementById("importMessageError").style.display = "none";
  document.getElementById("importMessage1").style.display = "none";
  document.getElementById("importMessageError1").style.display = "none";
  document.getElementById("importMessage2").style.display = "none";
  document.getElementById("importMessageError2").style.display = "none";
  document.getElementById("importMessage3").style.display = "none";
  document.getElementById("importMessageError3").style.display = "none";
  document.getElementById("importMessage4").style.display = "none";
  document.getElementById("importMessageError4").style.display = "none";
  document.getElementById("importMessage5").style.display = "none";
  document.getElementById("importMessageError5").style.display = "none";
  document.getElementById("importMessage6").style.display = "none";
  document.getElementById("importMessageError6").style.display = "none";
  document.getElementById("importMessage7").style.display = "none";
  document.getElementById("importMessageError7").style.display = "none";
  var i = $scope.project._id;
  var elements = document.getElementsByName("dataType");
  if(elements[0].checked){
    console.log('Importing criteria...');
    if($scope.projectUpdated.criteria.length == 0){
      console.log('There are no criteria to delete...');
      // Import data
      UploadCriteria();
    }else{
      //Delete all current criteria 
      $http.delete('/api/criterions/' + i)
        .success(function() {
          console.log("Done deleting all criteria.");
          // Import data
          UploadCriteria();
        })
        .error(function() {
          //console.log('Error: fail deletes' );
          $('#importing').hide();
      });
    }
  }
  if(elements[1].checked){
    console.log('Importing alternatives...');
    if($scope.projectUpdated.alternatives.length == 0){
      console.log('There are no alternatives to delete...');
      // Import data
      UploadAlternatives();
    }else{
      //Delete all current alternatives 
      $http.delete('/api/alternatives/' + i)
        .success(function() {
          console.log("Done deleting all alternatives.");
          // Import data
          UploadAlternatives();
        })
        .error(function() {
          //console.log('Error: fail deletes' );
          $('#importing').hide();
      });
    }
  }
  if(elements[2].checked){
    console.log('Importing performances...');
    if($scope.projectUpdated.performancetables.length == 0){
      console.log('There are no performances to delete...');
      // Import data
      UploadPerformances();
    }else{
      //Delete all current performances 
      $http.delete('/api/performances/' + i)
        .success(function() {
          console.log("Done deleting all performances.");
          // Import data
          UploadPerformances();
        })
        .error(function() {
          //console.log('Error: fail deletes' );
          $('#importing').hide();
      });
    }
  }
  if(elements[3].checked){
    console.log('Importing alternatives and performances...');
    if($scope.projectUpdated.performancetables.length == 0 && $scope.projectUpdated.alternatives.length == 0){
      console.log('There are no performances or alternatives to delete...');
      // Import data
      UploadAlternativesAndPerformances();
    }else{
    	if($scope.projectUpdated.performancetables.length != 0){
    		//Delete all current performances 
	      	$http.delete('/api/performances/' + i)
	        .success(function() {
	          console.log("Done deleting all performances.");
	        })
	        .error(function() {
	          //console.log('Error: fail deletes' );
	          $('#importing').hide();
	      	});
    	}
    	if($scope.projectUpdated.alternatives.length != 0){
    		//Delete all current alternatives 
		    $http.delete('/api/alternatives/' + i)
		        .success(function() {
		        console.log("Done deleting all alternatives.");
		    })
		        .error(function() {
		        //console.log('Error: fail deletes' );
		        $('#importing').hide();
		    });
    	}
    	// Import data
    	$timeout( function(){ UploadAlternativesAndPerformances(); }, 1000);
    }
  }
  if(elements[4].checked){
    console.log('Importing categories...');
    if($scope.projectUpdated.categories.length == 0){
      console.log('There are no categories to delete...');
      // Import data
      UploadCategories();
    }else{
      //Delete all current categories 
      $http.delete('/api/categories/' + i)
        .success(function() {
          console.log("Done deleting all categories.");
          // Import data
          UploadCategories();
        })
        .error(function() {
          //console.log('Error: fail deletes' );
          $('#importing').hide();
      });
    }
  }
  if(elements[5].checked){
    console.log('Importing parameters...');
    if($scope.projectUpdated.parameters.length == 0){
      console.log('There are no parameters to delete...');
      // Import data
      UploadParameters();
    }else{
      //Delete all current parameters 
      $http.delete('/api/parameters/' + i)
        .success(function() {
          console.log("Done deleting all parameters.");
          // Import data
          UploadParameters();
        })
        .error(function() {
          //console.log('Error: fail deletes' );
          $('#importing').hide();
      });
    }
  }
  if(elements[6].checked){
    console.log('Importing profiles...');
    if($scope.projectUpdated.profiletables.length == 0){
	    console.log('There are no profiles to delete...');
	    // Import data
	    UploadProfiles();
    }else{
      //Delete all current profiles 
      $http.delete('/api/profiles/' + i)
        .success(function() {
          console.log("Done deleting all profiles.");
          // Import data
          UploadProfiles();
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

// Upload file to get the data for the criteria 
function UploadCriteria(){
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
          document.getElementById("importMessageError1").innerHTML = "Criteria CSV file rejected: number of rows are incorrect or insufficient. Check the CSV file structure example below.";
          document.getElementById("importMessageError1").style.display = "block";
          $('#importing').hide();
          return 0;
        }
        //Check number of columns
        var c = rows[0].split(",");
        var numCells = c.length;
        if(numCells != 8){
          console.log('Number of columns are incorrect or do not correspond to the actual number of criteria.');
          //alert("CSV file was rejected: number of columns are incorrect.\n\nNumber of columns = 1 header column for alternative names + total number of criteria. Example:\n\nAlternatives Criteria, criteria 1, criteria 2, ...\nalternative 1, value, value, ...\nalternative 2, value, value, ...\nand so on...");
          document.getElementById("importMessageError1").innerHTML = "Criteria CSV file rejected: number of columns are incorrect or insufficient. Check the CSV file structure example below.";
          document.getElementById("importMessageError1").style.display = "block";
          $('#importing').hide();
          return 0;    
        }
        for (var i = 1; i < rows.length; i++) {
          var row = table.insertRow(-1);
          var cells = rows[i].split(",");
          var criterion = {name:"", description:"", direction:"", measure:"", weight:0, indifference:0,  preference:0,  veto:0};
          if(cells[0] == '' || cells[0] == null){
            // Do nothing - no criterion name, don't create
          }else{
            criterion.name = cells[0];
            criterion.description = cells[1];
            if(cells[2] == "max" || cells[2] == "min"){
              criterion.direction = cells[2];
            }
            if(cells[3] == "cardinal" || cells[3] == "ordinal"){
              criterion.measure = cells[3];
            }
            criterion.weight = cells[4];
            criterion.indifference = cells[5];
            criterion.preference = cells[6];
            criterion.veto = cells[7];
            $scope.createCriterionImport(criterion);
          }
        }
        table.className = 'table table-bordered horizontal';
        table.id = 'auxTable';
        // var dvCSV = document.getElementById("dvCSV");
        // dvCSV.innerHTML = "";
        // dvCSV.appendChild(table);
        $timeout( function(){ refreshProject(); $('#importing').hide(); }, 1000);
      	document.getElementById("importMessage1").innerHTML = "Successfully imported criteria.";
      	document.getElementById("importMessage1").style.display = "block";
        $scope.criteriaImported = true;
      }
      reader.readAsText(fileUpload.files[0]);
    } else {
      //alert("This browser does not support HTML5.");
      document.getElementById("importMessageError1").innerHTML = "This browser does not support HTML5.";
      document.getElementById("importMessageError1").style.display = "block";
      $('#importing').hide();
    }
  } else {
      //alert("Please upload a valid CSV file.");
      document.getElementById("importMessageError1").innerHTML = "Please upload a valid CSV file for criteria.";
      document.getElementById("importMessageError1").style.display = "block";
      $('#importing').hide();
  }
}

// Upload file to get the data for the alternatives 
function UploadAlternatives(){
  var fileUpload = document.getElementById("fileUpload2");
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
          document.getElementById("importMessageError2").innerHTML = "Alternatives CSV file rejected: number of rows are incorrect or insufficient. Check the CSV file structure example below.";
          document.getElementById("importMessageError2").style.display = "block";
          $('#importing').hide();
          return 0;
        }
        //Check number of columns
        var c = rows[0].split(",");
        var numCells = c.length;
        if(numCells > 2 || numCells == 0){
          document.getElementById("importMessageError2").innerHTML = "Alternatives CSV file rejected: number of columns are incorrect or insufficient. Check the CSV file structure example below.";
          document.getElementById("importMessageError2").style.display = "block";
          $('#importing').hide();
          return 0;    
        }
        for (var i = 1; i < rows.length; i++) {
          var row = table.insertRow(-1);
          var cells = rows[i].split(",");
          var alternative = {name:"", description:""};
          if(cells[0] == '' || cells[0] == null){
            // Do nothing - no alternative name, don't create
          }else{
            alternative.name = cells[0];
            alternative.description = cells[1];
            $scope.createAlternativeImport(alternative);
          }
        }
        table.className = 'table table-bordered horizontal';
        table.id = 'auxTable';
        // var dvCSV = document.getElementById("dvCSV");
        // dvCSV.innerHTML = "";
        // dvCSV.appendChild(table);
        $timeout( function(){ refreshProject(); $('#importing').hide(); }, 1000);
      	document.getElementById("importMessage2").innerHTML = "Successfully imported alternatives.";
      	document.getElementById("importMessage2").style.display = "block";
        $scope.alternativesImported = true;
      }
      reader.readAsText(fileUpload.files[0]);
    } else {
      //alert("This browser does not support HTML5.");
      document.getElementById("importMessageError2").innerHTML = "This browser does not support HTML5.";
      document.getElementById("importMessageError2").style.display = "block";
      $('#importing').hide();
    }
  } else {
      //alert("Please upload a valid CSV file.");
      document.getElementById("importMessageError2").innerHTML = "Please upload a valid CSV file for alternatives.";
      document.getElementById("importMessageError2").style.display = "block";
      $('#importing').hide();
  }
}

// Upload file to get the data for the performances 
function UploadPerformances(){
  var fileUpload = document.getElementById("fileUpload3");
  var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
  if (regex.test(fileUpload.value.toLowerCase())) {
    if (typeof (FileReader) != "undefined") {
      var reader = new FileReader();
      reader.onload = function (e) {
        var table = document.createElement("table");
        var rows = e.target.result.split("\n");
        //Check number of rows
        var numRows = rows.length;
        if(numRows != $scope.projectUpdated.alternatives.length + 1){
        	document.getElementById("importMessageError3").innerHTML = "Performance Table CSV file rejected: number of rows are incorrect or insufficient. Check the CSV file structure example below.";
          	document.getElementById("importMessageError3").style.display = "block";
          	$('#importing').hide();
          	return 0;
        }
        //Check number of columns
        var c = rows[0].split(",");
        var numCells = c.length;
        if(numCells != $scope.projectUpdated.criteria.length + 1){
        	document.getElementById("importMessageError3").innerHTML = "Performance Table CSV file rejected: number of columns are incorrect or insufficient. Check the CSV file structure example below.";
          	document.getElementById("importMessageError3").style.display = "block";
          	$('#importing').hide();
          	return 0;    
        }
        for (var i = 1; i < rows.length; i++) {
          	var row = table.insertRow(-1);
          	var cells = rows[i].split(",");
          	for (var j = 1; j <= cells.length; j++) {
          		var performance = {criterion:"", alternative:"", value:0};
          		if(cells[0] == '' || cells[0] == null || cells[j] == '' || cells[j] == null || c[j] == '' || c[j] == null){
           		// Do nothing - no alternative or no value or no criterion, don't create
	          	}else{
		          	performance.alternative = cells[0];
		          	performance.value = cells[j];
		            performance.criterion = c[j];
		            $scope.createPerformanceImport(performance);
	          	}
          	}
        }
        table.className = 'table table-bordered horizontal';
        table.id = 'auxTable';
        // var dvCSV = document.getElementById("dvCSV");
        // dvCSV.innerHTML = "";
        // dvCSV.appendChild(table);
        $timeout( function(){ refreshProject(); $('#importing').hide(); }, 1000);
      	document.getElementById("importMessage3").innerHTML = "Successfully imported performance table.";
      	document.getElementById("importMessage3").style.display = "block";
      	$scope.perfTblImported = true;
      }
      reader.readAsText(fileUpload.files[0]);
    } else {
      //alert("This browser does not support HTML5.");
      document.getElementById("importMessageError3").innerHTML = "This browser does not support HTML5.";
      document.getElementById("importMessageError3").style.display = "block";
      $('#importing').hide();
    }
  } else {
      //alert("Please upload a valid CSV file.");
      document.getElementById("importMessageError3").innerHTML = "Please upload a valid CSV file for the performance table.";
      document.getElementById("importMessageError3").style.display = "block";
      $('#importing').hide();
  }
}

// Upload file to get the data for the performances and alternatives
function UploadAlternativesAndPerformances(){
  var fileUpload = document.getElementById("fileUpload4");
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
        	document.getElementById("importMessageError4").innerHTML = "Alternatives and Performance Table CSV file rejected: number of rows are incorrect or insufficient. Check the CSV file structure example below.";
          	document.getElementById("importMessageError4").style.display = "block";
          	$('#importing').hide();
          	return 0;
        }
        //Check number of columns
        var c = rows[0].split(",");
        var numCells = c.length;
        if(numCells != $scope.projectUpdated.criteria.length + 1){
        	document.getElementById("importMessageError4").innerHTML = "Alternatives and Performance Table CSV file rejected: number of columns are incorrect or insufficient. Check the CSV file structure example below.";
          	document.getElementById("importMessageError4").style.display = "block";
          	$('#importing').hide();
          	return 0;    
        }
        for (var i = 1; i < rows.length; i++) {
          	var row = table.insertRow(-1);
          	var cells = rows[i].split(",");
          	$scope.createAlternativeImport2(cells[0]);
          	for (var j = 1; j <= cells.length; j++) {
          		var performance = {criterion:"", alternative:"", value:0};
          		if(cells[0] == '' || cells[0] == null || cells[j] == '' || cells[j] == null || c[j] == '' || c[j] == null){
           		// Do nothing - no alternative or no value or no criterion, don't create
	          	}else{
		          	performance.alternative = cells[0];
		          	performance.value = cells[j];
		            performance.criterion = c[j];
		            $scope.createPerformanceImport(performance);
	          	}
          	}
        }
        table.className = 'table table-bordered horizontal';
        table.id = 'auxTable';
        // var dvCSV = document.getElementById("dvCSV");
        // dvCSV.innerHTML = "";
        // dvCSV.appendChild(table);
        $timeout( function(){ refreshProject(); $('#importing').hide(); }, 1000);
      	document.getElementById("importMessage4").innerHTML = "Successfully imported alternatives and performance table.";
      	document.getElementById("importMessage4").style.display = "block";
      	$scope.perfTblImported = true;
      }
      reader.readAsText(fileUpload.files[0]);
    } else {
      //alert("This browser does not support HTML5.");
      document.getElementById("importMessageError4").innerHTML = "This browser does not support HTML5.";
      document.getElementById("importMessageError4").style.display = "block";
      $('#importing').hide();
    }
  } else {
      //alert("Please upload a valid CSV file.");
      document.getElementById("importMessageError4").innerHTML = "Please upload a valid CSV file for alternatives and performance table.";
      document.getElementById("importMessageError4").style.display = "block";
      $('#importing').hide();
  }
}

// Upload file to get the data for the categories 
function UploadCategories(){
  var fileUpload = document.getElementById("fileUpload5");
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
	        document.getElementById("importMessageError5").innerHTML = "Categories CSV file rejected: number of rows are incorrect or insufficient. Check the CSV file structure example below.";
	        document.getElementById("importMessageError5").style.display = "block";
	        $('#importing').hide();
	        return 0;
        }
        //Check number of columns
        var c = rows[0].split(",");
        var numCells = c.length;
        if(numCells != 3){
        	document.getElementById("importMessageError5").innerHTML = "Categories CSV file rejected: number of columns are incorrect or insufficient. Check the CSV file structure example below.";
          	document.getElementById("importMessageError5").style.display = "block";
          	$('#importing').hide();
          	return 0;    
        }
        for (var i = 1; i < rows.length; i++) {
          var row = table.insertRow(-1);
          var cells = rows[i].split(",");
          var category = {rank:0, name:"", action:""};
          if(cells[0] == '' || cells[0] == null || cells[1] == '' || cells[1] == null || cells[2] == '' || cells[2] == null){
            // Do nothing - no category name or rank or action, don't create
          }else{
          	category.rank = cells[0];
            category.name = cells[1];
            category.action = cells[2];
            $scope.createCategoryImport(category);
          }
        }
        table.className = 'table table-bordered horizontal';
        table.id = 'auxTable';
        // var dvCSV = document.getElementById("dvCSV");
        // dvCSV.innerHTML = "";
        // dvCSV.appendChild(table);
        $timeout( function(){ refreshProject(); $('#importing').hide(); }, 1000);
      	document.getElementById("importMessage5").innerHTML = "Successfully imported categories.";
      	document.getElementById("importMessage5").style.display = "block";
        $scope.categoriesImported = true;
      }
      reader.readAsText(fileUpload.files[0]);
    } else {
      //alert("This browser does not support HTML5.");
      document.getElementById("importMessageError5").innerHTML = "This browser does not support HTML5.";
      document.getElementById("importMessageError5").style.display = "block";
      $('#importing').hide();
    }
  } else {
      //alert("Please upload a valid CSV file.");
      document.getElementById("importMessageError5").innerHTML = "Please upload a valid CSV file for categories.";
      document.getElementById("importMessageError5").style.display = "block";
      $('#importing').hide();
  }
}

// Upload file to get the data for the criteria 
function UploadParameters(){
  var fileUpload = document.getElementById("fileUpload6");
  var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
  if (regex.test(fileUpload.value.toLowerCase())) {
    if (typeof (FileReader) != "undefined") {
      var reader = new FileReader();
      reader.onload = function (e) {
        var table = document.createElement("table");
        var rows = e.target.result.split("\n");
        //Check number of rows
        var numRows = rows.length;
        if(numRows <= 1 || numRows > 2){
        	document.getElementById("importMessageError6").innerHTML = "Parameters CSV file rejected: number of rows are incorrect or insufficient. Check the CSV file structure example below.";
          	document.getElementById("importMessageError6").style.display = "block";
          	$('#importing').hide();
          	return 0;
        }
        //Check number of columns
        var c = rows[0].split(",");
        var numCells = c.length;
        if(numCells != 1){
        	document.getElementById("importMessageError6").innerHTML = "Parameters CSV file rejected: number of columns are incorrect or insufficient. Check the CSV file structure example below.";
          	document.getElementById("importMessageError6").style.display = "block";
          	$('#importing').hide();
          	return 0;    
        }
        for (var i = 1; i < rows.length; i++) {
          var row = table.insertRow(-1);
          var cells = rows[i].split(",");
          if(cells[0] == '' || cells[0] == null){
            // Do nothing - no parameter credibility, don't create
          }else{
            $scope.createParameterImport(cells[0]);
          }
        }
        table.className = 'table table-bordered horizontal';
        table.id = 'auxTable';
        // var dvCSV = document.getElementById("dvCSV");
        // dvCSV.innerHTML = "";
        // dvCSV.appendChild(table);
        $timeout( function(){ refreshProject(); $('#importing').hide(); }, 1000);
      	document.getElementById("importMessage6").innerHTML = "Successfully imported parameters.";
      	document.getElementById("importMessage6").style.display = "block";
      }
      reader.readAsText(fileUpload.files[0]);
    } else {
      //alert("This browser does not support HTML5.");
      document.getElementById("importMessageError6").innerHTML = "This browser does not support HTML5.";
      document.getElementById("importMessageError6").style.display = "block";
      $('#importing').hide();
    }
  } else {
      //alert("Please upload a valid CSV file.");
      document.getElementById("importMessageError6").innerHTML = "Please upload a valid CSV file for parameters.";
      document.getElementById("importMessageError6").style.display = "block";
      $('#importing').hide();
  }
}

// Upload file to get the data for the profiles 
function UploadProfiles(){
  var fileUpload = document.getElementById("fileUpload7");
  var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
  if (regex.test(fileUpload.value.toLowerCase())) {
    if (typeof (FileReader) != "undefined") {
      var reader = new FileReader();
      reader.onload = function (e) {
        var table = document.createElement("table");
        var rows = e.target.result.split("\n");
        //Check number of rows
        var numRows = rows.length;
        if(numRows != $scope.projectUpdated.categories.length + 1){
	        document.getElementById("importMessageError7").innerHTML = "Profile Performance Table CSV file rejected: number of rows are incorrect or insufficient. Check the CSV file structure example below.";
	        document.getElementById("importMessageError7").style.display = "block";
	        $('#importing').hide();
	        return 0;
        }
        //Check number of columns
        var c = rows[0].split(",");
        var numCells = c.length;
        if(numCells != $scope.projectUpdated.criteria.length + 1){
        	document.getElementById("importMessageError7").innerHTML = "Profile Performance Table CSV file rejected: number of columns are incorrect or insufficient. Check the CSV file structure example below.";
          	document.getElementById("importMessageError7").style.display = "block";
          	$('#importing').hide();
          	return 0;    
        }
        for (var i = 1; i < rows.length; i++) {
          	var row = table.insertRow(-1);
          	var cells = rows[i].split(",");
          	for (var j = 1; j <= cells.length; j++) {
          		var profile = {criterion:"", action:"", value:0};
          		if(cells[0] == '' || cells[0] == null || cells[j] == '' || cells[j] == null || c[j] == '' || c[j] == null){
           		// Do nothing - no action or no value or no criterion, don't create
	          	}else{
		          	profile.action = cells[0];
		          	profile.value = cells[j];
		            profile.criterion = c[j];
		            $scope.createProfileImport(profile);
	          	}
          	}
        }
        table.className = 'table table-bordered horizontal';
        table.id = 'auxTable';
        // var dvCSV = document.getElementById("dvCSV");
        // dvCSV.innerHTML = "";
        // dvCSV.appendChild(table);
        $timeout( function(){ refreshProject(); $('#importing').hide(); }, 1000);
      	document.getElementById("importMessage7").innerHTML = "Successfully imported profile performance table.";
      	document.getElementById("importMessage7").style.display = "block";
        $scope.proTblImported = true;
      }
      reader.readAsText(fileUpload.files[0]);
    } else {
      //alert("This browser does not support HTML5.");
      document.getElementById("importMessageError7").innerHTML = "This browser does not support HTML5.";
      document.getElementById("importMessageError7").style.display = "block";
      $('#importing').hide();
    }
  } else {
      //alert("Please upload a valid CSV file.");
      document.getElementById("importMessageError7").innerHTML = "Please upload a valid CSV file for the profile performance table.";
      document.getElementById("importMessageError7").style.display = "block";
      $('#importing').hide();
  }
}

//Create criterion when importing
$scope.createCriterionImport = function (criterion) {
  var i = $scope.projectID;
  var newCriterion = new Criterions();
  newCriterion.name = criterion.name;
  newCriterion.description = criterion.description;
  newCriterion.direction = criterion.direction;
  newCriterion.measure = criterion.measure;
  newCriterion.weight = criterion.weight;
  newCriterion.indifference = criterion.indifference;
  newCriterion.preference = criterion.preference;
  newCriterion.veto = criterion.veto;
  $http.post('/api/criterions/'+i, newCriterion).success(function(response) {
    //console.log('Done creating criterion.');
  });
}

//Create alternative when importing
$scope.createAlternativeImport = function (alternative) {
  var i = $scope.projectID;
  var newAlternative = new Alternatives();
  newAlternative.name = alternative.name;
  newAlternative.description = alternative.description;
  $http.post('/api/alternatives/'+i, newAlternative).success(function(response) {
    //console.log('Done creating alternative.');
  });
}

//Create alternative when importing if the option chosen was "import alternatives and performance table"
$scope.createAlternativeImport2 = function (name) {
  var i = $scope.projectID;
  var newAlternative = new Alternatives();
  newAlternative.name = name;
  $http.post('/api/alternatives/'+i, newAlternative).success(function(response) {
    //console.log('Done creating alternative.');
  });
}

//Create performance when importing
$scope.createPerformanceImport = function (performance) {
  var i = $scope.projectID;
  var newPerformance = new Performances();
  newPerformance.criterion = performance.criterion;
  newPerformance.alternative = performance.alternative;
  newPerformance.value = performance.value;
  $http.post('/api/performances/' + i, newPerformance).success(function(response) {
  	//console.log('Done creating...');
   });
}

//Create category when importing
$scope.createCategoryImport = function (category) {
  var i = $scope.projectID;
  var newCategory = new Categories();
  newCategory.name = category.name;
  newCategory.rank = parseInt(category.rank);
  newCategory.action = category.action;
  $http.post('/api/categories/' + i, newCategory).success(function(response) {
  	//console.log('Done creating...');
   });
}

//Create parameter when importing
$scope.createParameterImport = function (credibility) {
  var i = $scope.projectID;
  var newParameter = new Parameters();
  newParameter.credibility = credibility;
  $http.post('/api/parameters/' + i, newParameter).success(function(response) {
  });
}

//Create profile when importing
$scope.createProfileImport = function (profile) {
  var i = $scope.projectID;
  var newProfile = new Profiles();
  newProfile.criterion = profile.criterion;
  newProfile.action = profile.action;
  newProfile.value = profile.value;
  $http.post('/api/profiles/' + i, newProfile).success(function(response) {
  	//console.log('Done creating...');
  });
}

}]);