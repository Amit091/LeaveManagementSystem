var express = require('express');
var router = express.Router();
var moment = require('moment');

const leave_SQL = require('../helpers/Dao/leave_form_SQL');
const leave_type_SQL = require('../helpers/Dao/Leave_type_SQL');


const lSQL = new leave_SQL();
const ltSQL = new leave_type_SQL();

var status = ['pending', 'accepted', 'rejected'];
var weekDay = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];


router.get('/', async (req, res, next) => {
  const list = await lSQL.getLeaveRecord();
  res.render('leave/leaveList', { list, status });
});

router.get('/add', (req, res, next) => {
  res.render('leave/add');
});

router.post('/add', async (req, res) => {
  try {
    //data validation
    req.checkBody('employeeName', 'Employee Name Required').notEmpty();
    req.checkBody('leaveDay', 'No. of Days of  Leave is Empty').notEmpty();
    req.checkBody('leaveDay', 'No. of Days of  Leave is Empty').isNumeric();
    req.checkBody('leaveType', 'Select specific LeaveType').notEmpty();
    req.checkBody('leaveReason', 'Reason shouldnot be empty').notEmpty();
    //Date part
    req.checkBody('fromDate', 'Date not select').notEmpty();
    req.checkBody('fromDate', 'Date not select URI').isISO8601();
    req.checkBody('fromDate', 'from date of leave must be valid and must be after today date').isAfter((new Date()).toDateString());
    req.checkBody('toDate', 'Date not selected').notEmpty();
    req.checkBody('toDate', 'End date of leave must be valid and after start date').isAfter((new Date(req.body.fromDate)).toDateString());
    req.checkBody('toDate', 'End date of lab must be valid and after start date').isAfter((new Date()).toDateString());
    var errors = req.validationErrors() || [];
    ((req.body.leaveDay) <= 0 ? errors.push({ 'param': 'leaveDay', 'msg': 'Leave must be positive Number' }) : '');
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    var fromDateFormat = new Date(req.body.fromDate);
    var toDateFormat = new Date(req.body.toDate);
    (!is_date(fromDateFormat)) ? errors.push({ 'param': 'fromDate', 'msg': 'Invalid From-Date Format' }) : (!(is_date_valid(fromDateFormat)) ? errors.push({ 'param': 'fromDate', 'msg': 'Invalid Date ! From Date Should not be before today' }) : '');
    (!is_date(toDateFormat)) ? errors.push({ 'param': 'fromDate', 'msg': 'Invalid To-Date Format' }) : (!(is_date_valid(toDateFormat)) ? errors.push({ 'param': 'toDate ', 'msg': 'Invalid  Date! Date Should not be before today' }) : '');

    /* After validation Work */
    //Writing to DB
    const leave_data = req.body;
    var leaveType = req.body.leaveType;
    console.log(leaveType);
    var leaveRecord = { 'leave': 5, 'casual': 5, 'unpaid': 5 };
    console.log(leaveRecord.casual);
    var dates = [];
     var userLeaveStatus = [];

    //here goes code for user holidays validation
    //user leavye Status

    let ull = await ltSQL.getUserLeaveDetail(1);
    if (ull.casual == 0 && ull.sick == 0 && ull.marriage == 0 && ull.mourn == 0 && ull.paternity == 0 && ull.maternity == 0) {
      console.log('No Leave Remain');
      console.log('use unpaid leave');
      res.send(leave_data);
      return;
    } else {
      switch (leaveType) {
        case 'casual':
          
          console.log('casual leave');
          console.log(moment(fromDateFormat).format('YYYY-MM-DD'));
          var casualLeave = calculateCasualDay(fromDateFormat, toDateFormat);
          var tempLeave = new Date(casualLeave).getMonth() + 1;
          console.log('casualLeave' + tempLeave);
          var holidays = await calculateHoliday(fromDate, toDate, 'casual');
          console.log(holidays); 
              
          //to check the respective day with holiday
          if(holidays != 0){
          do {           
            holidays.forEach(day=> {
              if (moment(day.dateFormat).isSame(getDateFormat(fromDate))) {
                console.log('no need of leave There is Holiday');
                userLeaveStatus.push({ 'date': fromDate, 'holiday': true ,'type':'holiday'});
                console.log(day.dateFormat);
              } else {
                console.log('no holiday');
                userLeaveStatus.push({ 'date': fromDate, 'holiday': false });
              }
            });
            fromDate = getDateFormat(moment(fromDate).add(1, 'day'));
            console.log(fromDate + 'no holiday');
          } while (fromDate <= toDate);
        }else{
          while(fromDate <= toDate){
          fromDate = getDateFormat(moment(fromDate).add(1, 'day'));
          userLeaveStatus.push({ 'date': fromDate, 'holiday': false ,'type':''});
          }
        }
          console.log(userLeaveStatus);
          //user leave status detail for weekend
          userLeaveStatus.forEach(day=>{
            if(moment(day.date).day() == 0 || moment(day.date).day()==6 ){
              console.log('This is weekend');
              day.holiday = true;
              day.type = 'holiday';
            }            
          });
          console.log(userLeaveStatus);
          console.log(ull.casual);
          console.log(fromDate);
          console.log(`+++++++++++++++++++++++`);
          
          fromDate = leave_data.fromDate;
          console.log(fromDate);
          console.log(calculateCasualDay(fromDate,toDate));
          var netCasualDay = calculateCasualDay(fromDate,toDate);
          if(netCasualDay < ull.casual){
            let temp =ull.casual - netCasualDay;
            console.log(temp+`  is a acasual day`);            
            console.log('casual Leave Accepted');            
          }else{
            console.log('Casual Leave is treate as unpaid leave');            
          }                                               
          break;
        case 'sick':
          console.log('sick leave');
          break;
        case 'marriage':
          console.log('marriage leave');
          break;
        case 'mourn':
          console.log('mourn leave');
          break;
        case 'paternity':
          console.log('paternity leave');
          break;
        case 'maternity':
          console.log('maternity leave');
          break;
        default:
          console.log('Unpaid leave');
          break;
      }
    }
    if (leaveType == "casual") {
      if (ull.casual == 0) {
        //use unpaid leave
      } else if (ull.casual < 9) {
        //deduct casual leave from 
      }

    }
    else if (leaveType == "sick") {
      if (ull.sick == 0 && ull.casual == 0) {
        //use casual leave
      } else if (ull.sick == 0 && ull.casual !== 0) {
        //use casualfunction();
      }
      //for sick code
    } else if (leaveType == "marriage") {
      //for marriage
    }
    else if (leaveType == "mourn") {
      //for mourn
    } else if (leaveType == "paternity") {

    }
    else if (leaveType == 'maternity') {

    }
    else {
      //for unpaid leave
    }


    // /* //get leave info from DB*/
    // console.log(`11111111111111111111111111`);

    // let leave = await ltSQL.getLeaveTypeDetail(leave_data.leaveType);
    // var leaveDay = leave.number;
    // let user_leave_list = await ltSQL.getUserLeaveDetail(1);
    // console.log(`************************************`);

    // console.log(user_leave_list);

    //checking if user have leave remaing for the type
    //if(userLeave.leave_data.leaveType){ check userleave }
    //if(override) then use casual leave 
    // ekse if use unpaid leave


    // console.log(`--------###################-------------`);





    // var dayofDate = new Date(fromDate).getDay();
    // console.log(weekDay[dayofDate]);

    // console.log(dbDate);
    // var dates = [];
    // fromDate = new Date(fromDate);
    // toDate = new Date(toDate);
    // while (fromDate <= toDate) {
    //   dates.push(fromDate);
    //   fromDate = addDays(fromDate);
    // }
    // console.log(dates);
    // console.log(dates.length);


    // console.log(fromDate);
    // console.log('-----------------');
    // var fDate = addDays(fromDate, 1);
    // console.log(fDate);

    // console.log(fromDate.setDate() + 1);


    // console.log(dates);

    // // console.log(userLeave.sick);

    // var l = leave.number;
    // console.log(l);
    // let dayDiff = (new Date(toDate) - new Date(fromDate)) / (1000 * 3600 * 24);
    // console.log(dayDiff);

    /*computation using leave type*/

    /*also checkthe public holiday*/

    //deduct3ed by that rsult

    //check whether the the leave have working holidays or non-working holidays

    //at last find the actual leave

    //let leaveStatus = await lSQL.saveLeaveForm(leave_data);
    // console.log('mait');

    // console.log(leave_data);
    if (errors.length > 0) {
      res.render('leave/add', { errors });
    } else {
      res.send(req.body);
    }
  } catch (error) {
    console.log(error);
  }
});

function getDateFormat(date) {
  return moment(date).format('YYYY-MM-DD');
}

function calculateCasualDay(fromDate, toDate) {
  fromDate = new Date(fromDate);
  toDate = new Date(toDate);  
  var year = ((fromDate.getMonth() + 1) > 3) ? fromDate.getFullYear() + 1 : formDate.getFullYear();
  var endDate = year + '-' + '03' + '-' + '31';
  var fromMonth = new Date(endDate) - new Date(fromDate);
  var toMonth = new Date(endDate) - new Date(toDate);
  var cL = Math.max(fromMonth, toMonth);
  cL= new Date(cL); 
  return cL.getMonth();
}

async function calculateHoliday(fromDate, toDate, flag) {
  var holidays = [];
  console.log(fromDate);
  let holiday = await ltSQL.getAllholidays(fromDate, toDate);
  if (holiday.length == 0) {
    console.log('No HoliDay');
    return 0;
  } else {
    console.log(holiday.length + 'days');
    return holiday;
  }
}


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
};
module.exports = router;