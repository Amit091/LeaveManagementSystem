var express = require('express');
var router = express.Router();
var holidayController = require("./../controller/holidayController");



/* GET home page. */
router.get('/', holidayController.getHolidayIndex);

router.post('/addholidays', holidayController.createHoliday);

//edit holidays
router.get('/editholiday/:id', holidayController.editHoliday);

//update holidays
router.post('/editholiday/:id', holidayController.updateHoliday);

//delete holidays
router.get('/deleteholiday/:id', holidayController.deleteHoliday);

//apply for float

router.get('/applyfloat', (req, res) => {
    res.render('holiday/applyFloat');
});
router.post('/applyfloat', holidayController.applyFloatLeave);



module.exports = router;
