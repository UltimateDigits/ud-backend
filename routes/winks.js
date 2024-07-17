const express = require("express");
const cors = require("cors");
const { createWink } = require("../controller/winks-url");

const router = express.Router();
router.use(cors("*"));

router.route("/createWink").post(createWink);

module.exports = router;
