module.exports = {
  //count 
  count_data :`SELECT Count(*) AS count FROM leave_form`,
  //Create new leve Record
	  insert_leave_record: `INSERT INTO leave_form (employee_name, leave_day,leave_type,start_date,end_date,leave_reason) VALUE (?,?,?,?,?,?)`,
    get_leve_record:`SELECT *,DATE_FORMAT(l.start_date, "%D %b %Y") as startDate,DATE_FORMAT(l.end_date, "%D %b %Y") as endDate,TIME_FORMAT(l.apply_date,"%I:%i:%s") AS applyTime,DATE_FORMAT(l.apply_date, "%D %b %Y") as applyDate FROM leave_form AS l`,
    get_leave_record_by_user_id_and_name:`SELECT *,DATE_FORMAT(l.start_date, "%D %b %Y") as startDate,DATE_FORMAT(l.end_date, "%D %b %Y") as endDate,TIME_FORMAT(l.apply_date,"%I:%i:%s") AS applyTime,DATE_FORMAT(l.apply_date, "%D %b %Y") as applyDate FROM leave_form AS l WHERE employee_id=? AND employee_name=?`,
    insert_leave_apply_record:` INSERT INTO leave_form (employee_id,employee_name,leave_type,start_date,end_date,leave_day,leave_reason) VALUE(?,?,?,?,?,?,?)` ,
    insert_user_leave_apply_detail: 'INSERT INTO leave_form_detail (leave_apply_id,date,holiday,type,name, leave_name) VALUES ?',
    update_user_leave_record:`UPDATE user_leave_detail SET casual=casual-?, sick=sick-?,marriage = marriage-?, mourn = mourn -?,paternity=paternity-?,maternity =maternity-? WHERE user_id = 1`,
    get_leave_data:`SELECT * FROM leaves`,
    add_user_temp_leave_data:`INSERT INTO user_leave_detail_temp (user_id,leave_form,casual,sick,marriage,mourn,paternity,maternity) VALUE (?)`,
    get_leave_by_id_userid_username:`SELECT *,DATE_FORMAT(l.start_date, "%Y-%m-%d") as startDate,DATE_FORMAT(l.end_date, "%Y-%m-%d") as endDate FROM leave_form AS l WHERE l.id = ? AND l.employee_id = ? AND l.status = 'pending'`,
    get_leave_data_by_id_and_employee : `SELECT *,DATE_FORMAT(l.start_date, "%Y-%m-%d") as startDate,DATE_FORMAT(l.end_date, "%Y-%m-%d") as endDate FROM leave_form AS l WHERE l.id = ? AND l.employee_id = ? AND l.employee_name=? AND l.status = 'pending'`,
    update_user_leave_apply_data:`UPDATE leave_form SET status = ? , reject_reason= ? WHERE id = ? AND employee_id = ?;`,
    get_all_user_data:`SELECT employee_id,employee_name FROM leave_form WHERE employee_name like '%?%'`,
    get_Apply_user_leave_data  :`SELECT * FROM leave_form WHERE id=? AND employee_id = ? AND status = 'pending`,
    update_apply_leave:`UPDATE leave_form SET leave_day = ?, leave_type=?,start_date=?,end_date=?,leave_reason=?,updated_at=current_timestamp() WHERE id=? AND employee_id = ?`,
    delete_all_record_from_form_detail :`DELETE from leave_form_detail where leave_apply_id = ?`,
    select_all_record_from_form_detail: `SELECT COUNT(*) AS count from leave_form_detail where leave_apply_id = ?`
  };