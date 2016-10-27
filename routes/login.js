var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http');
var querystring = require('querystring');

var API_URL = "localhost";
var API_PORT = 6001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* GET Login. */
app.get('/', function(req, res, next) {
  res.render('login', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante, privilegio: req.hestiasession.privilegio}});
});

/*POST login*/
app.post("/", function (req, res, next) {

  login = req.body;

  var data = querystring.stringify({
    "login": login
  });

  var options = {
    host: API_URL,
    port: API_PORT,
    path: '/apihestia/login?login='+JSON.stringify(login),
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
        if(chunk == "NOTAUTHORIZED"){
          res.redirect("/login?status=NOTAUTHORIZED");
        }else if(chunk == "ERROR"){
          res.redirect("/login?status=ERROR");
        }else{
          var user = JSON.parse(chunk);
          res.redirect("/autorizado/"+JSON.stringify(user));
        }
      });
  });
  req.write(data);
  req.end();
});

module.exports = app  ;
