const express = require("express");
const cors = require("cors");
const {
  verifyUser,
  mapPhoneNumber,
  UserCoinbaseAuthToken,
  getAddressFromPhno,
  getPhnoFromAddress,
  checkNumbers,
  isNumberAvailable,
  checkNumbersgen,
  moralis,
  getAddressFromVirtual,
  getAccessToken,
  getRoomId,
  checkNumbersExist,
  checkAddressExists
} = require("../controller/coinbase-auth");

const router = express.Router();

router.use(cors("*"));

router.route("/checknum").post(checkNumbers);
router.route("/checknumexists").post(checkNumbersExist);
router.route("/verify").post(verifyUser);
router.route("/map-phno").post(mapPhoneNumber);
router.route("/coinbaseAuth").post(UserCoinbaseAuthToken);
router.route("/getAddress").post(getAddressFromPhno);
router.route("/getPhno").post(getPhnoFromAddress);
router.route("/getvirtuals").post(isNumberAvailable);
router.route("/checknumbersgen").post(checkNumbersgen);
router.route("/moralis").post(moralis);
router.route("/getvirt").post(getAddressFromVirtual);
router.route("/getAccessToken").post(getAccessToken);
router.route("/getRoomId").post(getRoomId);
router.route("/addressExists").post(checkAddressExists);

module.exports = router;
