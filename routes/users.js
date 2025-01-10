const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");

// Removed getUsers, createUser,
// router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.patch("/me", updateUser)
// router.post("/", createUser);

module.exports = router;
