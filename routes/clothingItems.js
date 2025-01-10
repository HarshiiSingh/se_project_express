const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  likeItem,
  deleteItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.post("/", auth, createItem);

router.get("/", getItems);

router.put("/:itemId/likes", auth, likeItem);

router.delete("/:itemId/likes", auth, dislikeItem);

router.delete("/:itemId", auth, deleteItem);

module.exports = router;
