var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var http = require('http');
var session = require('client-sessions');
var cfenv = require('cfenv');


var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var cadastrar = require('./routes/cadastrar');
var funcionario = require('./routes/funcionario');
var cardapio = require('./routes/cardapio');
var perfil = require('./routes/perfil');
var restaurante = require('./routes/restaurante');
var home = require('./routes/home');
var mesas = require('./routes/mesas');
var pedidos = require('./routes/pedidos');
var financeiro = require('./routes/financeiro');

var app = express();
var appEnv = cfenv.getAppEnv();

// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  cookieName: 'hestiasession',
  secret: 'teste',
  duration: 7 * 24 * 60 * 60 * 1000
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/users', users);
app.use('/login', login);
app.use('/home', userValidation,home);
app.use('/cadastrar', cadastrar);
app.use('/perfil', userValidation,perfil);
app.use('/funcionario',userValidation,funcionario);
app.use('/cardapio', userValidation,cardapio);
app.use('/restaurante', userValidation, restaurante);
app.use('/mesas', userValidation, mesas);
app.use('/pedidos',userValidation, pedidos);
app.use('/financeiro',userValidation, financeiro);
app.use('/autorizado/:user', function(req,res){
  console.log("redirecionado..");
  var user = JSON.parse(req.params.user);
  req.hestiasession.name = user.nome;
  req.hestiasession.restaurante = user.restaurante;
  req.hestiasession.privilegio = user.privilegio;
  res.redirect("/funcionario");
});

app.use('/logout', function(req,res){
  req.hestiasession.reset();
  res.redirect('/login?status=logout');
})

function userValidation(req,res,next){
  if(!req.hestiasession.name){
    res.redirect("/login?status=sempermissao");
  }else{
    next();
  }
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

var server = app.listen(appEnv.port, '0.0.0.0', function() {
  console.log("server starting on " + appEnv.url);
});

module.exports = app;
