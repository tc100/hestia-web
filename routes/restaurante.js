var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http');
var querystring = require('querystring');
var request = require("request");

var API_URL = "https://hestia-api2.mybluemix.net";
//var API_URL = "localhost:6001";


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* GET restaurante. */

app.get('/', function(req,res){
  var id = req.hestiasession.restaurante;
  var nome = req.hestiasession.name;
  request.get(API_URL + '/apihestia/getRestaurante?id='+id, function (error, response, body) {
    if(!error){
      if(body == "ERROR"){
        res.send("ERROR");
      }else{
        var restaurante = JSON.parse(body);
        var alertX = JSON.stringify({"msg": "null", "typeMsg": "null"});
        res.render('restaurante/index', {user:{ name: nome, restaurante: id}, restaurante: body, alert: alertX});
      }
    }else{
      res.send("ERROR");
    }
  });
});

//Editar restaurante
app.post('/',function(req,res,next){
  var id = req.hestiasession.restaurante;
  var nome = req.hestiasession.name;
  var restaurante = {
    "id": req.hestiasession.restaurante,
    "nomerestaurante": req.body.nomeRestaurante,
    "descricao": req.body.descricao,
    "cnpj": req.body.cnpj,
    "email": req.body.email,
    "telefone": req.body.telefone,
    "cep": req.body.cep,
    "endereco": req.body.endereco,
    "cidade": req.body.cidade,
    "estado": req.body.estado,
    "numero": req.body.numero,
    "local": {
      "lat": req.body.lat,
      "long": req.body.long
    }
  };

  request.put(API_URL + '/apihestia/restaurante/editar?dados='+querystring.escape(JSON.stringify(restaurante)), function (error, response, body) {
    if(!error){
      if(body == "Alterado"){
        console.log("Alterado");
        res.send("Alterado");
      }else{
        console.log("fail: " + body);
        res.send("fail");
      }
    }else{
      res.send("ERROR");
    }
  });

});

module.exports = app  ;
