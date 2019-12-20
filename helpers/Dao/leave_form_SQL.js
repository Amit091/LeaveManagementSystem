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

async updateUserLeavRecord(data){
  try {
    con = await gcon();      
    console.log('*******************');
    console.log(data.unpaid);
    
    
    console.log(query.update_user_leave_record,[data.casual,data.sick]);
    
     let status = await con.query(query.update_user_leave_record,[data.casual,data.sick,data.marriage,data.mourn,data.paternity,data.maternity]);
     status = await JSON.parse(JSON.stringify(status));
    return status;
  } catch (error) {
    console.log(error);
  }
}

async addUserLeavRecordTemp(data){
  try {
    con = await gcon();      
    console.log('**********SQL*********');
    console.log(data);  
    let SQL = `INSERT INTO user_leave_detail_temp (user_id,leave_form,casual,sick,marriage,mourn,paternity,maternity,unpaid) VALUE ${data}`;
    
     let status = await con.query(SQL);
     status = await JSON.parse(JSON.stringify(status));
    return 'status';
  } catch (error) {
    console.log(error);
  }
}

  async getLeaveRecord(leaveForm) {
    try {
      con = await gcon();
      let status = await con.query(query.get_leve_record);
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

  async getLeaveData(){
    try {
      con = await gcon();
      let status = await con.query(query.get_leave_data);
      status = await JSON.parse(JSON.stringify(status));
      return status;
    } catch (error) {
      console.log(error);      
    }
  } 


  async getLeaveDataRecordByIdandUser(id,uid){
    try {
      con = await gcon();
      let status = await con.query(query.get_leave_data_by_id_and_employee,[id,uid]);
      status = await JSON.parse(JSON.stringify(status));
      return (status.length !=1)?0:status.reduce((data)=>{
        return data;
      });
    } catch (error) {
      console.log(error);      
    }
  } 

   async UpdateLeaveDataRecordStatus(data){
    try {
      con = await gcon();
      console.log(query.update_user_leave_apply_data,[data.status,data.reason,data.id,data.user]);
      
      let result = await con.query(query.update_user_leave_apply_data,[data.status,data.reason,data.id,data.user]);
      result = await JSON.parse(JSON.stringify(result));
      return result;
    } catch (error) {
      console.log(error);      
    }finally{
      con.close();
    }
  } 
  

  async getAllUser(user){
    try {
      con = await gcon();
      let status = await con.query("SELECT employee_id,employee_name FROM leave_form WHERE employee_name like '%"+user+"%'");
      status = await JSON.parse(JSON.stringify(status));
      return status;
     } catch (error) {
      console.log(error);      
    }
  } 

};
