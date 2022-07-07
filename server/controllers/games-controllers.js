const {
  selectCategories,
  selectReviewById,
  updateReviewById,
  selectUsers,
  selectReviews,
  selectCommentsByReviewId,
  postNewComment
} = require("../models/games-models");

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories: categories });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((error) => {
      next(error);
    });
};

exports.patchReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  updateReviewById(review_id, inc_votes)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users: users });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getReviews = (req, res, next) => {
  selectReviews()
    .then((reviews) => {
      res.status(200).send({ reviews: reviews });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  selectCommentsByReviewId(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((error) => {
      next(error);
    });
};


exports.postComment = (req, res, next) => {
  const { username } = req.body;
  const { body } = req.body;
  const { review_id } = req.params;

  postNewComment(review_id, username, body)
    .then((newComment) => {
      res.status(202).send({ newComment });
    })
    .catch((err) => {
      next(err);
    });
};