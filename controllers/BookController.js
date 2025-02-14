const { ObjectId } = require("mongodb");
const book = require("../models/book");

exports.index = async (req, res) => {
  const books = await book.find();
  res.json(books);
};

exports.create = async (req, res) => {
  try {
    if (!req.body.title || !req.body.author || !req.body.published_year) {
      return res.status(400).json({ error: "Data is incomplete" });
    }
    const existingBook = await book.findOne({ title: req.body.title });
    if (existingBook) {
      return res.status(400).json({ error: "Book already exists" });
    }
    const newBook = new book(req.body);
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.show = async (req, res) => {
  const _id = new ObjectId(req.params.id);
  const books = await book.findOne({ _id });
  res.json(books);
};

exports.update = async (req, res) => {
  const _id = new ObjectId(req.params.id);
  const books = await book.findByIdAndUpdate(_id, req.body);
  res.json({ data: "Book updated" });
};

exports.delete = async (req, res) => {
  const _id = new ObjectId(req.params.id);
  const books = await book.findByIdAndDelete({ _id });
  res.status(204).json();
};
