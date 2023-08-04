const express = require('express');
const cors = require('cors')
const {sendOTP, verifyOTP,sendMsg,sendLink} = require('../controller/twilio-sms');
const router = express.Router();

router.use(cors());

router.route('/sendotp').post(sendOTP);
router.route('/verify-otp').post(verifyOTP);
router.route('/send-msg').post(sendMsg);
router.route('/send-link').post(sendLink);
// router.route('/verify-otp').get(()=>{console.log("posting here. . .")});
module.exports = router