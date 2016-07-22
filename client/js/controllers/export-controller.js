app.controller('exportController', ['$scope', '$http', '$resource', '$location', '$window', '$timeout', 'orderByFilter', function ($scope, $http, $resource, $location, $window, $timeout, orderBy) {

$scope.projectID = $location.search().projectId;
$scope.username = $location.search().n
$scope.criteriaDone = false;
$scope.alternativesDone = false;
$scope.configurationsDone = false;

}]);

//Export into a .csv file 
app.directive('exportToCsv',function($http, $location){
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
      	document.getElementById("exportMessage").style.display = "none";
  		document.getElementById("exportMessageError").style.display = "none";
      	var projectID = $location.search().projectId;
        var el = element[0];
        var elements = document.getElementsByName("dataBox");
        if(!elements[0].checked && !elements[1].checked && !elements[2].checked && !elements[3].checked && !elements[4].checked && !elements[5].checked){
        	document.getElementById("exportMessageError").innerHTML = "Data to export not selected.";
    		document.getElementById("exportMessageError").style.display = "block";
        }else{
        element.bind('click', function(e){
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
            var a = $('<a/>', {
                style:'display:none',
                href:'data:application/octet-stream;base64,'+btoa(unescape(encodeURIComponent(csvString))),
                download:'criteria.csv'
            }).appendTo('body')
            a[0].click()
            a.remove();
            })
          }
        });
        element.bind('click', function(e){
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
            var a = $('<a/>', {
                style:'display:none',
                href:'data:application/octet-stream;base64,'+btoa(unescape(encodeURIComponent(csvString))),
                download:'alternatives.csv'
            }).appendTo('body')
            a[0].click()
            a.remove();
            })
          }
        });
        element.bind('click', function(e){
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
            var a = $('<a/>', {
                style:'display:none',
                href:'data:application/octet-stream;base64,'+btoa(unescape(encodeURIComponent(csvString))),
                download:'performances.csv'
            }).appendTo('body')
            a[0].click()
            a.remove();
            })
          }
        });
        element.bind('click', function(e){
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
            var a = $('<a/>', {
                style:'display:none',
                href:'data:application/octet-stream;base64,'+btoa(unescape(encodeURIComponent(csvString))),
                download:'categories.csv'
            }).appendTo('body')
            a[0].click()
            a.remove();
            })
          }
        });
        element.bind('click', function(e){
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
            var a = $('<a/>', {
                style:'display:none',
                href:'data:application/octet-stream;base64,'+btoa(unescape(encodeURIComponent(csvString))),
                download:'parameters.csv'
            }).appendTo('body')
            a[0].click()
            a.remove();
            })
          }
        });
        element.bind('click', function(e){
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
            var a = $('<a/>', {
                style:'display:none',
                href:'data:application/octet-stream;base64,'+btoa(unescape(encodeURIComponent(csvString))),
                download:'profiles.csv'
            }).appendTo('body')
            a[0].click()
            a.remove();
            })
          }
        });
		}
      }
    }
});