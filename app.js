const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const routes = require("./routes/index");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectdb = require("./database/booksDb");

dotenv.config();
connectdb();
const PORT = process.env.PORT || 5000;
const MONGOURL = process.env.MONGO_URL;

app.set("view engine", "pug");

app.use(bodyParser.json());
app.use(routes);

mongoose
  .connect(MONGOURL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
