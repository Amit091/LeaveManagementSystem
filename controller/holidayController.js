const holidaysSQL = require('../helpers/Dao/holidaysSQL');
const hSQL = new holidaysSQL();

var types = ['Public Holiday', 'Floating Holiday'];

exports.getHolidayIndex = async (req, res) => {
    try {
        let allresult = await hSQL.showHolidaysSQL();
        res.render('holiday/holidays', { allresult });
    } catch (error) {
        console.log(error);
    }
};

exports.createHoliday = async (req, res) => {
    try {
        var errors = req.validationErrors();
        errors = [];
        let holiday = await hSQL.getHolidayByName(req.body);
        if (holiday != "") {
            errors.push({ 'param': 'name', 'msg': 'Holiday with this name already exists' });
        }
        let allresult = await hSQL.showHolidaysSQL();
        if (errors.length > 0) {
            res.render('holiday/holidays', { allresult, errors });
        } else {
            await hSQL.createHolidays(req.body);
            req.flash('success_msg', 'new holiday added');
            res.redirect('/holiday');           
        }
        console.log(errors);
    } catch (error) {
        console.log(error);
    }
};

exports.editHoliday = async (req, res) => {
    try {
        const id = req.params.id;
        let holiday = await hSQL.getHolidayById(id);
        let allresult = await hSQL.showHolidaysSQL();
        console.log(holiday);
        res.render('holiday/editholidays', { holiday, allresult, types });
    } catch (error) {
        console.log(error);
    }
};

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
                let result = await hSQL.updateHoliday(id, req.body);
                console.log('dddddddddddddddddddd');
                console.log(result);
                console.log('dddddddddddddddddddd');
                res.redirect('/holiday');
            } else {
                errors.push({ 'param': 'name', 'msg': 'Holiday with this name already exists' });
                if (errors.length > 0) {
                    const holiday = await hSQL.getHolidayById(id);
                    res.render('holiday/editholidays', { allresult, errors, holiday, types });
                }
            }
        } else {
            let holiday = await hSQL.updateHoliday(id, req.body);
            let allresult = await hSQL.showHolidaysSQL();
            res.redirect('/holiday');   
        }
    } catch (error) {
        console.log(error);
    }
};

exports.deleteHoliday = async (req, res) => {
    try {
        const id = req.params.id;
        await hSQL.deleteHoliday(id);
        res.redirect('/holiday');   
    } catch (error) {
        console.log(error);
    }
};