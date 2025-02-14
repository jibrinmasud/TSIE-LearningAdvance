const express = require("express");
const router = express.Router();
const bookRouter = require("./book");
const courseRouter = require("./course");
const enrollementRouter = require("./enrollment");
const path = require("path");
const authRouter = require("./auth");

router.get("/", (req, res) => {
  res.render("index");
});
router.use("/book", bookRouter);
router.use("/auth", authRouter);
router.use("/course", courseRouter);
router.use("/enrollement", enrollementRouter);
// router.all("/*", (req, res) => {
//   res.render("404");
// });

module.exports = router;
