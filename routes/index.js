const router = require("express").Router();
const { REQUEST_NOT_FOUND } = require("../utils/errors");

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res) => {
  res.status(REQUEST_NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
