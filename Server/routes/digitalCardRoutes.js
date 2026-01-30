const express = require("express");
const router = express.Router();
const digitalCardController = require("../controllers/digitalCardController");
const validateDigitalCardDataMW = require("../middlewares/validateDigitalCardDataMW");
const authMW = require("../middlewares/authMW");
const upload = require('../middlewares/readImgFile');
const uploadImgToCloudinary = require("../middlewares/uploadImgToCloudinary");

router.get("/:userCardID", digitalCardController.getDigitalCard);



// PROTECTED ROUTES
router.use(authMW);
router.post("/", upload.single("image"), uploadImgToCloudinary, validateDigitalCardDataMW, digitalCardController.createDigitalCard);
router.delete("/", digitalCardController.deleteDigitalCard);
router.put("/", upload.single("image"), uploadImgToCloudinary, validateDigitalCardDataMW, digitalCardController.updateDigitalCard);


module.exports = router;