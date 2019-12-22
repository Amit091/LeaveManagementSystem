const leaveTypeSQL = require('../helpers/Dao/leaveTypeSQL');
const lSQL = new leaveTypeSQL();

//get leaveType index
exports.getLeaveTypeIndex = async(req,res)=>{
    try {
        let allresult = await lSQL.showleavesSQL();
        res.render('leaveType/leaveType', { allresult });
    } catch (error) {
        console.log(error);        
    }
};

exports.createLeave = async (req, res) => {
  //data validation
  try {
      req.checkBody('name', 'Employee Name Required').notEmpty();
      var errors = req.validationErrors();
      errors = [];
      let leaveName = await lSQL.getLeaveByName(req.body);
      if (leaveName != "") {
          errors.push({ 'param': 'name', 'msg': 'Leave with this name already exists' });
          console.log(errors);
          let allresult = await lSQL.showleavesSQL();
          if (errors.length > 0) {
              res.render('leaveType/leaveType', { allresult, errors });
          }
      }
      else {
          await lSQL.createLeaveSQL(req.body);
          let allresult = await lSQL.showleavesSQL();
          res.redirect('/leavetype');
      }
  } catch (error) {
      console.log(error);
  }
    };

exports.geteditLeave = async (req, res) => {
  try {
      id = req.params.id;
      let leave = await lSQL.getLeaveById(id);
      let allresult = await lSQL.showleavesSQL();
      res.render('leaveType/editleave', { leave, allresult });
  } catch (error) {
      console.log(error);
  }
};

exports.updateLeave = async (req, res) => {
  try {
      const id = req.params.id;
      let leaveName = await lSQL.getLeaveByName(req.body);
      if (leaveName != "") {
          let leave = await lSQL.getLeaveById(id);
          let allresult = await lSQL.showleavesSQL();
          if (req.body.name == leave.name) {
              await lSQL.updateLeaveSQL(id, req.body);
              res.redirect('/leavetype/');
          }
          else {
              var errors = req.validationErrors();
              errors = [];
              errors.push({ 'param': 'name', 'msg': 'Leave with this name already exists' });
              let leave = await lSQL.getLeaveById(id);
              let allresult = await lSQL.showleavesSQL();
              if (errors.length > 0) {
                  res.render('leaveType/editleave', { allresult, errors, leave });
              }
          }
      } else {
          await lSQL.updateLeaveSQL(id, req.body);
          let allresult = await lSQL.showleavesSQL();
          //res.render('leaveType/leaveType', { allresult });
          res.redirect('/leavetype/');
      }
  } catch (error) {
      console.log(error);
  }
};

exports.deleteLeave = async (req, res) => {
  try {
      const id = req.params.id;
      await lSQL.deleteLeaveSQL(id);
      res.redirect('/leavetype');
  } catch (error) {
      console.log(error);
  }
};