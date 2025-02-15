const ClothingItems = require("../models/clothingItem");
// const {
//   DEFAULT_ERROR,
//   REQUEST_NOT_FOUND,
//   INVALID_REQUEST,
//   FORBIDDEN,
// } = require("../utils/errors");

const NotFoundError = require("../utils/errors/NotFoundError")
const BadRequestError = require("../utils/errors/BadRequestError");
const ForbiddenError = require("../utils/errors/ForbiddenError")

const getItems = (req, res) => {
  ClothingItems.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
      return next(err);
      // return res
      //   .status(DEFAULT_ERROR)
      //   .send({ message: "An error has occurred on the server" });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  console.log(req.user._id);

  ClothingItems.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      console.log(item);
      res.status(201).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        // return res.status(INVALID_REQUEST).send({ message: err.message });
        return next(new(BadRequestError("Item unable to be created")))
      }
      return next(res);
      // return res
      //   .status(DEFAULT_ERROR)
      //   .send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItems.findById(itemId)
    .orFail()
    .then((item) => {
      if (req.user._id !== item.owner.toString()) {
        // return res
        //   .status(FORBIDDEN)
        //   .send({ message: "You may not delete another users item" });
        return next(new ForbiddenError("You may not delete another users item"));
      }
      return ClothingItems.findByIdAndDelete(itemId)
      .then((deletedItem) => res.status(200).send(deletedItem));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        // return res.status(INVALID_REQUEST).send({ message: err.message });
        return next(new BadRequestError("Item unable to be deleted"));
      }
      if (err.name === "DocumentNotFoundError") {
        // return res.status(REQUEST_NOT_FOUND).send({ message: err.message });
        return next(new NotFoundError("Item not found"));
      }
      return next(err);
      // return res
      //   .status(DEFAULT_ERROR)
      //   .send({ message: "An error has occurred on the server" });
    });
};

const likeItem = (req, res) => {
  ClothingItems.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Item unable to be liked"));
        // return res.status(INVALID_REQUEST).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        // return res.status(REQUEST_NOT_FOUND).send({ message: err.message });
        return next(new NotFoundError("Item not found"));
      }
      return next(err);
      // return res
      //   .status(DEFAULT_ERROR)
      //   .send({ message: "An error has occurred on the server" });
    });
};

const dislikeItem = (req, res) => {
  ClothingItems.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Item unable to be disliked"));
        // return res.status(INVALID_REQUEST).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
        // return res.status(REQUEST_NOT_FOUND).send({ message: err.message });
      }
      return next(err);
      // return res
      //   .status(DEFAULT_ERROR)
      //   .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };

// Validation Error, CastError, DocumentNotFoundError
