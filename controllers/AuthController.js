const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const dotenv = require("dotenv");
const sendEmail = require("../Emails/sendEmail");
const {
  welcomeTemplate,
  forgetPasswordTemplate,
} = require("../Emails/emailTemplates");
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

exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    const decoded = jwt.verify(token, JWTSECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Hash new password and update user
    const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password has been reset successfully",
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired reset token" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate password reset token
    const resetToken = jwt.sign({ userId: user._id }, JWTSECRET, {
      expiresIn: "1h",
    });

    // Create reset link
    const resetLink = `${process.env.PASSWORD_RESETLINK}/reset-password/${resetToken}`;

    // Send password reset email
    const emailContent = forgetPasswordTemplate(user.name, resetLink);
    const emailSent = await sendEmail(
      email,
      emailContent.subject,
      emailContent.text
    );

    if (!emailSent) {
      return res.status(500).json({ message: "Error sending reset email" });
    }

    res.status(200).json({ message: "Password reset email sent successfully" });
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
