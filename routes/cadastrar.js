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
  console.log("funcionario:" +req.body.nomeDono);
  console.log("Cadastro:" + JSON.stringify(cadastro));
  console.log(querystring.escape(JSON.stringify(funcionario)));
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

module.exports = app;
