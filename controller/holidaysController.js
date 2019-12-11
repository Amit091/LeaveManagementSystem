
const holidaysSQL = require('./../helpers/holidaysSQL');
const hSQL = new holidaysSQL();

var types = ['Public Holiday', 'Floating Holiday', 'Office Holiday'];
exports.createHolidays = async (req, res) => {
    try {
        let result = await hSQL.createHolidays(req.body);
        let allresult = await hSQL.showHolidaysSQL();
        res.render('leave/holidays', { allresult })
    } catch (error) {
        console.log(error);

    }


}

exports.editHoliday = async (req, res) => {
    try {
        const id = req.params.id;
        let holiday = await hSQL.getHolidayById(id);
        let allresult = await hSQL.showHolidaysSQL();

        res.render('leave/editholidays', { holiday, allresult, types });
    } catch (error) {
        console.log(error);

    }


}


exports.updateHoliday = async (req, res) => {
    try {
        const id = req.params.id;

        let holiday = await hSQL.updateHoliday(id, req.body);
        let allresult = await hSQL.showHolidaysSQL();
        res.render('leave/holidays', { holiday, allresult });
    } catch (error) {
        console.log(error);

    }


}

exports.deleteHoliday = async (req, res) => {
    try {
        const id = req.params.id;
        let deleteholiday = await hSQL.deleteHoliday(id);
        res.redirect('/leave/addholidays');
    } catch (error) {
        console.log(error);

    }
}

exports.createLeave = async (req, res) => {
    try {
        let result = await hSQL.createLeaveSQL(req.body);
        let allresult = await hSQL.showleavesSQL();

        res.render('leave/leaveType', { allresult });
    } catch (error) {
        console.log(error);

    }


}

exports.editLeave = async (req, res) => {
    try {
        const id = req.params.id;
        let leave = await hSQL.getLeaveById(id);
        let allresult = await hSQL.showleavesSQL();

        res.render('leave/editleave', { leave, allresult });
    } catch (error) {
        console.log(error);

    }


}

exports.updateLeave = async (req, res) => {
    try {
        const id = req.params.id;
        let leave = await hSQL.updateLeaveSQL(id, req.body);
        let allresult = await hSQL.showleavesSQL();
        res.render('leave/leaveType', { leave, allresult });
    } catch (error) {
        console.log(error);

    }
}

exports.deleteLeave = async (req, res) => {
    try {
        const id = req.params.id;
        let deleteleave = await hSQL.deleteLeaveSQL(id);
        res.redirect('/leave/leaveType');
    } catch (error) {
        console.log(error);

    }
}