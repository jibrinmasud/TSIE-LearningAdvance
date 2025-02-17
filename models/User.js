const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "instructor"],
    required: true,
  },
  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
    },
  ],
  enllormentDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("User", UserSchema);