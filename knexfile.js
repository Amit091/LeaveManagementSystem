require(`dotenv`).config({ path: `./.env` });

module.exports = {
  // knex migrate:latest --env=local
  development: {
    client: `mysql`,
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      // password: process.env.DB_PASSWORD,
      charset: `utf8mb4`
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: `knex_migrations`,
    },
  },

  // knex migrate:latest
  local: {
    client: `mysql`,
    connection: {
      host: process.env.DB_HOST,
      database: process.env.TEST_DB_NAME,
      user: process.env.DB_USER,
      charset: `utf8mb4`,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: `knex_migrations`,
    },
  },

  // knex migrate:latest --env production
  production: {
    client: `mysql`,
    connection: {
      host: process.env.DB_HOST,
      database: process.env.PROD_DB_NAME,
      user: process.env.DB_USER,
      // password: process.env.DB_PASSWORD,
      charset: `utf8mb4`,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: `knex_migrations`,
    },
  },
};
