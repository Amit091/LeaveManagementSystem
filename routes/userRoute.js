var express = require('express');
const passport = require('passport');
const auth = require('../config/auth');
const moment = require('moment');
var router = express.Router();

const userController = require('./../controller/userController');
const leave_SQL = require('../helpers/Dao/leave_form_SQL');

const lSQL = new leave_SQL();

/* GET A temporary login */
router.get('/login', userController.getLogin);

router.post('/login', userController.postLogin);

router.get('/', auth.isLogin, userController.getUserIndex);

router.get('/applyLeave', auth.isLogin, userController.getApplyLeave);

router.post('/applyLeave', auth.isLogin, userController.postApplyLeave);

router.get('/editLeave/:form',auth.isLogin, userController.getApplyLeaveEdit);

router.post('/editLeave/:form',auth.isLogin, userController.postApplyLeaveEdit);

module.exports = router;