module.exports = {
  //count 
  count_data :`SELECT Count(*) AS count FROM leave_form`,
  // //
  // get_product_offset :`SELECT p.* , DATE_FORMAT(p.doa, "%D %b %Y") as fdoa ,c.name as category FROM tbl_product AS p INNER JOIN tbl_category AS c WHERE p.categoryID = c.id LIMIT ? OFFSET ?`,
  // //Create
	 insert_leave_record: `INSERT INTO leave_form (employee_name, leave_day,leave_type_lists_id,start_date,end_date,leave_reason) VALUE (?,?,?,?,?,?)`,
	 get_leve_record:`SELECT *,DATE_FORMAT(l.start_date, "%D %b %y") as sDate,DATE_FORMAT(l.end_date, "%D %b %y") as eDate FROM leave_form AS l`

};/*
DROP TABLE leave_form;
CREATE TABLE
IF NOT EXISTS `leave_form` (
	`id` int (10)  NOT NULL,
	`employee_name` VARCHAR (255)  NOT NULL,
	`leave_day` INT NOT NULL,
	`leave_type_lists_id` BIGINT (20)  NOT NULL,
	`start_date` date NOT NULL,
	`end_date` date NOT NULL,
	`description` text COLLATE utf8mb4_unicode_ci NOT NULL,
	`status` enum (
		'pending',
		'accept',
		'reject'
	) DEFAULT 'pending' COLLATE utf8mb4_unicode_ci NOT NULL,
	`leave_reason` VARCHAR (255) COLLATE utf8mb4_unicode_ci NOT NULL,
	`reject_reason` VARCHAR (255) COLLATE utf8mb4_unicode_ci NOT NULL,
	`created_at` TIMESTAMP NULL DEFAULT NULL,
	`updated_at` TIMESTAMP NULL DEFAULT NULL
) ENGINE = INNODB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;


-*/