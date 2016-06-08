'use strict';
/**
 * Module dependencies.
 */
var fs = require('fs');
var http = require('http');
var querystring = require('querystring');
var jsonserverConf = require('../json-server');
const exec = require('child_process').exec;
var dbName = '{{ROUTE_JSDBNAME}}';
// var dbName = 'tasks';

module.exports ={
  dbMode: '{{BACKEND_DBMODE}}',
  // dbMode: 'json-server',
  dbName: dbName,
  uri: 'json-server://localhost:'+jsonserverConf.port+'/'+dbName,
  options:{
    port:jsonserverConf.port
  },
  startServer: function() {
      this.options.path = '/'+this.dbName;
      var spawn = require('child_process').spawn;
      var child = spawn('json-server', [
        '-w', './dbconf/db.json'
      ]);
      console.dir('starting json-server');
      child.stdout.on('data', function(chunk) {
        console.log(chunk.toString());
      });
      child.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
      });

      // wait for database server up
      var addDB=  function(){
        const cmddb = 'echo \'{"'+module.exports.dbName+'": []}\' > ./dbconf/db.json';
        exec(cmddb, function(error, stdout, stderr) {
          console.log('stdout: ' + stdout);
          if (error !== null) {
            console.log('exec error: ' + error);
          }
        });
      };
      setTimeout(function(){
          http.get(module.exports.options, function(res){
            console.dir('~~~~~~~~~~~~~~~~~~~~~~~~~~~');
            console.dir(res.statusCode);
            if(res.statusCode === 404){
              console.dir('No database db.json here, create one!');
              addDB();
            }
            console.dir('~~~~~~~~~~~~~~~~~~~~~~~~~~~');
          }).on('error',function(e){
            console.error(e);
            console.dir('Opps,the database server is not up, please check in!');
          });
        }, 2000);
  },
  index: function(req, res) {
    res.render('index', {
      title: module.exports.dbName,
      content: 'The '+module.exports.dbName+' server is running ~'
    });
  },
  getApi: function(req, res) {
    var varUrl = req.url.split('/');
    var filename = varUrl[2];
    var path = '/data/app/app/api/'+filename;

    fs.stat(path,function (error,s){
      if(!error && s.isFile()){
        var readable = fs.createReadStream(path,'utf-8');
        res.writeHead(200,{'Content-Type':'application/json'});
        readable.pipe(res);
      }else{
        res.json({ message: 'Failed to load '+filename });
      }
    });
  },
  operations: function(path,method,params,callback){
    this.options.path = path;
    this.options.method = method? method:'GET';
    this.options.headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      };
    var vetVar = JSON.stringify(params);
        params = JSON.parse(vetVar);
    var contents = querystring.stringify(params);
      // console.dir(this.options);
    var request = http.request(this.options, function(response){
      var str = '';
      response.setEncoding('utf-8');
      response.on('data', function (chunk) {
        str += chunk;
      });
      response.on('end', function(){
        callback(str,response.statusCode);
      });
      response.on('error', function(error){
        callback(error,response.statusCode);
      });
    }).on('error', function(e) {
        console.log('get error: ' + e.message);
    });
    request.write(contents);
    request.end();
  }
};
