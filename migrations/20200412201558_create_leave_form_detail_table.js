exports.up = function (knex) {
  return knex.schema.createTable('leave_form_detail', table => {
    table.increments('id').primary().notNullable();
    table.integer('leave_apply_id', 10).notNullable();
    table.date('date').notNullable();
    table.enum('holiday', ['true', 'false']).defaultTo('false').notNullable();
    table.string('type', 255).notNullable();
    table.string('name', 255).notNullable();
    table.string('leave_name', 255);
    table.engine('InnoDB');
    table.charset('utf8mb4')
    table.collate('utf8mb4_unicode_ci')
  });
};

exports.down = function (knex) {
  knex.schema.dropTable('leave_form_detail')
};