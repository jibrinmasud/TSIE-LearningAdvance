const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const dotenv = require("dotenv");
const sendEmail = require("../Emails/sendEmail");
const { welcomeTemplate } = require("../Emails/emailTemplates");
dotenv.config();
const JWTSECRET = process.env.JWT_SECRET;
var jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check for existing user first
    const existingUser = await User.findOne({ email, role });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    // Send welcome email
    const emailContent = welcomeTemplate(name, role);
    await sendEmail(email, emailContent.subject, emailContent.text);

    res.status(201).json({
      message: `User created successfully, UserName:${name}, Email:${email}, Role:${role}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({ message: "Incorrect Email or  password" });
    }
    const token = jwt.sign(
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      JWTSECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
