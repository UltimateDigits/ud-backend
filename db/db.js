const mongoose = require("mongoose");
require("dotenv").config();

const dbURI = "mongodb+srv://udmain:Qm6CJDapfQ4ehxEF@ud-main.xnsjd.mongodb.net/UD"
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = mongoose;
