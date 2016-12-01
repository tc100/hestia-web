var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http');
var querystring = require('querystring');

var API_URL = "localhost";
var API_PORT = 6001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/* GET Pagina Cadastrar.*/
app.get('/', function(req, res, next) {
  res.render('cadastrar', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante}});
});

/*POST dos dados cadastrais*/
app.post("/", function (req, res, next) {
  console.log("teste: " + JSON.stringify(req.body));
  cadastro = {
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
  funcionario = {
    "nome": req.body.nome,
    "login": req.body.login,
    "senha": req.body.senha,
    "restaurante": "placeholder",
    "privilegio" : ["Administrativo","Cardápio","Funcionário","Cozinha"]
  };

  var data = querystring.stringify({
    "cadastro": cadastro,
    "funcionario": funcionario
  });
  var options = {
    host: API_URL,
    port: API_PORT,
    path: '/apihestia/estabelecimento?cadastro='+querystring.escape(JSON.stringify(cadastro))+'&funcionario='+querystring.escape(JSON.stringify(funcionario)),
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
          res.send("cadastrado");
        }else{
          console.log("fail: " + chunk);
          res.send("fail");
        }
      });
  });
  req.write(data);
  req.end();
});


app.get("/verificarLogin", function(req,res,next){
    var login = req.body.login;
    var options = {
    host: API_URL,
    port: API_PORT,
    path: '/apihestia/verificarLogin?login='+login,
    method: 'GET',
    params: login,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(login)
    }
  };
  var request = http.request(options, function(response) {
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        if(chunk == "NAOEXISTE"){
          res.send(true);
        }else{
          res.send(false);
        }
      });
  });
  request.end();
})

app.get("/verificarCnpj", function(req,res,next){
    var cnpj = req.body.cnpj;
    var options = {
    host: API_URL,
    port: API_PORT,
    path: '/apihestia/verificarLogin?cnpj='+cnpj,
    method: 'GET',
    params: cnpj,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(cnpj)
    }
  };
  var request = http.request(options, function(response) {
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        if(chunk == "NAOEXISTE"){
          res.send(true);
        }else{
          res.send(false);
        }
      });
  });
  request.end();
})


module.exports = app;
