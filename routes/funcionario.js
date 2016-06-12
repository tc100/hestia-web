var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/* GET Pagina Cadastrar.*/
app.get('/', function(req, res, next) {
  res.render('funcionario/index', { title: 'Hestia - Funcionário' });
});
/* GET Pagina Cadastrar.*/
app.get('/criar', function(req, res, next) {
  res.render('funcionario/criar', { title: 'Hestia - Adicionar Funcionário' });
});
/* GET Pagina Cadastrar.*/
app.get('/detalhes', function(req, res, next) {
  res.render('funcionario/detalhes');
});
/* GET Pagina Cadastrar.*/
app.get('/editar', function(req, res, next) {
  res.render('funcionario/editar', { title: 'Hestia - Editar Funcionário' });
});
/*POST dos dados cadastrais*/
app.post("/", function (req, res, next) {
	res.redirect("/funcionario/index");
});

module.exports = app;
