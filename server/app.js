const express = require("express");

const {
  getCategories,
  getReviewById,
  patchReviewById
} = require("./controllers/games-controllers");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);

app.patch("/api/reviews/:review_id", patchReviewById);


app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });                                 
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else if ( err.code  ===  '23502') {
    res.status(400).send({ msg: "Bad Request" })
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  
  res.sendStatus(500);
});

module.exports = app;
