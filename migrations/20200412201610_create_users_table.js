exports.up = function (knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary().notNullable();
    table.string('name', 255).collate('utf8mb4_unicode_ci').notNullable();
    table.string('email', 255).collate('utf8mb4_unicode_ci').notNullable();
    table.string('alt_email', 255).collate('utf8mb4_unicode_ci').notNullable();
    table.string('phone', 30).collate('utf8mb4_unicode_ci').notNullable();
    table.timestamp('email_verified_at')
    table.string('password', 255).collate('utf8mb4_unicode_ci').notNullable();
    table.date('dob').notNullable();
    table.integer('designation_id', 10);
    table.date('joined').notNullable();
    table.date('left').notNullable();
    table.date('review').notNullable();
    table.string('account', 255).collate('utf8mb4_unicode_ci');
    table.string('bank', 255).collate('utf8mb4_unicode_ci');
    table.string('branch', 255).collate('utf8mb4_unicode_ci');
    table.string('pan', 255).collate('utf8mb4_unicode_ci');
    table.string('cit', 255).collate('utf8mb4_unicode_ci');
    table.enum('gender', ['male', 'female', 'other']).defaultTo('male').notNullable();
    table.string('image', 255).collate('utf8mb4_unicode_ci');
    table.string('citizenship', 255).collate('utf8mb4_unicode_ci');
    table.string('cit_img', 255).collate('utf8mb4_unicode_ci');
    table.string('pan_img', 255).collate('utf8mb4_unicode_ci');
    table.string('contract', 255).collate('utf8mb4_unicode_ci');
    table.string('appointment', 255).collate('utf8mb4_unicode_ci');
    table.string('remember_toKen', 255).collate('utf8mb4_unicode_ci');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.engine('InnoDB');
    table.charset('utf8mb4')
    table.collate('utf8mb4_unicode_ci')
  });
};

exports.down = function (knex) {
  knex.schema.dropTable('users')
};