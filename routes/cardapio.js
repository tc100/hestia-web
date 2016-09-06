var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http');
var querystring = require('querystring');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/* GET Pagina Cadastrar.*/
app.get('/', function(req, res, next) {
  var idRestaurante = req.hestiasession.restaurante;
  var nome = req.hestiasession.name;
  var options = {
    host: 'localhost',
    port: 8080,
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
          res.render('cardapio/index', {user:{ name: nome, restaurante: idRestaurante}, error: "erro ao conectar com o BD"});
        }else{
          console.log("cardapios: " + JSON.stringify(chunk));
          res.render('cardapio/index', {user:{ name: nome, restaurante: idRestaurante}, lista_cardapio: chunk});
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
  if(req.params.nome_cardapio == null || typeof req.params.nome_cardapio == "undefined")
    res.redirect("cardapio/index", {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante}});
  else{
    var nome_cardapio = req.params.nome_cardapio;
    var data = querystring.stringify({
      "restaurante":  idRestaurante,
      "cardapio": nome_cardapio
    });

    var options = {
      host: 'localhost',
      port: 8080,
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
            res.render('cardapio/editar', {user:{ name: nome, restaurante: idRestaurante}, cardapio: chunk});
          }
        });
    });
    req.write(data);
    req.end();

  }
});

app.post("/novo", function(req,res,next){
  var nome_restaurante = req.body.nome;
  var data = querystring.stringify({
    "restaurante":  req.hestiasession.restaurante,
    "cardapio": nome_restaurante
  });
  var options = {
    host: 'localhost',
    port: 8080,
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
          res.send({"nome": nome_restaurante, "categorias": []});
        }else{
          console.log("fail: " + chunk);
          res.redirect("/cadastrar?status=fail");
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
  console.log("acompanhamento: " + req.body.acompanhamento);
  var options = {
    host: 'localhost',
    port: 8080,
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
          console.log("Acompanhamento cadastrado");
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

app.post("/categoria", function (req, res, next){
  var nome_cardapio = req.body.nome_cardapio;
  var data = querystring.stringify({
    "restaurante":  req.hestiasession.restaurante,
    "cardapio": nome_cardapio
  });
  var options = {
    host: 'localhost',
    port: 8080,
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
          console.log("Categoria cadastrada");
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

app.post("/prato", function (req, res, next){
  var nome_cardapio = req.body.nome_cardapio;
  var data = querystring.stringify({
    "restaurante":  req.hestiasession.restaurante,
    "cardapio": nome_cardapio
  });

  var options = {
    host: 'localhost',
    port: 8080,
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
          console.log("Categoria cadastrada");
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
