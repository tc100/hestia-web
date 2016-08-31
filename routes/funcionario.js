var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var querystring = require("querystring");
var http = require('http');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/* GET Pagina Cadastrar.*/

app.get('/getFuncionario/:id', function(req,res){
  var idFuncionario = req.params.id;
  var options = {
    host: 'localhost',
    port: 8080,
    path: '/apihestia/getFuncionario?id='+idFuncionario,
    method: 'GET',
    params: idFuncionario,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(idFuncionario)
    }
  };
  var request = http.request(options, function(response) {
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        if(chunk == "ERROR"){
          res.send("ERROR");
        }else{
          console.log("teste: " + chunk);
          var funcionario = JSON.parse(chunk);
          res.send(funcionario);
        }
      });
  });
  request.write(idFuncionario);
  request.end();
});
app.get('/getFuncs', function (req,res){
  var id = req.hestiasession.restaurante;
  var options = {
    host: 'localhost',
    port: 8080,
    path: '/apihestia/getFuncs?id='+id,
    method: 'GET',
    params: req.hestiasession.restaurante,
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
          var funcionarios = JSON.parse(chunk);
          res.send(funcionarios);
        }
      });
  });
  request.write(id);
  request.end();
});
app.get('/', function(req, res, next) {
  var alertX = JSON.stringify({"msg": "null", "typeMsg": "null"});
  res.render('funcionario/index', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante}, alert: alertX});
  // res.render('funcionario/index', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante}});
});
/* GET Pagina Cadastrar.*/
app.get('/criar', function(req, res, next) {
  var alertX = JSON.stringify({"msg": "null", "typeMsg": "null"});
  res.render('funcionario/criar', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante}, alert: alertX});
  // res.render('funcionario/criar', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante}});
});

app.post('/criar', function(req, res, next) {
  var idRestaurante = req.hestiasession.restaurante;
  var nome = req.hestiasession.name;
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
          // res.redirect("/funcionario?status=editado");
          var alertX = JSON.stringify({"msg": "<b>Funcionário</b> cadastrado com <b>Sucesso</b>", "typeMsg": "success"});
          res.render('funcionario/index', {user:{ name: nome, restaurante: idRestaurante}, alert: alertX});
        }else{
          console.log("fail: " + chunk);
            var alertX = JSON.stringify({"msg": "<b>Erro</b> ao cadastrar o <b>Funcionário</b>", "typeMsg": "danger"});
            res.render('funcionario/criar', {user:{ name: nome, restaurante: idRestaurante}, alert: alertX, funcionario: funcionario2});
          // res.redirect("/funcionario/editar?id="+req.body.idFunc+"&status=fail");
        }
      });
  });
  req.write(JSON.stringify(funcionario));
  req.end();

});

/* GET Pagina Cadastrar.*/
app.get('/detalhes', function(req, res, next) {
  var alertX = JSON.stringify({"msg": "null", "typeMsg": "null"});
  res.render('funcionario/detalhes', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante}, alert: alertX});
  // res.render('funcionario/detalhes',{user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante}});
});
/* GET Pagina Cadastrar.*/
app.get('/editar', function(req, res, next) {
  var alertX = JSON.stringify({"msg": "null", "typeMsg": "null"});
  res.render('funcionario/editar', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante}, alert: alertX});
  // res.render('funcionario/editar',{user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante}});
});

app.post('/editar',function(req,res,next){
  console.log("teste2: " + JSON.stringify(req.body));
  var funcionario = {
    "id": req.body.idFunc,
    "nome": req.body.nomeFunc,
    "login":  req.body.login,
    "senha":  req.body.senha,
  };
  var options = {
    host: 'localhost',
    port: 8080,
    path: '/apihestia/funcionario/editar?dados='+querystring.escape(JSON.stringify(funcionario)),
    method: 'PUT',
    params: JSON.stringify(funcionario),
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(JSON.stringify(funcionario))
    }
  };

  var req = http.request(options, function(response) {
      response.setEncoding('utf8');

      response.on('data', function (chunk) {
        if(chunk == "Alterado"){
          console.log("Alterado");
          // res.redirect("/funcionario?status=editado");
          var alertX = JSON.stringify({"msg": "<b>Funcionário</b> alterado com <b>Sucesso</b>", "typeMsg": "success"});
          res.render('funcionario/index', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante}, alert: alertX});
        }else{
          console.log("fail: " + chunk);
            var alertX = JSON.stringify({"msg": "<b>Erro</b> ao alterar o <b>Funcionário</b>", "typeMsg": "danger"});
            res.render('funcionario/editar', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante}, alert: alertX});
          // res.redirect("/funcionario/editar?id="+req.body.idFunc+"&status=fail");
        }
      });
  });
  req.write(JSON.stringify(funcionario));
  req.end();
});

app.get('/delete/:id', function(req,res){
  var idFuncionario = req.params.id
  var cnpj = req.hestiasession.restaurante;
  var options = {
    host: 'localhost',
    port: 8080,
    path: '/apihestia/funcionario/delete?id='+idFuncionario+'&cnpj='+cnpj,
    method: 'DELETE',
    params: idFuncionario,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(idFuncionario)
    }
  };
  var request = http.request(options, function(response) {
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        if(chunk == "ERROR"){
          res.send("ERROR");
        }else{
          res.send("desativado");
        }
      });
  });
  request.write(idFuncionario);
  request.end();
});

/*POST dos dados cadastrais*/
app.post("/", function (req, res, next) {
	res.redirect("/funcionario/index");
});

module.exports = app;
