const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const { verify, verifyAdmin, isLoggedIn } = require("../auth");

const auth = require("../auth");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

router.get("/details", verify, userController.getProfile);
router.put("/profile", verify, userController.updateProfile);

module.exports = router;