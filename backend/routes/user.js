const express = require('express');
const router = express.Router();
const dataUser = require("../middleware/data-user")


const userCtrl = require('../controllers/user');


router.post('/signup', dataUser.valid, userCtrl.signup);
router.post('/login', userCtrl.login);


module.exports = router;