var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var querystring = require("querystring");
var http = require('http');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/* GET Pagina Cadastrar.*/
app.get('/', function(req, res, next) {
  var idRestaurante = req.hestiasession.restaurante;
  var nome = req.hestiasession.name;
  res.render('perfil/index', {user:{ name: nome, restaurante: idRestaurante}});
});


module.exports = app  ;
