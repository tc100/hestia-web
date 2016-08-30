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

//Editar restaurante
app.post('/',function(req,res,next){
  console.log("teste2: " + JSON.stringify(req.body));
  var restaurante = {
    "id": req.hestiasession.restaurante,
    "nomerestaurante": req.body.nomeRestaurante,
    "cnpj": req.body.cnpj,
    "email": req.body.email,
    "telefone": req.body.telefone,
    "cep": req.body.cep,
    "endereco": req.body.endereco,
    "cidade": req.body.cidade,
    "estado": req.body.estado
  };
  var options = {
    host: 'localhost',
    port: 8080,
    path: '/apihestia/restaurante/?dados='+querystring.escape(JSON.stringfy(restaurante)),
    method: 'PUT',
    params: JSON.stringify(restaurante),
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(JSON.stringify(restaurante))
    }
  };

  var req = http.request(options, function(response) {
      response.setEncoding('utf8');

      response.on('data', function (chunk) {
        if(chunk == "Alterado"){
          console.log("Alterado");
          res.redirect("/restaurante?status=editado");
        }else{
          console.log("fail: " + chunk);
          res.redirect("/restaurante?status=fail");
        }
      });
  });
  req.write(JSON.stringify(restaurante));
  req.end();
});

module.exports = app  ;
