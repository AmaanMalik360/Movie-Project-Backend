const express = require('express');
const { signup, signin,} = require('../controller/auth');
const router = express.Router()

router.post('/register-user', signup); 

router.post('/signin-user', signin);

module.exports = router