var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var http = require('http');
var request = require('got');

var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var cadastro = require('./routes/cadastro');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');;

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/login', login);
app.get('/cadastrar', function(req,res){
  res.render('cadastrar', { title: 'Hestia - Cadastrar' });
});

app.get("/cadastrarEstabelecimento", function(req,res){
  var request = require('request');
  request('http://localhost:8080/apihestia/estabelecimento?nome=Danilo&idade=23', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("Adicionado no banco:" + body); // Show the HTML for the Google homepage.
      res.status(200).send("Adicionado");
    }else{
      console.log("Erro ao adicionar: " + error);
    }
  });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
/*
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

*/


module.exports = app;
