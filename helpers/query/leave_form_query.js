module.exports = {
  //count 
  count_data :`SELECT Count(*) AS count FROM leave_form`,
  //Create new leve Record
	  insert_leave_record: `INSERT INTO leave_form (employee_name, leave_day,leave_type_lists_id,start_date,end_date,leave_reason) VALUE (?,?,?,?,?,?)`,
	  get_leve_record:`SELECT *,DATE_FORMAT(l.start_date, "%D %b %y") as sDate,DATE_FORMAT(l.end_date, "%D %b %y") as eDate FROM leave_form AS l`,
    insert_leave_apply_record:` INSERT INTO leave_form (employee_name,leave_type_lists_id,start_date,end_date,leave_day,leave_reason,userData) VALUE(?,?,?,?,?,?,?)` ,
    insert_user_leave_apply_detail: 'INSERT INTO leave_form_detail (leave_apply_id,date,holiday,type,name, leave_name) VALUES ?',
    update_user_leave_record:`UPDATE user_leave_detail SET casual=casual-?, sick=sick-?,marriage = marriage-?, mourn = mourn -?,paternity=paternity-?,maternity =maternity-? WHERE user_id = 1`,
    get_leave_data:`SELECT * FROM leaves`
};

/*  date: '2019-12-17',
    isHoliday: false,
    type: 'none',
    name: 'none',
    leave: 'sick',
    leave_id: 14 },*/