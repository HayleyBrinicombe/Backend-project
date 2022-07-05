const {
  selectCategories,
  selectReviewById
} = require("../models/games-models");

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories: categories });
    })
    .catch((err) => {
      console.log("error").next(err);
    });
};

exports.getreviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((review) => {
      if (review === undefined) {
        res.status(404).send({ msg: "review_id not found" });
      }
      res.status(200).send({ review });
    })
    .catch((error) => {
      next(error);
    });
};
