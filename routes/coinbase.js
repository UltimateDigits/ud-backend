const express = require("express");
const cors = require("cors");
const {
  verifyUser,
  mapPhoneNumber,
  UserCoinbaseAuthToken,
  getAddressFromPhno,
  getPhnoFromAddress,
} = require("../controller/coinbase-auth");

const { userLog } = require("../controller/coinbase-backend.ts");
const router = express.Router();

router.use(cors("*"));

router.route("/verify").post(verifyUser);
router.route("/map-phno").post(mapPhoneNumber);
router.route("/coinbaseAuth").post(userLog);
router.route("/getAddress").post(getAddressFromPhno);
router.route("/getPhno").post(getPhnoFromAddress);

module.exports = router;
