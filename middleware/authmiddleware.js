const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ObjectId } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();
const JWTSECRET = process.env.JWT_SECRET;

const authmiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Authorization header missing or invalid" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized No Token Provided" });
  }

  try {
    const decoded = await jwt.verify(token, JWTSECRET);
    console.log('Decoded token:', decoded);
    console.log('User from token:', decoded.user);
    if (!decoded.user) {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    req.user = decoded.user;
    console.log('Setting req.user to:', req.user);
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authmiddleware;