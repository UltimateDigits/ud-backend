const Winks = require("../models/Winks");
const { v4: uuidv4 } = require("uuid"); // Ensure you have this import for uuidv4

const createWink = async (req, res, next) => {
  console.log("called");

  const {
    walletAddress,
    amount,
    chainDetails,
    type,
    contractAddress,
    functionName,
    uri,
    abi,
    tokenAddress,
  } = req.body;

  console.log(
    walletAddress,
    amount,
    chainDetails,
    type,
    contractAddress,
    functionName,
    uri,
    abi,
    tokenAddress
  );

  let uniqueId;
  let isUnique = false;

  // Generate a unique ID and check if it already exists in the database
  while (!isUnique) {
    uniqueId = uuidv4();
    const existingLink = await Link.findOne({ uniqueId });
    if (!existingLink) {
      isUnique = true;
    }
  }

  const newLink = new Link({
    walletAddress,
    amount,
    chainDetails,
    uniqueId,
    type,
    contractAddress,
    functionName,
    abi,
    uri,
    tokenAddress,
  });

  await newLink.save();

  res.status(200).json({ link: `http://localhost:3000/?search=${uniqueId}` });
};

module.exports = {
  createWink,
};
