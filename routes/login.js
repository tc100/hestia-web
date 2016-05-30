var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http');
var querystring = require('querystring');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* GET Login. */
app.get('/', function(req, res, next) {
  res.render('login', { title: 'Hestia - Login' });
});

/*POST login*/
app.post("/", function (req, res, next) {

  login = req.body;

  var data = querystring.stringify({
    "login": login
  });

  var options = {
    host: 'localhost',
    port: 8080,
    path: '/apihestia/login?q='+JSON.stringify(login),
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
        if(chunk == "Found"){
          console.log("Achou");
          console.log("realizar aqui as validações de login");
          console.log("Redirecionar para o home logado");
          res.redirect("/funcionario?status=logado");
        }else{
          console.log("fail: " + chunk);
          res.redirect("/login?status=fail");
        }
      });
  });
  req.write(data);
  req.end();
});

module.exports = app  ;
