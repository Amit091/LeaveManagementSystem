var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/holidays', function (req, res, next) {
    res.render('leave/holidays', { title: 'Holidays' });
});

/* GET home page. */
router.get('/leaveType', function (req, res, next) {
    res.render('leave/leaveType', { title: 'leave Types' });
});

// router.get('/list', function (req, res, next) {
//     res.render('leave/leaveList');
// });

// router.get('/add', function (req, res, next) {
//     res.render('leave/add');
// });


module.exports = router;
