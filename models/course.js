const { Schema, mongoose } = require("mongoose");
const CourseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: false,
  },
  rating: {
    type: Number,
    required: false,
  },
  enrolledStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});
module.exports = mongoose.model("course", CourseSchema);
