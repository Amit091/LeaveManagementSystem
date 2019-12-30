var express = require('express');
var router = express.Router();

/* GET calender */
router.get('/show', function (req, res, next) {
    res.render('calender/calender', { title: 'Express' });
});

module.exports = router;
