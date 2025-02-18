const { ObjectId } = require("mongodb");
const Course = require("../models/course");
const validation = require("../models/validation/CourseValidation");
const User = require("../models/User");
const authorizeRoles = require("../middleware/rolemiddleware");
const authmiddleware = require("../middleware/authmiddleware");
const cloudinary = require("../config/cloudinary");
const Enrollment = require("../models/enrollment");

exports.index = async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
};

exports.create = [
  authmiddleware,
  authorizeRoles("instructor"),
  async (req, res) => {
    try {
      const { error, value } = validation.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Initialize variables for storing Cloudinary URLs
      let courseImage, courseVideo;

      // Validate file sizes (additional check even though multer handles this)
      const maxSize = 1024 * 1024 * 1024; // 1GB
      if (req.files) {
        for (let fileType in req.files) {
          if (req.files[fileType][0].size > maxSize) {
            return res.status(400).json({
              error: `${fileType} exceeds maximum file size of 1GB`,
            });
          }
        }
      }

      if (req.files && req.files.courseImage) {
        const result = await cloudinary.uploader.upload(
          req.files.courseImage[0].path,
          {
            folder: "courses/images",
            resource_type: "auto",
            timeout: 120000, // 2 minute timeout for large files
          }
        );
        courseImage = result.secure_url;
      }

      if (req.files && req.files.courseVideo) {
        const result = await cloudinary.uploader.upload(
          req.files.courseVideo[0].path,
          {
            folder: "courses/videos",
            resource_type: "video",
            timeout: 600000, // 10 minute timeout for large video files
            chunk_size: 20000000, // 20MB chunks for better upload handling
          }
        );
        courseVideo = result.secure_url;
      }

      const courseData = {
        ...req.body,
        courseImage,
        courseVideo,
        instructor: req.user._id,
      };

      const course = new Course(courseData);
      await course.save();

      res.status(201).json({
        success: true,
        message: "Course created successfully",
        course: {
          id: course._id,
          title: course.title,
          instructor: course.instructor,
          courseImage: course.courseImage,
          courseVideo: course.courseVideo,
          price: course.price,
          description: course.description,
          category: course.category,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];

exports.courseAnalytics = [
  authmiddleware,
  authorizeRoles("instructor"),
  async (req, res) => {
    try {
      // Get aggregated course analytics
      const analytics = await enrollment.aggregate([
        {
          $lookup: {
            from: "courses",
            localField: "course",
            foreignField: "_id",
            as: "courseDetails",
          },
        },
        {
          $unwind: "$courseDetails",
        },
        {
          $lookup: {
            from: "users",
            localField: "student",
            foreignField: "_id",
            as: "studentDetails",
          },
        },
        {
          $unwind: "$studentDetails",
        },
        {
          $group: {
            _id: "$course",
            courseName: { $first: "$courseDetails.title" },
            totalEnrollments: { $sum: 1 },
            activeStudents: {
              $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
            },
            completedStudents: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
            droppedStudents: {
              $sum: { $cond: [{ $eq: ["$status", "dropped"] }, 1, 0] },
            },
            averageRating: { $avg: "$courseDetails.rating" },
            students: {
              $push: {
                studentId: "$studentDetails._id",
                name: "$studentDetails.name",
                email: "$studentDetails.email",
                status: "$status",
                enrollmentDate: "$enrollmentDate",
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            courseName: 1,
            totalEnrollments: 1,
            activeStudents: 1,
            completedStudents: 1,
            droppedStudents: 1,
            averageRating: { $round: ["$averageRating", 1] },
            students: 1,
          },
        },
      ]);

      res.status(200).json({
        success: true,
        analytics,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching course analytics",
        error: error.message,
      });
    }
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
  try {
    const _id = new ObjectId(req.params.id);

    let updateData = { ...req.body };

    if (req.files && req.files.courseImage) {
      const result = await cloudinary.uploader.upload(
        req.files.courseImage[0].path,
        {
          folder: "courses/images",
        }
      );
      updateData.courseImage = result.secure_url;
    }

    if (req.files && req.files.courseVideo) {
      const result = await cloudinary.uploader.upload(
        req.files.courseVideo[0].path,
        {
          folder: "courses/videos",
          resource_type: "video",
        }
      );
      updateData.courseVideo = result.secure_url;
    }

    await Course.findByIdAndUpdate(_id, updateData);
    res.json({ data: "Course updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  const deletedCourse = await Course.findByIdAndDelete(req.params.id);
  res.json(deletedCourse);
};

exports.courseAnalytics = async (req, res) => {
  try {
    const totalcourse = Course.aggregate([
      {
        $match: { ratingAverage: { $gte: 4 } },
      },
      {
        $group: {
          _id: null,
          totalcourse: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json({ status: "success", data: totalcourse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
