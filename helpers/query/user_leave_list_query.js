module.exports = {
  //count 
  count_data :`SELECT Count(*) AS count FROM user_leave_detail`,
  //Create new leve Record
	 insert_leave_record: `INSERT INTO leaves (employee_name, leave_day,leave_type_lists_id,start_date,end_date,leave_reason) VALUE (?,?,?,?,?,?)`,
   get_user_leave_record:`SELECT * FROM user_leave_detail WHERE user_id=?`

};