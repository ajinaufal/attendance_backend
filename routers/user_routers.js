var express = require('express');
var router = express.Router();
const userControllers = require('../controllers/user_controllers');

router.get('/', function (req, res, next) {
    userControllers.listEmployees(req, res);
});

router.get('/profile', async function (req, res, next) {
    await userControllers.profileUser(req, res);
});

router.post('/detail', function (req, res, next) {
    userControllers.detailUser(req, res);
});

router.post('/update', function (req, res, next) {
    userControllers.updateUser(req, res);
});

router.post('/create', function (req, res, next) {
    userControllers.createeUser(req, res);
});


module.exports = router;
