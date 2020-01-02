const gcon = require('../../config/DBConnection');
const query = require('../query/tbl_users_query');
var con;

module.exports = class userSQL {
  async getAllUser(user) {
    try {
      con = await gcon();
      let status = await con.query(query.get_users,[user]);
      //console.log(status);
      status = await JSON.parse(JSON.stringify(status));
      return status;
    } catch (error) {
      console.log(error);
    }
  }

  async getUserByidandName(user) {
    try {
      con = await gcon();
      let status = await con.query(query.get_user_detail_by_id_and_name,[user.id,user.name]);
      // console.log(status);      
      status = await JSON.parse(JSON.stringify(status));
      return (status.length ==1)?status.reduce(data=>{
        return data;
      }):status;
    } catch (error) {
      console.log(error);
    }
  }

  async getUserByName(user) {
    try {
      con = await gcon();
      let status = await con.query(query.get_user_detail_by_name,[user]);
      status = await JSON.parse(JSON.stringify(status));
      //console.log(status.length);
      return (status.length ==1)?status.reduce(data=>{
        return data;
      }):status;
    } catch (error) {
      console.log(error);
    }
  }

  async getUserById(user) {
    try {
      con = await gcon();
      let status = await con.query(query.get_user_detail,[user]);
      //console.log(status);      
      status = await JSON.parse(JSON.stringify(status));
      return (status.length ==1)?status.reduce(data=>{
        return data;
      }):status;
    } catch (error) {
      console.log(error);
    }
  }
};