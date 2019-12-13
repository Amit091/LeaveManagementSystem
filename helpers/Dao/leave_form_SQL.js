const gcon = require('../../config/DBConnection');
const query = require('../query/leave_form_query');
var con;

module.exports = class leaveSQL {
  async saveLeaveForm(leaveForm) {
    try {
      con = await gcon();
      let status = await con.query(query.insert_leave_record, [leaveForm.employeeName, leaveForm.leaveDay, leaveForm.leaveType, leaveForm.fromDate, leaveForm.toDate, leaveForm.leaveReason]);
      console.log(status);
      return status;
    } catch (error) {
      console.log(error);
    }
  }
  async getLeaveRecord(leaveForm) {
    try {
      con = await gcon();
      let status = await con.query(query.get_leve_record);
      status = await JSON.parse(JSON.stringify(status));
      console.log(status);
      return status;
    } catch (error) {
      console.log(error);
    }
  }

  async getholidaysRecord(){
    try {
      con = await gcon();
      let status = await con.query(query.get_leve_record);
      status = await JSON.parse(JSON.stringify(status));
      console.log(status);
      return status;
    } catch (error) {
      console.log(error);
    }
  }
};
