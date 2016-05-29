var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http');
var querystring = require('querystring');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/* GET Pagina Cadastrar.*/
app.get('/', function(req, res, next) {
  res.render('cadastrar', { title: 'Hestia - Cadastrar' });
});

/*POST dos dados cadastrais*/
app.post("/", function (req, res, next) {
  cadastro = {
    "nome-restaurante": req.body.nomeRestaurante,
    "cnpj": req.body.cnpj,
    "email": req.body.email,
    "telefone": req.body.telefone,
    "endereco": req.body.endereco,
    "cidade": req.body.cidade,
    "estado": req.body.estado
  };
  funcionario = {
    "nome": req.body.nomeDono,
    "login": req.body.login,
    "senha": req.body.senha
  };
  var data = querystring.stringify({
    "cadastro": cadastro,
    "funcionario": funcionario
  });

  var options = {
    host: 'localhost',
    port: 8080,
    path: '/apihestia/estabelecimento?cadastro='+JSON.stringify(cadastro)+'&funcionario='+JSON.stringify(funcionario),
    method: 'POST',
    params: data,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data)
    }
  };

  var req = http.request(options, function(response) {
      response.setEncoding('utf8');

      response.on('data', function (chunk) {
        if(chunk == "Cadastrado"){
          console.log("Cadastrado");
          res.redirect("/login?status=cadastrado");
        }else{
          console.log("fail: " + chunk);
          res.redirect("/cadastrar?status=fail");
        }
      });
  });
  req.write(data);
  req.end();
});

module.exports = app;
