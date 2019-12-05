var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('leave/leaveList');
});

router.get('/add', function (req, res, next) {
  res.render('leave/add');
});

module.exports = router;