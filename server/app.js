const express = require("express");

const {
  getCategories,
  getreviewById
} = require("./controllers/games-controllers");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getreviewById);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use((err, req, res, next) => {
  if (err === "22P02") {
    res.status(400).send({ msg: "bad request a review Id must be a number." });
  }
});

app.use((err, req, res, next) => {
  res.sendStatus(500);
});

module.exports = app;
