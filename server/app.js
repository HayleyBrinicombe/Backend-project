const express = require("express");

const {
  getCategories,
  getReviewById,
  patchReviewById,
  getUsers,
  getReviews,
  getCommentsByReviewId,
  postComment
} = require("./controllers/games-controllers");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/users", getUsers);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.patch("/api/reviews/:review_id", patchReviewById);

app.post("/api/reviews/:review_id/comments", postComment);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "URL Not Found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503") {
    res.status(400).send({ msg: "Bad Request" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);

  res.Status(500);
});

module.exports = app;
