
const holidaysSQL = require('./../helpers/holidaysSQL');
const hSQL = new holidaysSQL();

exports.createHolidays = async (req, res) => {
    try {
        let result = await hSQL.createHolidays(req.body);
        let allresult = await hSQL.showHolidaysSQL();

        res.render('leave/holidays', { allresult })
    } catch (error) {
        console.log(error);

    }


}


// exports.showHolidays = async (req, res) => {
//     try {
//         let result = await hSQL.showHolidaysSQL();
//         res.render('leave/allholidays', { result })
//     } catch (error) {
//         console.log(error);

//     }


// }
