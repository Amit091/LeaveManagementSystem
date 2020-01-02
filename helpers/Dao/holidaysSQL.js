const gcon = require('../../config/DBConnection');

module.exports = class holidaysSQL {
    
    async createHolidays(data) {
        try {
            let con = await gcon();
            const readSQL = `INSERT INTO holidays (name,type,from_date,to_date,leaveDay,description) VALUE ('${data.name}','${data.holidaypicker}','${data.fromDate}','${data.toDate}','${data.leaveDay}','${data.description}')`;
            let status = await con.query(readSQL);
            status = JSON.parse(JSON.stringify(status));
            return status;
        } catch (err) {
            console.log(err);
        }
    }

    async showHolidaysSQL() {
        try {
            let con = await gcon();
            const readSQL = `SELECT *,DATE_FORMAT(holidays.from_date,"%b %D %Y")as fromdateformat,DATE_FORMAT(holidays.to_date,"%b %D %Y")as todateformat FROM holidays`;
            let status = await con.query(readSQL);
            status = JSON.parse(JSON.stringify(status));
            return status;
        } catch (err) {
            console.log(err);
        }
    }

    async getHolidayByName(data) {
        try {
            let con = await gcon();
            const readSQL = `SELECT *,DATE_FORMAT(holidays.from_date,'%Y-%m-%d')as fromdateformat,DATE_FORMAT(holidays.to_date,'%Y-%m-%d')as todateformat FROM holidays WHERE name='${data.name}'`;
            let status = await con.query(readSQL);
            status = JSON.parse(JSON.stringify(status));
            status.forEach(holiday => {
                status = holiday;
            });

            console.log('==============');

            console.log(status);
            console.log('==============');

            return status;
        } catch (err) {
            console.log(err);
        }
    }

    async updateHoliday(id, data) {
        try {
            let con = await gcon();
            var sql = `UPDATE holidays SET name = '${data.name}',type='${data.holidaypicker}',from_date='${data.fromDate}',to_date='${data.toDate}',leaveDay='${data.leaveDay}',description='${data.description}' WHERE id = '${id}'`;
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

    async getHolidayById(id) {
        try {
            let con = await gcon();
            const readSQL = `SELECT *,DATE_FORMAT(holidays.from_date,'%Y-%m-%d')as fromdateformat,DATE_FORMAT(holidays.to_date,'%Y-%m-%d')as todateformat FROM holidays WHERE id='${id}'`;
            let status = await con.query(readSQL);
            console.log(status);

            status = JSON.parse(JSON.stringify(status));
            status.forEach(holiday => {
                status = holiday;
            });
            console.log(status);
            return status;
        } catch (err) {
            console.log(err);
        }
    }

    async getHolidayByDate(data) {
        try {
            let con = await gcon();
            const readSQL = `SELECT *,DATE_FORMAT(holidays.from_date,'%Y-%m-%d')as fromdateformat,DATE_FORMAT(holidays.to_date,'%Y-%m-%d')as todateformat FROM holidays WHERE from_date='${data.fromDate}'`;
            let status = await con.query(readSQL);
            status = JSON.parse(JSON.stringify(status));
            status.forEach(date => {
                status = date
            });

            console.log('==============');

            console.log(status);
            console.log('==============');

            return status;
        } catch (err) {
            console.log(err);
        }
    }
};
