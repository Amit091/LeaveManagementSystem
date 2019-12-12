

const holidaysSQL = require('../helpers/Dao/holidaysSQL');
const hSQL = new holidaysSQL();

var types = ['Public Holiday', 'Floating Holiday'];
exports.createHolidays = async (req, res) => {
    try {
        var errors = req.validationErrors();
        errors = [];
        let holiday = await hSQL.getHolidayByName(req.body);
        console.log(holiday);
        if (holiday != "") {
            errors.push({ 'param': 'name', 'msg': 'Holiday with this name already exists' });
        }
        let allresult = await hSQL.showHolidaysSQL();
        if (errors.length > 0) {
            console.log("heloo");
            res.render('leave/holidays', { allresult, errors })
        } else {
            await hSQL.createHolidays(req.body);
            res.render('leave/holidays', { allresult });
            req.flash('success_msg', 'new holiday added');
        }
        console.log(errors);

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
        var errors = req.validationErrors();
        errors = [];
        const allresult = await hSQL.showHolidaysSQL();
        const holiday = await hSQL.getHolidayById(id);
        let holidayName = await hSQL.getHolidayByName(req.body);
        if (holidayName != "") {

            if (req.body.name == holiday.name) {
                hSQL.updateHoliday(id, req.body);
                res.render('leave/holidays', { holiday, allresult });
            } else {
                errors.push({ 'param': 'name', 'msg': 'Holiday with this name already exists' });
                if (errors.length > 0) {
                    const holiday = await hSQL.getHolidayById(id);
                    res.render('leave/editholidays', { allresult, errors, holiday, types });
                }
            }

        } else {
            let holiday = await hSQL.updateHoliday(id, req.body);
            let allresult = await hSQL.showHolidaysSQL();
            res.render('leave/holidays', { holiday, allresult });
        }


    } catch (error) {
        console.log(error);

    }


}

exports.deleteHoliday = async (req, res) => {
    try {
        const id = req.params.id;
        await hSQL.deleteHoliday(id);
        res.redirect('/leave/addholidays');
    } catch (error) {
        console.log(error);

    }
}

exports.createLeave = async (req, res) => {
    //data validation
    try {
        req.checkBody('name', 'Employee Name Required').notEmpty();
        var errors = req.validationErrors();
        errors = [];
        let leaveName = await hSQL.getLeaveByName(req.body);

        if (leaveName != "") {
            errors.push({ 'param': 'name', 'msg': 'Leave with this name already exists' });
            console.log(errors);

            let allresult = await hSQL.showleavesSQL();
            if (errors.length > 0) {
                res.render('leave/leaveType', { allresult, errors });
            }
        }
        else {
            await hSQL.createLeaveSQL(req.body);
            let allresult = await hSQL.showleavesSQL();
            res.render('leave/leaveType', { allresult });
        }

    } catch (error) {
        console.log(error);

    }


}

exports.editLeave = async (req, res) => {
    try {
        id = req.params.id;

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

        let leaveName = await hSQL.getLeaveByName(req.body);
        if (leaveName != "") {
            let leave = await hSQL.getLeaveById(id);
            let allresult = await hSQL.showleavesSQL();
            if (req.body.name == leave.name) {
                await hSQL.updateLeaveSQL(id, req.body);
                res.render('leave/leaveType', { allresult });
            }
            else {
                var errors = req.validationErrors();
                errors = [];
                errors.push({ 'param': 'name', 'msg': 'Leave with this name already exists' });
                let leave = await hSQL.getLeaveById(id);
                let allresult = await hSQL.showleavesSQL();
                if (errors.length > 0) {
                    res.render('leave/editleave', { allresult, errors, leave });
                }
            }

        } else {
            await hSQL.updateLeaveSQL(id, req.body);
            let allresult = await hSQL.showleavesSQL();
            res.render('leave/leaveType', { allresult });
        }

    } catch (error) {
        console.log(error);

    }
}

exports.deleteLeave = async (req, res) => {
    try {
        const id = req.params.id;
        await hSQL.deleteLeaveSQL(id);
        res.redirect('/leave/leaveType');
    } catch (error) {
        console.log(error);

    }
}