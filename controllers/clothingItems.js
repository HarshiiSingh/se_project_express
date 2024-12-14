const ClothingItems = require("../models/clothingItem");

const getItems = (req, res) => {
  ClothingItems.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(500)
        .send({ message: "Requested resource not foundss" });
    });
};

const createItem = (req, res) => {
  // console.log(req)
  // console.log(req.body)
  const { name, weather, imageUrl } = req.body;
  console.log(req.user._id);

  ClothingItems.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(500)
        .send({ message: "Requested resource not foundss" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);
  ClothingItems.findByIdAndDelete(itemId)
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      return res
        .status(500)
        .send({ message: "Requested resource not foundss" });
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
      return res
        .status(500)
        .send({ message: "Requested resource not foundss" });
    });
};

const dislikeItem = (req, res) => {
  ClothingItems.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({data:item}))
    .catch((err) => {
      console.error(err);
      return res
        .status(500)
        .send({ message: "Requested resource not foundss" });
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem};
