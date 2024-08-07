const mongoose = require("mongoose");
require("dotenv").config();

const dbURI =  process.env.DB
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = mongoose;
