var express = require('express');
var router = express.Router();
var holidaysController = require("./../controller/holidaysController");
const holidaysSQL = require('../helpers/Dao/holidaysSQL');
const hSQL = new holidaysSQL();


/* GET home page. */
router.get('/addholidays', async function (req, res, next) {
    let allresult = await hSQL.showHolidaysSQL();
    console.log('-------------------');
    console.log(allresult);
    res.render('leave/holidays', { allresult });
});

router.post('/addholidays', holidaysController.createHolidays);

// router.get('/showholidays', holidaysController.showHolidays);



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
