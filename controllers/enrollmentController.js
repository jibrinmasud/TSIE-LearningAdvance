const Student = require("../models/student");
const Course = require("../models/course");
exports.index = async (req, res) => {
  const enrollments = await Enrollment.find();
  res.json(enrollments);
};
exports.create = async (req, res) => {
  const { studentId, courseId } = req.body;
  const student = await Student.findById(studentId);
  const course = await Course.findById(courseId);
  if (!student || !course) {
    return res.status(404).json({ message: "Student or Course not found" });
  }
  const newEnrollment = new Enrollment({ student, course });
  const savedEnrollment = await newEnrollment.save();
  res.json(savedEnrollment);
};

exports.show = async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);
  res.json(enrollment);
};
exports.update = async (req, res) => {
  const updatedEnrollment = await Enrollment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedEnrollment);
};
exports.delete = async (req, res) => {
  const deletedEnrollment = await Enrollment.findByIdAndDelete(req.params.id);
  res.json(deletedEnrollment);
};
