var express = require('express');
var router = express.Router();
var holidaysController = require("./../controller/holidaysController");
const holidaysSQL = require('../helpers/Dao/holidaysSQL');
const hSQL = new holidaysSQL();


/* GET home page. */
router.get('/addholidays', async function (req, res, next) {
    let allresult = await hSQL.showHolidaysSQL();
    res.render('leave/holidays', { allresult });
});

router.post('/addholidays', holidaysController.createHolidays);

//edit holidays
router.get('/editholiday/:id', holidaysController.editHoliday);

//update holidays
router.post('/editholiday/:id', holidaysController.updateHoliday);

//delete holidays
router.get('/deleteholiday/:id', holidaysController.deleteHoliday);

/* GET home page. */
router.get('/leaveType', async function (req, res, next) {
    let allresult = await hSQL.showleavesSQL();
    res.render('leave/leaveType', { allresult });
});
//create leave
router.post('/leaveType', holidaysController.createLeave);

//edit leave
router.get('/editleave/:id', holidaysController.editLeave);

//update leave
router.post('/editleave/:id', holidaysController.updateLeave);

//delete leave
router.get('/deleteleave/:id', holidaysController.deleteLeave);


// router.get('/list', function (req, res, next) {
//     res.render('leave/leaveList');
// });

// router.get('/add', function (req, res, next) {
//     res.render('leave/add');
// });


module.exports = router;
