const Student = require("../models/student");
const Course = require("../models/course");
const Enrollment = require("../models/enrollment");

exports.index = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'name email')
      .populate('course', 'title description');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enrollments", error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    
    // Validate input
    if (!studentId || !courseId) {
      return res.status(400).json({ message: "Student ID and Course ID are required" });
    }

    // Find student and course
    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);
    
    if (!student || !course) {
      return res.status(404).json({ message: "Student or Course not found" });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: "Student is already enrolled in this course" });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      student: studentId,
      course: courseId
    });
    
    // Save enrollment and update references
    await enrollment.save();
    student.enrolledCourses.push(courseId);
    await student.save();
    
    course.enrolledStudents.push(studentId);
    await course.save();

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: "Error creating enrollment", error: error.message });
  }
};

exports.show = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('student', 'name email')
      .populate('course', 'title description');
    
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enrollment", error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'completed', 'dropped'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    enrollment.status = status;
    await enrollment.save();

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: "Error updating enrollment", error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // Remove course from student's enrolled courses
    await Student.findByIdAndUpdate(enrollment.student, {
      $pull: { enrolledCourses: enrollment.course }
    });

    // Remove student from course's enrolled students
    await Course.findByIdAndUpdate(enrollment.course, {
      $pull: { enrolledStudents: enrollment.student }
    });

    await Enrollment.findByIdAndDelete(req.params.id);
    res.json({ message: "Enrollment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting enrollment", error: error.message });
  }
};