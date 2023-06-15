var express = require('express');
var router = express.Router();
const authController = require('../controllers/auth_controllers');

router.get('/generate', function async(req, res, next) {
    authController.generate(req, res);
});

router.post('/login', function async(req, res, next) {
    authController.login(req, res);
});

router.get('/logout', function async(req, res, next) {
    authController.logout(req, res);
});

module.exports = router;
