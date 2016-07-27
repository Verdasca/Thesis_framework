var mongoose = require( 'mongoose' );
var _ = require( 'lodash' );
//var fs = require('fs');
var fs = require('fs-extra')

// Create empty folder with the name of the project _id when the user creates a new project
exports.createProject = function(req, res){
    var dir = './Projects';
    var name = req.params.id;
    var dirName = dir + '/'+ name;
    // If folder does not exist, create the folder plus data and result folder
    if (!fs.existsSync(dirName)){
        fs.mkdirSync(dirName);
        fs.mkdirSync(dirName+'/data');
        fs.mkdirSync(dirName+'/results');
    }
    res.send('Project folder created.');
};

// Delete project folder when the user deletes the entire project
exports.deleteProject = function(req, res){
    var dir = './Projects';
    var name = req.params.id;
    var dirName = dir + '/'+ name;
    fs.removeSync(dirName);
    res.send('Project folder deleted.');
};

// Get the project's data
exports.getData = function(req, res){
    var dir = './Projects';
    var name = req.params.id;
    var dirName = dir + '/'+ name;
    if (fs.existsSync(dirName+'/data/data.json')){
        //var data = require(dirName+'/data/data.json');
        //var data = fs.readFile(dirName+'/data/data.json');
        fs.readFile(dirName+'/data/data.json', 'utf8', function(err, data) {  
            if (err) throw err;
            res.send(data);
        });
        //res.json(data);
    }else{
        res.send('No data...');
    }
};

// Save the project's data
exports.saveData = function(req, res){
    //console.log(req.body);
    var dir = './Projects';
    var name = req.params.id;
    var dirName = dir + '/'+ name + '/data';
    fs.writeJson(dirName+'/data.json', req.body, function (err) {
      //console.log(err)
    })
    res.send('Data saved.');
};

// Reload the project's data
exports.saveDataReload = function(req, res){
    var dir = './Projects';
    var name = req.params.id;
    var number = req.params.nameId;
    var dirName = dir + '/'+ name + '/data';
    console.log('Reloading files');
    if (fs.existsSync(dir+'/'+ name +'/results')){
        fs.readFile(dir+'/'+name+'/results/data'+number+'.json', 'utf8', function(err, data) {  
            if (err){
                res.send(err); 
            }else{
                var jsonContent = JSON.parse(data);
                fs.writeJson(dirName+'/data.json', jsonContent, function (err) {
                  if (err){
                    res.send(err);
                  }else{
                    res.send('Data reloaded.');
                  } 
                })
            }
        });
    }else{
        res.send('No data...');
    }
};

// Save the results
exports.saveDataResults = function(req, res){
    console.log(req.body);
    var dir = './Projects';
    var name = req.params.id;
    var number = req.params.nameId;
    var jsonFile = 'data'+number+'.json'
    var dirName = dir + '/'+ name + '/results';
    fs.writeJson(dirName+'/'+jsonFile, req.body, function (err) {
      console.log(err)
    })
    res.send('Result saved.');
};

// Get result
exports.getDataResult = function(req, res){
    var dir = './Projects';
    var name = req.params.id;
    var number = req.params.nameId;
    var dirName = dir + '/'+ name;
    if (fs.existsSync(dirName+'/results')){
        fs.readFile(dirName+'/results/data'+number+'.json', 'utf8', function(err, data) {  
            if (err) throw err;
            res.send(data);
        });
        //res.json(data);
    }else{
        res.send('No data...');
    }
};

// Delete result file
exports.deleteResult = function(req, res){
    var dir = './Projects';
    var name = req.params.id;
    var number = req.params.nameId;
    var dirName = dir + '/'+ name;
    fs.removeSync(dirName+'/results/data'+number+'.json');
    res.send('Result file deleted.');
};
