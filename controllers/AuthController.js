const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const dotenv = require("dotenv");
dotenv.config();
const JWTSECRET = process.env.JWT_SECRET;
var jwt = require("jsonwebtoken");
exports.signup = async (req, res) => {
  const password = bcrypt.hashSync(req.body.password, saltRounds);
  const user = await User.create({ ...req.body, password });
  res.json({ user });
};

exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(401).json({ message: "Incorrect Email or  password" });
  }
  const token = jwt.sign({ user }, JWTSECRET);
  res.json({ user, access_token: token });
};
