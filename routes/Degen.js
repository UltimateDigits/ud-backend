const express = require("express");
const cors = require("cors");

const {CheckNumber,GenerateNumbers,SetMinted} = require("../controller/degen")




const router = express.Router();

router.use(cors("*"));


router.route("/checkDegen").post(CheckNumber)
router.route("/generateNumbers").post(GenerateNumbers)
router.route("/setMinted").post(SetMinted)




module.exports = router;
