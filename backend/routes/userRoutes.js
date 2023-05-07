//User Routes

//Import Express
const express = require("express");

//Import Controller Functions
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/userController");

//Import Protected Route Middleware
const { protect } = require("../middleware/authMiddleware");

//Reference to Express Router
const router = express.Router();

//Base url found in server.js : app.use("/api/users"
//Functions found in userController.js
router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

module.exports = router;
