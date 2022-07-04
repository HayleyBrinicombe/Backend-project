const { selectCategories } = require("../models/games-models");

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories: categories });
    })
    .catch((err) => {
      console.log("error").next(err);
    });
};
