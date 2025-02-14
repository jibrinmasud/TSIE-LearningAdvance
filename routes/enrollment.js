const express = require("express");
const enrollementRouter = express.Router();
const enrollmentController = require("../controllers/enrollmentController");
const authmiddleware = require("../middleware/authmiddleware");
enrollementRouter
  .use(authmiddleware)
  .route("/")
  .get(enrollmentController.index)
  .post(enrollmentController.create);

enrollementRouter
  .route("/:id")
  .get(enrollmentController.show)
  .patch(enrollmentController.update)
  .delete(enrollmentController.delete);
module.exports = enrollementRouter;
