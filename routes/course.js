const express = require("express");
const courseRouter = express.Router();
const CourseController = require("../controllers/CourseController");
const authmiddleware = require("../middleware/authmiddleware");
const validateSchema = require("../middleware/validationmiddleware");
const authorizeRoles = require("../middleware/rolemiddleware");

courseRouter
  .route("/")
  .get(CourseController.index)
  //only instructor can create a course
  .post(
    CourseController.create,
    authmiddleware,
    validateSchema,
    authorizeRoles("instructor")
  );
//instructor and user can view courses
courseRouter
  .route("/:category")
  .get(
    CourseController.show,
    authmiddleware,
    authorizeRoles("student", "instructor")
  );
//only instructor can be able to update and delete a cousre
courseRouter
  .route("/:id")
  .patch(authmiddleware, authorizeRoles("instructor"), CourseController.update)
  .delete(
    CourseController.delete,
    authmiddleware,
    authorizeRoles("instructor")
  );

module.exports = courseRouter;
