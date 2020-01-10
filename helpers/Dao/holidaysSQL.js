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
            // console.log(status);
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
                status = date;
            });
            return status;
        } catch (err) {
            console.log(err);
        }
    }

    async getAllholidaystest(startDate,endDate){
        try {
          let con = await gcon();
                //let status = await con.query(`SELECT * FROM holidaystest WHERE from_date BETWEEN '${stDate}' AND '${eDate}' OR to_date BETWEEN '${stDate}' AND '${eDate}'`);
                let status = await con.query(`SELECT *,DATE_FORMAT(date,'%Y-%m-%d')as dateFormat FROM holidaystest WHERE date BETWEEN '${startDate}' AND '${endDate}' AND type ='public' ORDER BY date`);
                status = JSON.parse(JSON.stringify(status));
                return  (status.length == 0)?0:status;
        } catch (error) {
          console.log(error);      
        }
      }
      async getAllholidays(startDate,endDate){
        try {
          let con = await gcon();
                let status = await con.query(`SELECT *,DATE_FORMAT(H.from_date,'%Y-%m-%d') as fromDate,DATE_FORMAT(H.to_date,'%Y-%m-%d') as toDate FROM holidays AS H WHERE H.from_date BETWEEN '${startDate}' AND '${endDate}' OR H.to_date BETWEEN '${startDate}' AND '${endDate}' AND H.type ='public'` );                
                status = JSON.parse(JSON.stringify(status));
                return  (status.length == 0)?0:status;
        } catch (error) {
          console.log(error);      
        }
      }
};
