exports.up = function (knex) {
  return knex.schema.table('user_leave_detail_temp', table => {
    table
      .boolean('flag2')
      .comment(`0 -> main, 1 -> general`)
      .defaultTo(0)
  });
};

exports.down = function (knex) {
  knex.schema.table('user_leave_detail_temp', table => {
    table.dropColumns('flag1', 'flag', 'flag2')
  })
};