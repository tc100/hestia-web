var express = require('express');
var router = express.Router();

/* GET sobre page. */
router.get('/', function(req, res, next) {
  res.render('sobre', {user:{ name: req.hestiasession.name, restaurante: req.hestiasession.restaurante}});
});

module.exports = router;
