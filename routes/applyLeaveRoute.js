var express = require('express');
const router = express.Router();
var applyLeaveController = require('./../controller/applyleaveController');

router.get('/',applyLeaveController.getApplyLeaveIndex);

router.get('/list',applyLeaveController.getApplyLeaveIndex);

router.get('/add',applyLeaveController.getApplyLeave);

router.post('/add',applyLeaveController.addApplyLeave);

router.get('/edit/:id',applyLeaveController.getApplyLeaveEdit);

router.post('/edit/:id',applyLeaveController.UpdateApplyLeave);

module.exports = router;