module.exports = {
  //count 
  count_data :`SELECT Count(*) AS count FROM leave_form`,
  //Create new leve Record
	 insert_leave_record: `INSERT INTO leave_form (employee_name, leave_day,leave_type_lists_id,start_date,end_date,leave_reason) VALUE (?,?,?,?,?,?)`,
	 get_leve_record:`SELECT *,DATE_FORMAT(l.start_date, "%D %b %y") as sDate,DATE_FORMAT(l.end_date, "%D %b %y") as eDate FROM leave_form AS l`

};