module.exports={
  get_users:`SELECT *,DATE_FORMAT(u.joined,'%Y-%m-%d') as fjoined FROM users  AS u WHERE name LIKE ?`,
  get_all_users : `SELECT * FROM users`,
  get_user_detail: `SELECT * FROM users where id = ?`,
  get_user_detail_by_name: `SELECT * FROM users where name = ?`,
  get_user_detail_by_id_and_name: `SELECT * FROM users where id = ? AND name=?`
};