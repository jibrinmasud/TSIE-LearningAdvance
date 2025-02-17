const express = require("express");
const authRoutes = express.Router();
const AuthController = require("../controllers/AuthController");
const userSchema = require("../models/validation/UserValidation");
const validate = require("../middleware/validationmiddleware");

authRoutes.post("/signup", validate(userSchema), AuthController.signup);
authRoutes.post("/login", AuthController.login);

module.exports = authRoutes;
