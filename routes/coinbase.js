const express = require("express");
const cors = require("cors");
const {
  verifyUser,
  mapPhoneNumber,
  UserCoinbaseAuthToken,
  getAddressFromPhno,
  getPhnoFromAddress,
  checkNumbers,
} = require("../controller/coinbase-auth");

const router = express.Router();

router.use(cors("*"));

router.route("/checknum").post(checkNumbers);
router.route("/verify").post(verifyUser);
router.route("/map-phno").post(mapPhoneNumber);
router.route("/coinbaseAuth").post(UserCoinbaseAuthToken);
router.route("/getAddress").post(getAddressFromPhno);
router.route("/getPhno").post(getPhnoFromAddress);

module.exports = router;
