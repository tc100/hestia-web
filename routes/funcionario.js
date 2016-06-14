var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var querystring = require("querystring");
var http = require('http');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/* GET Pagina Cadastrar.*/

app.get('/getFuncs', function (req,res){
  var cnpj = req.hestiasession.restaurante;
  console.log("cnpj: " + cnpj);
  var options = {
    host: 'localhost',
    port: 8080,
    path: '/apihestia/getFuncs?cnpj='+cnpj,
    method: 'GET',
    params: req.hestiasession.restaurante,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(cnpj)
    }
  };
  var request = http.request(options, function(response) {
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        if(chunk == "ERROR"){
          res.send("ERROR");
        }else{
          var funcionarios = JSON.parse(chunk);
          res.send(funcionarios);
        }
      });
  });
  request.write(cnpj);
  request.end();
});
app.get('/', function(req, res, next) {
  res.render('funcionario/index', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante}});
});
/* GET Pagina Cadastrar.*/
app.get('/criar', function(req, res, next) {
  res.render('funcionario/criar', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante}});
});

app.post('/criar', function(req, res, next) {
  var funcionario = {
    "nome": req.body.nomeFunc,
    "login":  req.body.login,
    "senha":  req.body.senha,
    "restaurante": req.hestiasession.restaurante
  };
  var options = {
    host: 'localhost',
    port: 8080,
    path: '/apihestia/funcionario?dados='+querystring.escape(JSON.stringify(funcionario)),
    method: 'POST',
    params: JSON.stringify(funcionario),
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(JSON.stringify(funcionario))
    }
  };

  var req = http.request(options, function(response) {
      response.setEncoding('utf8');

      response.on('data', function (chunk) {
        if(chunk == "Cadastrado"){
          console.log("Cadastrado");
          res.redirect("/funcionario?status=cadastrado");
        }else{
          console.log("fail: " + chunk);
          res.redirect("/funcionario/criar?status=fail");
        }
      });
  });
  req.write(JSON.stringify(funcionario));
  req.end();

});

/* GET Pagina Cadastrar.*/
app.get('/detalhes', function(req, res, next) {
  res.render('funcionario/detalhes',{user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante}});
});
/* GET Pagina Cadastrar.*/
app.get('/editar', function(req, res, next) {
  res.render('funcionario/editar',{user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante}});
});

/*POST dos dados cadastrais*/
app.post("/", function (req, res, next) {
	res.redirect("/funcionario/index");
});

module.exports = app;
