const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");

const auth = require("../middlewares/auth");
const {
  validateUserBodyInfo,
  validateAuth,
} = require("../middlewares/validation");

const NotFoundError = require("../utils/errors/NotFoundError");

// No Protect Route
router.post("/signin", validateAuth, login);
router.post("/signup", validateUserBodyInfo, createUser);
router.use("/items", clothingItemRouter);

// Protected Route
router.use("/users", auth, userRouter);

router.use((req, res, next) =>
  next(new NotFoundError("Router not found"))
);

module.exports = router;
