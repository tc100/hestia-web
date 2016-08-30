var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http');
var querystring = require('querystring');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* GET restaurante. */

app.get('/', function(req,res){
  var id = req.hestiasession.restaurante;
  var nome = req.hestiasession.name;
  var options = {
    host: 'localhost',
    port: 8080,
    path: '/apihestia/getRestaurante?id='+id,
    method: 'GET',
    params: id,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(id)
    }
  };
  var request = http.request(options, function(response) {
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        if(chunk == "ERROR"){
          res.send("ERROR");
        }else{
          console.log("teste: " + chunk);
          var restaurante = JSON.parse(chunk);
          res.render('restaurante/index', {user:{ name: nome, restaurante: id}, restaurante: chunk});
        }
      });
  });
  request.write(id);
  request.end();
});

module.exports = app  ;
