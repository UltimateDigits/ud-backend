const {TWILIO_ACCOUNT_SID ,TWILIO_AUTH_TOKEN ,TWILIO_SERVICE_SID} = process.env;
const client = require('twilio')(TWILIO_ACCOUNT_SID ,TWILIO_AUTH_TOKEN, {
    lazyLoading: true
})

/**
 * send OTP
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const sendOTP = async (req,res,next) => {
    
    const {countryCode,phoneNumber} = req.body;
    console.log(phoneNumber);
    try {

        const otpres = await client.verify
        .v2.services(TWILIO_SERVICE_SID)
        .verifications.create({
            to:`+${countryCode}${phoneNumber}`,
            channel: "sms"
        });
        res.status(200).send(`OTP send successfully!: ${JSON.stringify(otpres)}`)
    }catch (e) {
        console.log(e);
        console.log("Leave a line\n")
        res.status(error?.status|| 400).send(error?message : 'Something went wrong!!');

    }
};


/**
 * verify OTP
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const verifyOTP = async (req,res,next) => {
    const {countryCode,phoneNumber,otp} = req.body;
    try {

        const verifyres = await client.verify.v2
        .services(TWILIO_SERVICE_SID)
        .verificationChecks.create({
            to:`+${countryCode}${phoneNumber}`,
            code: otp,
        });
       return res.status(200).send(`OTP send successfully!: ${JSON.stringify(verifyres)}`)
    }catch (e) {
        console.log(e);
        console.log("Leave a line\n")
        return res.status(error?.status|| 400).send(error?message : 'Something went wrong!!');

    }
};
module.exports = {sendOTP, verifyOTP}