exports.up = function(knex) {
  return knex.schema.createTable('leaves', table => {
    table.increments('id').notNullable();
    table.string(`name`, 50).collate('utf8mb4_unicode_ci').notNullable();
    table.integer('number', 10).notNullable();
    table.string('description', 500).collate('utf8mb4_unicode_ci').notNullable();
    table.timestamps({ useTz: true });
    table.engine('InnoDB');
    table.charset('utf8mb4')
    table.collate('utf8mb4_unicode_ci')
  });
};

exports.down = function(knex) {
  knex.schema.dropTable('leaves')
};
