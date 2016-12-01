var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var querystring = require("querystring");
var http = require('http');

var API_URL = "localhost";
var API_PORT = 6001;

/* GET home page. */
router.get('/', function(req, res, next) {
  //get nome restaurante
  var options = {
    host: API_URL,
    port: API_PORT,
    path: '/apihestia/getNomeEstabelecimento?restaurante='+req.hestiasession.restaurante,
    method: 'GET',
    params: req.hestiasession.restaurante,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(req.hestiasession.restaurante)
    }
  };
  var request = http.request(options, function(response) {
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        if(chunk == "ERROR"){
          res.render("error", {error: chunk});
        }else{
          res.render('mesas', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante, nomerestaurante: chunk}});
        }
      });
  });
  request.end();

});

module.exports = router;
