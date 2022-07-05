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
      if (review.rows.length) {
        return review.rows[0];
      }
      return Promise.reject({ status: 404, msg: "review_id not found" });
    });
};
