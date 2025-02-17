const express = require("express");
const authRoutes = express.Router();
const AuthController = require("../controllers/AuthController");
const userSchema = require("../models/validation/UserValidation");
const validate = require("../middlewares/validate");
authRoutes.post("/signup", AuthController.signup, validate(userSchema));
authRoutes.post("/login", AuthController.login);

module.exports = authRoutes;
