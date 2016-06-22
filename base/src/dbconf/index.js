'use strict';
/**
 * Module dependencies.
 */
var fs = require('fs'),
  http = require('http'),
  querystring = require('querystring'),
  jsonserverConf = require('../json-server');
var spawn = require('child_process').spawn;

module.exports ={
  dbMode: '{{BACKEND_DBMODE}}',
  // dbMode: 'json-server',
  uri: 'json-server://localhost:'+jsonserverConf.port+'/db.json',
  options:{
    port:jsonserverConf.port
  },
  startServer: function() {
    var child = spawn('json-server', [
      '-w', './dbconf/db.json'
    ]);
    child.stdout.on('data', function(chunk) {
      console.log(chunk.toString());
    });
    child.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
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
    var request = http.request(module.exports.options, function(response){
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
