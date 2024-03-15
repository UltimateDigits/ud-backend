const mongoose = require("../db/db.js");

const userMappingSchema = new mongoose.Schema({
  rootId: String,
  endUserId: String,
  phone: String,
  address: String,
  type: String,
  countryCode: String,
});

const UserMapping = mongoose.model("UserMapping", userMappingSchema);

module.exports = UserMapping;
