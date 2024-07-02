const jwt = require("jsonwebtoken");
const UserMapping = require("../models/Mapping");
const fs = require("fs"); // Import the File System module
const path = require("path");
const { log } = require("console");
const { APIKEYNAME, PRIVATEKEY } = process.env;
const filePath = path.join(__dirname, "coinbase_cloud_api_key.json");
const rateLimit = require("express-rate-limit");
const { query, validationResult } = require("express-validator");
const Moralis = require("moralis").default;
const { API } = require("@huddle01/server-sdk/api");
const HuddleAuth = require("@huddle01/server-sdk/auth");
const { AccessToken, Role } = HuddleAuth;
const HUDDLE_API_KEY = process.env.HUDDLE_API_KEY;

// Use fs.readFileSync to read the file content synchronously
const fileContent = fs.readFileSync(filePath, "utf8");
const coinbaseCloudApiKey = JSON.parse(fileContent);

const apiKeyName = coinbaseCloudApiKey.name;
const privateKey = coinbaseCloudApiKey.privateKey;
// Import the UserMapping model
const SECRET_KEY = "MyS3cr3tK3y!2024@#$";

/**
 * Maps a new phone number to the specified rootId and endUserId.
 * Checks if the phone number already exists before mapping.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const mapPhoneNumber = async (req, res, next) => {
  const {
    rootId = "",
    endUserId = "",
    phoneNumber,
    address,
    type,
    countryCode,
  } = req.body;

  console.log(req.body);
  try {
    // Check if the mapping already exists
    const existingMapping = await UserMapping.findOne({ address });
    console.log(existingMapping);
    if (existingMapping) {
      // Check if phoneNumber is already in virtuals to avoid duplication
      if (!existingMapping.virtuals.includes(phoneNumber)) {
        existingMapping.virtuals.push(phoneNumber); // Add phoneNumber to virtuals
        await existingMapping.save(); // Save the updated document
        return res.status(200).json({
          success: true,
          message: "Phone number added to virtuals.",
          mapping: existingMapping,
        });
      } else {
        return res.status(409).json({
          success: false,
          message: "Phone number already exists in virtuals.",
        });
      }
    }

    // If no existing mapping, create a new one with phoneNumber as the first item in virtuals
    const newMapping = await UserMapping.create({
      rootId,
      endUserId,
      phoneNumber,
      address,
      type,
      countryCode,
      virtuals: [phoneNumber], // Initialize virtuals with phoneNumber
    });

    return res.status(201).json({ success: true, mapping: newMapping });
  } catch (error) {
    console.error("Error mapping phone number:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getAddressFromPhno = async (req, res, next) => {
  const { phoneNumber } = req.body;
  console.log(phoneNumber);
  try {
    const existingMapping = await UserMapping.findOne({ phone: phoneNumber });
    console.log(existingMapping);
    if (existingMapping) {
      return res.status(200).json({ success: true, mapping: existingMapping });
    } else {
      return res
        .status(204)
        .json({ success: false, message: "No mapping found." });
    }
  } catch (error) {
    console.error("Error mapping phone number:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
const getPhnoFromAddress = async (req, res, next) => {
  const { address } = req.body;
  console.log(address);
  try {
    const existingMapping = await UserMapping.findOne({ address });
    console.log(existingMapping);
    if (existingMapping) {
      return res.status(200).json({ success: true, mapping: existingMapping });
    } else if (existingMapping == null) {
      console.log("no mapping");
      return res
        .status(204)
        .json({ success: false, message: "No mapping found." });
    }
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
  try {
    const { issueUserToken } = await import("@coinbase/waas-server-auth");

    try {
      const { uuid } = req.body;
      console.log("uuid", uuid);
      console.log(apiKeyName, apiKeyName);
      if (apiKeyName != null && apiKeyName != null) {
        const token = await issueUserToken({
          apiKeyName: apiKeyName,
          privateKey: privateKey,
          userID: uuid,
        });

        console.log("auth done", token);
        res.json({ success: true, token });
      }
    } catch (error) {
      console.error("Error verifying user:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  } catch (e) {
    console.log(e);
    console.log("error");
    return res.status(500).json({ success: false, error: e.message });
  }
};

// New function to check if numbers exist in the DB and return email and address
const checkNumbers = async (req, res, next) => {
  console.log("called hadasdas");
  const { numbers } = req.body;

  console.log(numbers);

  try {
    const results = await Promise.all(
      numbers.map(async (number) => {
        const userMapping = await UserMapping.findOne({ phone: number });
        if (userMapping) {
          return {
            phone: number,
            email: userMapping.endUserId, // Assuming endUserId is the email
            address: userMapping.address,
          };
        } else {
          return {
            phone: number,
            email: null,
            address: null,
          };
        }
      })
    );

    return res.status(200).json({ success: true, results });
  } catch (error) {
    console.error("Error checking numbers:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
const checkNumbersgen = async (req, res, next) => {
  console.log("called hadasdas");
  const { numbers } = req.body;

  console.log(numbers);

  try {
    const results = await Promise.all(
      numbers.map(async (number) => {
        const exists = await UserMapping.exists({ phone: number });
        return { number, exists };
      })
    );
    return res.status(200).json({ success: true, results });
  } catch (error) {
    console.error("Error checking numbers:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const isNumberAvailable = async (req, res, next) => {
  console.log("Check if number is available");
  const { number } = req.body;

  console.log(number);

  try {
    const userMapping = await UserMapping.findOne({
      phone: number,
      countryCode: 999,
    });
    console.log(userMapping);
    if (userMapping) {
      return res.status(200).json({ success: true, available: true });
    } else {
      return res.status(204).json({ success: true, available: false });
    }
  } catch (error) {
    console.error("Error checking number:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const moralis = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { address, chain } = req.body;

  try {
    console.log(address);
    console.log(chain);
    if (!address || !chain) {
      return res
        .status(400)
        .json({ error: "Missing address or chain parameter" });
    }
    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      address: address,
      chain: chain,
      mediaItems: false,
      format: "decimal",
    });
    return res.status(200).json(response);
  } catch (e) {
    console.log(`Error: ${e}`);
    return res.status(400).json();
  }
};

const getAddressFromVirtual = async (req, res, next) => {
  const { virtual } = req.body; // changed from phoneNumber to virtual
  console.log(virtual);
  try {
    const existingMapping = await UserMapping.findOne({ virtuals: virtual }); // search for virtual in virtuals array
    console.log(existingMapping);
    if (existingMapping) {
      return res.status(200).json({ success: true, mapping: existingMapping });
    } else {
      return res
        .status(204)
        .json({ success: false, message: "No mapping found." });
    }
  } catch (error) {
    console.error("Error mapping virtual:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
const getAccessToken = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { walletAddress, roomid } = req.body;
  console.log(roomid);
  console.log(walletAddress);

  try {
    const accessToken = new AccessToken({
      apiKey: HUDDLE_API_KEY,
      roomId: roomid,
      //available roles: Role.HOST, Role.CO_HOST, Role.SPEAKER, Role.LISTENER, Role.GUEST - depending on the privileges you want to give to the user
      role: Role.HOST,
      //custom permissions give you more flexibility in terms of the user privileges than a pre-defined role
      permissions: {
        admin: true,
        canConsume: true,
        canProduce: true,
        canProduceSources: {
          cam: true,
          mic: true,
          screen: true,
        },
        canRecvData: true,
        canSendData: true,
        canUpdateMetadata: true,
      },
      options: {
        metadata: {
          // you can add any custom attributes here which you want to associate with the user
          walletAddress: walletAddress,
        },
      },
    });

    const token = await accessToken.toJwt();

    console.log(token);

    return res.status(200).json({ AccessToken: token });
  } catch (e) {
    console.log(`Error: ${e}`);
    return res.status(400).json();
  }
};

const getRoomId = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { walletAddress } = req.body;
  const api = new API({
    apiKey: HUDDLE_API_KEY,
  });
  const createNewTokenGatedRoom = await api.createRoom({
    title: "Huddle01 Room",
    chain: "ETHEREUM",
    tokenType: "ERC721",
    contractAddress: [walletAddress],
  });

  const roomId = createNewTokenGatedRoom?.data;

  return res.status(200).json(roomId);
};

module.exports = {
  verifyUser,
  mapPhoneNumber,
  UserCoinbaseAuthToken,
  getAddressFromPhno,
  getPhnoFromAddress,
  checkNumbers,
  isNumberAvailable,
  checkNumbersgen,
  moralis,
  getAddressFromVirtual,
  getAccessToken,
  getRoomId,
};
