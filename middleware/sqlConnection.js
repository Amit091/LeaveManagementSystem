var mysql = require('promise-mysql');
//setting up database connection
const dbConfig = {
    host: "localhost",
    user: "root",
    password: "",
    database: "mock_leave",
    connectionLimit: 0,
    queueLimit: 0
};

module.exports = async () => {
    try {
        let con = await mysql.createConnection(dbConfig);
        if (con) console.log('DB Connect');
        return con;
    } catch (error) {
        console.log('SQL ERROR');
        console.log(error);
        throw error;
    }
};








