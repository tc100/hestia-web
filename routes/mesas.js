var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var querystring = require("querystring");
var http = require('http');
var request = require("request");

var API_URL = "https://hestia-api2.mybluemix.net";
//var API_URL = "localhost:6001";

/* GET home page. */

router.get('/', function(req, res, next) {
  //get nome restaurante

  request.get(API_URL + '/apihestia/getNomeEstabelecimento?restaurante='+req.hestiasession.restaurante, function (error, response, body) {
    if(!error){
      if(body == "ERROR"){
        res.render("error", {error: body});
      }else{
        res.render('mesas', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante, nomerestaurante: body}});
      }
    }else{
      res.send("ERROR");
    }
  });
});

module.exports = router;
