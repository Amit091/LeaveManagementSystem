var express = require('express');
var router = express.Router();
const leaveTypeController = require('./../controller/leaveTypeController');

/* GET home page. */
router.get('/',leaveTypeController.getLeaveTypeIndex);
//create leave
router.post('/', leaveTypeController.createLeave);

//edit leave
router.get('/editleave/:id', leaveTypeController.geteditLeave);

//update leave
router.post('/editleave/:id', leaveTypeController.updateLeave);

//delete leave
router.get('/deleteleave/:id', leaveTypeController.deleteLeave);

module.exports = router;