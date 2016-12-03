var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var querystring = require("querystring");
var http = require('http');
var request = require('request');

var API_URL = "https://hestia-api2.mybluemix.net";
//var API_URL = "localhost:6001";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/* GET Pagina Cadastrar.*/

app.get('/getFuncionario/:id', function(req,res){
  var idFuncionario = req.params.id;

  request.get(API_URL + '/apihestia/getFuncionario?id='+idFuncionario, function (error, response, body) {
    if(!error){
      if(body == "ERROR"){
        res.send("ERROR");
      }else{
        var funcionario = JSON.parse(body);
        res.send(funcionario);
      }
    }else{
      res.send("ERROR");
    }
  });
});
app.get('/getFuncs', function (req,res){
  var id = req.hestiasession.restaurante;
  request.get(API_URL + '/apihestia/getFuncs?id='+ id, function (error, response, body) {
    if(!error){
      if(body == "ERROR"){
        res.send("ERROR");
      }else{
        var funcionarios = JSON.parse(body);
        res.send(funcionarios);
      }
    }else{
      res.send("ERROR");
    }
  });
});

app.get('/', function(req, res, next) {
  var privilegio = req.hestiasession.privilegio;
  if (privilegio.indexOf("Funcionário") == -1){
    var alertX = JSON.stringify({"msg": "O Usuário não tem acesso a tela de <b>Funcionário</b>", "typeMsg": "warning"});
    res.render('home', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante, privilegio: privilegio}, alert: alertX});
  }
  var alertX = JSON.stringify({"msg": "null", "typeMsg": "null"});
  res.render('funcionario/index', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante, privilegio: privilegio}, alert: alertX});
});

/* GET Pagina Cadastrar.*/
app.get('/criar', function(req, res, next) {
  var privilegio = req.hestiasession.privilegio;
  if (privilegio.indexOf("Funcionário") == -1){
    var alertX = JSON.stringify({"msg": "O Usuário não tem acesso a tela de <b>Funcionário</b>", "typeMsg": "warning"});
    res.render('home', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante, privilegio: privilegio}, alert: alertX});
  }
  var alertX = JSON.stringify({"msg": "null", "typeMsg": "null"});
  res.render('funcionario/criar', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante, privilegio: privilegio}, alert: alertX});
});

app.post('/criar', function(req, res, next) {
  var idRestaurante = req.hestiasession.restaurante;
  var nome = req.hestiasession.name;
  var privilegio = req.hestiasession.privilegio;
  var funcionario = {
    "nome": req.body.nomeFunc,
    "login":  req.body.login,
    "senha":  req.body.senha,
    "restaurante": req.hestiasession.restaurante,
    "privilegio" : req.body.privilegio
  };
  request.post(API_URL + '/apihestia/funcionario?dados='+querystring.escape(JSON.stringify(funcionario)), function (error, response, body) {
    if(!error){
      if(body == "Cadastrado"){
        console.log("Cadastrado");
        var alertX = JSON.stringify({"msg": "<b>Funcionário</b> cadastrado com <b>Sucesso</b>", "typeMsg": "success"});
        res.render('funcionario/index', {user:{ name: nome, restaurante: idRestaurante, privilegio: privilegio}, alert: alertX});
      }else{
        console.log("fail: " + body);
          var alertX = JSON.stringify({"msg": "<b>Erro</b> ao cadastrar o <b>Funcionário</b>", "typeMsg": "danger"});
          res.render('funcionario/criar', {user:{ name: nome, restaurante: idRestaurante, privilegio: privilegio}, alert: alertX, funcionario: funcionario});
      }
    }else{
      res.send("ERROR");
    }
  });
});

/* GET Pagina detalhes.*/
app.get('/detalhes', function(req, res, next) {
  var privilegio = req.hestiasession.privilegio;
  if (privilegio.indexOf("Funcionário") == -1){
    var alertX = JSON.stringify({"msg": "O Usuário não tem acesso a tela de <b>Funcionário</b>", "typeMsg": "warning"});
    res.render('home', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante, privilegio: privilegio}, alert: alertX});
  }
  var alertX = JSON.stringify({"msg": "null", "typeMsg": "null"});
  res.render('funcionario/detalhes', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante, privilegio: req.hestiasession.privilegio}, alert: alertX});
});

/* GET Pagina editar.*/
app.get('/editar', function(req, res, next) {
  var privilegio = req.hestiasession.privilegio;
  if (privilegio.indexOf("Funcionário") == -1){
    var alertX = JSON.stringify({"msg": "O Usuário não tem acesso a tela de <b>Funcionário</b>", "typeMsg": "warning"});
    res.render('home', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante, privilegio: privilegio}, alert: alertX});
  }
  var alertX = JSON.stringify({"msg": "null", "typeMsg": "null"});
  res.render('funcionario/editar', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante, privilegio: req.hestiasession.privilegio}, alert: alertX});
});

app.post('/editar',function(req,res,next){
  var idRestaurante = req.hestiasession.restaurante;
  var nome = req.hestiasession.name;
  var privilegio = req.hestiasession.privilegio;

  var funcionario = {
    "id": req.body.idFunc,
    "nome": req.body.nomeFunc,
    "login":  req.body.login,
    "senha":  req.body.senha,
    "privilegio" : req.body.privilegio
  };

  request.put(API_URL + '/apihestia/funcionario/editar?dados='+querystring.escape(JSON.stringify(funcionario)), function (error, response, body) {
    if(!error){
        if(body == "Alterado"){
          console.log("Alterado");
          var alertX = JSON.stringify({"msg": "<b>Funcionário</b> alterado com <b>Sucesso</b>", "typeMsg": "success"});
          res.render('funcionario/index', {user:{ name: nome, restaurante: idRestaurante, privilegio: privilegio}, alert: alertX});
        }else{
          console.log("fail: " + body);
            var alertX = JSON.stringify({"msg": "<b>Erro</b> ao alterar o <b>Funcionário</b>", "typeMsg": "danger"});
            res.render('funcionario/editar', {user:{ name: nome, restaurante: idRestaurante, privilegio: privilegio}, alert: alertX});
        }
    }else{
      res.send("ERROR");
    }
  });
});

app.get('/delete/:id', function(req,res){
  var idFuncionario = req.params.id
  var idRestaurante = req.hestiasession.restaurante;

  request.delete(API_URL + '/apihestia/funcionario/delete?id='+idFuncionario+'&idRestaurante='+idRestaurante, function (error, response, body) {
    if(!error){
      if(body == "ERROR"){
        res.send("ERROR");
      }else{
        res.send("desativado");
      }
    }else{
      res.send("ERROR");
    }
  });
});

/*POST dos dados cadastrais*/
app.post("/", function (req, res, next) {
	res.redirect("/funcionario/index");
});

module.exports = app;
