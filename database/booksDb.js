const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB", error.message);
  }
};

module.exports = connectdb;
