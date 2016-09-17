var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var alertX = JSON.stringify({"msg": "null", "typeMsg": "null"});
  res.render('home', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante}, alert: alertX});
});

module.exports = router;
