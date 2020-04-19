exports.up = function (knex) {
  return knex.schema.createTable('user_leave_detail', table => {
    table.increments('id').primary().notNullable();
    table.integer('user_id', 10);
    table.integer('casual', 10).notNullable().defaultTo(12);
    table.integer('sick', 10).notNullable().defaultTo(3);
    table.integer('marriage', 10).notNullable().defaultTo(10);
    table.integer('mourn', 10).notNullable().defaultTo(13);
    table.integer('paterinty', 10).notNullable().defaultTo(5);
    table.integer('maternity', 10).notNullable().defaultTo(60);
    table.integer('unpaid', 10).notNullable().defaultTo(0);
    table.integer('floating', 10).notNullable().defaultTo(1);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.engine('InnoDB');
    table.charset('utf8mb4')
    table.collate('utf8mb4_unicode_ci')
  });
};

exports.down = function (knex) {
  knex.schema.dropTable('user_leave_detail')
};