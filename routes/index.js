const router = require("express").Router();
const { REQUEST_NOT_FOUND } = require("../utils/errors");

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");

const auth = require("../middlewares/auth");

// No Protect Route
router.post("/signin", login);
router.post("/signup", createUser);
router.use("/items", clothingItemRouter);

// Protected Route
router.use("/users", auth, userRouter);

router.use((req, res) => {
  res.status(REQUEST_NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
