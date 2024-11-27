const express = require("express");
const cors = require("cors");
const { createWink, getWink, proxyHer } = require("../controller/winks-url");

const router = express.Router();
router.use(cors("*"));

router.route("/createWink").post(createWink);
router.route("/getWink/:uniqueId").get(getWink);
router.route("/proxy").get(proxyHer);

module.exports = router;
