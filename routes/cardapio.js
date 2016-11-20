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
  var idRestaurante = req.hestiasession.restaurante;
  var nome = req.hestiasession.name;
  var privilegio = req.hestiasession.privilegio;
  if (privilegio.indexOf("Cardápio") == -1){
    var alertX = JSON.stringify({"msg": "O Usuário não tem acesso a tela de <b>Cardápio</b>", "typeMsg": "warning"});
    res.render('home', {user:{ name: nome, restaurante: idRestaurante, privilegio: privilegio}, alert: alertX});
  }
  var options = {
    host: API_URL,
    port: API_PORT,
    path: '/apihestia/cardapios?restaurante='+idRestaurante,
    method: 'GET',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(idRestaurante)
    }
  };

  var req = http.request(options, function(response) {
      response.setEncoding('utf8');

      response.on('data', function (chunk) {
        if(chunk == "Fail"){
          console.log("fail: " + chunk);
          var alertX = JSON.stringify({"msg": "null", "typeMsg": "null"});
          res.render('cardapio/index', {user:{ name: nome, restaurante: idRestaurante, privilegio: privilegio}, alert: alertX, error: "erro ao conectar com o BD"});
        }else{
          console.log("cardapios: " + JSON.stringify(chunk));
          var alertX = JSON.stringify({"msg": "null", "typeMsg": "null"});
          res.render('cardapio/index', {user:{ name: nome, restaurante: idRestaurante, privilegio: privilegio}, alert: alertX, lista_cardapio: chunk});
        }
      });
  });
  req.write(idRestaurante);
  req.end();
});

app.get('/editar', function(req, res, next) {
    res.redirect("/cardapio");
});

app.get('/editar/:nome_cardapio', function(req, res, next) {
  var idRestaurante = req.hestiasession.restaurante;
  var nome = req.hestiasession.name;
  var privilegio = req.hestiasession.privilegio;
  if (privilegio.indexOf("Cardápio") == -1){
    var alertX = {"msg": "O Usuário não tem acesso a tela de <b>Cardápio</b>", "typeMsg": "warning"};
    res.render('home', {user:{ name: nome, restaurante: idRestaurante, privilegio: privilegio}, alert: alertX});
  }
  if(req.params.nome_cardapio == null || typeof req.params.nome_cardapio == "undefined"){
    var alertX = JSON.stringify({"msg": "null", "typeMsg": "null"});
    res.redirect("cardapio/index", {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante}, alert: alertX});
  }
  else{
    var nome_cardapio = req.params.nome_cardapio;
    var data = querystring.stringify({
      "restaurante":  idRestaurante,
      "cardapio": nome_cardapio
    });

    var options = {
      host: API_URL,
      port: API_PORT,
      path: '/apihestia/cardapio?restaurante='+idRestaurante+'&cardapio='+ encodeURIComponent(nome_cardapio),
      method: 'GET',
      params: data,
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(data)
      }
    };

    var req = http.request(options, function(response) {
        response.setEncoding('utf8');

        response.on('data', function (chunk) {
          if(chunk == "Fail"){
            console.log("fail: " + chunk);
            res.redirect("/cardapio");
          }else{
            var alertX = JSON.stringify({"msg": "null", "typeMsg": "null"});
            res.render('cardapio/editar', {user:{ name: nome, restaurante: idRestaurante}, cardapio: chunk, alert: alertX});
          }
        });
    });
    req.write(data);
    req.end();

  }
});

app.post("/clonar", function(req,res,next){

  var nome_clonar = req.body.nome_clonar;
  var nome_cardapio = req.body.novo_cardapio;
  var data = querystring.stringify({
    "restaurante":  req.hestiasession.restaurante,
    "cardapio": nome_cardapio
  });
  var options = {
    host: API_URL,
    port: API_PORT,
    path: '/apihestia/cardapio/clonar?restaurante='+req.hestiasession.restaurante+'&novo_cardapio='+encodeURIComponent(nome_cardapio)+'&nome_clonar='+encodeURIComponent(nome_clonar),
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
        if(chunk == "Fail"){
          console.log("fail: " + chunk);
          var alertX = JSON.stringify({"msg": "<b>Erro</b> ao duplicar <b>Cardápio</b>", "typeMsg": "danger"});
          res.send({"alert": JSON.parse(alertX)});
        }else{
          console.log("Cardapio cadastrado");
          var alertX = JSON.stringify({"msg": "<b>Cardápio</b> duplicado com <b>Sucesso</b>", "typeMsg": "success"});
          res.send({"nome": nome_cardapio, "categorias": JSON.parse(chunk).categorias, "alert": JSON.parse(alertX)});
        }
      });
  });
  req.write(data);
  req.end();

});

app.post("/novo", function(req,res,next){
  var nome_restaurante = req.body.nome;
  var data = querystring.stringify({
    "restaurante":  req.hestiasession.restaurante,
    "cardapio": nome_restaurante
  });
  var options = {
    host: API_URL,
    port: API_PORT,
    path: '/apihestia/cardapio/novo?restaurante='+req.hestiasession.restaurante+'&cardapio='+encodeURIComponent(nome_restaurante),
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
          console.log("Cardapio cadastrado");
          var alertX = JSON.stringify({"msg": "<b>Cardápio</b> cadastrado com <b>Sucesso</b>", "typeMsg": "success"});
          res.send({"nome": nome_restaurante, "categorias": [], "alert": JSON.parse(alertX)});
        }else{
          console.log("fail: " + chunk);var alertX = JSON.stringify({"msg": "<b>Erro</b> ao cadastrar <b>Cardápio</b>", "typeMsg": "danger"});
          res.send({"alert": JSON.parse(alertX)});

        }
      });
  });
  req.write(data);
  req.end();

});

app.post("/acompanhamento", function (req, res, next){
  var nome_cardapio = req.body.nome_cardapio;
  var data = querystring.stringify({
    "restaurante":  req.hestiasession.restaurante,
    "cardapio": nome_cardapio
  });
  console.log (JSON.stringify(req.body.acompanhamento));
  console.log("acompanhamento: " + req.body.acompanhamento);
  var options = {
    host: API_URL,
    port: API_PORT,
    path: '/apihestia/acompanhamento?restaurante='+req.hestiasession.restaurante+'&cardapio='+encodeURIComponent(nome_cardapio)+'&acompanhamento='+encodeURIComponent(req.body.acompanhamento),
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
          var alertX = JSON.stringify({"msg": "<b>Acompanhamento</b> Cadastrado com <b>Sucesso</b>", "typeMsg": "success"});
          console.log("Acompanhamento cadastrada");
          res.send(JSON.parse(alertX));
        }else{
          console.log("fail: " + chunk);
          var alertX = JSON.stringify({"msg": "<b>Falha</b> ao cadastrar <b>Acompanhamento</b><br>ERRO: "+chunk, "typeMsg": "danger"});
          res.send(JSON.parse(alertX));
        }
      });
  });
  req.write(data);
  req.end();

});

app.post("/deleteAcompanhamento", function (req, res, next){
  var nome_cardapio = req.body.nome_cardapio;
  var data = querystring.stringify({
    "restaurante":  req.hestiasession.restaurante,
    "cardapio": nome_cardapio
  });
  var options = {
    host: API_URL,
    port: API_PORT,
    path: '/apihestia/deleteAcompanhamento?restaurante='+req.hestiasession.restaurante+'&cardapio='+encodeURIComponent(nome_cardapio)+'&acompanhamento='+encodeURIComponent(req.body.acompanhamento),
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
        if(chunk == "Deletado"){
          var alertX = JSON.stringify({"msg": "<b>Acompanhamento</b> Deletado com <b>Sucesso</b>", "typeMsg": "success"});
          console.log("Acompanhamento deletado");
          res.send(JSON.parse(alertX));
        }else{
          console.log("fail: " + chunk);
          var alertX = JSON.stringify({"msg": "<b>Falha</b> ao cadastrar <b>Acompanhamento</b><br>ERRO: "+chunk, "typeMsg": "danger"});
          res.send(JSON.parse(alertX));
        }
      });
  });
  req.write(data);
  req.end();

});

app.post("/categoria", function (req, res, next){
  var nome_cardapio = req.body.nome_cardapio;
  var data = querystring.stringify({
    "restaurante":  req.hestiasession.restaurante,
    "cardapio": nome_cardapio
  });
  var options = {
    host: API_URL,
    port: API_PORT,
    path: '/apihestia/categoria?restaurante='+req.hestiasession.restaurante+'&cardapio='+encodeURIComponent(nome_cardapio)+'&categoria='+encodeURIComponent(req.body.categoria),
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
          var alertX = JSON.stringify({"msg": "<b>Categoria</b> Cadastrada com <b>Sucesso</b>", "typeMsg": "success"});
          console.log("Categoria cadastrada");
          res.send(JSON.parse(alertX));
        }else{
          console.log("fail: " + chunk);
          var alertX = JSON.stringify({"msg": "<b>Falha</b> ao cadastrar <b>Categoria</b><br>ERRO: "+chunk, "typeMsg": "danger"});
          res.send(JSON.parse(alertX));
        }
      });
  });
  req.write(data);
  req.end();

});

app.post("/deleteCategoria", function (req, res, next){
  var nome_cardapio = req.body.nome_cardapio;
  var data = querystring.stringify({
    "restaurante":  req.hestiasession.restaurante,
    "cardapio": nome_cardapio
  });
  var options = {
    host: API_URL,
    port: API_PORT,
    path: '/apihestia/deleteCategoria?restaurante='+req.hestiasession.restaurante+'&cardapio='+encodeURIComponent(nome_cardapio)+'&categoria='+encodeURIComponent(req.body.categoria),
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
        if(chunk == "Deletado"){
          var alertX = JSON.stringify({"msg": "<b>Categoria</b> Deletada com <b>Sucesso</b>", "typeMsg": "success"});
          console.log("Categoria deletada");
          res.send(JSON.parse(alertX));
        }else{
          console.log("fail: " + chunk);
          var alertX = JSON.stringify({"msg": "<b>Falha</b> ao cadastrar <b>Categoria</b><br>ERRO: "+chunk, "typeMsg": "danger"});
          res.send(JSON.parse(alertX));
        }
      });
  });
  req.write(data);
  req.end();

});

app.post("/prato", function (req, res, next){
  var nome_cardapio = req.body.nome_cardapio;
  var data = querystring.stringify({
    "restaurante":  req.hestiasession.restaurante,
    "cardapio": nome_cardapio
  });
  var options = {
    host: API_URL,
    port: API_PORT,
    path: '/apihestia/prato?restaurante='+req.hestiasession.restaurante+'&cardapio='+encodeURIComponent(nome_cardapio)+'&prato='+encodeURIComponent(req.body.prato)+'&categoria='+encodeURIComponent(req.body.nome_categoria)+"&editar="+encodeURIComponent(req.body.editar_prato),
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
          var alertX = JSON.stringify({"msg": "<b>Prato</b> Cadastrado com <b>Sucesso</b>", "typeMsg": "success"});
          console.log("Prato cadastrado");
          res.send(JSON.parse(alertX));
        }else{
          console.log("fail: " + chunk);
          var alertX = JSON.stringify({"msg": "<b>Falha</b> ao cadastrar <b>Prato</b><br>ERRO: "+chunk, "typeMsg": "danger"});
          res.send(JSON.parse(alertX));
        }
      });
  });
  //req.write(data);
  req.end();

});


app.post("/deletePrato", function (req, res, next){
  var nome_cardapio = req.body.nome_cardapio;
  var data = querystring.stringify({
    "restaurante":  req.hestiasession.restaurante,
    "cardapio": nome_cardapio
  });
  var options = {
    host: API_URL,
    port: API_PORT,
    path: '/apihestia/deletePrato?restaurante='+req.hestiasession.restaurante+'&cardapio='+encodeURIComponent(nome_cardapio)+'&prato='+encodeURIComponent(req.body.prato)+'&categoria='+encodeURIComponent(req.body.nome_categoria),
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
        if(chunk == "Deletado"){
          var alertX = JSON.stringify({"msg": "<b>Prato</b> Deletado com <b>Sucesso</b>", "typeMsg": "success"});
          console.log("Prato deletado");
          res.send(JSON.parse(alertX));
        }else{
          console.log("fail: " + chunk);
          var alertX = JSON.stringify({"msg": "<b>Falha</b> ao deletar <b>Prato</b><br>ERRO: "+chunk, "typeMsg": "danger"});
          res.send(JSON.parse(alertX));
        }
      });
  });
  //req.write(data);
  req.end();

});

module.exports = app;
