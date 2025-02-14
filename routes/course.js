const express = require("express");
const courseRouter = express.Router();
const CourseController = require("../controllers/CourseController");
const authmiddleware = require("../middleware/authmiddleware");

courseRouter
  .use(authmiddleware)
  .route("/")
  .get(CourseController.index)
  .post(CourseController.create);

courseRouter
  .route("/:category")
  .get(CourseController.show)
  .patch(CourseController.update)
  .delete(CourseController.delete);

module.exports = courseRouter;
