const jwt = require("jsonwebtoken");
const fs = require("fs"); // Import the File System module
const path = require("path"); // Import the Path module to ensure path compatibility
const { APIKEYNAME, PRIVATEKEY } = process.env;

// Assuming the file is in the root directory of your project. Adjust the path as necessary.
const filePath = path.join(__dirname, "coinbase_cloud_api_key.json");

// Use fs.readFileSync to read the file content synchronously
const fileContent = fs.readFileSync(filePath, "utf8");
const coinbaseCloudApiKey = JSON.parse(fileContent);

const apiKeyName = coinbaseCloudApiKey.name;
const privateKey = coinbaseCloudApiKey.privateKey;

const userLog = async (req, res, next) => {
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

module.exports = {
  userLog,
};
