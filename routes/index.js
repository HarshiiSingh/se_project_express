const router = require("express").Router();

const userRouter = require("./users.js");
const clothingItemRouter = require("./clothingItems.js");

router.use("/users", userRouter);
// router.use("/items", clothingItemRouter);

router.use((req, res) => {
  res.status(REQUEST_NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
