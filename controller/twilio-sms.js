const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } =
  process.env;
const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
  lazyLoading: true,
});
const jwt = require("jsonwebtoken");
const UserMapping = require("../models/Mapping"); // Import the UserMapping model
const SECRET_KEY = "MyS3cr3tK3y!2024@#$";
/**
 * send OTP
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const sendOTP = async (req, res, next) => {
  console.log("sid", TWILIO_ACCOUNT_SID);
  console.log("auth", TWILIO_AUTH_TOKEN);
  console.log("service", TWILIO_SERVICE_SID);
  const { countryCode, phoneNumber } = req.body;
  console.log(phoneNumber);
  console.log(countryCode);
  try {
    const otpres = await client.verify.v2
      .services(TWILIO_SERVICE_SID)
      .verifications.create({
        to: `+${countryCode}${phoneNumber}`,
        channel: "sms",
      });
    console.log(typeof otpres);
    // console.log(typeof(otpres))
    console.log(otpres);
    return res.status(200).send(JSON.stringify(otpres));
  } catch (e) {
    console.log(e);
    console.log("Leave a line\n");
    return res
      .status(e?.status || 400)
      .send(
        e
          ? JSON.stringify({ error: e })
          : JSON.stringify({ error: "Something went wrong!!" })
      );
  }
};

/**
 * verify OTP
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const verifyOTP = async (req, res, next) => {
  const { countryCode, phoneNumber, otp, rootId = "ncw", address } = req.body;
  try {
    const verifyres = await client.verify.v2
      .services(TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: `+${countryCode}${phoneNumber}`,
        code: otp,
      });

    if (verifyres.status === "approved" && rootId !== "ncw") {
      const existingMapping = await UserMapping.findOne({ rootId });
      if (existingMapping) {
        console.log("Mapping already exists");
        return res
          .status(409)
          .json({ success: false, message: "Mapping already exists." });
      }

      const existingNo = await UserMapping.findOne({ phone: phoneNumber });
      if (existingNo) {
        console.log("Number already exists");
        return res
          .status(408)
          .json({ success: false, message: "Number already exists." });
      }

      const newMapping = await UserMapping.create({
        rootId: rootId,
        endUserId: "asdsadasd",
        phone: phoneNumber,
        address: address,
        type: "real",
      });

      console.log("newMapping", newMapping);
      // return res.status(200).send(JSON.stringify(newMapping));
    }
    if (verifyres.status === "approved" && rootId === "ncw") {
      const existingMapping = await UserMapping.findOne({ address });
      if (existingMapping) {
        console.log("Mapping already exists");
        return res
          .status(409)
          .json({ success: false, message: "Mapping already exists." });
      }

      const existingNo = await UserMapping.findOne({ phone: phoneNumber });
      if (existingNo) {
        console.log("Number already exists");
        return res
          .status(408)
          .json({ success: false, message: "Number already exists." });
      }

      const newMapping = await UserMapping.create({
        rootId: "ncw",
        endUserId: "asdsadasd",
        phone: phoneNumber,
        address: address,
        type: "real",
      });

      console.log("newMapping", newMapping);
      // return res.status(200).send(JSON.stringify(newMapping));
    }

    return res.status(200).send(JSON.stringify(verifyres));
  } catch (e) {
    console.log(e);
    console.log("Leave a line\n");
    return res
      .status(e?.status || 400)
      .send(
        e
          ? JSON.stringify({ error: e })
          : JSON.stringify({ error: "Something went wrong!!" })
      );
  }
};

/**
 * send MSG
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const sendMsg = async (req, res, next) => {
  const { phoneNumber, amount, number } = req.body;
  try {
    const sent = await client.messages.create({
      body: `${number} sent ${amount} into your account`,
      to: `${phoneNumber}`,
      from: "+15416157939",
    });

    return res.status(200).send(JSON.stringify(sent));
  } catch (e) {
    console.log(e);
    console.log("Leave a line\n");
    return res
      .status(e?.status || 400)
      .send(
        e
          ? JSON.stringify({ error: e })
          : JSON.stringify({ error: "Something went wrong!!" })
      );
  }
};

/**
 * send Link
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const sendLink = async (req, res, next) => {
  const { phoneNumber, number } = req.body;
  try {
    const sent = await client.messages.create({
      body: `${number} was trying to send BUSD but failed.Register on Ultimate Digits using https://whole-final-ud.vercel.app/ for successful transaction`,
      to: `${phoneNumber}`,
      from: "+15416157939",
    });

    return res.status(200).send(JSON.stringify(sent));
  } catch (e) {
    console.log(e);
    console.log("Leave a line\n");
    return res
      .status(e?.status || 400)
      .send(
        e
          ? JSON.stringify({ error: e })
          : JSON.stringify({ error: "Something went wrong!!" })
      );
  }
};
module.exports = { sendOTP, verifyOTP, sendMsg, sendLink };
