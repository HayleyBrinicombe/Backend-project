const connection = require("../../db/connection");

exports.selectCategories = () => {
  return connection.query("SELECT * FROM categories;").then(({ rows }) => {
    return rows;
  });
};
exports.selectReviewById = (review_id) => {
  return connection
    .query("SELECT * FROM reviews WHERE review_id = $1;", [review_id])
    .then((review) => {
      return review.rows[0];
    })
    .catch((error) => {
      return Promise.reject(error.code);
    });
};
