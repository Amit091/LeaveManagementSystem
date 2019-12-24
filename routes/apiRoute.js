var express = require('express');
const router = express.Router();
const apiController = require('./../controller/apiController');

router.post('/api/decideLeave',apiController.decideLeave);

router.get('/api/getuser',apiController.getAllUser);

router.get('/api/getDataForModal',apiController.getDataForModal);

module.exports = router;