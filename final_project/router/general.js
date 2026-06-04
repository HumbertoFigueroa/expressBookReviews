const express = require("express");
const axios = require("axios");

let books = require("./booksdb.js");
let users = require("./usersdb.js");

const public_users = express.Router();


// Register new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  const userExists = users.find((user) => user.username === username);

  if (userExists) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({ username, password });

  return res.status(201).json({
    message: "User registered successfully"
  });
});


// Task 1 - Get all books
public_users.get("/", function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});


// Task 2 - Get book by ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn], null, 4));
  }

  return res.status(404).json({
    message: "Book not found"
  });
});


// Task 3 - Get books by author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author.toLowerCase();
  const result = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].author.toLowerCase() === author) {
      result[isbn] = books[isbn];
    }
  });

  if (Object.keys(result).length > 0) {
    return res.status(200).send(JSON.stringify(result, null, 4));
  }

  return res.status(404).json({
    message: "No books found by this author"
  });
});


// Task 4 - Get books by title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title.toLowerCase();
  const result = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].title.toLowerCase() === title) {
      result[isbn] = books[isbn];
    }
  });

  if (Object.keys(result).length > 0) {
    return res.status(200).send(JSON.stringify(result, null, 4));
  }

  return res.status(404).json({
    message: "No books found with this title"
  });
});


// Task 5 - Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  }

  return res.status(404).json({
    message: "Book not found"
  });
});


// Task 10 - Get all books using async/await with Axios
public_users.get("/async/books", async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).send(
      typeof response.data === "string"
        ? response.data
        : JSON.stringify(response.data, null, 4)
    );
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books"
    });
  }
});


// Task 11 - Get book by ISBN using async/await with Axios
public_users.get("/async/isbn/:isbn", async function (req, res) {
  try {
    const isbn = encodeURIComponent(req.params.isbn);
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);

    return res.status(200).send(
      typeof response.data === "string"
        ? response.data
        : JSON.stringify(response.data, null, 4)
    );
  } catch (error) {
    return res.status(404).json({
      message: "Book not found"
    });
  }
});


// Task 12 - Get books by author using async/await with Axios
public_users.get("/async/author/:author", async function (req, res) {
  try {
    const author = encodeURIComponent(req.params.author);
    const response = await axios.get(`http://localhost:5000/author/${author}`);

    return res.status(200).send(
      typeof response.data === "string"
        ? response.data
        : JSON.stringify(response.data, null, 4)
    );
  } catch (error) {
    return res.status(404).json({
      message: "No books found by this author"
    });
  }
});


// Task 13 - Get books by title using async/await with Axios
public_users.get("/async/title/:title", async function (req, res) {
  try {
    const title = encodeURIComponent(req.params.title);
    const response = await axios.get(`http://localhost:5000/title/${title}`);

    return res.status(200).send(
      typeof response.data === "string"
        ? response.data
        : JSON.stringify(response.data, null, 4)
    );
  } catch (error) {
    return res.status(404).json({
      message: "No books found with this title"
    });
  }
});


module.exports.general = public_users;
