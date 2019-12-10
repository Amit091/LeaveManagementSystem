
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
        console.log(id);
        console.log(req.body);

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
        console.log(result);

        res.render('leave/leaveType')
    } catch (error) {
        console.log(error);

    }


}