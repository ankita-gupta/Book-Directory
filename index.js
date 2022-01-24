const express = require("express");
const bookRouter = require("./routers/book");
const userRouter = require("./routers/user");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/book-directory");

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(bookRouter);
app.use(userRouter);
app.listen(port);
