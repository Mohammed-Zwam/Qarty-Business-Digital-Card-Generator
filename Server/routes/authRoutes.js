const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const validateRegisterDataMW = require('../middlewares/validateRegisterDataMW');
const validateLoginDataMW = require('../middlewares/validateLoginDataMW');


router.post("/signup", validateRegisterDataMW, authController.register);
router.post("/login", validateLoginDataMW, authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);



module.exports = router;