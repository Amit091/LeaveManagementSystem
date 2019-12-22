const gcon = require('../../config/DBConnection');

module.exports = class leaveTypeSQL {
  async createLeaveSQL(data) {
    try {
        let con = await gcon();
        const readSQL = `INSERT INTO leaves(name,number,description) VALUE ('${data.name}','${data.number}','${data.description}')`;
        let status = await con.query(readSQL);
        status = JSON.parse(JSON.stringify(status));
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
        status = JSON.parse(JSON.stringify(status));
        status.forEach(holiday => {
            status = holiday;
        });
        return status;
    } catch (err) {
        console.log(err);
    }
}

async getLeaveByName(data) {
  try {
      let con = await gcon();
      var readSql = `SELECT * FROM leaves WHERE name='${data.name}'`;
      let status = await con.query(readSql);
      status = JSON.parse(JSON.stringify(status));
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
};