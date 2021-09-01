const express = require("express");
const cors = require("cors");
const { pool } = require("./config");
const { response } = require("express");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const { body, check } = require("express-validator");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(helmet());

const isProduction = process.env.NODE_ENV === 'production';
const origin = {
  origin: isProduction ? 'https://wwww.example.com' : '*',
}

app.use(cors(origin));

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
});

const postLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1,
})

app.use(limiter);
app
const getBooks = (req, res) => {
  pool.query("SELECT * FROM books", (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

const addBooks = (req, res) => {
  const { author, title } = req.body;
  console.log(author, title);
  pool.query(
    "INSERT INTO books (author, title) VALUES ($1, $2)",
    [author, title],
    (error) => {
      if (error) {
        throw error;
      }
      response.status(201).json({ status: "succes", message: "Book added." });
    }
  );
};

app.route("/books").get(getBooks).post(postLimiter, addBooks);;

app.listen(process.env.PORT || 3002, () => {
  console.log("Server listening.");
});
