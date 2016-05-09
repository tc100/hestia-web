var express = require('express');
var router = express.Router();
var http = require('http');

exports.cadastrarEstabelecimento = function(opts, callback){
  var req = http.request(options, function(res){
    console.log("passou aqui");
    var stdout = "";
    res.on("data", function(data){
      stdout += data;
    });

    var stderr = "";
    res.on("error", function(){
      stderr +- error;
    });

    res.on("end", function(){
      callback(stderr,stdout);
    })
  })
}

module.exports = router;
