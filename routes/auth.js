const express = require("express");
const authRoutes = express.Router();
const AuthController = require("../controllers/AuthController");
const userSchema = require("../models/validation/UserValidation");
const validate = require("../middleware/validationmiddleware");

authRoutes.post("/signup", validate(userSchema), AuthController.signup);
authRoutes.post("/login", AuthController.login);
authRoutes.post("/forgot-password", AuthController.forgotPassword);
authRoutes.get("/reset-password/:token", AuthController.verifyResetToken);

module.exports = authRoutes;
