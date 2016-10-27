var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http');
var querystring = require('querystring');

var API_URL = "localhost"
var API_PORT = 6001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* GET restaurante. */

app.get('/', function(req,res){
  var id = req.hestiasession.restaurante;
  var nome = req.hestiasession.name;
  var options = {
    host: API_URL,
    port: API_PORT,
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
          var alertX = JSON.stringify({"msg": "null", "typeMsg": "null"});
          res.render('restaurante/index', {user:{ name: nome, restaurante: id}, restaurante: chunk, alert: alertX});
        }
      });
  });
  request.write(id);
  request.end();
});

//Editar restaurante
app.post('/',function(req,res,next){
  console.log("teste2: " + JSON.stringify(req.body));

  var id = req.hestiasession.restaurante;
  var nome = req.hestiasession.name;
  var restaurante = {
    "id": req.hestiasession.restaurante,
    "nomerestaurante": req.body.nomerestaurante,
    "cnpj": req.body.cnpj,
    "email": req.body.email,
    "telefone": req.body.telefone,
    "cep": req.body.cep,
    "endereco": req.body.endereco,
    "cidade": req.body.cidade,
    "estado": req.body.estado
  };
  var options = {
    host: API_URL,
    port: API_PORT,
    path: '/apihestia/restaurante/editar?dados='+querystring.escape(JSON.stringify(restaurante)),
    method: 'PUT',
    params: JSON.stringify(restaurante),
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(JSON.stringify(restaurante))
    }
  };

  var req = http.request(options, function(response) {
      response.setEncoding('utf8');
      var restauranteX = JSON.stringify(restaurante);
      response.on('data', function (chunk) {
        if(chunk == "Alterado"){
          console.log("Alterado");
          var alertX = JSON.stringify({"msg": "<b>Restaurante</b> alterado com <b>Sucesso", "typeMsg": "success"});
          res.render('restaurante/index', {user:{ name: nome, restaurante: id}, restaurante: restauranteX, alert: alertX});
        }else{
          console.log("fail: " + chunk);
          var alertX = JSON.stringify({"msg": "<b>Erro</b> ao editar <b>Restaurente", "typeMsg": "danger"});
          res.render('restaurante/index', {user:{ name: nome, restaurante: id}, restaurante: restauranteX, alert: alertX});
        }
      });
  });
  req.write(JSON.stringify(restaurante));
  req.end();
});

module.exports = app  ;
