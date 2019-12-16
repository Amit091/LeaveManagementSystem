const gcon = require('../../config/DBConnection');
const query = require('../query/leave_form_query');
var con;

module.exports = class leaveSQL {
  async saveLeaveForm(leaveForm) {
    try {
      con = await gcon();
      console.log(query.insert_leave_apply_record, [leaveForm.employeeName, leaveForm.leaveType, leaveForm.fromDate, leaveForm.toDate, leaveForm.leaveDay, leaveForm.leaveReason]);
      console.log('*********************99966');
      
      let status = await con.query(query.insert_leave_apply_record, [leaveForm.employeeName, leaveForm.leaveType, leaveForm.fromDate, leaveForm.toDate, leaveForm.leaveDay,  leaveForm.leaveReason]);
      status = await JSON.parse(JSON.stringify(status));
      return status;
    } catch (error) {
      console.log(error);
    }
  }

  async insertLeaveHolidaydata(data){
    try {
      con = await gcon();
      console.log( `INSERT INTO leave_form_detail (leave_apply_id,date,holiday,type,name, leave_name) VALUES ${data}`);
      let sqlQuery = `INSERT INTO leave_form_detail (leave_apply_id,date,holiday,type,name, leave_name) VALUES ${data}`;
        //console.log(`${con.query(query.insert_user_leave_apply_detail,[data])}`);      
       let status = await con.query(sqlQuery);
       status = await JSON.parse(JSON.stringify(status));
      return status;
    } catch (error) {
      console.log(error);
    }
  }
  async getLeaveRecord(leaveForm) {
    try {
      con = await gcon();
      let status = await con.query(query.get_leve_record,[]);
      status = await JSON.parse(JSON.stringify(status));
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
      return status;
    } catch (error) {
      console.log(error);
    }
  }

  
  
};
