const connection = require("../../db/connection");

exports.selectCategories = () => {
  return connection.query("SELECT * FROM categories;").then(({ rows }) => {
    return rows;
  });

};
