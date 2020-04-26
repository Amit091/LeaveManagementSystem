exports.up = function (knex) {
  return knex.schema.createTable('holidays', table => {
    table.increments('id').notNullable();
    table.string(`name`, 50).collate('utf8mb4_unicode_ci').notNullable();
    table.enum('type', ['public', 'float', 'company']).defaultTo("public").notNullable();
    table.date('from_date').notNullable();
    table.date('to_date').notNullable();
    table.integer('leaveDay', 10).defaultTo("1").notNullable();
    table.string('description', 500).collate('utf8mb4_unicode_ci').notNullable();
    table.timestamps({ useTz: true }).defaultTo(knex.fn.now());
    table.engine('InnoDB');
    table.charset('utf8mb4')
    table.collate('utf8mb4_unicode_ci')
  })
};

exports.down = function (knex) {
  knex.schema.dropTable('holidays')
};
