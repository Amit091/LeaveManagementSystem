exports.up = function (knex) {
  return knex.schema.createTable('leave_form', table => {
    table.increments('id').primary().notNullable();
    table.integer('employee_id', 10).notNullable();
    table.string(`employee_name`, 255).collate('utf8mb4_unicode_ci').notNullable();
    table.integer('leave_day', 10).notNullable();
    table.string(`leave_type`, 50).collate('utf8mb4_unicode_ci').notNullable();
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
    table.timestamp('apply_date').defaultTo(knex.fn.now());
    table.enum('status', ['pending','accept','reject']).defaultTo("pending").notNullable();
    table.text('leave_reason', ['longtext']).collate('utf8mb4_unicode_ci').notNullable();
    table.text('reject_reason', ['longtext']).collate('utf8mb4_unicode_ci').notNullable().defaultTo('not yet');
    table.timestamps({ useTz: true }).defaultTo(knex.fn.now());    
    table.text('data', ['longtext']).collate('utf8mb4_unicode_ci');
    table.engine('InnoDB');
    table.charset('utf8mb4')
    table.collate('utf8mb4_unicode_ci')
  });
};

exports.down = function (knex) {
  knex.schema.dropTable('leave_form')
};