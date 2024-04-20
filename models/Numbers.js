const mongoose = require("../db/db.js");


const numbersSchema = new mongoose.Schema({
    number:String,
    minted:Boolean
  });
  
  const Numbers = mongoose.model("Numbers", numbersSchema);
  
  module.exports = Numbers;