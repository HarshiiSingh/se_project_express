const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const {
  validateUserProfile
} = require("../middlewares/validation");
// Removed getUsers, createUser,
// router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.patch("/me", validateUserProfile, updateUser);
// router.post("/", createUser);

module.exports = router;
