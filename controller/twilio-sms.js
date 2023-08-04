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
        console.log(typeof(otpres))
        // console.log(typeof(otpres))
        console.log(otpres)
        return res.status(200).send(JSON.stringify(otpres))
       
    }catch (e) {
        console.log(e);
        console.log("Leave a line\n")
        return res.status(e?.status|| 400).send(e? JSON.stringify({"error":e}) : JSON.stringify({"error": 'Something went wrong!!'}));

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
        
       return res.status(200).send(JSON.stringify(verifyres));
    
    }catch (e) {
        console.log(e);
        console.log("Leave a line\n")
        return res.status(e?.status|| 400).send(e? JSON.stringify({"error":e}) : JSON.stringify({"error": 'Something went wrong!!'}));

    }
};


/**
 * send MSG
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const sendMsg = async (req,res,next) => {
    const {phoneNumber, amount, number} = req.body;
    try {

        const sent = await client.messages
        .create({
            body:`${number} sent ${amount} into your account`,
            to: `${phoneNumber}`,
            from:"+15416157939"
        })
        
       return res.status(200).send(JSON.stringify(sent));
    
    }catch (e) {
        console.log(e);
        console.log("Leave a line\n")
        return res.status(e?.status|| 400).send(e? JSON.stringify({"error":e}) : JSON.stringify({"error": 'Something went wrong!!'}));

    }
};


/**
 * send Link
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const sendLink = async (req,res,next) => {
    const {phoneNumber, amount, number} = req.body;
    try {

        const sent = await client.messages
        .create({
            body:`${number} was trying to send ${amount}BUSD but failed.
            Register on Ultimate Digits using https://whole-final-ud.vercel.app/ for successful transaction`,
            to: `${phoneNumber}`,
            from:"+15416157939"
        })
        
       return res.status(200).send(JSON.stringify(sent));
    
    }catch (e) {
        console.log(e);
        console.log("Leave a line\n")
        return res.status(e?.status|| 400).send(e? JSON.stringify({"error":e}) : JSON.stringify({"error": 'Something went wrong!!'}));

    }
};
module.exports = {sendOTP, verifyOTP, sendMsg, sendLink}