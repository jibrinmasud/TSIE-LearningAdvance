const { Schema, mongoose } = require("mongoose");
const BookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },

  published_year: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
module.exports =  mongoose.model("book", BookSchema);
