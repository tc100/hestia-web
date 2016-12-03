var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http');
var querystring = require('querystring');
var request = require("request");

var API_URL = "https://hestia-api2.mybluemix.net";
//var API_URL = "localhost:6001";


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
  }else{
    request.get(API_URL + '/apihestia/cardapios?restaurante='+idRestaurante, function (error, response, body) {
      if(!error){
        if(body == "Fail"){
          console.log("fail: " + body);
          var alertX = JSON.stringify({"msg": "null", "typeMsg": "null"});
          res.render('cardapio/index', {user:{ name: nome, restaurante: idRestaurante, privilegio: privilegio}, alert: alertX, error: "erro ao conectar com o BD"});
        }else{
          var alertX = JSON.stringify({"msg": "null", "typeMsg": "null"});
          res.render('cardapio/index', {user:{ name: nome, restaurante: idRestaurante, privilegio: privilegio}, alert: alertX, lista_cardapio: body});
        }
      }else{
        res.send("ERROR");
      }
    });
  }

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
    request.get(API_URL + '/apihestia/cardapio?restaurante='+idRestaurante+'&cardapio='+ encodeURIComponent(nome_cardapio), function (error, response, body) {
      if(!error){
        if(body == "Fail"){
          console.log("fail: " + body);
          res.redirect("/cardapio");
        }else{
          var alertX = JSON.stringify({"msg": "null", "typeMsg": "null"});
          res.render('cardapio/editar', {user:{ name: nome, restaurante: idRestaurante}, cardapio: body, alert: alertX});
        }
      }else{
        res.send("ERROR");
      }
    });
  }
});

app.post("/clonar", function(req,res,next){
  var nome_clonar = req.body.nome_clonar;
  var nome_cardapio = req.body.novo_cardapio;

  request.post(API_URL + '/apihestia/cardapio/clonar?restaurante='+req.hestiasession.restaurante+'&novo_cardapio='+encodeURIComponent(nome_cardapio)+'&nome_clonar='+encodeURIComponent(nome_clonar), function (error, response, body) {
    if(!error){
      if(body == "Fail"){
        console.log("fail: " + body);
        var alertX = JSON.stringify({"msg": "<b>Erro</b> ao duplicar <b>Cardápio</b>", "typeMsg": "danger"});
        res.send({"alert": JSON.parse(alertX)});
      }else{
        console.log("Cardapio cadastrado");
        var alertX = JSON.stringify({"msg": "<b>Cardápio</b> duplicado com <b>Sucesso</b>", "typeMsg": "success"});
        res.send({"nome": nome_cardapio, "categorias": JSON.parse(body).categorias, "alert": JSON.parse(alertX)});
      }
    }else{
      res.send("ERROR");
    }
  });
});

app.post("/novo", function(req,res,next){
  var nome_restaurante = req.body.nome;

  request.post(API_URL + '/apihestia/cardapio/novo?restaurante='+req.hestiasession.restaurante+'&cardapio='+encodeURIComponent(nome_restaurante), function (error, response, body) {
    if(!error){
      if(body == "Cadastrado"){
        console.log("Cardapio cadastrado");
        var alertX = JSON.stringify({"msg": "<b>Cardápio</b> cadastrado com <b>Sucesso</b>", "typeMsg": "success"});
        res.send({"nome": nome_restaurante, "categorias": [], "alert": JSON.parse(alertX)});
      }else{
        console.log("fail: " + body);
        var alertX = JSON.stringify({"msg": "<b>Erro</b> ao cadastrar <b>Cardápio</b>", "typeMsg": "danger"});
        res.send({"alert": JSON.parse(alertX)});
      }
    }else{
      res.send("ERROR");
    }
  });
});

app.post("/acompanhamento", function (req, res, next){
  var nome_cardapio = req.body.nome_cardapio;

  request.post(API_URL + '/apihestia/acompanhamento?restaurante='+req.hestiasession.restaurante+'&cardapio='+encodeURIComponent(nome_cardapio)+'&acompanhamento='+encodeURIComponent(req.body.acompanhamento), function (error, response, body) {
    if(!error){
      if(body == "Cadastrado"){
        var alertX = JSON.stringify({"msg": "<b>Acompanhamento</b> Cadastrado com <b>Sucesso</b>", "typeMsg": "success"});
        console.log("Acompanhamento cadastrada");
        res.send(JSON.parse(alertX));
      }else{
        console.log("fail: " + body);
        var alertX = JSON.stringify({"msg": "<b>Falha</b> ao cadastrar <b>Acompanhamento</b><br>ERRO: "+body, "typeMsg": "danger"});
        res.send(JSON.parse(alertX));
      }
    }else{
      res.send("ERROR");
    }
  });
});


app.post("/editarAtivoCardapio", function (req, res, next){
  var nome_cardapio = req.body.nome_cardapio;

  request.post(API_URL + '/apihestia/editarAtivoCardapio?restaurante='+req.hestiasession.restaurante+'&cardapio='+encodeURIComponent(nome_cardapio)+'&ativo='+encodeURIComponent(req.body.ativo), function (error, response, body) {
    if(!error){
       if(body == "Alterado"){
          if(req.body.ativo == "true"){
            var alertX = JSON.stringify({"msg": "Cardapio <b>ativado</b> com <b>Sucesso</b>", "typeMsg": "success"});
            res.send(JSON.parse(alertX));
          }else{
            var alertX = JSON.stringify({"msg": "Cardapio <b>desativado</b> com <b>Sucesso</b>", "typeMsg": "success"});
            res.send(JSON.parse(alertX));
          }
        }else{
          console.log("fail: " + body);
          var alertX = JSON.stringify({"msg": "<b>Falha</b> ao ativar/desativar cardapio<br>ERRO: "+body, "typeMsg": "danger"});
          res.send(JSON.parse(alertX));
        }
    }else{
      res.send("ERROR");
    }
  });
});

app.post("/deleteAcompanhamento", function (req, res, next){
  var nome_cardapio = req.body.nome_cardapio;
  request.post(API_URL + '/apihestia/deleteAcompanhamento?restaurante='+req.hestiasession.restaurante+'&cardapio='+encodeURIComponent(nome_cardapio)+'&acompanhamento='+encodeURIComponent(req.body.acompanhamento), function (error, response, body) {
    if(!error){
      if(body == "Deletado"){
        var alertX = JSON.stringify({"msg": "<b>Acompanhamento</b> Deletado com <b>Sucesso</b>", "typeMsg": "success"});
        console.log("Acompanhamento deletado");
        res.send(JSON.parse(alertX));
      }else{
        console.log("fail: " + body);
        var alertX = JSON.stringify({"msg": "<b>Falha</b> ao cadastrar <b>Acompanhamento</b><br>ERRO: "+body, "typeMsg": "danger"});
        res.send(JSON.parse(alertX));
      }
    }else{
      res.send("ERROR");
    }
  });

});

app.post("/categoria", function (req, res, next){
  var nome_cardapio = req.body.nome_cardapio;

  request.post(API_URL + '/apihestia/categoria?restaurante='+req.hestiasession.restaurante+'&cardapio='+encodeURIComponent(nome_cardapio)+'&categoria='+encodeURIComponent(req.body.categoria), function (error, response, body) {
    if(!error){
      if(body == "Cadastrado"){
        var alertX = JSON.stringify({"msg": "<b>Categoria</b> Cadastrada com <b>Sucesso</b>", "typeMsg": "success"});
        console.log("Categoria cadastrada");
        res.send(JSON.parse(alertX));
      }else{
        console.log("fail: " + body);
        var alertX = JSON.stringify({"msg": "<b>Falha</b> ao cadastrar <b>Categoria</b><br>ERRO: "+body, "typeMsg": "danger"});
        res.send(JSON.parse(alertX));
      }
    }else{
      res.send("ERROR");
    }
  });

});

app.post("/deleteCategoria", function (req, res, next){
  var nome_cardapio = req.body.nome_cardapio;

  request.post(API_URL + '/apihestia/deleteCategoria?restaurante='+req.hestiasession.restaurante+'&cardapio='+encodeURIComponent(nome_cardapio)+'&categoria='+encodeURIComponent(req.body.categoria), function (error, response, body) {
    if(!error){
      if(body == "Deletado"){
        var alertX = JSON.stringify({"msg": "<b>Categoria</b> Deletada com <b>Sucesso</b>", "typeMsg": "success"});
        console.log("Categoria deletada");
        res.send(JSON.parse(alertX));
      }else{
        console.log("fail: " + body);
        var alertX = JSON.stringify({"msg": "<b>Falha</b> ao cadastrar <b>Categoria</b><br>ERRO: "+body, "typeMsg": "danger"});
        res.send(JSON.parse(alertX));
      }
    }else{
      res.send("ERROR");
    }
  });
});

app.post("/prato", function (req, res, next){
  var nome_cardapio = req.body.nome_cardapio;

  request.post(API_URL + '/apihestia/prato?restaurante='+req.hestiasession.restaurante+'&cardapio='+encodeURIComponent(nome_cardapio)+'&prato='+encodeURIComponent(req.body.prato)+'&categoria='+encodeURIComponent(req.body.nome_categoria)+"&editar="+encodeURIComponent(req.body.editar_prato), function (error, response, body) {
    if(!error){
      if(body == "Cadastrado"){
        var alertX = JSON.stringify({"msg": "<b>Prato</b> Cadastrado com <b>Sucesso</b>", "typeMsg": "success"});
        console.log("Prato cadastrado");
        res.send(JSON.parse(alertX));
      }else{
        console.log("fail: " + body);
        var alertX = JSON.stringify({"msg": "<b>Falha</b> ao cadastrar <b>Prato</b><br>ERRO: "+body, "typeMsg": "danger"});
        res.send(JSON.parse(alertX));
      }
    }else{
      res.send("ERROR");
    }
  });

});


app.post("/deletePrato", function (req, res, next){
  var nome_cardapio = req.body.nome_cardapio;

  request.post(API_URL + '/apihestia/deletePrato?restaurante='+req.hestiasession.restaurante+'&cardapio='+encodeURIComponent(nome_cardapio)+'&prato='+encodeURIComponent(req.body.prato)+'&categoria='+encodeURIComponent(req.body.nome_categoria), function (error, response, body) {
    if(!error){
      if(body == "Deletado"){
        var alertX = JSON.stringify({"msg": "<b>Prato</b> Deletado com <b>Sucesso</b>", "typeMsg": "success"});
        console.log("Prato deletado");
        res.send(JSON.parse(alertX));
      }else{
        console.log("fail: " + body);
        var alertX = JSON.stringify({"msg": "<b>Falha</b> ao deletar <b>Prato</b><br>ERRO: "+body, "typeMsg": "danger"});
        res.send(JSON.parse(alertX));
      }
    }else{
      res.send("ERROR");
    }
  });

});

module.exports = app;
