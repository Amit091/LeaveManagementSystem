module.exports = {
  //count 
  count_data :`SELECT Count(*) AS count FROM leaves`,
  //Create new leve Record
	 insert_leave_record: `INSERT INTO leaves (employee_name, leave_day,leave_type,start_date,end_date,leave_reason) VALUE (?,?,?,?,?,?)`,
   get_leave_record:`SELECT * FROM leaves`,
   get_leave_record_name :`SELECT  * FROM leaves WHERE id = ?`

};