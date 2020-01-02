var moment = require('moment');
const leave_SQL = require('../helpers/Dao/leave_form_SQL');
const leave_type_SQL = require('../helpers/Dao/Leave_type_SQL');
const userSQL = require('../helpers/Dao/users_SQL');


const lSQL = new leave_SQL();
const ltSQL = new leave_type_SQL();
const uSQL = new userSQL();

var status = ['pending', 'accepted', 'rejected'];
var weekDay = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
var LP = { 'casual': 4, 'sick': 0, 'mourn': 0, 'marriage': 7, 'paternity': 15, 'maternity': 15, 'unpaid': 0 };
var ldd;

exports.getApplyLeaveIndex = async (req, res) => {
  var ldd = await getLeaveData();
  const list = await lSQL.getLeaveRecord();
  res.render('applyLeave/leaveList', { list, status, ldd });
};

exports.getApplyLeave = async (req, res) => {
  var ldd = await getLeaveData();
  // console.log(ldd);
  res.render('applyLeave/add', { ldd });
};

async function checkDashianOrTiharMonth(name) {
  try {
    //to check the month is dashian or tihar month
    var prev = 0, next = 0, month;

    //check 
    var start = '2019-11-30';
    var end = '2019-12-01';
    var datearr = generateDateArray(startDate, endDate);
    var dSd = getDateMonth(start);
    var dEd = getDateMonth(end);
    if (dSd == dEd) {
      console.log('We have same month');
      month = dSd || dEd;
    } else {
      var temparr = generateDateArray(start, end);
      temparr.forEach(date => {
        let dat = getDateMonth(date.date);
        if (dat == dSd) prev++;
        else if (dat == dEd) next++;
      });
      if (prev > next) console.log('it is in prev month');
      else if (prev <= next) console.log('it is in next month');
      month = (prev > next) ? dSd : dEd;
    }
    return month;
  } catch (error) {
    console.log(error);
  }
}

async function checkCasualLeave(date) {
  const dm = await checkDashianOrTiharMonth('dashian');
  const tm = await checkDashianOrTiharMonth('tihar');
  const cm = getDateMonth(date);
  if (cm == dm && cm == tm) {
    console.log('ony 1 day have both dashian');
    return 1;
  }
  else if (cm == dm) {
    console.log('only  1  day dashain only');
    return 1;
  }
  else if (cm == tm) {
    console.log('only  2 day tihar only');
    return 2;
  }
  else {
    console.log('as much');
    return 0;
  }
}

function getDateMonth(date) {
  return new Date(date).getMonth();
}

//calculate the next day by adding the params no.of day
function calculateNextDay(day) {
  var today = new Date();
  var dd = today.setDate(today.getDate() + day);
  return getDateFormat(today);
}

function calculateDayDiff(fromDate, toDate) {
  var dayDiff = (new Date(toDate).getTime() - new Date(fromDate).getTime()) / (1000 * 3600 * 24);
  console.log(dayDiff + 1);
  return dayDiff + 1;
}

exports.addApplyLeave = async (req, res) => {
  try {
    //check whether the date applied meet the requirement for leave apply
    const leave_data = req.body;
    const uid = req.body.userid;
    //console.log(leave_data);
    //data validation express validators
    req.checkBody('employeeName', 'Employee Name Required').notEmpty();
    req.checkBody('leaveType', 'Select specific LeaveType').notEmpty();
    //Date part
    req.checkBody('fromDate', 'Date not select').notEmpty();
    req.checkBody('fromDate', 'Date not select URI').isISO8601();
    //req.checkBody('fromDate', 'from date of leave must be valid and must be after today date').isAfter((new Date()).toDateString());
    req.checkBody('fromDate', `From date of leave must be valid and after ${LP[`${req.body.leaveType}`]} day from today`).isAfter(new Date(calculateNextDay(LP[`${req.body.leaveType}`] - 1)).toDateString());
    req.checkBody('toDate', 'Date not selected').notEmpty();
    req.checkBody('toDate', 'End date of leave must be valid and after start date').isAfter((new Date(req.body.fromDate)).toDateString());
    // req.checkBody('toDate', 'End date of lab must be valid and after start date').isAfter((new Date()).toDateString());
    req.checkBody('leaveDay', 'No. of Days of  Leave is Empty').notEmpty();
    req.checkBody('leaveDay', 'No. of Days of  Leave is Empty').isNumeric();
    let days = calculateDayDiff(req.body.fromDate, req.body.toDate);
    req.checkBody('leaveDay', 'Invalid Record').equals(days.toString());
    req.checkBody('leaveReason', 'Reason should not be empty').notEmpty();

    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    var fromDateFormat = new Date(req.body.fromDate);
    var toDateFormat = new Date(req.body.toDate);
    //(!is_date(fromDateFormat)) ? errors.push({ 'param': 'fromDate', 'msg': 'Invalid From-Date Format' }) : (!(is_date_valid(fromDateFormat)) ? errors.push({ 'param': 'fromDate', 'msg': 'Invalid Date ! From Date Should not be before today' }) : '');
    //(!is_date(toDateFormat)) ? errors.push({ 'param': 'fromDate', 'msg': 'Invalid To-Date Format' }) : (!(is_date_valid(toDateFormat)) ? errors.push({ 'param': 'toDate ', 'msg': 'Invalid  Date! Date Should not be before today' }) : '');
    var errors = req.validationErrors() || [];
    ((req.body.leaveDay) <= 0 ? errors.push({ 'param': 'leaveDay', 'msg': 'Leave must be positive Number' }) : '');


    /************************data valdiation************************** */

    let user = await uSQL.getUserByName(leave_data.employeeName);
    let useri = await uSQL.getUserById(leave_data.userid);

    //checking the leve type validation for progression period employee and leave for male and female employeee
    if (JSON.stringify(user) !== JSON.stringify(useri)) {
      errors.push({ 'param': 'Form Data', 'msg': 'Invalid Data or Data not Found' });
    } else {
      //console.log((JSON.stringify(user) === JSON.stringify(useri)));
      let monthDiff = diff_months(user.joined, new Date());

      //probation period 
      if (monthDiff < 6) {
        if (leave_data.leaveType !== 'unpaid') errors.push({ 'param': 'Leave Type ', 'msg': 'Employee on Probation Period can only have Unpaid leave' });
      } else {
        //user gender validation    
        if (user.gender == leave_data.usergender) {
          if (user.gender == 'male' && leave_data.leaveType == 'maternity') { errors.push({ 'param': 'leaveType', 'msg': 'No Maternity Leave for this employee' }); }
          else if (user.gender == 'female' && leave_data.leaveType == 'paternity') { errors.push({ 'param': 'leaveType', 'msg': 'No Paternity Leave for this employee' }); }
          else if (user.gender == 'other') errors.push({ 'param': 'user', 'msg': 'User Data Invalid' });
        } else {
          errors.push({ 'param': 'user', 'msg': 'Invalid User Data' });
        }
      }
    }
    //checkLeaveApplyDay();
    var ldd = await lSQL.getLeaveData();
    if (errors.length > 0) {
      res.render('applyLeave/add', { errors, data: leave_data, ldd });
      return;
    } else {
      console.log('i think validaiton done');
    //   res.send(req.body);
    // }
    
    // return;

    // console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~New session~~~~~~~~${new Date()}~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
    // // //let user_data = await 
    // // res.send(leave_data);
    // // //res.render('applyLeave/add', { errors, data: leave_data, ldd });
    // // return;
    // if (errors.length > 0) {
    //   res.render('applyLeave/add', { errors, data: leave_data, ldd });
    //   return;
    // } else {
      var leaveType = req.body.leaveType;
      var userLeaveStatus = []; //to store leave date detail with holiday, weekend, leave type   
      var userLeaveData = [];
      var usl, uls;  //to store no of day of casual, leave unpaid and holiday
      //here goes code for user holidays validation
      usl = await calculateHoliday4Leave(leave_data.fromDate, leave_data.toDate, leaveType);
      uls = await calculateLeave(leave_data.fromDate, leave_data.toDate, usl, leaveType, leave_data.userid);
      if (uls.length != 2) {
        errors.push({ 'param': 'Internal Error', 'msg': 'Internal Server Error' });
        res.render('applyLeave/add', { errors, data: leave_data, ldd });
      } else {
        userLeaveData = uls[0];
        userLeaveStatus = uls[1];
        console.log(userLeaveData);
        //  var jsonSql = userLeaveData.map((data)=>{
        //    return ``
        //  });
        console.log(userLeaveData);
        let form_status = await lSQL.saveLeaveForm(leave_data);
        if (form_status.affectedRows == 1) {
          let insertValues = userLeaveStatus.map((data) => {
            return `(${form_status.insertId},'${data.date}','${data.isHoliday}',"${data.type}","${data.name}","${data.leave}")`;
          });
          let leave_detail = await lSQL.insertLeaveHolidaydata(insertValues);
          console.log('*********************');
          console.log(userLeaveData);

          var sql = userLeaveData.map((data) => {
            return `(${uid},${form_status.insertId},'${data.casual}','${data.sick}','${data.marriage}','${data.mourn}','${data.paternity}','${data.maternity}','${data.unpaid}','current_timestamp()')`;
          });
          console.log(sql);
          // //calculate the leave Data
          // if (leave_detail.insertId != 0) {
          //   let userLeave = await lSQL.updateUserLeavRecord(userLeaveData);
          //   console.log(userLeave);
          // }
          await lSQL.addUserLeavRecordTemp(sql);
        }
        // res.send(leave_data);
        req.flash(
          "success_msg",
          `Leave Apply have been added to pending list`
        );
        res.redirect('/applyleave/list');
      }
    }
  } catch (error) {
    console.log(error);
    // res.redirect('/applyleave/list',);
  }
};

exports.getApplyLeaveEdit = async (req, res) => {
  let id = req.params.id;
  var uid = req.query.uid;
  console.log(id + '-' + uid);
  var ldd = await getLeaveData();
  var data = await lSQL.getLeaveRecordById(id, uid);
  console.log(data);
  if (data == 0) {
    req.flash("error_msg", `Record does not Exist`);
    res.redirect('/applyleave');
  } else {
    res.render('applyLeave/editUserLeaveForm', { ldd, data });
  }
};

exports.UpdateApplyLeave = async (req, res) => {
  try {
    let fid = req.params.id;
    let uid = req.query.uid;
    let leave_data = req.body;
    console.log(fid);
    let chkId = await lSQL.getLeaveRecordById(fid, uid);
    if (!chkId) {
      req.flash("error_msg", `Unable to Update data`);
      res.redirect('/applyleave/');
    } else {
      //data validation
      req.checkBody('employeeName', 'Employee Name Required').notEmpty();
      req.checkBody('leaveDay', 'No. of Days of  Leave is Empty').notEmpty();
      req.checkBody('leaveDay', 'No. of Days of  Leave is Empty').isNumeric();
      req.checkBody('leaveType', 'Select specific LeaveType').notEmpty();
      req.checkBody('leaveReason', 'Reason shouldnot be empty').notEmpty();
      //Date part
      req.checkBody('fromDate', 'Date not select').notEmpty();
      req.checkBody('fromDate', 'Date not select URI').isISO8601();
      //req.checkBody('fromDate', 'from date of leave must be valid and must be after today date').isAfter((new Date()).toDateString());
      req.checkBody('toDate', 'Date not selected').notEmpty();
      req.checkBody('toDate', 'End date of leave must be valid and after start date').isAfter((new Date(req.body.fromDate)).toDateString());
      // req.checkBody('toDate', 'End date of lab must be valid and after start date').isAfter((new Date()).toDateString());
      console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~New session~~~~~~~~${new Date()}~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
      var errors = req.validationErrors() || [];
      ((req.body.leaveDay) <= 0 ? errors.push({ 'param': 'leaveDay', 'msg': 'Leave must be positive Number' }) : '');
      var fromDate = req.body.fromDate;
      var toDate = req.body.toDate;
      var fromDateFormat = new Date(req.body.fromDate);
      var toDateFormat = new Date(req.body.toDate);

      (!is_date(fromDateFormat)) ? errors.push({ 'param': 'fromDate', 'msg': 'Invalid From-Date Format' }) : (!(is_date_valid(fromDateFormat)) ? errors.push({ 'param': 'fromDate', 'msg': 'Invalid Date ! From Date Should not be before today' }) : '');
      (!is_date(toDateFormat)) ? errors.push({ 'param': 'fromDate', 'msg': 'Invalid To-Date Format' }) : (!(is_date_valid(toDateFormat)) ? errors.push({ 'param': 'toDate ', 'msg': 'Invalid  Date! Date Should not be before today' }) : '');

      console.log(errors);
      let ldd = await lSQL.getLeaveData();
      if (errors.length > 0) {
        res.render('applyLeave/editUserLeaveForm', { errors, data: leave_data, ldd });
      } else {
        const leave_data = req.body;
        var leaveType = req.body.leaveType;
        var userLeaveStatus = []; //to store leave date detail with holiday, weekend, leave type   
        var userLeaveData = [];
        var usl, uls, flag = false;  //to store no of day of casual, leave unpaid and holiday

        //here goes code for user holidays validation
        usl = await calculateHoliday4Leave(leave_data.fromDate, leave_data.toDate, leaveType);
        uls = await calculateLeave(leave_data.fromDate, leave_data.toDate, usl, leaveType);
        if (uls.length != 2) {
          errors.push({ 'param': 'Internal Error', 'msg': 'Internal Server Error' });
          res.render('applyLeave/editUserLeaveForm', { errors, data: leave_data, ldd });
        } else {
          userLeaveData = uls[0];
          userLeaveStatus = uls[1];
          let form_status = await lSQL.updateAppliedLeave(leave_data, fid, uid);
          if (form_status != '' && form_status.affectedRows == 1 && form_status.changedRows == 1) {
            let count = await lSQL.countAppliedLeaveDetail(fid);
            if (count != 0) {
              let status = await lSQL.deleteAppliedLeaveDetail(fid);
            }
            //update leave record
            let insertValues = userLeaveStatus.map((data) => {
              return `(${fid},'${data.date}','${data.isHoliday}',"${data.type}","${data.name}","${data.leave}")`;
            });
            let leave_detail = await lSQL.insertLeaveHolidaydata(insertValues);
            // console.log('*********************');
            // console.log(userLeaveData);  
            var sql = userLeaveData.map((data) => {
              return `(${uid},${fid},'${data.casual}','${data.sick}','${data.marriage}','${data.mourn}','${data.paternity}','${data.maternity}','${data.unpaid}','current_timestamp()')`;
            });
            console.log(sql);
            await lSQL.addUserLeavRecordTemp(sql);
            req.flash("success_msg", `Applied user leave Updated`);
            res.redirect('/applyleave/');
          } else {
            req.flash("error_msg", `Unable to Update data`);
            res.redirect('/applyleave/');
          }
          //done the else of if (uls.length != 2) 
        }
      }
      //res.send(req.body);
    }
  } catch (error) {
    console.log(error);
  }
};

function getDateFormat(date) {
  return moment(date).format('YYYY-MM-DD');
}

//calculate remaining casual day
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

//generate date array from start to end
function generateDateArray(startDate, endDate) {
  var result = [];
  do {
    result.push({ 'date': startDate, 'weekDay': getWeekDay(startDate) });
    startDate = getDateFormat(moment(startDate).add(1, 'day'));
  } while (startDate <= endDate);
  return result;
}

//to get date with holiday detail
async function calculateHoliday4Leave(startDate, endDate, flag) {
  var userLeaveStatus = generateDateArray(startDate, endDate);
  var holidays = await ltSQL.getAllholidays(startDate, endDate);

  //to check the respective day with holiday and storing the date data to array i json form
  userLeaveStatus.forEach(leaveDay => {
    if (holidays !== 0) {
      holidays.forEach(holiday => {
        if (leaveDay.isHoliday) {
          leaveDay.isHoliday = true;
        }
        //check the range holiday by using new if for single data and multiple day
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
    if ((moment(leaveDay.date).day() == 0 || moment(leaveDay.date).day() == 6)) {//&& !leaveDay.isHoliday
      leaveDay.isHoliday = true;
      leaveDay.type = 'weekend';
      leaveDay.name = getWeekDay(leaveDay.date);
    }
  });
  return userLeaveStatus;
}

function getWeekDay(date) {
  return weekDay[(moment(date).day())];
}

//to calculate the exact leave day
async function calculateLeave(startDate, endDate, userLeaveStatus, type, uid) {
  console.log('initiate leave Calculation');
  var leaveRecord = [];
  var ull = await ltSQL.getUserLeaveDetail(1);
  var netCasualDay = calculateCasualDay(startDate, endDate);
  var leaveAbleDay = (netCasualDay < ull.casual) ? parseInt(ull.casual - netCasualDay) : 0;
  var allowabaleCL = await checkCasualLeave(startDate);
  //checking casual leave
  var casual = 0, sick = 0, marriage = 0, mourn = 0, paternity = 0, maternity = 0, unpaid = 0, holiday = 0;
  userLeaveStatus.forEach(leaveDay => {
    switch (type) {
      case 'casual':
        console.log('casual');
        if (leaveDay.isHoliday) {
          holiday++;
          leaveDay.leave = 'holiday';
        } else {
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
        break;
      case 'sick':
        if (leaveDay.isHoliday) {
          holiday++;
          leaveDay.leave = 'holiday';
        } else {
          console.log(ull.sick);
          if (ull.sick != 0) {
            ull.sick--;
            sick++;
            leaveDay.leave = 'sick';
          }
          else if (ull.sick == 0) {
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
        }
        break;
      // for marriage leave type
      case 'marriage':
        if (leaveDay.isHoliday) {
          holiday++;
          leaveDay.leave = 'holiday';
        } else {
          if (ull.marriage != 0) {
            ull.marriage--;
            marriage++;
            leaveDay.leave = 'marriage';
          } else {
            unpaid++;
            leaveDay.leave = 'unpaid';
          }
        }
        break;
      case 'mourn':
        if (leaveDay.isHoliday) {
          holiday++;
          leaveDay.leave = 'holiday';
        } else {
          if (ull.mourn != 0) {
            ull.mourn--;
            mourn++;
            leaveDay.leave = 'mourn';
          } else {
            unpaid++;
            leaveDay.leave = 'unpaid';
          }
        }
        break;
      case 'paternity':
        if (ull.paternity != 0) {
          ull.paternity--;
          paternity++;
          leaveDay.leave = 'paternity';
        } else {
          unpaid++;
          leaveDay.leave = 'unpaid';
        }
        break;
      case 'maternity':
        if (ull.maternity != 0) {
          ull.maternity--;
          maternity++;
          leaveDay.leave = 'maternity';
        } {
          unpaid++;
          leaveDay.leave = 'unpaid';
        }
        break;
      default:
        unpaid++;
        leaveDay.leave = 'unpaid';
        break;
    }
  });
  console.log();
  leaveRecord.push({ 'casual': casual, 'sick': sick, 'marriage': marriage, 'mourn': mourn, 'paternity': paternity, 'maternity': maternity, 'unpaid': unpaid, 'holiday': holiday });
  return [leaveRecord, userLeaveStatus];
}

async function getLeaveData() {
  try {
    return await lSQL.getLeaveData();
  } catch (error) {
    console.log(error);
  }
}


function diff_months(startDate, endDate) {
  if (moment(endDate).isAfter(startDate)) {
    let diff = moment(endDate).diff(moment(startDate), 'months', true);
    diff = Math.abs(diff);
    return diff;
  } else {
    return 99;
  }
}

function diff_day(startDate, endDate) {
  if (moment(endDate).isAfter(startDate)) {
    let diff = moment(endDate).diff(moment(startDate), 'days', true);
    diff = Math.ceil(Math.abs(diff));
    return diff;
  } else {
    return 99;
  }
}

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

var is_date = function (input) {
  if (Object.prototype.toString.call(input) === "[object Date]")
    return true;
  return false;
};
