const gcon = require('../../config/DBConnection');
const query = require('../query/leave_record_query');
const query1 = require('../query/holiday_record');
const uQuery = require('../query/user_leave_list_query');


var con;

module.exports = class leaveSQL {
  async getALlLeaveType(){
    try {
      let con = await gcon();
            let status = await con.query(query.get_leave_record);
            status = JSON.parse(JSON.stringify(status));
            return  (status.length == 0)?'':status.reduce(item=>{
              return item;
        });  
    } catch (error) {
      console.log(error);      
    }
  }
  async getLeaveTypeDetail(type){
    try {
      let con = await gcon();
            let status = await con.query(query.get_leave_record_name,[type]);
            status = JSON.parse(JSON.stringify(status));
            return  (status.length == 0)?'':status.reduce(item=>{
              return item;
        });  
    } catch (error) {
      console.log(error);      
    }
  }
  async getAllholidays(stDate,eDate){
    try {
      let con = await gcon();
            let status = await con.query(query1.get_holidays_record_between_date,[stDate,eDate]);
            status = JSON.parse(JSON.stringify(status));
            return  (status.length == 0)?'':status;
    } catch (error) {
      console.log(error);      
    }
  }

  async getUserLeaveDetail(uid){
    try {
      let con = await gcon();
            let status = await con.query(uQuery.get_user_leave_record,[uid]);
            status = JSON.parse(JSON.stringify(status));
            return  (status.length == 0)?'':status.reduce(item=>{
                  return item;
            });            
    } catch (error) {
      console.log(error);      
    }
  }
};
