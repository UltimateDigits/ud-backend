const mongoose = require("../db/db.js");


const numbersu2uSchema = new mongoose.Schema({
    number:String,
    minted:Boolean
  });
  
  const Numbers = mongoose.model("NumbersU2U", numbersu2uSchema);
  
  module.exports = Numbers;