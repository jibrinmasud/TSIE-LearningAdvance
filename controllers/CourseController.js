const { ObjectId } = require("mongodb");
const Course = require("../models/course");

exports.index = async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
};
exports.create = async (req, res) => {
  const newCourse = new Course(req.body);
  const savedCourse = await newCourse.save();
  res.json(savedCourse);
};

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
  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedCourse);
};
exports.delete = async (req, res) => {
  const deletedCourse = await Course.findByIdAndDelete(req.params.id);
  res.json(deletedCourse);
};
