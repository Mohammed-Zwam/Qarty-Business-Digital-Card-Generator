const express = require("express");
const router = express.Router();
const digitalCardController = require("../controllers/digitalCardController");
const validateDigitalCardDataMW = require("../middlewares/validateDigitalCardDataMW");
const authMW = require("../middlewares/authMW");
const upload = require('../middlewares/readImgFile');
const uploadImgToCloudinary = require("../middlewares/uploadImgToCloudinary");

router.get("/getDigitalCard/:userCardID", digitalCardController.getDigitalCard);



// PROTECTED ROUTES
router.use(authMW);
router.post("/create", upload.single("image"), uploadImgToCloudinary, validateDigitalCardDataMW, digitalCardController.createDigitalCard);
router.delete("/delete", digitalCardController.deleteDigitalCard);
router.put("/update", upload.single("image"), uploadImgToCloudinary, validateDigitalCardDataMW, digitalCardController.updateDigitalCard);


module.exports = router;