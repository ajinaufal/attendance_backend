var express = require('express');
var router = express.Router();
const attendanceControllers = require('../controllers/attendance_controllers');

router.get('/', function (req, res, next) {
    attendanceControllers.listAttendances(req, res);
});

router.get('/in', function (req, res, next) {
    attendanceControllers.inAttendances(req, res);
});

router.get('/out', function (req, res, next) {
    attendanceControllers.outAttendances(req, res);
});

module.exports = router;