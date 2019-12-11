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
            const readSQL = `SELECT *,DATE_FORMAT(holidays.date,"%b %D %Y")as dateformat FROM holidays`;
            let status = await con.query(readSQL);
            status = JSON.parse(JSON.stringify(status));
            return status;
        } catch (err) {
            console.log(err);

        }
    }

    async getHolidayById(id) {
        try {
            let con = await gcon();
            const readSQL = `SELECT *,DATE_FORMAT(holidays.date,"%Y %b %D")as dateformat FROM holidays WHERE id=${id}`;
            let status = await con.query(readSQL);
            status = JSON.parse(JSON.stringify(status))
            status.forEach(holiday => {
                status = holiday;
            });
            console.log(status);

            return status;
        } catch (err) {
            console.log(err);

        }
    }

    async updateHoliday(id, data) {
        try {
            let con = await gcon();
            var sql = `UPDATE holidays SET name = '${data.name}',type='${data.holidaypicker}',date='${data.date}',description='${data.description}' WHERE id = '${id}'`;
            let status = await con.query(sql);
            status = await JSON.parse(JSON.stringify(status));

            return status;
        }
        catch (error) {
            console.log(error);

        }
    }

    async deleteHoliday(id) {
        try {
            let con = await gcon();
            var readSql = `DELETE FROM holidays WHERE id='${id}'`;
            let status = await con.query(readSql);
            return status;

        } catch (err) {
            console.log(err);

        }
    }

    async createLeaveSQL(data) {
        try {

            let con = await gcon();
            const readSQL = `INSERT INTO leaves(name,number,description) VALUE ('${data.name}','${data.number}','${data.description}')`;
            let status = await con.query(readSQL);
            status = JSON.parse(JSON.stringify(status))
            return status;
        } catch (err) {
            console.log(err);

        }
    }

    async showleavesSQL() {
        try {
            let con = await gcon();
            const readSQL = `SELECT * FROM leaves`;
            let status = await con.query(readSQL);
            status = JSON.parse(JSON.stringify(status));
            return status;
        } catch (err) {
            console.log(err);

        }
    }

    async getLeaveById(id) {
        try {
            let con = await gcon();
            const readSQL = `SELECT * FROM leaves WHERE id=${id}`;
            let status = await con.query(readSQL);
            status = JSON.parse(JSON.stringify(status))
            status.forEach(holiday => {
                status = holiday;
            });
            console.log(status);

            return status;
        } catch (err) {
            console.log(err);


        }


    }

    async updateLeaveSQL(id, data) {
        try {
            let con = await gcon();
            var sql = `UPDATE leaves SET name = '${data.name}',number='${data.number}',description='${data.description}' WHERE id = '${id}'`;
            let status = await con.query(sql);
            status = await JSON.parse(JSON.stringify(status));

            return status;
        }
        catch (error) {
            console.log(error);

        }
    }

    async deleteLeaveSQL(id) {
        try {
            let con = await gcon();
            var readSql = `DELETE FROM leaves WHERE id='${id}'`;
            let status = await con.query(readSql);
            return status;

        } catch (err) {
            console.log(err);

        }
    }



}
