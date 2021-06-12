module.exports = {
  //count 
  count_data :`SELECT Count(*) AS count FROM leave_form`,
  //Create new leve Record
	 insert_leave_record: `INSERT INTO leave_form (employee_name, leave_day,leave_type,start_date,end_date,leave_reason) VALUE (?,?,?,?,?,?)`,
   get_holidays_record:`SELECT *,DATE_FORMAT(H.date,"%Y-%m-%d") as dateFormat  FROM holidays AS H`,
   get_holidays_record_between_date : `SELECT *,DATE_FORMAT(H.date,"%Y-%m-%d") as dateFormat FROM holidays AS H WHERE H.date BETWEEN ? AND ? AND H.type = 'Public Holiday' ORDER BY H.date `

};