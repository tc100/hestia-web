var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('got');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/* GET Pagina Cadastrar.*/
app.get('/', function(req, res, next) {
  res.render('cadastrar', { title: 'Hestia - Cadastrar' });
});

/*POST dos dados cadastrais*/
app.post("/", function (req, res, next) {
	console.log(req.body);
  cadastro = req.body;
  console.log("teste: " + req.body.nomeDono);
  funcionario = {
    "nome": req.body.nomeDono,
    "login": req.body.login,
    "senha": req.body.senha
  };
  request('http://localhost:8080/apihestia/estabelecimento?cadastro=' + JSON.stringify(cadastro) +'&funcionario='+JSON.stringify(funcionario), function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("Adicionado no banco:" + body); // Show the HTML for the Google homepage.
      res.status(200).send("Adicionado");
    }else{
      console.log("Erro ao adicionar: " + error);
    }
  });
  res.redirect("/login");
});

module.exports = app;
