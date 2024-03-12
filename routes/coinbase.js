const express = require("express");
const cors = require("cors");
const {
  verifyUser,
  mapPhoneNumber,
  UserCoinbaseAuthToken,
} = require("../controller/coinbase-auth");
const router = express.Router();

router.use(cors("*"));

router.route("/verify").post(verifyUser);
router.route("/map-phno").post(mapPhoneNumber);
router.route("/coinbaseAuth").post(UserCoinbaseAuthToken);

module.exports = router;
