const mongoose = require("../db/db.js");

const winksSchema = new mongoose.Schema({
  walletAddress: String,
  amount: Number,
  chainDetails: String,
  uniqueId: String,
  type: Number,
  contractAddress: String,
  abi: String,
  functionName: String,
  uri: String,
  tokenAddress: String,
});

const Winks = mongoose.model("Winks", winksSchema);

module.exports = Winks;
