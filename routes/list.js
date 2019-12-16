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
  req.flash('success_msg', 'Data save');
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

    console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~New session~~~~~~~~${new Date}~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);

    var errors = req.validationErrors() || [];
    ((req.body.leaveDay) <= 0 ? errors.push({ 'param': 'leaveDay', 'msg': 'Leave must be positive Number' }) : '');
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    var fromDateFormat = new Date(req.body.fromDate);
    var toDateFormat = new Date(req.body.toDate);

    (!is_date(fromDateFormat)) ? errors.push({ 'param': 'fromDate', 'msg': 'Invalid From-Date Format' }) : (!(is_date_valid(fromDateFormat)) ? errors.push({ 'param': 'fromDate', 'msg': 'Invalid Date ! From Date Should not be before today' }) : '');
    (!is_date(toDateFormat)) ? errors.push({ 'param': 'fromDate', 'msg': 'Invalid To-Date Format' }) : (!(is_date_valid(toDateFormat)) ? errors.push({ 'param': 'toDate ', 'msg': 'Invalid  Date! Date Should not be before today' }) : '');

    /* After validation Work Validation for Work */
    const leave_data = req.body;
    var leaveType = req.body.leaveType;
    var userLeaveStatus = []; //to store leave date detail with holiday, weekend, leave type   
    var userLeaveData = [];
    var usl, uls;  //to store no of day of casual, leave unpaid and holiday

    //here goes code for user holidays validation
    //user leavye Status

    var ull = await ltSQL.getUserLeaveDetail(1);
    if (ull.casual == 0 && ull.sick == 0 && ull.marriage == 0 && ull.mourn == 0 && ull.paternity == 0 && ull.maternity == 0) {
      console.log('No Leave Remain');
      console.log('use unpaid leave');
      res.send(leave_data);
      return;
    } else {
      switch (leaveType) {
        case 'casual':
          console.log('casual leave');
          usl = await calculateHoliday4Leave(leave_data.fromDate, leave_data.toDate, leaveType);
          uls = await calculateLeave(leave_data.fromDate, leave_data.toDate, usl, ull, leaveType);
          break;
        case 'sick':
          usl = await calculateHoliday4Leave(leave_data.fromDate, leave_data.toDate, leaveType);
          uls = await calculateLeave(leave_data.fromDate, leave_data.toDate, usl, ull, leaveType);
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
          errors.push({ 'param': 'Leave_type', 'msg': 'Leave type not defined' });
          break;
      }
    }
    console.log(leave_data);
      userLeaveData = uls[0];
      userLeaveStatus = uls[1];
    
    // if (uls.length != 0) {
    //   errors.push({ 'param': 'Internal Error', 'msg': 'Internal Server Error' });
    // } else {
    //   userLeaveData = uls[0];
    //   userLeaveStatus = uls[1];
    // }
    if (errors.length > 0) {
      res.render('leave/add', { errors });
    } else {  
      let form_status = await lSQL.saveLeaveForm(leave_data);
      if(form_status.affectedRows == 1 && form_status.insertId !=0){
        let array=[];
        let insertValues = userLeaveStatus.map((data)=>{
        return `(${form_status.insertId},'${data.date}','${data.isHoliday}',"${data.type}","${data.name}","${data.leave}")`;
      })
      console.log('*************+++++++++++++++++*****************');
      
      console.log(insertValues);
      // console.log(insertValues.join(','));
      //  var query = insertValues.join(',');
       console.log(insertValues);
       
        
        let leave_detail = await lSQL.insertLeaveHolidaydata(insertValues);
        console.log(leave_detail);
        
      }
      
      res.send(leave_data)
      // req.flash('success_msg', 'Data save');
      // res.redirect('/list');
    }
  } catch (error) {
    console.log(error);
  }
});

function getDateFormat(date) {
  return moment(date).format('YYYY-MM-DD');
}
function calculateCasualDay(startDate, endDate) {
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  var year = ((startDate.getMonth() + 1) > 3) ? startDate.getFullYear() + 1 : startDate.getFullYear();
  var lastDate = year + '-' + '03' + '-' + '31';
  var fromMonth = new Date(lastDate) - new Date(startDate);
  var toMonth = new Date(lastDate) - new Date(endDate);
  var cL = Math.max(fromMonth, toMonth);
  cL = new Date(cL);
  return cL.getMonth();
}

async function calculateHoliday(startDate, endDate) {
  let holiday = await ltSQL.getAllholidays(startDate, endDate);
  if (holiday.length == 0) {
    return 0;
  } else {
    return holiday;
  }
}

function generateDateArray(startDate, endDate) {
  var result = [];
  var i = 0;
  do {
    console.log(i++);
    result.push({ 'date': startDate });
    startDate = getDateFormat(moment(startDate).add(1, 'day'));

  } while (startDate <= endDate);
  console.log(result);
  return result;
}

async function calculateHoliday4Leave(fromDate, toDate, flag) {
  var userLeaveStatus = generateDateArray(fromDate, toDate);
  var holidays = await calculateHoliday(fromDate, toDate, 'flag');
  //to check the respective day with holiday and storing the date data to array i json form
  userLeaveStatus.forEach(leaveDay => {
    if (holidays !== 0) {
      holidays.forEach(holiday => {
        if (leaveDay.isHoliday) {
          leaveDay.isHoliday = true;
        }
        else if (moment(holiday.dateFormat).isSame(moment(leaveDay.date))) {
          leaveDay.isHoliday = true;
          leaveDay.type = holiday.type;
          leaveDay.name = holiday.name;
        }
        else {
          leaveDay.isHoliday = false;
          leaveDay.type = 'none';
          leaveDay.name = 'none';
        }
      });
    } else {
      leaveDay.isHoliday = false;
      leaveDay.type = 'none';
      leaveDay.name = 'none';
    }
  });
  userLeaveStatus.forEach(leaveDay => {
    if ((moment(leaveDay.date).day() == 0 || moment(leaveDay.date).day() == 6) && !leaveDay.isHoliday) {
      leaveDay.isHoliday = true;
      leaveDay.type = 'weekend';
      leaveDay.name = weekDay[moment(leaveDay.date).day()];
    }
  });
  console.log(userLeaveStatus);
  return userLeaveStatus;
}

async function calculateLeave(startDate, endDate, userLeaveStatus, ull, type) {
  console.log('initiate leave Calculation');
  var leaveRecord = [];
  var netCasualDay = calculateCasualDay(startDate, endDate);
  var leaveAbleDay = (netCasualDay < ull.casual) ? parseInt(ull.casual - netCasualDay) : 0;
  var typeLeave = ull.sick;
  var flag = type;
  //checking casual leave
  var day = 0, casual = 0, unpaid = 0, holiday = 0;
  userLeaveStatus.forEach(leaveDay => {
    if (leaveDay.isHoliday) {
      leaveDay.leave = 'none';
      holiday++;
    }
    else if (leaveDay.isHoliday == false) {
      if (flag == 'sick') {
        if (typeLeave != 0) {
          typeLeave--;
          day++;
          leaveDay.leave = 'sick';
        }
        else if (typeLeave == 0) {
          if (leaveAbleDay != 0) {
            leaveAbleDay--;
            casual++;
            leaveDay.leave = 'casual';
          } else {
            unpaid++;
            leaveDay.leave = 'unpaid';
          }
        } else {
          unpaid++;
          leaveDay.leave = 'unpaid';
        }
      } else if (flag == 'casual') {
        if (leaveAbleDay != 0) {
          leaveAbleDay--;
          casual++;
          leaveDay.leave = 'casual';
        } else if (leaveAbleDay == 0) {
          unpaid++;
          leaveDay.leave = 'unpaid';
        }
        else {
          unpaid++;
          leaveDay.leave = 'unpaid';
        }
      }
    }
    else {
      unpaid++;
      leaveDay.leave = 'unpaid';
    }
  });
  leaveAbleDay = (netCasualDay < ull.casual) ? parseInt(ull.casual - netCasualDay) : 0;
  leaveRecord.push({ 'type': flag, 'day': day, 'casual': casual, 'unpaid': unpaid, 'holiday': holiday });
  console.log(leaveRecord);
  console.log(userLeaveStatus);
  return [leaveRecord, userLeaveStatus];
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