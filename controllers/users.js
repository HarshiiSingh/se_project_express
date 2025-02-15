const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const NotFoundError = require("../utils/errors/NotFoundError")
const UnauthorizedError = require("../utils/errors/UnauthorizedError");
const BadRequestError = require("../utils/errors/BadRequestError");
const ConflictError = require("../utils/errors/ConflictError");

// const {
//   DEFAULT_ERROR,
//   REQUEST_NOT_FOUND,
//   INVALID_REQUEST,
//   DUPLICATE,
//   UNAUTHORIZED,
// } = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  console.log(req.body);

  if (!email || !password || !name || !avatar) {
    // return res
    //   .status(INVALID_REQUEST)
    //   .send({ message: "All required fields must be filled" });
    return next(new BadRequestError("All Required Fields must be filled"));
  }

  return User.findOne({ email }).then((exists) => {
    if (exists) {
      // return res.status(DUPLICATE).send({ message: "Email in use" });
      return next(new ConflictError("Email in use"));

    }

    return bcrypt
      .hash(password, 10)
      .then((hash) => User.create({ name, avatar, email, password: hash }))
      .then((user) => {
        res.status(201).send({
          name: user.name,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        });
      })
      .catch((err) => {
        console.error(err);
        if (err.name === "ValidationError") {
          // return res.status(INVALID_REQUEST).send({ message: err.message });
          return next(new BadRequestError("Bad Request"));
        }
        return next(err);
        // return res
        //   .status(DEFAULT_ERROR)
        //   .send({ message: "An error has occurred on the server" });
      });
  });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  console.log(userId);
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        // return res.status(REQUEST_NOT_FOUND).send({ message: err.message });
        return next(new NotFoundError("User not Found"));
      }
      if (err.name === "CastError") {
        // return res.status(INVALID_REQUEST).send({ message: err.message });
        return next(new BadRequestError("Invalid User"));
      }
      return next(err);
      // return res
      //   .status(DEFAULT_ERROR)
      //   .send({ message: "An error has occurred on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    // return res
    //   .status(INVALID_REQUEST)
    //   .send({ message: "Missing Email or Password" });
    return next(new BadRequestError("Missing Email or Password"));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        // return res
        //   .status(UNAUTHORIZED)
        //   .send({ message: "Incorrect information" });
        return next(new UnauthorizedError("Incorrect email or password"));
      }
      return next(err);
      // return res.status(DEFAULT_ERROR).send({ message: err.message });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        // return res.status(INVALID_REQUEST).send({ message: "User not found" });
        return next(new BadRequestError("User not Found"));

      }
      if (err.name === "DocumentNotFoundError") {
        // return res.status(REQUEST_NOT_FOUND).send({ message: "Bad request" });
        return next(new NotFoundError("Bad request"));
      }
      // return res.status(DEFAULT_ERROR).send({ err: err.message });
      return next(err);
    });
};
module.exports = { createUser, getCurrentUser, login, updateUser };
