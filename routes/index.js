var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hestia - O Restaurante em Suas Mãos' });
});

module.exports = router;
