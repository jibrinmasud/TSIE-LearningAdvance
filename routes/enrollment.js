const express = require("express");
const enrollmentRouter = express.Router();
const enrollmentController = require("../controllers/enrollmentController");
const authmiddleware = require("../middleware/authmiddleware");
const authorizeRoles = require("../middleware/rolemiddleware");
enrollmentRouter
  .use(authmiddleware)
  .route("/")
  .get(authorizeRoles("student"), enrollmentController.index)
  .post(authorizeRoles("student"), enrollmentController.create);

enrollmentRouter
  .route("/:id")
  .get(authorizeRoles("student"), enrollmentController.show)
  .patch(authorizeRoles("student"), enrollmentController.update)
  .delete(authorizeRoles("student"), enrollmentController.delete);

module.exports = enrollmentRouter;