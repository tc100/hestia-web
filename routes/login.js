var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http');
var querystring = require('querystring');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* GET Login. */
app.get('/', function(req, res, next) {
  res.render('login', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante}});
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
          console.log("privilegio: " + JSON.stringify(user));
          res.redirect("/autorizado/"+JSON.stringify(user));
        }
      });
  });
  req.write(data);
  req.end();
});

module.exports = app  ;
