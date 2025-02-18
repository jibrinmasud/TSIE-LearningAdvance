const express = require("express");
const courseRouter = express.Router();
const CourseController = require("../controllers/CourseController");
const authmiddleware = require("../middleware/authmiddleware");
const authorizeRoles = require("../middleware/rolemiddleware");
const upload = require("../config/multer");

const courseUpload = upload.fields([
  { name: "courseImage", maxCount: 1 },
  { name: "courseVideo", maxCount: 1 },
]);

courseRouter
  .route("/")
  .get(CourseController.index)
  .post(
    authmiddleware,
    authorizeRoles("instructor"),
    courseUpload,
    CourseController.create
  );
courseRouter
  .route("/analytics")
  .get(
    CourseController.courseAnalytics,
    authmiddleware,
    authorizeRoles("instructor")
  );

courseRouter
  .route("/:category")
  .get(
    CourseController.show,
    authmiddleware,
    authorizeRoles("student", "instructor")
  );

courseRouter
  .route("/:id")
  .patch(
    authmiddleware,
    authorizeRoles("instructor"),
    courseUpload,
    CourseController.update
  )
  .delete(
    authmiddleware,
    authorizeRoles("instructor"),
    CourseController.delete
  );

module.exports = courseRouter;
