const { Schema, mongoose } = require("mongoose");
const CourseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: "User",
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
  courseImage: {
    type: String,
    required: false,
  },
  courseVideo: {
    type: String,
    required: false,
  },
  enrolledStudents: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Course", CourseSchema);
