const express = require('express');
let books = require("./booksdb.js");
let users = require("./usersdb.js");
const public_users = express.Router();


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
  
    users.push({
      username,
      password
    });
  
    return res.status(201).json({
      message: "User registered successfully"
    });
  });

// Get the book list available in the shop using async/await
public_users.get('/', async function (req, res) {
    try {
      const getBooks = () => {
        return new Promise((resolve, reject) => {
          resolve(books);
        });
      };
  
      const bookList = await getBooks();
  
      return res.status(200).send(JSON.stringify(bookList, null, 4));
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving books" });
    }
  });

// Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
  
    const getBookByISBN = () => {
      return new Promise((resolve, reject) => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject("Book not found");
        }
      });
    };
  
    try {
      const book = await getBookByISBN();
      return res.status(200).send(JSON.stringify(book, null, 4));
    } catch (error) {
      return res.status(404).json({ message: error });
    }
  });
  
// Get book details based on author using async/await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
  
    const getBooksByAuthor = () => {
      return new Promise((resolve, reject) => {
        const bookKeys = Object.keys(books);
        const result = {};
  
        bookKeys.forEach((key) => {
          if (books[key].author.toLowerCase() === author.toLowerCase()) {
            result[key] = books[key];
          }
        });
  
        if (Object.keys(result).length > 0) {
          resolve(result);
        } else {
          reject("No books found by this author");
        }
      });
    };
  
    try {
      const result = await getBooksByAuthor();
      return res.status(200).send(JSON.stringify(result, null, 4));
    } catch (error) {
      return res.status(404).json({ message: error });
    }
  });

// Get all books based on title using async/await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
  
    const getBooksByTitle = () => {
      return new Promise((resolve, reject) => {
        const bookKeys = Object.keys(books);
        const result = {};
  
        bookKeys.forEach((key) => {
          if (books[key].title.toLowerCase() === title.toLowerCase()) {
            result[key] = books[key];
          }
        });
  
        if (Object.keys(result).length > 0) {
          resolve(result);
        } else {
          reject("No books found with this title");
        }
      });
    };
  
    try {
      const result = await getBooksByTitle();
      return res.status(200).send(JSON.stringify(result, null, 4));
    } catch (error) {
      return res.status(404).json({ message: error });
    }
  });

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    if (books[isbn]) {
      return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    }
  
    return res.status(404).json({ message: "Book not found" });
  });

module.exports.general = public_users;
