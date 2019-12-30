module.exports = {
  //count 
  count_data :`SELECT Count(*) AS count FROM leave_form`,
  //Create new leve Record
	  insert_leave_record: `INSERT INTO leave_form (employee_name, leave_day,leave_type,start_date,end_date,leave_reason) VALUE (?,?,?,?,?,?)`,
	  get_leve_record:`SELECT *,DATE_FORMAT(l.start_date, "%D %b %y") as sDate,DATE_FORMAT(l.end_date, "%D %b %y") as eDate,TIME_FORMAT(l.apply_date,"%I:%i:%s") AS aTime,DATE_FORMAT(l.apply_date, "%D %b %y") as aDate FROM leave_form AS l`,
    insert_leave_apply_record:` INSERT INTO leave_form (employee_id,employee_name,leave_type,start_date,end_date,leave_day,leave_reason) VALUE(?,?,?,?,?,?,?)` ,
    insert_user_leave_apply_detail: 'INSERT INTO leave_form_detail (leave_apply_id,date,holiday,type,name, leave_name) VALUES ?',
    update_user_leave_record:`UPDATE user_leave_detail SET casual=casual-?, sick=sick-?,marriage = marriage-?, mourn = mourn -?,paternity=paternity-?,maternity =maternity-? WHERE user_id = 1`,
    get_leave_data:`SELECT * FROM leaves`,
    add_user_temp_leave_data:`INSERT INTO user_leave_detail_temp (user_id,leave_form,casual,sick,marriage,mourn,paternity,maternity) VALUE (?)`,
    get_leave_data_by_id_and_employee : `SELECT *,DATE_FORMAT(l.start_date, "%Y-%m-%d") as sDate,DATE_FORMAT(l.end_date, "%Y-%m-%d") as eDate FROM leave_form AS l WHERE l.id = ? AND l.employee_id = ? AND l.status = 'pending'`,
    update_user_leave_apply_data:`UPDATE leave_form SET status = ? , reject_reason= ? WHERE id = ? AND employee_id = ?;`,
    get_all_user_data:`SELECT employee_id,employee_name FROM leave_form WHERE employee_name like '%?%'`,
    get_Apply_user_leave_data  :`SELECT * FROM leave_form WHERE id=? AND employee_id = ? AND status = 'pending`,
    update_apply_leave:`UPDATE leave_form SET leave_day = ?, leave_type=?,start_date=?,end_date=?,leave_reason=?,updated_at=current_timestamp() WHERE id=? AND employee_id = ?`,
    delete_all_record_from_form_detail :`DELETE from leave_form_detail where leave_apply_id = ?`,
    select_all_record_from_form_detail: `SELECT COUNT(*) AS count from leave_form_detail where leave_apply_id = ?`
  };
/*%H:%i: */
/*  date: '2019-12-17',
    isHoliday: false,
    type: 'none',
    name: 'none',
    leave: 'sick',
    leave_id: 14 },*/