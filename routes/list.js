var express = require('express');
var router = express.Router();

const leave_SQL = require('../helpers/Dao/leave_form_SQL');
const lSQL = new leave_SQL();

router.get('/', async(req, res, next)=> {
  const list = await lSQL.getLeaveRecord();
  res.render('leave/leaveList',{list});
});

router.get('/add', (req, res, next)=> {
  res.render('leave/add');
});

router.post('/add', async(req, res) => {
  try {
    
  //console.log(req.body);
  //data validation
  req.checkBody('employeeName', 'Employee Name Required').notEmpty();
  req.checkBody('leaveDay', 'No. of Days of  Leave is Empty').notEmpty();
  req.checkBody('leaveDay', 'No. of Days of  Leave is Empty').isNumeric();
  req.checkBody('leaveType', 'Select specific LeaveType').notEmpty();
  req.checkBody('fromDate', 'Date not select').notEmpty();
  req.checkBody('toDate', 'Date not selected').notEmpty();
  req.checkBody('leaveReason', 'Reason shouldnot be empty').notEmpty();
  var errors = req.validationErrors();
  ((req.body.leaveDay) <= 0 ? errors.push({ 'param': 'leaveDay', 'msg': 'Leave must be positive Number'}) : '');
  var fromDate = new Date(req.body.fromDate);
  var toDate = new Date(req.body.toDate);
  (!is_date(fromDate)) ? errors.push({ 'param': 'fromDate', 'msg': 'Invalid From-Date Format' }) : (!(is_date_valid(fromDate)) ? errors.push({ 'param': 'fromDate', 'msg': 'Invalid Date ! Date Should not be before today' }) : '');
  (!is_date(toDate)) ? errors.push({ 'param': 'fromDate', 'msg': 'Invalid To-Date Format' }) : (!(is_date_valid(toDate)) ? errors.push({ 'param': 'toDate ', 'msg': 'Invalid  Date! Date Should not be before today' }) : '');
  
  //Writing to DB
  const leave_data = req.body;
  console.log('-------------');
  let leaveStatus = await lSQL.saveLeaveForm(leave_data);
  console.log('mait');
  
console.log(leave_data);



  if (errors.length > 0) {
    res.render('leave/add', { errors });
  } else {
    res.send(req.body);
  }
  } catch (error) {
    console.log(error);    
  }
});

var is_date = function (input) {
  if (Object.prototype.toString.call(input) === "[object Date]")
    return true;
  return false;
};

var is_date_valid = (input) => {
  if (is_date(input)) {
    var date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    if (date.getTime() <= input.getTime() || date.getTime() == input.getTime()) {
      return true;
    } else {
      return false;
    }
  }

}
module.exports = router;