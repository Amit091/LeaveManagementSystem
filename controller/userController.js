const passport = require('passport');
const moment = require('moment');
const leave_SQL = require('../helpers/Dao/leave_form_SQL');
const leave_type_SQL = require('../helpers/Dao/Leave_type_SQL');
const userSQL = require('../helpers/Dao/users_SQL');
const holidaySQL = require('../helpers/Dao/holidaysSQL');
const lSQL = new leave_SQL();
const ltSQL = new leave_type_SQL();
const uSQL = new userSQL();
const hSQL = new holidaySQL();

var status = ['pending', 'accepted', 'rejected'];
var weekDay = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
var LP = { 'casual': 4, 'sick': 0, 'mourn': 0, 'marriage': 7, 'paternity': 15, 'maternity': 15, 'unpaid': 0 };

exports.getLogin = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      res.render('./user/login');
    } else {
      res.redirect('/user');
    }
  } catch (error) {
    console.log('error');
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    passport.authenticate('local', {
      successRedirect: '/user',
      failureRedirect: '/user/login',
      failureFlash: true
    })(req, res, next);
  } catch (error) {
    console.log('error');
  }
};

exports.getUserIndex = async (req, res) => {
  try {
    var ldd = await lSQL.getLeaveData();
    const list = await lSQL.getLeaveRecord4User(req.user.id, req.user.name);
    res.render('./user/userIndex', { list, ldd });
  } catch (error) {
    console.log('error');
  }
};

exports.getApplyLeave = async (req, res) => {
  try {
    var ldd = await filterLeaveType(req.user);
    res.render('./user/userApplyLeave', { ldd });
  } catch (error) {
    console.log('error');
  }
};

exports.postApplyLeave = async (req, res) => {
  try {
    const leave_data = req.body;
    const uid = req.user.id;
    let user = req.user;
    //data validation express validators
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
    console.log(req.body);
    var errors = req.validationErrors() || [];
    (req.user == 'undefined') ? errors.push({ 'param': 'data', 'msg': 'Invalid User Not Found' }) : '';
    ((req.body.leaveDay) <= 0 ? errors.push({ 'param': 'leaveDay', 'msg': 'Leave must be positive Number' }) : '');

    let monthDiff = diff_months(user.joined, new Date());
    //probation period 
    if (monthDiff <= 6) {
      if (leave_data.leaveType !== 'unpaid') errors.push({ 'param': 'Leave Type ', 'msg': 'Employee on Probation Period can only have Unpaid leave' });
    } else {
      //user gender validation 
      if (user.gender == 'male' && leave_data.leaveType == 'maternity') { errors.push({ 'param': 'leaveType', 'msg': 'No Maternity Leave for this employee' }); }
      else if (user.gender == 'female' && leave_data.leaveType == 'paternity') { errors.push({ 'param': 'leaveType', 'msg': 'No Paternity Leave for this employee' }); }
      else if (user.gender == 'other') errors.push({ 'param': 'user', 'msg': 'User Data Invalid' });
    }

    if (errors.length > 0) {
      res.render('./user/userApplyLeave', { errors, data: req.body, ldd: await filterLeaveType(req.user) });
      return;
    } else {
      console.log('i think validaiton done');
      console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~New session~~~~~~~~${new Date()}~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
      var leaveType = req.body.leaveType;
      leave_data.userid = user.id;
      leave_data.employeeName = user.name;
      console.log(leave_data);
      var userLeaveStatus = []; //to store leave date detail with holiday, weekend, leave type   
      var userLeaveData = [];
      var usl, uls;  //to store no of day of casual, leave unpaid and holiday
      //here goes code for user holidays validation
      usl = await calculateHoliday4Leave(leave_data.fromDate, leave_data.toDate, leaveType);
      uls = await calculateLeave(leave_data.fromDate, leave_data.toDate, usl, leaveType, user.id);
      if (uls.length != 2) {
        errors.push({ 'param': 'Internal Error', 'msg': 'Internal Server Error' });
        res.render('applyLeave/add', { errors, data: req.body, ldd: await filterLeaveType(req.user) });
        return;
      } else {
        userLeaveData = uls[0];
        userLeaveStatus = uls[1];
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
          await lSQL.addUserLeavRecordTemp(sql);
        }
        req.flash(
          "success_msg",
          `Leave Apply have been added to pending list`
        );
        res.redirect('/user');
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getApplyLeaveEdit = async (req, res) => {
  try {
    let id = req.params.form;
    let user = req.user;
    console.log(id);
    console.log(req.user);
    var data = await lSQL.getLeaveDataRecordByIdandUser(id, user.id);

    if (data == 0) {
      req.flash("error_msg", `Record does not Exist`);
      res.redirect('/asdasdasdasd');
    } else {
      res.render('./user/editApplyLeaveuser', { data, ldd: await filterLeaveType(req.user) });
    }
  } catch (error) {
    console.log(error);
  }
};

//updating the leave apply
exports.postApplyLeaveEdit = async (req, res) => {
  try {
    const leave_data = req.body;
    const uid = req.user.id;
    let user = req.user;
    let fid = req.params.form;
    //data validation express validators
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
    req.checkBody('id', 'Invalid User Leave Data').notEmpty().equals(req.params.form);

    console.log(req.body);
    var errors = req.validationErrors() || [];
    (req.user == 'undefined') ? errors.push({ 'param': 'data', 'msg': 'Invalid User Not Found' }) : '';
    ((req.body.leaveDay) <= 0 ? errors.push({ 'param': 'leaveDay', 'msg': 'Leave must be positive Number' }) : '');

    let monthDiff = diff_months(user.joined, new Date());
    //probation period 
    if (monthDiff <= 6) {
      if (leave_data.leaveType !== 'unpaid') errors.push({ 'param': 'Leave Type ', 'msg': 'Employee on Probation Period can only have Unpaid leave' });
    } else {
      //user gender validation 
      if (user.gender == 'male' && leave_data.leaveType == 'maternity') { errors.push({ 'param': 'leaveType', 'msg': 'No Maternity Leave for this employee' }); }
      else if (user.gender == 'female' && leave_data.leaveType == 'paternity') { errors.push({ 'param': 'leaveType', 'msg': 'No Paternity Leave for this employee' }); }
      else if (user.gender == 'other') errors.push({ 'param': 'user', 'msg': 'User Data Invalid' });
    }
    if (errors.length > 0) {
      res.render('./user/userApplyLeave', { errors, data: req.body, ldd: await filterLeaveType(req.user) });
      return;
    } else {
      let chkId = await lSQL.getLeaveRecordById(fid, user.id, user.name);      
      if (!chkId) {
        req.flash("error_msg", `Unable to Update data. Data Not Found`);
        res.redirect('/user/');
      } else {        
        console.log('i think validaiton done');
      console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~New session~~~~~~~~${new Date()}~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
      var leaveType = req.body.leaveType;
      leave_data.userid = user.id;
      leave_data.employeeName = user.name;
      var userLeaveStatus = []; //to store leave date detail with holiday, weekend, leave type   
      var userLeaveData = [];
      var usl, uls, flag = false;
      //here goes code for user holidays validation
      usl = await calculateHoliday4Leave(leave_data.fromDate, leave_data.toDate, leaveType);
      uls = await calculateLeave(leave_data.fromDate, leave_data.toDate, usl, leaveType,uid);
      if (uls.length != 2) {
        errors.push({ 'param': 'Internal Error', 'msg': 'Internal Server Error' });
        res.render('applyLeave/editUserLeaveForm', { errors, data: leave_data, ldd :await filterLeaveType(req.user) });
      } else{
        userLeaveData = uls[0];
        userLeaveStatus = uls[1];
        let form_status = await lSQL.updateAppliedLeave(leave_data, fid, uid);
        if (form_status != '' && form_status.affectedRows == 1 && form_status.changedRows == 1) {
          let count = await lSQL.countAppliedLeaveDetail(fid);
          if (count != 0) {
            let status = await lSQL.deleteAppliedLeaveDetail(fid);
          }
          //update leave record of each date
          let insertValues = userLeaveStatus.map((data) => {
            return `(${fid},'${data.date}','${data.isHoliday}',"${data.type}","${data.name}","${data.leave}")`;
          });
          let leave_detail = await lSQL.insertLeaveHolidaydata(insertValues);
          var sql = userLeaveData.map((data) => {
            return `(${uid},${fid},'${data.casual}','${data.sick}','${data.marriage}','${data.mourn}','${data.paternity}','${data.maternity}','${data.unpaid}','current_timestamp()')`;
          });
          console.log(sql);
          await lSQL.addUserLeavRecordTemp(sql);
          req.flash("success_msg", `Applied user leave Updated`);
          res.redirect('/user/');
        } else {
          req.flash("error_msg", `Unable to Update data`);
          res.redirect('/user/');
        }
        //done the else of if (uls.length != 2)
      }
    }}
    } catch (error) {
      console.log(error);
    }
  };


  /*
  exports.getLogin = async (req, res) => {
    try {
  var ldd = await filterLeaveType(req.user);
      res.render('./user/editApplyLeaveuser', { ldd });
    } catch (error) {
      console.log('error');
    }
  }
  */

  //helper function


  async function filterLeaveType(user) {
    try {
      var ldd;
      var leavedata = await lSQL.getLeaveData();
      let pp = diff_months(user.joined, new Date());
      if (pp <= 6) {
        console.log('only unpaid');
        ldd = leavedata.filter(data => {
          if (data.name == 'unpaid') {
            return data;
          }
        });
      } else {
        if (user.gender == 'male') {
          console.log('no materity');
          ldd = leavedata.filter(data => {
            if (data.name != 'maternity') {
              return data;
            }
          });
        }
        else if (user.gender == 'female') {
          ldd = leavedata.filter(data => {
            if (data.name != 'paternity') {
              return data;
            }
          });
        }
        else if (user.gender == 'other') {
          ldd = leavedata.filter(data => {
            if (data.name != 'paternity' || data.name != 'paternity') {
              return data;
            }
          });
        }
      }
      return ldd;
    } catch (error) {
      console.log(error);
    }
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
    var holidays = await hSQL.getAllholidays(startDate, endDate);
    //var holidays = await hSQL.getAllholidaystest(startDate, endDate);
    var hList = [];
    if (holidays != 0) {
      holidays.forEach(day => {
        if (moment(day.fDate).isSame(day.tDate)) {
          console.log('same date');
          hList.push({ 'date': day.fDate || day.tDate, 'type': day.type, 'name': day.name, 'desc': day.description });
        } else if (moment(day.tDate).isAfter(day.fDate)) {
          console.log('diff');
          let sDate = day.fDate;
          let eDate = day.tDate;
          do {
            hList.push({ 'date': sDate, 'type': day.type, 'name': day.name, 'desc': day.description });
            sDate = getDateFormat(moment(sDate).add(1, 'day'));
          } while (sDate <= eDate);
        }
      });
      hList = hList.filter(day => {
        if (moment(day.date).isSameOrAfter(startDate) && moment(day.date).isSameOrBefore(endDate)) {
          console.log(day.date);
          return day;
        }
      });
    }
    //to check the respective day with holiday and storing the date data to array i json form
    userLeaveStatus.forEach(leaveDay => {
      if (hList !== 0) {
        hList.forEach(holiday => {
          if (leaveDay.isHoliday) {
            leaveDay.isHoliday = true;
          }
          //check the range holiday by using new if for single data and multiple day
          else if (moment(holiday.date).isSame(moment(leaveDay.date))) {
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

  //to calculate the exact leave day
  async function calculateLeave(startDate, endDate, userLeaveStatus, type, uid) {
    console.log('initiate leave Calculation');
    var leaveRecord = [];
    var ull = await ltSQL.getUserLeaveDetail(uid);
    console.log(ull.maternity);
    console.log(type);
    var netCasualDay = calculateCasualDay(startDate, endDate);
    var leaveAbleDay = (netCasualDay < ull.casual) ? parseInt(ull.casual - netCasualDay) : 0;
    //var allowabaleCL = await checkCasualLeave(startDate);
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
          } else {
            unpaid++;
            leaveDay.leave = 'unpaid';
          }
          break;
        case 'unpaid':
          unpaid++;
          leaveDay.leave = 'unpaid';
          break;
        default:
          break;
      }
    });
    console.log();
    leaveRecord.push({ 'casual': casual, 'sick': sick, 'marriage': marriage, 'mourn': mourn, 'paternity': paternity, 'maternity': maternity, 'unpaid': unpaid, 'holiday': holiday });
    return [leaveRecord, userLeaveStatus];
  }

  function getWeekDay(date) {
    return weekDay[(moment(date).day())];
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
      return 0;
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

  function getDateFormat(date) {
    return moment(date).format('YYYY-MM-DD');
  }
  function calculateDayDiff(fromDate, toDate) {
    var dayDiff = (new Date(toDate).getTime() - new Date(fromDate).getTime()) / (1000 * 3600 * 24);
    console.log(dayDiff + 1);
    return dayDiff + 1;
  }

  function calculateNextDay(day) {
    var today = new Date();
    var dd = today.setDate(today.getDate() + day);
    return getDateFormat(today);
  }

  function getWeekDay(date) {
    return weekDay[(moment(date).day())];
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

  function getDateMonth(date) {
    return new Date(date).getMonth();
  }

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