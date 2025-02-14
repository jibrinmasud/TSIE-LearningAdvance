const express = require("express");
const bookRouter = express.Router();
const BookController = require("../controllers/BookController");
const authmiddleware = require("../middleware/authmiddleware");

bookRouter
  .use(authmiddleware)
  .route("/")
  .get(BookController.show)
  .post(BookController.create);

bookRouter
  .route("/:id")
  .get(BookController.show)
  .patch(BookController.update)
  .delete(BookController.delete);

module.exports = bookRouter;
