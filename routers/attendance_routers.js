var express = require('express');
var router = express.Router();
const attendanceControllers = require('../controllers/attendance_controllers');

router.get('/', async function (req, res, next) {
    await attendanceControllers.listAttendances(req, res);
});

router.get('/in', async function (req, res, next) {
    await attendanceControllers.inAttendances(req, res);
});

module.exports = router;