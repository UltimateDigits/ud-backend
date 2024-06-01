const mongoose = require("mongoose");

const dbURI =
  "mongodb+srv://udmain:Qm6CJDapfQ4ehxEF@ud-main.xnsjd.mongodb.net/?retryWrites=true&w=majority&appName=UD-main";
//mongodb+srv://Thiru:Gryffindor7@cluster0.96vb1.mongodb.net/UD
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = mongoose;
