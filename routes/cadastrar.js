var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http');
var querystring = require('querystring');
var request = require("request");
var URL = require('url');


var API_URL = "https://hestia-api2.mybluemix.net";
//var API_URL = "localhost:6001";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/* GET Pagina Cadastrar.*/
app.get('/', function(req, res, next) {
  res.render('cadastrar', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante}});
});

/*POST dos dados cadastrais*/
app.post("/", function (req, res, next) {

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

  request.post(API_URL + '/apihestia/estabelecimento?cadastro='+querystring.escape(JSON.stringify(cadastro))+'&funcionario='+querystring.escape(JSON.stringify(funcionario)), function (error, response, body) {
    if(!error){
      if(body == "Cadastrado"){
        res.send("cadastrado");
      }else{
        console.log("fail: " + body);
        res.send("fail");
      }
    }else{
      res.send("ERROR");
    }
  });

});


app.get("/verificarLogin", function(req,res,next){
  var parsedURL = URL.parse(req.url,true);
  var params = parsedURL.query;
  var login =params.login;

    request.get(API_URL + '/apihestia/verificarLogin?login='+login, function (error, response, body) {
      if(!error){
        console.log("body : " + body);
        if(body == "NAOEXISTE"){
          res.send(true);
        }else{
          res.send(false);
        }
      }else{
        res.send("ERROR");
      }
    });
})

app.get("/verificarCnpj", function(req,res,next){
  var parsedURL = URL.parse(req.url,true);
  var params = parsedURL.query;
  var cnpj =params.cnpj;

  request.get(API_URL + '/apihestia/verificarLogin?cnpj='+cnpj, function (error, response, body) {
    if(!error){
      if(body == "NAOEXISTE"){
        res.send(true);
      }else{
        res.send(false);
      }
    }else{
      res.send("ERROR");
    }
  });
})


module.exports = app;
