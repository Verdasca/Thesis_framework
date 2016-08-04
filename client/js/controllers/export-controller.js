app.controller('exportController', ['$scope', '$http', '$resource', '$location', '$window', '$timeout', 'orderByFilter', function ($scope, $http, $resource, $location, $window, $timeout, orderBy) {

$scope.projectID = $location.search().projectId;
$scope.username = $location.search().n;
$scope.criteriaDone = false;
$scope.alternativesDone = false;
$scope.configurationsDone = false;

//Select all checkboxes from the export section
$scope.selectAll = function(){
  document.getElementById("exportCri").checked = true;
  document.getElementById("exportAlt").checked = true;
  document.getElementById("exportPerf").checked = true;
  document.getElementById("exportCat").checked = true;
  document.getElementById("exportPar").checked = true;
  document.getElementById("exportPro").checked = true;
}

//Unselect all checkboxes from the export section
$scope.selectNone = function(){
  document.getElementById("exportCri").checked = false;
  document.getElementById("exportAlt").checked = false;
  document.getElementById("exportPerf").checked = false;
  document.getElementById("exportCat").checked = false;
  document.getElementById("exportPar").checked = false;
  document.getElementById("exportPro").checked = false;
}

}]);

//Export into a .csv file 
app.directive('exportToCsv',function($http, $location, $timeout){
    return {
      restrict: 'A',
      scope: {
        names: '=names'
      },
      link: function (scope, element, attrs) {
      	var projectID = $location.search().projectId;
        var el = element[0];
        var elements = document.getElementsByName("dataBox");
        element.bind('click', function(e){
          var zip = new JSZip();
          document.getElementById("exportMessage").style.display = "none";
          document.getElementById("exportMessageError").style.display = "none";
          if(!elements[0].checked && !elements[1].checked && !elements[2].checked && !elements[3].checked && !elements[4].checked && !elements[5].checked){
            document.getElementById("exportMessageError").innerHTML = "Data to export not selected.";
            document.getElementById("exportMessageError").style.display = "block";
          }
          if(elements[0].checked){
          	$http.get('/api/criterions/' + projectID).success(function(data) {
	     	    var criteriaUpdated = data.criteria;
            var csvString = '';
            csvString = csvString + 'Name,Description,Direction,Measure,Weight,Indifference,Preference,Veto';
            csvString = csvString + "\n";
            for(var i=0; i < criteriaUpdated.length; i++){
                var rowData = criteriaUpdated[i];
                // Get the data
                csvString = csvString + rowData.name + ",";
                csvString = csvString + rowData.description + ",";
                csvString = csvString + rowData.direction + ",";
                csvString = csvString + rowData.measure + ",";
                csvString = csvString + rowData.weight + ",";
                csvString = csvString + rowData.indifference + ",";
                csvString = csvString + rowData.preference + ",";
                csvString = csvString + rowData.veto + ",";
                csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
                csvString = csvString + "\n";
            }
            csvString = csvString.substring(0, csvString.length - 1);
            zip.file(scope.names+"/criteria.csv", csvString);
            })
          }
          if(elements[1].checked){
            $http.get('/api/alternatives/' + projectID).success(function(data) {
            var alternativesUpdated = data.alternatives;
            var csvString = '';
            csvString = csvString + 'Name,Description';
            csvString = csvString + "\n";
            for(var i=0; i<alternativesUpdated.length;i++){
                var rowData = alternativesUpdated[i];
                // Get the data
                csvString = csvString + rowData.name + ",";
                csvString = csvString + rowData.description + ",";
                csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
                csvString = csvString + "\n";
            }
            csvString = csvString.substring(0, csvString.length - 1);
            zip.file(scope.names+"/alternatives.csv", csvString);
            })
          }
          if(elements[2].checked){
            $http.get('/api/performances/' + projectID).success(function(data) {
            var performancesUpdated = data.performancetables;
            var csvString = '';
            csvString = csvString + 'Alternative,Criterion,Value';
            csvString = csvString + "\n";
            for(var i=0; i<performancesUpdated.length;i++){
                var rowData = performancesUpdated[i];
                // Get the data
                csvString = csvString + rowData.alternative + ",";
                csvString = csvString + rowData.criterion + ",";
                csvString = csvString + rowData.value + ",";
                csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
                csvString = csvString + "\n";
            }
            csvString = csvString.substring(0, csvString.length - 1);
            zip.file(scope.names+"/performances.csv", csvString);
            })
          }
          if(elements[3].checked){
            $http.get('/api/categories/' + projectID).success(function(data) {
            var categoriesUpdated = data.categories;
            var csvString = '';
            csvString = csvString + 'Rank,Category,Reference Action';
            csvString = csvString + "\n";
            for(var i=0; i<categoriesUpdated.length;i++){
                var rowData = categoriesUpdated[i];
                // Get the data
                csvString = csvString + rowData.rank + ",";
                csvString = csvString + rowData.name + ",";
                csvString = csvString + rowData.action + ",";
                csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
                csvString = csvString + "\n";
            }
            csvString = csvString.substring(0, csvString.length - 1);
            zip.file(scope.names+"/categories.csv", csvString);
            })
          }
          if(elements[4].checked){
            $http.get('/api/parameters/' + projectID).success(function(data) {
            var parametersUpdated = data.parameters;
            var csvString = '';
            csvString = csvString + 'Credibility Lambda';
            csvString = csvString + "\n";
            for(var i=0; i<parametersUpdated.length;i++){
                var rowData = parametersUpdated[i];
                // Get the data
                csvString = csvString + rowData.credibility + ",";
                csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
                csvString = csvString + "\n";
            }
            csvString = csvString.substring(0, csvString.length - 1);
            zip.file(scope.names+"/parameters.csv", csvString);
            })
          }
          if(elements[5].checked){
            $http.get('/api/profiles/' + projectID).success(function(data) {
            var profilesUpdated = data.profiletables;
            var csvString = '';
            csvString = csvString + 'Reference Action,Criterion,Value';
            csvString = csvString + "\n";
            for(var i=0; i<profilesUpdated.length;i++){
                var rowData = profilesUpdated[i];
                // Get the data
                csvString = csvString + rowData.action + ",";
                csvString = csvString + rowData.criterion + ",";
                csvString = csvString + rowData.value + ",";
                csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
                csvString = csvString + "\n";
            }
            csvString = csvString.substring(0, csvString.length - 1);
            zip.file(scope.names+"/profiles.csv", csvString);
            })
          }
          if(elements[0].checked || elements[1].checked || elements[2].checked || elements[3].checked || elements[4].checked || elements[5].checked){
            $timeout( function(){
              zip.generateAsync({type:"blob"})
              .then(function(content) {
                  // see FileSaver.js
                  saveAs(content, scope.names+".zip");
              });
              document.getElementById("exportMessage").innerHTML = "Export successfully.";
              document.getElementById("exportMessage").style.display = "block";
            }, 1500);
          }
        });
      }
    }
});
