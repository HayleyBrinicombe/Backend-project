const { Connection } = require("pg");
const connection = require("../../db/connection");

exports.selectCategories = () => {
  return connection.query("SELECT * FROM categories;").then(({ rows }) => {
    return rows;
  });
};
exports.selectReviewById = (review_id) => {
  return connection
    .query(
      `SELECT reviews.*, COUNT (comments.review_id)::INT AS comment_count
       FROM reviews
       LEFT JOIN comments
       ON reviews.review_id = comments.review_id
       WHERE reviews.review_id = $1
       GROUP BY reviews.review_id`,
      [review_id]
    )
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

exports.selectUsers = () => {
  return connection.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
};
exports.selectReviews = (category, sort_by = "created_at", order = "DESC") => {
  const validColumns = [
    "owner",
    "title",
    "review_id",
    "category",
    "created_at",
    "votes",
    "comment_count"
  ];
  if (!validColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  if (!["ASC", "DESC"].includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (category) {
    return connection
      .query(
        `SELECT reviews.*, COUNT (comments.review_id)::INT AS comment_count
       FROM reviews
       LEFT JOIN comments
       ON reviews.review_id = comments.review_id    
       WHERE reviews.category = $1  
       GROUP BY reviews.review_id
       ORDER BY ${sort_by} ${order}`,
        [category]
      )
      .then((reviews) => {
        return reviews.rows;
      });
  } else {
    return connection
      .query(
        `SELECT reviews.*, COUNT (comments.review_id)::INT AS comment_count
       FROM reviews
       LEFT JOIN comments
       ON reviews.review_id = comments.review_id      
       GROUP BY reviews.review_id
       ORDER BY ${sort_by} ${order}`
      )
      .then((reviews) => {
        return reviews.rows;
      });
  }

  console.log(bbbbbbb)
};
exports.selectCommentsByReviewId = async (review_id) => {
  if (isNaN(+review_id)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid input"
    });
  }

  const reviewCheck = await connection.query(
    `SELECT * FROM comments
     WHERE review_id = $1`,
    [review_id]
  );
  if (reviewCheck.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: "Resource not found"
    });
  }

  const comments = await connection.query(
    `SELECT * FROM comments
     WHERE review_id = $1`,
    [review_id]
  );

  return comments.rows;
};
exports.postNewComment = (review_id, username, body) => {
  return connection
    .query(
      `INSERT INTO comments 
  (author, review_id, body)
  VALUES
  ('${username}', ${review_id}, '${body}') 
  RETURNING *;`
    )
    .then(({ rows }) => {
      return rows;
    });
};
