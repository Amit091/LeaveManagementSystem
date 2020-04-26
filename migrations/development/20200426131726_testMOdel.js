
exports.up = function (knex) {
  return knex.schema.createTable('users1', function (table) {
    table.increments();
    table.string('name');
    table.string('email', 128);
    table.string('role').defaultTo('admin');
    table.string('password');
    table.timestamps();
  });
};

exports.down = function (knex) {
  knex.schema.dropTable('users1')
};
