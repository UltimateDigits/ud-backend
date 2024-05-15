const mongoose = require("../db/db.js");


const numbersAvaxSchema = new mongoose.Schema({
    number:String,
    minted:Boolean
  });
  
  const Numbers = mongoose.model("NumbersAVAX", numbersAvaxSchema);
  
  module.exports = Numbers;