const { ObjectId } = require("mongodb");
const Course = require("../models/course");
const validation = require("../models/validation/CourseValidation");
const User = require("../models/User");
const authorizeRoles = require("../middleware/rolemiddleware");
const authmiddleware = require("../middleware/authmiddleware");

exports.index = async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
};
exports.create = [
  authmiddleware,
  authorizeRoles("instructor"),
  async (req, res) => {
    const { error, value } = validation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  },
];
exports.show = async (req, res) => {
  try {
    const courses = await Course.find({ category: req.params.category });
    if (courses.length === 0) {
      return res
        .status(404)
        .json({ message: "No courses found for this category" });
    }
    res.json(courses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

exports.update = async (req, res) => {
  const _id = new ObjectId(req.params.id);
  await Course.findByIdAndUpdate(_id, req.body);
  res.json({ data: "Course updated" });
};
exports.delete = async (req, res) => {
  const deletedCourse = await Course.findByIdAndDelete(req.params.id);
  res.json(deletedCourse);
};
