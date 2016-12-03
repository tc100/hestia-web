var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http');
var request = require("request");


var API_URL = "https://hestia-api2.mybluemix.net";
//var API_URL = "localhost:6001";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* GET Login. */
app.get('/', function(req, res, next) {
  res.render('login', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante, privilegio: req.hestiasession.privilegio}});
});

/*POST login*/
app.post("/", function (req, res, next) {
  var login = {
    "login":req.body.login,
    "senha": req.body.senha
  };
  request.get(API_URL + '/apihestia/login?login='+ encodeURIComponent(JSON.stringify(login)), function (error, response, body) {
    if(!error){
      if(body == "NOTAUTHORIZED"){
        res.redirect("/login?status=NOTAUTHORIZED");
      }else if(response == "ERROR"){
        res.redirect("/login?status=ERROR");
      }else{
        var user = JSON.parse(body);
        res.redirect("/autorizado/"+JSON.stringify(user));
      }
    }else{
      console.log("error: " + error);
      res.redirect("/login?status=ERROR");
    }
  });
});

module.exports = app  ;
