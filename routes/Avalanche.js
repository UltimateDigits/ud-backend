const express = require("express");
const cors = require("cors");

const {CheckNumber,GenerateNumbers,SetMinted,SetMintedBulk} = require("../controller/avalance")




const router = express.Router();

router.use(cors("*"));


router.route("/checkDegen").post(CheckNumber)
router.route("/generateNumbers").post(GenerateNumbers)
router.route("/setMinted").post(SetMinted)
router.route("/setMintedBulk").post(SetMintedBulk)




module.exports = router;
