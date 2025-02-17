const User = require("../models/User");
const Course = require("../models/course");
const Enrollment = require("../models/enrollment");
const { ObjectId } = require("mongodb");

exports.index = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || user.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    const enrollments = await Enrollment.find({ student: user._id })
      .populate("student", "name email")
      .populate("course", "title description");
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching enrollments",
      error: error.message,
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || user.role !== "student") {
      return res.status(404).json({
        message: "Student profile not found or user is not a student",
      });
    }
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const existingEnrollment = await Enrollment.findOne({
      student: user._id,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        message: "Student is already enrolled in this course",
      });
    }

    const enrollment = new Enrollment({
      student: user._id,
      course: courseId,
      status: "active",
    });

    await enrollment.save();

    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      await user.save();
    }

    const populatedEnrollment = await enrollment.populate([
      "student",
      "course",
    ]);

    res.status(201).json({
      message: "Enrollment successful",
      enrollment: populatedEnrollment.Course,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating enrollment",
      error: error.message,
    });
  }
};

exports.show = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      student: student._id,
    }).populate(["student", "course"]);

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching enrollment",
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const enrollment = await Enrollment.findOneAndUpdate(
      {
        _id: req.params.id,
        student: student._id,
      },
      { status: req.body.status },
      { new: true }
    ).populate(["student", "course"]);

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({
      message: "Error updating enrollment",
      error: error.message,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const enrollment = await Enrollment.findOneAndDelete({
      _id: req.params.id,
      student: student._id,
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // Remove course from student's enrolled courses
    student.enrolledCourses = student.enrolledCourses.filter(
      (courseId) => courseId.toString() !== enrollment.course.toString()
    );
    await student.save();

    res.json({ message: "Enrollment deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting enrollment",
      error: error.message,
    });
  }
};
