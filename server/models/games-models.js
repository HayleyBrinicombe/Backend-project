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

exports.updateReviewById = (review_id, inc_votes) => {
  const query = [inc_votes, review_id];
  return connection
    .query(
      `UPDATE reviews
  SET votes = votes + $1
  WHERE review_id = $2
  RETURNING *`,
      query
    )
    .then(({ rows: [review] }) => {
      if (review) {
        return review;
      }
      return Promise.reject({
        status: 404,
        msg: `Unable to process request: Review ID ${review_id} could not be found`
      });
    });
};
