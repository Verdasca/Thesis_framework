var app = angular.module("configurations-controller", ['ngRoute', 'ngResource', 'ngSanitize', 'ngCsv', 'appRoutes', 'mainCtrl', 'ui']);

app.controller('configurationsController', ['$scope', '$http', function ($scope, $http) {

//Get the data from criterions in mongoDB
$http.get('/api/criterions').success(function(data) {
  $scope.criterions = data;
  })
  .error(function(data) {
    console.log('Error: ' + data);
});  

}]);

//Export weight method 1 ratio results into a .csv file 
app.directive('exportWeightsToCsv',function(){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var el = element[0];
            element.bind('click', function(e){
                //var table = e.target.nextElementSibling;
                var table = document.getElementById("weightTbl");
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
                var a = $('<a/>', {
                    style:'display:none',
                    href:'data:application/octet-stream;base64,'+btoa(csvString),
                    download:'weight_Results.csv'
                }).appendTo('body')
                a[0].click()
                a.remove();
            });
        }
    }
});

//Export weight method 3 ratios results into a .csv file 
app.directive('exportTwoWeightsToCsv',function(){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var el = element[0];
            element.bind('click', function(e){
                //var table = e.target.nextElementSibling;
                var table = document.getElementById("weightTbl2");
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
                var a = $('<a/>', {
                    style:'display:none',
                    href:'data:application/octet-stream;base64,'+btoa(csvString),
                    download:'weight_Results_2.csv'
                }).appendTo('body')
                a[0].click()
                a.remove();
            });
        }
    }
});

app.directive('exportThreeWeightsToCsv',function(){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var el = element[0];
            element.bind('click', function(e){
                //var table = e.target.nextElementSibling;
                var table = document.getElementById("weightTbl3");
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
                var a = $('<a/>', {
                    style:'display:none',
                    href:'data:application/octet-stream;base64,'+btoa(csvString),
                    download:'weight_Results_3.csv'
                }).appendTo('body')
                a[0].click()
                a.remove();
            });
        }
    }
});

//Export weight method 1 ratio results into a .csv file, only with name and norm. weight 
app.directive('exportOnlyWeightsToCsv',function(){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var el = element[0];
            element.bind('click', function(e){
                //var table = e.target.nextElementSibling;
                var table = document.getElementById("weightTbl");
                var csvString = '';
                for(var i=0; i<table.rows.length;i++){
                    var rowData = table.rows[i].cells;
                    for(var j=0; j<rowData.length;j++){ //number of columns to export
                        if(j == 1 || j == 2){
                            //Do nothing
                        }else{
                            csvString = csvString + rowData[j].innerHTML + ",";
                        }
                    }   
                    csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
                    csvString = csvString + "\n";   
                }
                csvString = csvString.substring(0, csvString.length - 1);
                var a = $('<a/>', {
                    style:'display:none',
                    href:'data:application/octet-stream;base64,'+btoa(csvString),
                    download:'weights.csv'
                }).appendTo('body')
                a[0].click()
                a.remove();
            });
        }
    }
});

//Export weight method 3 ratios results into a .csv file, only with name and norm. weight 
app.directive('exportTwoOnlyWeightsToCsv',function(){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var el = element[0];
            element.bind('click', function(e){
                //var table = e.target.nextElementSibling;
                var table = document.getElementById("weightTbl2");
                var csvString = '';
                for(var i=0; i<table.rows.length;i++){
                    var rowData = table.rows[i].cells;
                    for(var j=0; j<rowData.length;j++){ //number of columns to export
                        if(j == 1 || j == 2){
                            //Do nothing
                        }else{
                            csvString = csvString + rowData[j].innerHTML + ",";
                        }
                    }   
                    csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
                    csvString = csvString + "\n";   
                }
                csvString = csvString.substring(0, csvString.length - 1);
                var a = $('<a/>', {
                    style:'display:none',
                    href:'data:application/octet-stream;base64,'+btoa(csvString),
                    download:'weights_2.csv'
                }).appendTo('body')
                a[0].click()
                a.remove();
            });
        }
    }
});

app.directive('exportThreeOnlyWeightsToCsv',function(){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var el = element[0];
            element.bind('click', function(e){
                //var table = e.target.nextElementSibling;
                var table = document.getElementById("weightTbl3");
                var csvString = '';
                for(var i=0; i<table.rows.length;i++){
                    var rowData = table.rows[i].cells;
                    for(var j=0; j<rowData.length;j++){ //number of columns to export
                        if(j == 1 || j == 2){
                            //Do nothing
                        }else{
                            csvString = csvString + rowData[j].innerHTML + ",";
                        }
                    }   
                    csvString = csvString.substring(0,csvString.length - 1); //delete the last values which is a coma (,)
                    csvString = csvString + "\n";   
                }
                csvString = csvString.substring(0, csvString.length - 1);
                var a = $('<a/>', {
                    style:'display:none',
                    href:'data:application/octet-stream;base64,'+btoa(csvString),
                    download:'weights_3.csv'
                }).appendTo('body')
                a[0].click()
                a.remove();
            });
        }
    }
}); 

//Refresh the cards so the new ones can be draggable (it's the same code on the script)
function addDragDrop(){
    //exclude older browsers by the features we need them to support
    //and legacy opera explicitly so we don't waste time on a dead browser
    if
    (
        !document.querySelectorAll 
        || 
        !('draggable' in document.createElement('span')) 
        || 
        window.opera
    ) 
    { return; }

    //get the collection of draggable targets and add their draggable attribute
    for(var 
        targets = document.querySelectorAll('[data-draggable="target"]'), 
        len = targets.length, 
        i = 0; i < len; i ++)
    {
        targets[i].setAttribute('aria-dropeffect', 'none');
    }

    //get the collection of draggable items and add their draggable attributes
    for(var 
        items = document.querySelectorAll('[data-draggable="item"]'), 
        len = items.length, 
        i = 0; i < len; i ++)
    {
        items[i].setAttribute('draggable', 'true');
        items[i].setAttribute('aria-grabbed', 'false');
        items[i].setAttribute('tabindex', '0');
    }


    //dictionary for storing the selections data 
    //comprising an array of the currently selected items 
    //a reference to the selected items' owning container
    //and a refernce to the current drop target container
    var selections = 
    {
        items      : [],
        owner      : null,
        droptarget : null
    };
    
    //function for selecting an item
    function addSelection(item)
    {
        //if the owner reference is still null, set it to this item's parent
        //so that further selection is only allowed within the same container
        if(!selections.owner)
        {
            selections.owner = item.parentNode;
        }
        
        //or if that's already happened then compare it with this item's parent
        //and if they're not the same container, return to prevent selection
        else if(selections.owner != item.parentNode)
        {
            return;
        }
                
        //set this item's grabbed state
        item.setAttribute('aria-grabbed', 'true');
        
        //add it to the items array
        selections.items.push(item);
    }
    
    //function for unselecting an item
    function removeSelection(item)
    {
        //reset this item's grabbed state
        item.setAttribute('aria-grabbed', 'false');
        
        //then find and remove this item from the existing items array
        for(var len = selections.items.length, i = 0; i < len; i ++)
        {
            if(selections.items[i] == item)
            {
                selections.items.splice(i, 1);
                break;
            }
        }
    }
    
    //function for resetting all selections
    function clearSelections()
    {
        //if we have any selected items
        if(selections.items.length)
        {
            //reset the owner reference
            selections.owner = null;

            //reset the grabbed state on every selected item
            for(var len = selections.items.length, i = 0; i < len; i ++)
            {
                selections.items[i].setAttribute('aria-grabbed', 'false');
            }

            //then reset the items array        
            selections.items = [];
        }
    }

    //shorctut function for testing whether a selection modifier is pressed
    function hasModifier(e)
    {
        return (e.ctrlKey || e.metaKey || e.shiftKey);
    }
    
     
    //function for applying dropeffect to the target containers
    function addDropeffects()
    {
        //apply aria-dropeffect and tabindex to all targets apart from the owner
        for(var len = targets.length, i = 0; i < len; i ++)
        {
            if
            (
                targets[i] != selections.owner 
                && 
                targets[i].getAttribute('aria-dropeffect') == 'none'
            )
            {
                targets[i].setAttribute('aria-dropeffect', 'move');
                targets[i].setAttribute('tabindex', '0');
            }
        }

        //remove aria-grabbed and tabindex from all items inside those containers
        for(var len = items.length, i = 0; i < len; i ++)
        {
            if
            (
                items[i].parentNode != selections.owner 
                && 
                items[i].getAttribute('aria-grabbed')
            )
            {
                items[i].removeAttribute('aria-grabbed');
                items[i].removeAttribute('tabindex');
            }
        }       
    }
    
    //function for removing dropeffect from the target containers
    function clearDropeffects()
    {
        //if we have any selected items
        if(selections.items.length)
        {
            //reset aria-dropeffect and remove tabindex from all targets
            for(var len = targets.length, i = 0; i < len; i ++)
            {
                if(targets[i].getAttribute('aria-dropeffect') != 'none')
                {
                    targets[i].setAttribute('aria-dropeffect', 'none');
                    targets[i].removeAttribute('tabindex');
                }
            }

            //restore aria-grabbed and tabindex to all selectable items 
            //without changing the grabbed value of any existing selected items
            for(var len = items.length, i = 0; i < len; i ++)
            {
                if(!items[i].getAttribute('aria-grabbed'))
                {
                    items[i].setAttribute('aria-grabbed', 'false');
                    items[i].setAttribute('tabindex', '0');
                }
                else if(items[i].getAttribute('aria-grabbed') == 'true')
                {
                    items[i].setAttribute('tabindex', '0');
                }
            }       
        }
    }

    //shortcut function for identifying an event element's target container
    function getContainer(element)
    {
        do
        {
            if(element.nodeType == 1 && element.getAttribute('aria-dropeffect'))
            {
                return element;
            }
        }
        while(element = element.parentNode);
        
        return null;
    }

    //Add events for the drop/drag cards
    document.addEventListener('mousedown', mouseDown, false);
    document.addEventListener('mouseup', mouseUp, false);
    document.addEventListener('dragstart', dragStart, false);
    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('dragenter', dragEnter, false);
    document.addEventListener('dragleave', dragLeave, false); 
    document.addEventListener('dragover', dragOver, false);  
    document.addEventListener('dragend', dragEnd, false);

    //mousedown event to implement single selection
    function mouseDown(e){
        //if the element is a draggable item
        if(e.target.getAttribute('draggable'))
        {
            //clear dropeffect from the target containers
            clearDropeffects();

            //if the multiple selection modifier is not pressed 
            //and the item's grabbed state is currently false
            if
            (
                !hasModifier(e) 
                && 
                e.target.getAttribute('aria-grabbed') == 'false'
            )
            {
                //clear all existing selections
                clearSelections();
            
                //then add this new selection
                addSelection(e.target);
            }
        }
        
        //else [if the element is anything else]
        //and the selection modifier is not pressed 
        else if(!hasModifier(e))
        {
            //clear dropeffect from the target containers
            clearDropeffects();

            //clear all existing selections
            clearSelections();
        }
        
        //else [if the element is anything else and the modifier is pressed]
        else
        {
            //clear dropeffect from the target containers
            clearDropeffects();
        }

    }
    
    //mouseup event to implement multiple selection
    function mouseUp(e){
        //if the element is a draggable item 
        //and the multipler selection modifier is pressed
        if(e.target.getAttribute('draggable') && hasModifier(e))
        {
            //if the item's grabbed state is currently true
            if(e.target.getAttribute('aria-grabbed') == 'true')
            {
                //unselect this item
                removeSelection(e.target);
                
                //if that was the only selected item
                //then reset the owner container reference
                if(!selections.items.length)
                {
                    selections.owner = null;
                }
            }
            
            //else [if the item's grabbed state is false]
            else
            {
                //add this additional selection
                addSelection(e.target);
            }
        }
        
    }

    //dragstart event to initiate mouse dragging
    function dragStart(e)
    {
        //if the element's parent is not the owner, then block this event
        if(selections.owner != e.target.parentNode)
        {
            e.preventDefault();
            return;
        }
                
        //[else] if the multiple selection modifier is pressed 
        //and the item's grabbed state is currently false
        if
        (
            hasModifier(e) 
            && 
            e.target.getAttribute('aria-grabbed') == 'false'
        )
        {
            //add this additional selection
            addSelection(e.target);
        }
        
        //we don't need the transfer data, but we have to define something
        //otherwise the drop action won't work at all in firefox
        //most browsers support the proper mime-type syntax, eg. "text/plain"
        //but we have to use this incorrect syntax for the benefit of IE10+
        e.dataTransfer.setData('text', '');
        
        //apply dropeffect to the target containers
        addDropeffects();
    
    }
    
    

    //keydown event to implement selection and abort
    function keyDown(e){
        //if the element is a grabbable item 
        if(e.target.getAttribute('aria-grabbed'))
        {
            //Space is the selection or unselection keystroke
            if(e.keyCode == 32)
            {
                //if the multiple selection modifier is pressed 
                if(hasModifier(e))
                {
                    //if the item's grabbed state is currently true
                    if(e.target.getAttribute('aria-grabbed') == 'true')
                    {
                        //if this is the only selected item, clear dropeffect 
                        //from the target containers, which we must do first
                        //in case subsequent unselection sets owner to null
                        if(selections.items.length == 1)
                        {
                            clearDropeffects();
                        }

                        //unselect this item
                        removeSelection(e.target);

                        //if we have any selections
                        //apply dropeffect to the target containers, 
                        //in case earlier selections were made by mouse
                        if(selections.items.length)
                        {
                            addDropeffects();
                        }
                
                        //if that was the only selected item
                        //then reset the owner container reference
                        if(!selections.items.length)
                        {
                            selections.owner = null;
                        }
                    }
                    
                    //else [if its grabbed state is currently false]
                    else
                    {
                        //add this additional selection
                        addSelection(e.target);

                        //apply dropeffect to the target containers 
                        addDropeffects();
                    }
                }

                //else [if the multiple selection modifier is not pressed]
                //and the item's grabbed state is currently false
                else if(e.target.getAttribute('aria-grabbed') == 'false')
                {
                    //clear dropeffect from the target containers
                    clearDropeffects();

                    //clear all existing selections
                    clearSelections();
            
                    //add this new selection
                    addSelection(e.target);

                    //apply dropeffect to the target containers
                    addDropeffects();
                }
                
                //else [if modifier is not pressed and grabbed is already true]
                else
                {
                    //apply dropeffect to the target containers 
                    addDropeffects();
                }
            
                //then prevent default to avoid any conflict with native actions
                e.preventDefault();
            }

            //Modifier + M is the end-of-selection keystroke
            if(e.keyCode == 77 && hasModifier(e))
            {
                //if we have any selected items
                if(selections.items.length)
                {
                    //apply dropeffect to the target containers 
                    //in case earlier selections were made by mouse
                    addDropeffects();

                    //if the owner container is the last one, focus the first one
                    if(selections.owner == targets[targets.length - 1])
                    {
                        targets[0].focus();
                    }
                    
                    //else [if it's not the last one], find and focus the next one
                    else
                    {
                        for(var len = targets.length, i = 0; i < len; i ++)
                        {
                            if(selections.owner == targets[i])
                            {
                                targets[i + 1].focus();
                                break;
                            }
                        }
                    }
                }               
        
                //then prevent default to avoid any conflict with native actions
                e.preventDefault();
            }
        }
        
        //Escape is the abort keystroke (for any target element)
        if(e.keyCode == 27)
        {
            //if we have any selected items
            if(selections.items.length)
            {
                //clear dropeffect from the target containers
                clearDropeffects();
                
                //then set focus back on the last item that was selected, which is 
                //necessary because we've removed tabindex from the current focus
                selections.items[selections.items.length - 1].focus();

                //clear all existing selections
                clearSelections();
                
                //but don't prevent default so that native actions can still occur
            }
        }
            
    }


   
    //related variable is needed to maintain a reference to the 
    //dragleave's relatedTarget, since it doesn't have e.relatedTarget
    var related = null;

    //dragenter event to set that variable
    function dragEnter(e){
        related = e.target;

    }
    
    //dragleave event to maintain target highlighting using that variable
    function dragLeave(e){
        //get a drop target reference from the relatedTarget
        var droptarget = getContainer(related);
        
        //if the target is the owner then it's not a valid drop target
        if(droptarget == selections.owner)
        {
            droptarget = null;
        }

        //if the drop target is different from the last stored reference
        //(or we have one of those references but not the other one)
        if(droptarget != selections.droptarget)
        {
            //if we have a saved reference, clear its existing dragover class
            if(selections.droptarget)
            {
                selections.droptarget.className = 
                    selections.droptarget.className.replace(/ dragover/g, '');
            }
            
            //apply the dragover class to the new drop target reference
            if(droptarget)
            {
                droptarget.className += ' dragover';
            }
                    
            //then save that reference for next time
            selections.droptarget = droptarget;
        }

    } 

    //dragover event to allow the drag by preventing its default
    function dragOver(e){
        //if we have any selected items, allow them to be dragged
        if(selections.items.length)
        {
            e.preventDefault();
        }
    
    }



    //dragend event to implement items being validly dropped into targets,
    //or invalidly dropped elsewhere, and to clean-up the interface either way
    function dragEnd(e){
        //if we have a valid drop target reference
        //(which implies that we have some selected items)
        if(selections.droptarget)
        {
            //append the selected items to the end of the target container
            for(var len = selections.items.length, i = 0; i < len; i ++)
            {
                selections.droptarget.appendChild(selections.items[i]);
            }

            //prevent default to allow the action           
            e.preventDefault();
        }

        //if we have any selected items
        if(selections.items.length)
        {
            //clear dropeffect from the target containers
            clearDropeffects();
        
            //if we have a valid drop target reference
            if(selections.droptarget)
            {
                //reset the selections array
                clearSelections();

                //reset the target's dragover class
                selections.droptarget.className = 
                    selections.droptarget.className.replace(/ dragover/g, '');

                //reset the target reference
                selections.droptarget = null;
            }
        }   
    }

}

var helpVisible = false;
function showHelp(){
    $("div#helpInfo").css('top', 51).css('right', 0);

    if(helpVisible){
        document.getElementById("textNav2").style.color = "#ffffff";
        $('div#helpInfo').hide();
        helpVisible = false;
    }else{
        document.getElementById("textNav2").style.color = "#000000";
        $('div#helpInfo').show();
        helpVisible = true;
    }
}

//Functions to increase/decrease the number between the interval
var intervalResult = 0.00;
function decreaseIntervalResult(){
    intervalResult = document.getElementById("ratioZIntervalResult").value;
    var valid = parseFloat(intervalResult) - 0.20;
    if(valid <= document.getElementById("ratioZIntervalMin").value){
        var min = document.getElementById("ratioZIntervalMin").value;
        document.getElementById("ratioZIntervalResult").value = parseFloat(min);
    }else{
        var number = parseFloat(intervalResult) - 0.20;
        document.getElementById("ratioZIntervalResult").value = parseFloat(number).toFixed(2);
    }
}

function increaseIntervalResult(){
    intervalResult = document.getElementById("ratioZIntervalResult").value;
    var valid = parseFloat(intervalResult) + 0.20;
    if(valid >= document.getElementById("ratioZIntervalMax").value){
        var max = document.getElementById("ratioZIntervalMax").value;
        document.getElementById("ratioZIntervalResult").value = parseFloat(max);
    }else{
        var number = parseFloat(intervalResult) + 0.20;
        document.getElementById("ratioZIntervalResult").value = parseFloat(number).toFixed(2);
    }
}

//Functions to increase/decrease the ratio values
var intervalResult = 0.00;
function decreaseRatio(id){
    if(id == "ratioZ1"){
        var number = document.getElementById("ratioZ1").value;
        if(number == 1 || (number-1) < 1 ){
            document.getElementById("ratioZ1").value = 1;
        }else{
            document.getElementById("ratioZ1").value = parseFloat(number) - 1;
        }
    }else if(id == "ratioZ2"){
        var number = document.getElementById("ratioZ2").value;
        if(number == 1 || (number-1) < 1 ){
            document.getElementById("ratioZ2").value = 1;
        }else{
            document.getElementById("ratioZ2").value = parseFloat(number) - 1;
        }
    }else if(id == "ratioZ3"){
        var number = document.getElementById("ratioZ3").value;
        if(number == 1 || (number-1) < 1 ){
            document.getElementById("ratioZ3").value = 1;
        }else{
            document.getElementById("ratioZ3").value = parseFloat(number) - 1;
        }
    }else if(id == "ratioZ"){
        var number = document.getElementById("ratioZ").value;
        if(number == 1 || (number-1) < 1 ){
            document.getElementById("ratioZ").value = 1;
        }else{
            document.getElementById("ratioZ").value = parseFloat(number) - 1;
        }
    }else if(id == "ratioZIntervalMin"){
        var number = document.getElementById("ratioZIntervalMin").value;
        if(number == 1 || (number-1) < 1 ){
            document.getElementById("ratioZIntervalMin").value = 1;
        }else{
            document.getElementById("ratioZIntervalMin").value = parseFloat(number) - 1;
        }
    }else if(id == "ratioZIntervalMax"){
        var number = document.getElementById("ratioZIntervalMax").value;
        if(number == 1 || (number-1) < 1 ){
            document.getElementById("ratioZIntervalMax").value = 1;
        }else{
            document.getElementById("ratioZIntervalMax").value = parseFloat(number) - 1;
        }
    }else{
        //Do nothing
    } 
}

function increaseRatio(id){
    if(id == "ratioZ1"){
        var number = document.getElementById("ratioZ1").value;
        document.getElementById("ratioZ1").value = parseFloat(number) + 1;
    }else if(id == "ratioZ2"){
        var number = document.getElementById("ratioZ2").value;
        document.getElementById("ratioZ2").value = parseFloat(number) + 1;
    }else if(id == "ratioZ3"){
        var number = document.getElementById("ratioZ3").value;
        document.getElementById("ratioZ3").value = parseFloat(number) + 1;
    }else if(id == "ratioZ"){
        var number = document.getElementById("ratioZ").value;
        document.getElementById("ratioZ").value = parseFloat(number) + 1;
    }else if(id == "ratioZIntervalMin"){
        var number = document.getElementById("ratioZIntervalMin").value;
        document.getElementById("ratioZIntervalMin").value = parseFloat(number) + 1;
    }else if(id == "ratioZIntervalMax"){
        var number = document.getElementById("ratioZIntervalMax").value;
        document.getElementById("ratioZIntervalMax").value = parseFloat(number) + 1;
    }else{
        //Do nothing
    }     
}

var threeRatios = false;
//Get ratio Z value according to the selected option
function getRatioZ(){
    if(document.getElementById("oneValue").checked == true){
        return document.getElementById("ratioZ").value; 
    }else if(document.getElementById("interval").checked == true){
        return document.getElementById("ratioZIntervalResult").value; 
    }if(document.getElementById("threeValues").checked == true){
        threeRatios = true;
        return document.getElementById("ratioZ1").value; 
    }else{
        return 0; 
    }
}

//Calculate the required e0 + e1 + ... + er-1 for K(r)
function getE(i, len){
    var total = 0;
    var table = document.getElementById("auxTbl").getElementsByTagName('tbody')[0];

    for(k=len-1; k>i; k--){
        var row = table.rows[k];
        var er = document.getElementById("auxTbl").getElementsByTagName('tbody')[0].rows[k].cells[3].innerHTML;
        var val = Number(er);

        total = total + val;              
    }
    
    return total;
}

var totalEr = 0;
var totalWeights = 0.0;

//Calculate non-normalized weight
function calculateKr(i, len){
    var z = getRatioZ() - 1;
    var total = totalEr - 1;
    
    var u = z/total;
    
    var allE = getE(i, len);
    
    var rest = u.toFixed(6) * allE;
    var final = 1.0 + rest;

    totalWeights = totalWeights + Number(final.toFixed(2));          
 
    return final.toFixed(2);
}

//Function to sort the table, according to rank, from ranking section
function sortAuxiliarTable(){
    var tbl = document.getElementById("auxTbl").tBodies[0];
    var store = [];
    for(var i=0, len=tbl.rows.length; i<len; i++){
        var row = tbl.rows[i];
        var sortnr = parseFloat(row.cells[0].textContent || row.cells[0].innerText);
        if(!isNaN(sortnr)) store.push([sortnr, row]);
    }
    store.sort(function(x,y){
        return x[0] - y[0];
    });
    for(var i=0, len=store.length; i<len; i++){
        tbl.appendChild(store[i][1]);
    }
    store = null;
}

function sortAuxiliarTable2(){
    var tbl = document.getElementById("auxTbl2").tBodies[0];
    var store = [];
    for(var i=0, len=tbl.rows.length; i<len; i++){
        var row = tbl.rows[i];
        var sortnr = parseFloat(row.cells[0].textContent || row.cells[0].innerText);
        if(!isNaN(sortnr)) store.push([sortnr, row]);
    }
    store.sort(function(x,y){
        return x[0] - y[0];
    });
    for(var i=0, len=store.length; i<len; i++){
        tbl.appendChild(store[i][1]);
    }
    store = null;
}

function sortAuxiliarTable3(){
    var tbl = document.getElementById("auxTbl3").tBodies[0];
    var store = [];
    for(var i=0, len=tbl.rows.length; i<len; i++){
        var row = tbl.rows[i];
        var sortnr = parseFloat(row.cells[0].textContent || row.cells[0].innerText);
        if(!isNaN(sortnr)) store.push([sortnr, row]);
    }
    store.sort(function(x,y){
        return x[0] - y[0];
    });
    for(var i=0, len=store.length; i<len; i++){
        tbl.appendChild(store[i][1]);
    }
    store = null;
}

function sortAuxiliarTable4(){
    var tbl = document.getElementById("auxTbl4").tBodies[0];
    var store = [];
    for(var i=0, len=tbl.rows.length; i<len; i++){
        var row = tbl.rows[i];
        var sortnr = parseFloat(row.cells[0].textContent || row.cells[0].innerText);
        if(!isNaN(sortnr)) store.push([sortnr, row]);
    }
    store.sort(function(x,y){
        return x[0] - y[0];
    });
    for(var i=0, len=store.length; i<len; i++){
        tbl.appendChild(store[i][1]);
    }
    store = null;
}

function sortAuxiliarTable5(){
    var tbl = document.getElementById("auxTbl5").tBodies[0];
    var store = [];
    for(var i=0, len=tbl.rows.length; i<len; i++){
        var row = tbl.rows[i];
        var sortnr = parseFloat(row.cells[0].textContent || row.cells[0].innerText);
        if(!isNaN(sortnr)) store.push([sortnr, row]);
    }
    store.sort(function(x,y){
        return x[0] - y[0];
    });
    for(var i=0, len=store.length; i<len; i++){
        tbl.appendChild(store[i][1]);
    }
    store = null;
}

function sortAuxiliarTable6(){
    var tbl = document.getElementById("auxTbl6").tBodies[0];
    var store = [];
    for(var i=0, len=tbl.rows.length; i<len; i++){
        var row = tbl.rows[i];
        var sortnr = parseFloat(row.cells[0].textContent || row.cells[0].innerText);
        if(!isNaN(sortnr)) store.push([sortnr, row]);
    }
    store.sort(function(x,y){
        return x[0] - y[0];
    });
    for(var i=0, len=store.length; i<len; i++){
        tbl.appendChild(store[i][1]);
    }
    store = null;
}

//Functions to increase/decrease the number of deciaml places
var decimalPlaces = 0;
function decreaseDecimal(){
    if(decimalPlaces == 0){
        //Do nothing
    }else{
        decimalPlaces = decimalPlaces - 1;
        var value = document.getElementById("nDecimals").innerHTML;
        if(decimalPlaces == 0){
            document.getElementById("nDecimals").innerHTML = value.substring(0,value.length-2);
        }else{
            document.getElementById("nDecimals").innerHTML = value.substring(0,value.length-1);
        }
    }
}

function increaseDecimal(){
    if(decimalPlaces == 2){
        //Do nothing
    }else{
        decimalPlaces = decimalPlaces + 1;
        if(decimalPlaces == 1){
            document.getElementById("nDecimals").innerHTML += '.x';
        }else{
            document.getElementById("nDecimals").innerHTML += 'x';
        }
    }
}

/* Execute Weight Method */
function weightMethod(){
    document.getElementById("saveBtn").style.display = 'none';
    document.getElementById("saveBtn2").style.display = 'none';
    document.getElementById("saveBtn3").style.display = 'none';
    document.getElementById("exportBtnAll").style.display = 'none';
    document.getElementById("exportBtn").style.display = 'none';
    document.getElementById("exportBtnWeight").style.display = 'none';
    document.getElementById("exportBtn2").style.display = 'none';
    document.getElementById("exportBtnWeight2").style.display = 'none';
    document.getElementById("exportBtn3").style.display = 'none';
    document.getElementById("exportBtnWeight3").style.display = 'none';
    document.getElementById("weightTbl").style.display = 'none';
    document.getElementById("weightTbl2").style.display = 'none';
    document.getElementById("weightTbl3").style.display = 'none';
    document.getElementById("chartCriterion").style.display = 'none';
    document.getElementById("chartCriterion2").style.display = 'none';
    document.getElementById("chartCriterion3").style.display = 'none';
    document.getElementById("chartRank").style.display = 'none';
    document.getElementById("chartRank2").style.display = 'none';
    document.getElementById("chartRank3").style.display = 'none';
    document.getElementById("showRatio").innerHTML = "";
    document.getElementById("showRatio2").innerHTML = "";
    document.getElementById("showRatio3").innerHTML = "";

    //Checks if ratio Z was defined, if not, stop the execution of the method
    if(document.getElementById("oneValue").checked == true || document.getElementById("interval").checked == true || document.getElementById("threeValues").checked == true){
        document.getElementById("error").style.display = 'none';    
    }else{
        document.getElementById("error").style.display = 'block';
        return 0;
    }

    //Eliminates previous data from the tables
    $("#auxTbl tbody tr").remove();
    $("#auxTbl2 tbody tr").remove();
    totalWeights = 0.0; 
    totalEr = 0;

    var nodes = document.getElementById("weightMethod").getElementsByTagName("ol");
    var table = document.getElementById("auxTbl").getElementsByTagName('tbody')[0];
    var table2 = document.getElementById("auxTbl2").getElementsByTagName('tbody')[0];
    var nRows = 0;
    var m = nodes.length;
    var len = 0;
    var len2 = 0;
    var rank = 0;
    var totalWhiteCards = 0;
    var nWhiteCard = 0;
    var hasWhiteCard = false;
    var sumTotal = 0.00;

    for(i=0; i<nodes.length; i++){
        if(nodes.item(i).getAttribute("id") != "whiteSection"){
            var n = nodes.item(i).getElementsByTagName("li").length;
            if(n != 0){
                for (j=0; j<n; j++) {

                }
            rank = rank + 1;
            }
        }
    } 

    for(i=0; i<nodes.length; i++){
        var name = "";
        if(nodes.item(i).getAttribute("id") != "whiteSection"){
            var n = nodes.item(i).getElementsByTagName("li").length;
            var nCard = 0;
            var nCriterion = 0.00;
            var minusWhiteCardsRows = 0;
            if(hasWhiteCard){
                    nCard = nWhiteCard;
                    nWhiteCard = 0;
                    hasWhiteCard = false;
                }else{
                    nCard = 0;
            }
            if(n != 0){
                for (j=0; j<n; j++) {
                    if(nodes.item(i).getElementsByTagName("li")[j].innerHTML == "White Card"){
                        //Sum total of white cards
                        totalWhiteCards = totalWhiteCards + 1;
                        //Add white card to the column for er
                        nWhiteCard = nWhiteCard + 1;
                        hasWhiteCard = true;
                        //Get rid off coma at the end if it's a white card
                        name = name.substring(0, name.length - 2) + "  ";
                        //Save how many white cards there are between criterions to not add them to the results (ignore white cards)
                        minusWhiteCardsRows = minusWhiteCardsRows + 1;
                    }else{
                        // Create an empty <tr> element and add it to the 1st position of the table + ignore white card rows
                        var row = table2.insertRow(j-minusWhiteCardsRows);
                            
                        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        var cell4 = row.insertCell(3);
                        var cell5 = row.insertCell(4);
                        var cell6 = row.insertCell(5);
                        var cell7 = row.insertCell(6);
                            
                        // Add some text to the new cells:
                        cell1.innerHTML = rank;
                        cell2.innerHTML = nodes.item(i).getElementsByTagName("li")[j].innerHTML;
                        cell3.innerHTML = "";
                        cell4.innerHTML = ""; 
                        cell5.innerHTML = "";
                        cell6.innerHTML = "";   
                        cell7.innerHTML = "";

                        len2 = len2 + 1;
                        nCriterion = nCriterion + 1.00;

                        if(j+1 != n){
                            name = name + nodes.item(i).getElementsByTagName("li")[j].innerHTML + " , ";    
                        }else{
                            name = name + nodes.item(i).getElementsByTagName("li")[j].innerHTML;    
                        }
                    }
                }
                //alert(nodes.item(i).getElementsByTagName("li")[0].innerHTML);
                // Create an empty <tr> element and add it to the 1st position of the table:
                var row2 = table.insertRow(nRows);
                        
                // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
                var cell11 = row2.insertCell(0);
                var cell22 = row2.insertCell(1);
                var cell33 = row2.insertCell(2);
                var cell44 = row2.insertCell(3);
                var cell55 = row2.insertCell(4);
                var cell66 = row2.insertCell(5);
                        
                // Add some text to the new cells:
                cell11.innerHTML = "";
                cell22.innerHTML = name;
                cell33.innerHTML = nCard;
                cell44.innerHTML = 1 + nCard; 
                cell55.innerHTML = "";
                cell66.innerHTML = nCriterion;  

                totalEr = totalEr + 1 + nCard;
                nRows = nRows + 1; 
                len = len + 1;
                rank = rank - 1;
            }
        }
    } 

    //var len = table.length;
    for(k = 0, n=len; k < len; k++,n--){
        table.rows[k].cells[0].innerHTML = n;
    }

    //Add the calculated weights to each row
    for(i=len-1; i>=0; i--){
        table.rows[i].cells[4].innerHTML = calculateKr(i, len);
        table.rows[i].cells[5].innerHTML = Math.floor((table.rows[i].cells[5].innerHTML * calculateKr(i, len)) * Math.pow(10, 2)) / Math.pow(10, 2);
    }
    //Sort table
    sortAuxiliarTable();

    //Get total sums
    for (i = 0; i < len; i++) {
        sumTotal = parseFloat(sumTotal) + parseFloat(table.rows[i].cells[5].innerHTML);
    }

    var nDecimals = decimalPlaces;
    var invert = 1;
    
    if(nDecimals == 0){
        //Do nothing, stays 1
    }else if(nDecimals == 1){
        invert = 0.1;     
    }else{
        invert = 0.01;    
    }  

    //Calculate K*i and K''i
    for (i = 0; i < len; i++) {
        for (j = 0; j < len2; j++) {
            if(table.rows[i].cells[0].innerHTML == table2.rows[j].cells[0].innerHTML){
                table2.rows[j].cells[2].innerHTML = Math.floor(((table.rows[i].cells[4].innerHTML * 100)/sumTotal) * Math.pow(10, 9)) / Math.pow(10, 9);
                table2.rows[j].cells[3].innerHTML = Math.floor(table2.rows[j].cells[2].innerHTML * Math.pow(10, nDecimals)) / Math.pow(10, nDecimals);
                table2.rows[j].cells[6].innerHTML = parseFloat((table2.rows[j].cells[2].innerHTML)).toFixed(nDecimals);
            }
        }
    }

    //Calculate di
    for (j = 0; j < len2; j++) {
        var ki = table2.rows[j].cells[2].innerHTML;
        var kii = table2.rows[j].cells[3].innerHTML;
        var aux = ((invert - (parseFloat(ki) - parseFloat(kii))) / parseFloat(ki));
        table2.rows[j].cells[4].innerHTML = Math.floor(aux * Math.pow(10, 9)) / Math.pow(10, 9);
        var aux2 = ((parseFloat(ki) - parseFloat(kii)) / parseFloat(ki));
        table2.rows[j].cells[5].innerHTML = Math.floor(aux2 * Math.pow(10, 9)) / Math.pow(10, 9);
    }

    //Sort table
    sortAuxiliarTable2();

    //Get final table result
    weightResults();

    //If we have 3 ratio z values, execute the method for the other 2 ratio z values
    if(threeRatios){
        threeRatios = false;
        var z2 = document.getElementById("ratioZ2").value;
        var z3 = document.getElementById("ratioZ3").value;
        weightMethodOtherRatios(z2);
        weightMethodOtherRatios2(z3);
    }
}

function weightResults(){
    //Eliminates previous data from the table
    $("#weightTbl tbody tr").remove();
    
    var table = document.getElementById("weightTbl").getElementsByTagName('tbody')[0];
    var tblAux = document.getElementById("auxTbl").getElementsByTagName('tbody')[0];
    var tblAux2 = document.getElementById("auxTbl2").getElementsByTagName('tbody')[0];
    var len = tblAux.rows.length; 
    var len2 = tblAux2.rows.length;  

    for(i=0; i < len2; i++){
        // Create an empty <tr> element and add it to the 1st position of the table:
        var row = table.insertRow(i);
                        
        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
                        
        // Add some text to the new cells:
        cell1.innerHTML = tblAux2.rows[i].cells[1].innerHTML;
        cell2.innerHTML = tblAux2.rows[i].cells[0].innerHTML;
        cell3.innerHTML = "";
        cell4.innerHTML = tblAux2.rows[i].cells[6].innerHTML;  
    }    

    for (i = 0; i < len; i++) {
        for (j = 0; j < len2; j++) {
            if(tblAux.rows[i].cells[0].innerHTML == table.rows[j].cells[1].innerHTML){
                table.rows[j].cells[2].innerHTML = tblAux.rows[i].cells[4].innerHTML;
            }
        }
    } 

    var length = table.rows.length;

    //Create criterion x weight column chart
    var data = [];

    for (var i = 0; i < length; i++) {
        data[i] = {"criterion":table.rows[i].cells[0].innerHTML, "weight":table.rows[i].cells[3].innerHTML};
    }

    //Add export possibilities: JPG and PNG
    var exp = {"enabled": true, "menu": [{"format": "JPG","label": "Save as JPG","title": "Export chart to JPG",}, {"format": "PNG","label": "Save as PNG","title": "Export chart to PNG",}]};

    var chart = new AmCharts.AmSerialChart();
    chart.export = exp;
    chart.dataProvider = data;
    chart.categoryField = "criterion";
    var graph = new AmCharts.AmGraph();
    graph.valueField = "weight";
    graph.type = "column";
    chart.addGraph(graph);
    chart.write('chartCriterion');
    var categoryAxis = chart.categoryAxis;
    categoryAxis.autoGridCount  = false;
    categoryAxis.gridCount = data.length;
    categoryAxis.gridPosition = "start";
    categoryAxis.labelRotation = 90;

    //Create rank x weight column chart
    var dataR = [];
    for (var i = 0; i < length; i++) {
        dataR[i] = {"weight":table.rows[i].cells[3].innerHTML, "rank":table.rows[i].cells[1].innerHTML};
    }

    var chart = new AmCharts.AmSerialChart();
    chart.export = exp;
    chart.dataProvider = dataR;
    chart.categoryField = "rank";
    var graph = new AmCharts.AmGraph();
    graph.valueField = "weight";
    graph.type = "column";
    chart.addGraph(graph);
    chart.write('chartRank');

    document.getElementById("chartCriterion").style.overflow = '';
    document.getElementById("chartRank").style.overflow = '';
    document.getElementById("chartCriterion").style.textAlign = '';
    document.getElementById("chartRank").style.textAlign = '';
    document.getElementById("weightTbl").style.display = '';
    document.getElementById("chartCriterion").style.display = '';
    document.getElementById("chartRank").style.display = '';
    document.getElementById("exportBtn").style.display = '';
    document.getElementById("exportBtnWeight").style.display = '';
    document.getElementById("saveBtn").style.display = '';
    document.getElementById("compareBtn").style.display = '';

    //Show value of ratio chosen
    if(document.getElementById("oneValue").checked == true){
        document.getElementById("showRatio").innerHTML = "Ratio Z = " + document.getElementById("ratioZ").value;
    }else if(document.getElementById("interval").checked == true){
        document.getElementById("showRatio").innerHTML = "Ratio Z = " + document.getElementById("ratioZIntervalResult").value; 
    }else{
        document.getElementById("showRatio").innerHTML = "Ratio Z = " + document.getElementById("ratioZ1").value;
    }
}

//Repeted function for the other results if 3 values for ratio z was selected
//Calculate the required e0 + e1 + ... + er-1 for K(r)
function getE2(i, len){
    var total = 0;
    var table = document.getElementById("auxTbl3").getElementsByTagName('tbody')[0];

    for(k=len-1; k>i; k--){
        var row = table.rows[k];
        var er = document.getElementById("auxTbl3").getElementsByTagName('tbody')[0].rows[k].cells[3].innerHTML;
        var val = Number(er);

        total = total + val;          
    }
    
    return total;
}

//Calculate non-normalized weight
function calculateKr2(i, len, ratio){
    var z = ratio - 1;
    var total = totalEr;
    
    var u = z/total;
    
    var allE = getE2(i, len);
    
    var rest = u.toFixed(6) * allE;
    var final = 1.0 + rest;

    totalWeights = totalWeights + Number(final.toFixed(2));          
 
    return final.toFixed(2);
}

function getE3(i, len){
    var total = 0;
    var table = document.getElementById("auxTbl5").getElementsByTagName('tbody')[0];

    for(k=len-1; k>i; k--){
        var row = table.rows[k];
        var er = document.getElementById("auxTbl5").getElementsByTagName('tbody')[0].rows[k].cells[3].innerHTML;
        var val = Number(er);

        total = total + val;          
    }
    
    return total;
}

//Calculate non-normalized weight
function calculateKr3(i, len, ratio){
    var z = ratio - 1;
    var total = totalEr;
    
    var u = z/total;
    
    var allE = getE3(i, len);
    
    var rest = u.toFixed(6) * allE;
    var final = 1.0 + rest;

    totalWeights = totalWeights + Number(final.toFixed(2));          
 
    return final.toFixed(2);
}

//Weight method for the 2 other ratio z values if selected 3 values option
function weightMethodOtherRatios(z){
    //Eliminates previous data from the tables
    $("#auxTbl3 tbody tr").remove();
    $("#auxTbl4 tbody tr").remove();
    totalWeights = 0.0; 
    totalEr = 0;

    var nodes = document.getElementById("weightMethod").getElementsByTagName("ol");
    var table = document.getElementById("auxTbl3").getElementsByTagName('tbody')[0];
    var table2 = document.getElementById("auxTbl4").getElementsByTagName('tbody')[0];
    var nRows = 0;
    var m = nodes.length;
    var len = 0;
    var len2 = 0;
    var rank = 0;
    var totalWhiteCards = 0;
    var nWhiteCard = 0;
    var hasWhiteCard = false;
    var sumTotal = 0.00;

    for(i=0; i<nodes.length; i++){
        if(nodes.item(i).getAttribute("id") != "whiteSection"){
            var n = nodes.item(i).getElementsByTagName("li").length;
            if(n != 0){
                for (j=0; j<n; j++) {

                }
            rank = rank + 1;
            }
        }
    } 

    for(i=0; i<nodes.length; i++){
        var name = "";
        if(nodes.item(i).getAttribute("id") != "whiteSection"){
            var n = nodes.item(i).getElementsByTagName("li").length;
            var nCard = 0;
            var nCriterion = 0.00;
            var minusWhiteCardsRows = 0;
            if(hasWhiteCard){
                    nCard = nWhiteCard;
                    nWhiteCard = 0;
                    hasWhiteCard = false;
                }else{
                    nCard = 0;
            }
            if(n != 0){
                for (j=0; j<n; j++) {
                    if(nodes.item(i).getElementsByTagName("li")[j].innerHTML == "White Card"){
                        //Sum total of white cards
                        totalWhiteCards = totalWhiteCards + 1;
                        //Add white card to the column for er
                        nWhiteCard = nWhiteCard + 1;
                        hasWhiteCard = true;
                        //Get rid off coma at the end if it's a white card
                        name = name.substring(0, name.length - 2) + "  ";
                        //Save how many white cards there are between criterions to not add them to the results (ignore white cards)
                        minusWhiteCardsRows = minusWhiteCardsRows + 1;

                    }else{
                        // Create an empty <tr> element and add it to the 1st position of the table: + ignore white cards rows
                        var row = table2.insertRow(j-minusWhiteCardsRows);
                            
                        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        var cell4 = row.insertCell(3);
                        var cell5 = row.insertCell(4);
                        var cell6 = row.insertCell(5);
                        var cell7 = row.insertCell(6);
                            
                        // Add some text to the new cells:
                        cell1.innerHTML = rank;
                        cell2.innerHTML = nodes.item(i).getElementsByTagName("li")[j].innerHTML;
                        cell3.innerHTML = "";
                        cell4.innerHTML = ""; 
                        cell5.innerHTML = "";
                        cell6.innerHTML = "";   
                        cell7.innerHTML = "";

                        len2 = len2 + 1;
                        nCriterion = nCriterion + 1.00;

                        if(j+1 != n){
                            name = name + nodes.item(i).getElementsByTagName("li")[j].innerHTML + " , ";    
                        }else{
                            name = name + nodes.item(i).getElementsByTagName("li")[j].innerHTML;    
                        }
                    }
                }
                //alert(nodes.item(i).getElementsByTagName("li")[0].innerHTML);
                // Create an empty <tr> element and add it to the 1st position of the table:
                var row2 = table.insertRow(nRows);
                        
                // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
                var cell11 = row2.insertCell(0);
                var cell22 = row2.insertCell(1);
                var cell33 = row2.insertCell(2);
                var cell44 = row2.insertCell(3);
                var cell55 = row2.insertCell(4);
                var cell66 = row2.insertCell(5);
                        
                // Add some text to the new cells:
                cell11.innerHTML = "";
                cell22.innerHTML = name;
                cell33.innerHTML = nCard;
                cell44.innerHTML = 1 + nCard; 
                cell55.innerHTML = "";
                cell66.innerHTML = nCriterion;  

                totalEr = totalEr + 1 + nCard;
                nRows = nRows + 1; 
                len = len + 1;
                rank = rank - 1;
            }
        }
    } 

    //var len = table.length;
    for(k = 0, n=len; k < len; k++,n--){
        table.rows[k].cells[0].innerHTML = n;
    }

    //Add the calculated weights to each row
    for(i=len-1; i>=0; i--){
        table.rows[i].cells[4].innerHTML = calculateKr2(i, len, z);
        table.rows[i].cells[5].innerHTML = Math.floor((table.rows[i].cells[5].innerHTML * calculateKr2(i, len, z)) * Math.pow(10, 2)) / Math.pow(10, 2);
    }
    //Sort table
    sortAuxiliarTable3();

    //Get total sums
    for (i = 0; i < len; i++) {
        sumTotal = parseFloat(sumTotal) + parseFloat(table.rows[i].cells[5].innerHTML);
    }

    var nDecimals = decimalPlaces;
    var invert = 1;
    
    if(nDecimals == 0){
        //Do nothing, stays 1
    }else if(nDecimals == 1){
        invert = 0.1;     
    }else{
        invert = 0.01;    
    }  

    //Calculate K*i and K''i
    for (i = 0; i < len; i++) {
        for (j = 0; j < len2; j++) {
            if(table.rows[i].cells[0].innerHTML == table2.rows[j].cells[0].innerHTML){
                table2.rows[j].cells[2].innerHTML = Math.floor(((table.rows[i].cells[4].innerHTML * 100)/sumTotal) * Math.pow(10, 9)) / Math.pow(10, 9);
                table2.rows[j].cells[3].innerHTML = Math.floor(table2.rows[j].cells[2].innerHTML * Math.pow(10, nDecimals)) / Math.pow(10, nDecimals);
                table2.rows[j].cells[6].innerHTML = parseFloat((table2.rows[j].cells[2].innerHTML)).toFixed(nDecimals);
            }
        }
    }

    //Calculate di
    for (j = 0; j < len2; j++) {
        var ki = table2.rows[j].cells[2].innerHTML;
        var kii = table2.rows[j].cells[3].innerHTML;
        var aux = ((invert - (parseFloat(ki) - parseFloat(kii))) / parseFloat(ki));
        table2.rows[j].cells[4].innerHTML = Math.floor(aux * Math.pow(10, 9)) / Math.pow(10, 9);
        var aux2 = ((parseFloat(ki) - parseFloat(kii)) / parseFloat(ki));
        table2.rows[j].cells[5].innerHTML = Math.floor(aux2 * Math.pow(10, 9)) / Math.pow(10, 9);
    }

    //Sort table
    sortAuxiliarTable4();

    //Get final table result
    weightResults2();    
}

function weightMethodOtherRatios2(z){
    //Eliminates previous data from the tables
    $("#auxTbl5 tbody tr").remove();
    $("#auxTbl6 tbody tr").remove();
    totalWeights = 0.0; 
    totalEr = 0;

    var nodes = document.getElementById("weightMethod").getElementsByTagName("ol");
    var table = document.getElementById("auxTbl5").getElementsByTagName('tbody')[0];
    var table2 = document.getElementById("auxTbl6").getElementsByTagName('tbody')[0];
    var nRows = 0;
    var m = nodes.length;
    var len = 0;
    var len2 = 0;
    var rank = 0;
    var totalWhiteCards = 0;
    var nWhiteCard = 0;
    var hasWhiteCard = false;
    var sumTotal = 0.00;

    for(i=0; i<nodes.length; i++){
        if(nodes.item(i).getAttribute("id") != "whiteSection"){
            var n = nodes.item(i).getElementsByTagName("li").length;
            if(n != 0){
                for (j=0; j<n; j++) {

                }
            rank = rank + 1;
            }
        }
    } 

    for(i=0; i<nodes.length; i++){
        var name = "";
        if(nodes.item(i).getAttribute("id") != "whiteSection"){
            var n = nodes.item(i).getElementsByTagName("li").length;
            var nCard = 0;
            var nCriterion = 0.00;
            var minusWhiteCardsRows = 0;
            if(hasWhiteCard){
                    nCard = nWhiteCard;
                    nWhiteCard = 0;
                    hasWhiteCard = false;
                }else{
                    nCard = 0;
            }
            if(n != 0){
                for (j=0; j<n; j++) {
                    if(nodes.item(i).getElementsByTagName("li")[j].innerHTML == "White Card"){
                        //Sum total of white cards
                        totalWhiteCards = totalWhiteCards + 1;
                        //Add white card to the column for er
                        nWhiteCard = nWhiteCard + 1;
                        hasWhiteCard = true;
                        //Get rid off coma at the end if it's a white card
                        name = name.substring(0, name.length - 2) + "  ";
                        //Save how many white cards there are between criterions to not add them to the results (ignore white cards)
                        minusWhiteCardsRows = minusWhiteCardsRows + 1;

                    }else{
                        // Create an empty <tr> element and add it to the 1st position of the table: + ignore white cards rows
                        var row = table2.insertRow(j-minusWhiteCardsRows);
                            
                        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        var cell4 = row.insertCell(3);
                        var cell5 = row.insertCell(4);
                        var cell6 = row.insertCell(5);
                        var cell7 = row.insertCell(6);
                            
                        // Add some text to the new cells:
                        cell1.innerHTML = rank;
                        cell2.innerHTML = nodes.item(i).getElementsByTagName("li")[j].innerHTML;
                        cell3.innerHTML = "";
                        cell4.innerHTML = ""; 
                        cell5.innerHTML = "";
                        cell6.innerHTML = "";   
                        cell7.innerHTML = "";

                        len2 = len2 + 1;
                        nCriterion = nCriterion + 1.00;

                        if(j+1 != n){
                            name = name + nodes.item(i).getElementsByTagName("li")[j].innerHTML + " , ";    
                        }else{
                            name = name + nodes.item(i).getElementsByTagName("li")[j].innerHTML;    
                        }
                    }
                }
                //alert(nodes.item(i).getElementsByTagName("li")[0].innerHTML);
                // Create an empty <tr> element and add it to the 1st position of the table:
                var row2 = table.insertRow(nRows);
                        
                // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
                var cell11 = row2.insertCell(0);
                var cell22 = row2.insertCell(1);
                var cell33 = row2.insertCell(2);
                var cell44 = row2.insertCell(3);
                var cell55 = row2.insertCell(4);
                var cell66 = row2.insertCell(5);
                        
                // Add some text to the new cells:
                cell11.innerHTML = "";
                cell22.innerHTML = name;
                cell33.innerHTML = nCard;
                cell44.innerHTML = 1 + nCard; 
                cell55.innerHTML = "";
                cell66.innerHTML = nCriterion;  

                totalEr = totalEr + 1 + nCard;
                nRows = nRows + 1; 
                len = len + 1;
                rank = rank - 1;
            }
        }
    } 

    //var len = table.length;
    for(k = 0, n=len; k < len; k++,n--){
        table.rows[k].cells[0].innerHTML = n;
    }

    //Add the calculated weights to each row
    for(i=len-1; i>=0; i--){
        table.rows[i].cells[4].innerHTML = calculateKr3(i, len, z);
        table.rows[i].cells[5].innerHTML = Math.floor((table.rows[i].cells[5].innerHTML * calculateKr3(i, len, z)) * Math.pow(10, 2)) / Math.pow(10, 2);
    }
    //Sort table
    sortAuxiliarTable5();

    //Get total sums
    for (i = 0; i < len; i++) {
        sumTotal = parseFloat(sumTotal) + parseFloat(table.rows[i].cells[5].innerHTML);
    }

    var nDecimals = decimalPlaces;
    var invert = 1;
    
    if(nDecimals == 0){
        //Do nothing, stays 1
    }else if(nDecimals == 1){
        invert = 0.1;     
    }else{
        invert = 0.01;    
    }  

    //Calculate K*i and K''i
    for (i = 0; i < len; i++) {
        for (j = 0; j < len2; j++) {
            if(table.rows[i].cells[0].innerHTML == table2.rows[j].cells[0].innerHTML){
                table2.rows[j].cells[2].innerHTML = Math.floor(((table.rows[i].cells[4].innerHTML * 100)/sumTotal) * Math.pow(10, 9)) / Math.pow(10, 9);
                table2.rows[j].cells[3].innerHTML = Math.floor(table2.rows[j].cells[2].innerHTML * Math.pow(10, nDecimals)) / Math.pow(10, nDecimals);
                table2.rows[j].cells[6].innerHTML = parseFloat((table2.rows[j].cells[2].innerHTML)).toFixed(nDecimals);
            }
        }
    }

    //Calculate di
    for (j = 0; j < len2; j++) {
        var ki = table2.rows[j].cells[2].innerHTML;
        var kii = table2.rows[j].cells[3].innerHTML;
        var aux = ((invert - (parseFloat(ki) - parseFloat(kii))) / parseFloat(ki));
        table2.rows[j].cells[4].innerHTML = Math.floor(aux * Math.pow(10, 9)) / Math.pow(10, 9);
        var aux2 = ((parseFloat(ki) - parseFloat(kii)) / parseFloat(ki));
        table2.rows[j].cells[5].innerHTML = Math.floor(aux2 * Math.pow(10, 9)) / Math.pow(10, 9);
    }

    //Sort table
    sortAuxiliarTable6();

    //Get final table result
    weightResults3();    
}

function weightResults2(){
    //Eliminates previous data from the table
    $("#weightTbl2 tbody tr").remove();
    
    var table = document.getElementById("weightTbl2").getElementsByTagName('tbody')[0];
    var tblAux = document.getElementById("auxTbl3").getElementsByTagName('tbody')[0];
    var tblAux2 = document.getElementById("auxTbl4").getElementsByTagName('tbody')[0];
    var len = tblAux.rows.length; 
    var len2 = tblAux2.rows.length; 

    for(i=0; i < len2; i++){
        // Create an empty <tr> element and add it to the 1st position of the table:
        var row = table.insertRow(i);
                        
        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
                        
        // Add some text to the new cells:
        cell1.innerHTML = tblAux2.rows[i].cells[1].innerHTML;
        cell2.innerHTML = tblAux2.rows[i].cells[0].innerHTML;
        cell3.innerHTML = "";
        cell4.innerHTML = tblAux2.rows[i].cells[6].innerHTML;  
    }    

    for (i = 0; i < len; i++) {
        for (j = 0; j < len2; j++) {
            if(tblAux.rows[i].cells[0].innerHTML == table.rows[j].cells[1].innerHTML){
                table.rows[j].cells[2].innerHTML = tblAux.rows[i].cells[4].innerHTML;
            }
        }
    }

    var length = table.rows.length;

    //Create criterion x weight column chart
    var data = [];
    for (var i = 0; i < length; i++) {
        data[i] = {"weight":table.rows[i].cells[3].innerHTML, "criterion":table.rows[i].cells[0].innerHTML};
    }

    //Add export possibilities: JPG and PNG
    var exp = {"enabled": true, "menu": [{"format": "JPG","label": "Save as JPG","title": "Export chart to JPG",}, {"format": "PNG","label": "Save as PNG","title": "Export chart to PNG",}]};

    var chart = new AmCharts.AmSerialChart();
    chart.export = exp;
    chart.dataProvider = data;
    chart.categoryField = "criterion";
    var graph = new AmCharts.AmGraph();
    graph.valueField = "weight";
    graph.type = "column";
    chart.addGraph(graph);
    chart.write('chartCriterion2');
    var categoryAxis = chart.categoryAxis;
    categoryAxis.autoGridCount  = false;
    categoryAxis.gridCount = data.length;
    categoryAxis.gridPosition = "start";
    categoryAxis.labelRotation = 90;

    //Create rank x weight column chart
    var dataR = [];
    for (var i = 0; i < length; i++) {
        dataR[i] = {"weight":table.rows[i].cells[3].innerHTML, "rank":table.rows[i].cells[1].innerHTML};
    }

    var chart = new AmCharts.AmSerialChart();
    chart.export = exp;
    chart.dataProvider = dataR;
    chart.categoryField = "rank";
    var graph = new AmCharts.AmGraph();
    graph.valueField = "weight";
    graph.type = "column";
    chart.addGraph(graph);
    chart.write('chartRank2');

    document.getElementById("chartCriterion2").style.overflow = '';
    document.getElementById("chartRank2").style.overflow = '';
    document.getElementById("chartCriterion2").style.textAlign = '';
    document.getElementById("chartRank2").style.textAlign = '';
    document.getElementById("weightTbl2").style.display = '';    
    document.getElementById("chartCriterion2").style.display = '';
    document.getElementById("chartRank2").style.display = '';
    document.getElementById("exportBtn2").style.display = '';
    document.getElementById("exportBtnWeight2").style.display = '';

    //Show value of ratio chosen
    document.getElementById("showRatio2").innerHTML = "Ratio Z = " + document.getElementById("ratioZ2").value;

}

function weightResults3(){
    //Eliminates previous data from the table
    $("#weightTbl3 tbody tr").remove();
    
    var table = document.getElementById("weightTbl3").getElementsByTagName('tbody')[0];
    var tblAux = document.getElementById("auxTbl5").getElementsByTagName('tbody')[0];
    var tblAux2 = document.getElementById("auxTbl6").getElementsByTagName('tbody')[0];
    var len = tblAux.rows.length; 
    var len2 = tblAux2.rows.length; 

    for(i=0; i < len2; i++){
        // Create an empty <tr> element and add it to the 1st position of the table:
        var row = table.insertRow(i);
                        
        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
                        
        // Add some text to the new cells:
        cell1.innerHTML = tblAux2.rows[i].cells[1].innerHTML;
        cell2.innerHTML = tblAux2.rows[i].cells[0].innerHTML;
        cell3.innerHTML = "";
        cell4.innerHTML = tblAux2.rows[i].cells[6].innerHTML;  
    }    

    for (i = 0; i < len; i++) {
        for (j = 0; j < len2; j++) {
            if(tblAux.rows[i].cells[0].innerHTML == table.rows[j].cells[1].innerHTML){
                table.rows[j].cells[2].innerHTML = tblAux.rows[i].cells[4].innerHTML;
            }
        }
    }

    var length = table.rows.length;

    //Create criterion x weight column chart
    var data = [];
    for (var i = 0; i < length; i++) {
        data[i] = {"weight":table.rows[i].cells[3].innerHTML, "criterion":table.rows[i].cells[0].innerHTML};
    }

    //Add export possibilities: JPG and PNG
    var exp = {"enabled": true, "menu": [{"format": "JPG","label": "Save as JPG","title": "Export chart to JPG",}, {"format": "PNG","label": "Save as PNG","title": "Export chart to PNG",}]};

    var chart = new AmCharts.AmSerialChart();
    chart.export = exp;
    chart.dataProvider = data;
    chart.categoryField = "criterion";
    var graph = new AmCharts.AmGraph();
    graph.valueField = "weight";
    graph.type = "column";
    chart.addGraph(graph);
    chart.write('chartCriterion3');
    var categoryAxis = chart.categoryAxis;
    categoryAxis.autoGridCount  = false;
    categoryAxis.gridCount = data.length;
    categoryAxis.gridPosition = "start";
    categoryAxis.labelRotation = 90;

    //Create rank x weight column chart
    var dataR = [];
    for (var i = 0; i < length; i++) {
        dataR[i] = {"weight":table.rows[i].cells[3].innerHTML, "rank":table.rows[i].cells[1].innerHTML};
    }

    var chart = new AmCharts.AmSerialChart();
    chart.export = exp;
    chart.dataProvider = dataR;
    chart.categoryField = "rank";
    var graph = new AmCharts.AmGraph();
    graph.valueField = "weight";
    graph.type = "column";
    chart.addGraph(graph);
    chart.write('chartRank3');

    document.getElementById("chartCriterion3").style.overflow = '';
    document.getElementById("chartRank3").style.overflow = '';
    document.getElementById("chartCriterion3").style.textAlign = '';
    document.getElementById("chartRank3").style.textAlign = '';
    document.getElementById("weightTbl3").style.display = '';
    document.getElementById("chartCriterion3").style.display = '';
    document.getElementById("chartRank3").style.display = '';
    document.getElementById("exportBtn3").style.display = '';
    document.getElementById("exportBtnWeight3").style.display = '';
    document.getElementById("exportBtnAll").style.display = '';
    document.getElementById("saveBtn").style.display = '';
    document.getElementById("saveBtn2").style.display = '';
    document.getElementById("saveBtn3").style.display = '';
    document.getElementById("compareBtn").style.display = '';

    //Show value of ratio chosen
    document.getElementById("showRatio3").innerHTML = "Ratio Z = " + document.getElementById("ratioZ3").value;
}

var numResults = 0;
//Save weight result
function saveWeightResult(idTable){
    var addTbl = document.getElementById('tableResults');
    var tbl = document.createElement('table');
    var tbdy = document.createElement('tbody');
    tbl.appendChild(tbdy);
    addTbl.appendChild(tbl);

    //Save the result on the new table
    var newName = 'tbl' + numResults;
    //See which table is to save when executed the 3 ratio choice
    if(idTable == 2){
        var source = document.getElementById('weightTbl2');
        var ratioValue = document.getElementById('showRatio2').innerHTML;
    }else if(idTable == 3){
        var source = document.getElementById('weightTbl3');
        var ratioValue = document.getElementById('showRatio3').innerHTML;
    }else{
        var source = document.getElementById('weightTbl');
        var ratioValue = document.getElementById('showRatio').innerHTML;
    }
    var copy = source.cloneNode(true);
    copy.setAttribute('id', newName);
    tbl.parentNode.replaceChild(copy, tbl);

    var inputName = 'option' + numResults;
    var rowName = 'row' + numResults;
    var addOptionTbl = document.getElementById("compareOptionsTable").getElementsByTagName('tbody')[0];
    // Create an empty <tr> element and add it to the 1st position of the table:
    var row = addOptionTbl.insertRow(0);
                        
    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
                        
    // Add some text to the new cells:
    cell1.innerHTML = "Result " + numResults;
    cell2.innerHTML = ratioValue;
    cell3.innerHTML = "<input type='checkbox' id='" + inputName + "' style='vertical-align:initial'/>";
    cell4.innerHTML = "<input type='button' value='Delete' onclick='deleteResultOption(this, "+numResults+")' class='btn btn-danger'/>";

    cell1.setAttribute('style', 'vertical-align:middle');
    cell2.setAttribute('style', 'vertical-align:middle');
    row.setAttribute('id', rowName);
    numResults = numResults + 1;
}

//Delete the result saved
function deleteResultOption(row, idTable){
    //Delete result from option compare list
    var i = row.parentNode.parentNode.rowIndex;
    document.getElementById("compareOptionsTable").deleteRow(i);
    //Delete result from table result list
    var name = "#tbl" + idTable;
    $(name).remove();
}

//Go to compare results section
function compareWeightResults(){
    document.getElementById("content").style.display = 'none';
    document.getElementById("compareWeightMethod").style.display = '';
}

//Go back to configuration section of the weight method
function backToConfiguration(){
    document.getElementById("compareWeightMethod").style.display = 'none';
    document.getElementById("content").style.display = '';
}

//Compare weight results
function compareResults(){
    //Eliminates previous data from the tables
    $("#compareTable tbody tr").remove();

    var table = document.getElementById("compareTable").getElementsByTagName('tbody')[0];
    var optionTbl = document.getElementById("compareOptionsTable").getElementsByTagName('tbody')[0];
    var numOptions = optionTbl.rows.length;
    var ids = [];
    var resultNames = [];
    var ratioValues = [];
    var numOptionsSelected = 0;

    //Get ids and number of results selected that are going to be compared
    for (var k = 0; k < numOptions; k++) {
        var name = optionTbl.rows[k].cells[2].getElementsByTagName('input')[0].id;
        //If this result was selected
        if(document.getElementById(name).checked){
            var rowId = document.getElementById(name).parentNode.parentNode.rowIndex - 1;   //Get row index
            resultNames[numOptionsSelected] = optionTbl.rows[rowId].cells[0].innerHTML;     //Save result name
            ids[numOptionsSelected] = 'tbl' + k;                                            //Save table id of the select result
            ratioValues[numOptionsSelected] = optionTbl.rows[rowId].cells[1].innerHTML;     //Save ratio Z value
            numOptionsSelected = numOptionsSelected + 1;                                    //Increase number of selected results
        }else{
            //Do nothing, result not selected
        }
    } 

    if(numOptionsSelected == 0){
        document.getElementById("errorCompare").style.display = '';
    }else{
        document.getElementById("errorCompare").style.display = 'none';       

        //Make header for the table according to the number of options chosen
        var row = table.insertRow(0);
        for (var i = 0; i <= numOptionsSelected; i++) {
            if(i == 0){
                var cell = row.insertCell(i);    
                cell.innerHTML = "Criteria";
                cell.setAttribute('style', 'vertical-align:middle');
                cell.setAttribute('id', 'configHeader3');
            }else{
                var cell1 = row.insertCell(i);    
                cell1.innerHTML = resultNames[i-1] +'<br/>'+ ratioValues[i-1];
                cell1.setAttribute('id', 'configHeader3');
            }
        }

        //Get the number of criteria of the first result choosen
        var tableExample = document.getElementById(ids[0]).getElementsByTagName('tbody')[0];
        var numRows = tableExample.rows.length;
        var criterionExists = false;
        //Insert criteria it's weights according to each result chosen
        for (var j = 1; j <= numRows; j++) {
            var row2 = table.insertRow(j);
            for (var i = 0; i <= numOptionsSelected; i++) {
                if(i == 0){
                    var cell = row2.insertCell(i);    
                    cell.innerHTML = tableExample.rows[j-1].cells[0].innerHTML;
                }else{
                    var cell1 = row2.insertCell(i);    
                    var tbl = document.getElementById(ids[i-1]).getElementsByTagName('tbody')[0];
                    var len = tbl.rows.length;
                    //Get the correct weight according to the criteria
                    for (var k = 0; k < len; k++) {
                        if(tbl.rows[k].cells[0].innerHTML == cell.innerHTML){
                            cell1.innerHTML = tbl.rows[k].cells[3].innerHTML;
                            criterionExists = true;
                        }else{
                            //Add blank if criterion does not exist in this result
                            if(!criterionExists){
                                cell1.innerHTML = "NA";    
                            }
                        }
                    }
                    criterionExists = false;
                }
            }
        }   
    }
}

