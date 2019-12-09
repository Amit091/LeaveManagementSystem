const gcon = require('./../middleware/sqlConnection');
const express = require('express');
const router = express.Router();

module.exports = class holidaysSQL {
    async createHolidays(data) {
        try {
            let con = await gcon();
            const readSQL = `INSERT INTO holidays (name,type,date,description) VALUE ('${data.name}','${data.holidaypicker}','${data.date}','${data.description}')`;
            let status = await con.query(readSQL);
            status = JSON.parse(JSON.stringify(status))
            return status;
        } catch (err) {
            console.log(err);

        }
    }

    async showHolidaysSQL() {
        try {
            let con = await gcon();
            const readSQL = `SELECT *,DATE_FORMAT(holidays.date,"%D %b %Y")as dateformat FROM holidays`;
            let status = await con.query(readSQL);
            status = JSON.parse(JSON.stringify(status))
            console.log(status);

            return status;
        } catch (err) {
            console.log(err);

        }
    }
}