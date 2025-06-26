const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  if (!isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  // Task 1: Get all books
  return res.status(200).send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  // Task 2: Get book by ISBN
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 2));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  // Task 3: Get books by author
  const author = req.params.author;
  const matchingBooks = Object.values(books).filter(
    (book) => book.author === author
  );
  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 2));
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  // Task 4: Get books by title
  const title = req.params.title;
  const matchingBooks = Object.values(books).filter(
    (book) => book.title === title
  );
  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 2));
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  // Task 5: Get book reviews by ISBN
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 2));
  } else {
    return res.status(404).json({ message: "No reviews found for this book" });
  }
});

// Task 10: Get all books using async/await with Axios
public_users.get("/async/books", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");
    res.status(200).send(response.data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11: Get book by ISBN using Promise callback with Axios
public_users.get("/async/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  axios
    .get(`http://localhost:5000/isbn/${isbn}`)
    .then((response) => res.status(200).send(response.data))
    .catch(() => res.status(404).json({ message: "Book not found" }));
});

// Task 12: Get books by author using async/await with Axios
public_users.get("/async/author/:author", async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    res.status(200).send(response.data);
  } catch (err) {
    res.status(404).json({ message: "No books found for this author" });
  }
});

// Task 13: Get books by title using Promise callback with Axios
public_users.get("/async/title/:title", (req, res) => {
  const title = req.params.title;
  axios
    .get(`http://localhost:5000/title/${title}`)
    .then((response) => res.status(200).send(response.data))
    .catch(() =>
      res.status(404).json({ message: "No books found with this title" })
    );
});

module.exports.general = public_users;
