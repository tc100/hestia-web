var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante}});
});

module.exports = router;
