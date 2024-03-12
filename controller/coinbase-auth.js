const jwt = require("jsonwebtoken");
const UserMapping = require("../models/Mapping");
const { APIKEYNAME, PRIVATEKEY } = process.env;

// Import the UserMapping model
const SECRET_KEY = "MyS3cr3tK3y!2024@#$";
// const UserCoinbaseAuth = require("@coinbase/waas-server-auth");

/**
 * Maps a new phone number to the specified rootId and endUserId.
 * Checks if the phone number already exists before mapping.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const mapPhoneNumber = async (req, res, next) => {
  const { rootId, endUserId, phoneNumber } = req.body;
  try {
    // Check if the mapping already exists
    const existingMapping = await UserMapping.findOne({ rootId, endUserId });
    if (existingMapping) {
      return res
        .status(409)
        .json({ success: false, message: "Mapping already exists." });
    }

    // If no existing mapping, create a new one
    const newMapping = await UserMapping.create({
      rootId,
      endUserId,
      phoneNumber,
    });
    return res.status(201).json({ success: true, mapping: newMapping });
  } catch (error) {
    console.error("Error mapping phone number:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Verifies if the specified rootId and endUserId have a phone number mapped.
 * If so, returns a JWT and the phone number; otherwise, returns false.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const verifyUser = async (req, res, next) => {
  const { rootId } = req.body;
  try {
    const userMapping = await UserMapping.findOne({ rootId });
    console.log(userMapping);
    if (userMapping) {
      const token = jwt.sign(
        {
          rootId,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
      );
      return res.status(200).json({ success: true, token, user: userMapping });
    } else {
      return res
        .status(204)
        .json({ success: false, message: "No mapping found." });
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
const UserCoinbaseAuthToken = async (req, res, next) => {
  const { issueUserToken } = await import("@coinbase/waas-server-auth");

  const { uuid } = req.body;

  try {
    console.log("uuid", uuid);
    console.log(APIKEYNAME, PRIVATEKEY, uuid);
    const token = await issueUserToken({
      APIKEYNAME,
      PRIVATEKEY,
      uuid,
    });

    res.json({ success: true, token });
  } catch (error) {
    console.error("Error verifying user:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { verifyUser, mapPhoneNumber, UserCoinbaseAuthToken };
