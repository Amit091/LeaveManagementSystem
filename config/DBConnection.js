const mysql = require('promise-mysql');
const chalk = require('chalk');

const dbConfig = {
    user: "root",
    password: "",
    database: "mock_leave",
    host: "localhost",
    queueLimit: 0, // unlimited queueing
    connectionLimit: 0
};

module.exports = async() => {
    try {
        let con = await mysql.createConnection(dbConfig);
        if (con) console.log(chalk.green('MYSQL Connected'));
        return con;
    } catch (ex) {
        if (ex.errno == 'ECONNREFUSED') {
            console.log(chalk.red('SQL Connection ERROR'));
            console.log(chalk.red(`MySQL Server not available`));
            console.log(chalk.red(`at ${ex.address} port:${ex.port}`));
        }
    }
};