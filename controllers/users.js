const User = require("../models/user");

// Get /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: "Requested resource not found" });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  console.log(req.body);
  User.create({ name, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Requested resource not found" });
      }
      return res.status(500).send({ message: "Requested resource not found" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(400)
          .send({ message: "Requested resource not found" });
      } else if (err.name === "CastError") {
        return res
          .status(500)
          .send({ message: "Requested resource not found" });
      }
      return res.status(500).send({ message: "Requested resource not found" });
    });
};

module.exports = { getUsers, createUser, getUser };
