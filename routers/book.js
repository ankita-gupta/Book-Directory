const express = require("express");
const router = new express.Router();
const Book = require("../models/book");
const auth = require("../middlewares/auth");

router.get("/books", auth, async (req, res) => {
  const books = await Book.find({ author: req.user._id });
  res.send(books);
});

router.get("/book/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const book = await Book.findOne({ _id, author: req.user._id });
    if (!book) {
      return res.status(404).send({ error: "Book not found" });
    }
    res.send(book);
  } catch (e) {
    res.status(404).send(e);
  }
});

router.post("/book", auth, async (req, res) => {
  const book = new Book({ ...req.body, author: req.user._id });
  try {
    await book.save();
    res.status(201).send(book);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/book/:id", auth, async (req, res) => {
  try {
    await Book.findOneAndDelete({ _id: req.params.id, author: req.user._id });
    res.send();
  } catch (e) {
    res.status(404).send(e);
  }
});

router.patch("/book/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowed_updates = [
    "title",
    "author",
    "publication_date",
    "genre",
    "summary",
  ];
  const isValidOperation = updates.every((update) =>
    allowed_updates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      author: req.user._id,
    });
    if (!book) {
      return res.status(404).send();
    }
    updates.forEach((update) => (book[update] = req.body[update]));
    await book.save();
    res.send(book);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
