const express = require('express');
const cors = require('cors')
const {sendOTP, verifyOTP} = require('../controller/twilio-sms');
const router = express.Router();

router.use(cors());

router.route('/send-otp').post(sendOTP);
router.route('/verify-otp').post(verifyOTP);

module.exports = router