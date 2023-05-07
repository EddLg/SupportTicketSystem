//User Controller Functions

//import asyncHandler
const asyncHandler = require("express-async-handler");

//import bcrypt
const bcrypt = require("bcryptjs");

//import JWT
const jwt = require("jsonwebtoken");

//import user Model
const User = require("../models/userModel");

//  Register New User
//route   /api/users
//access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //Input Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please include all data");
  }

  //Find if User already exists
  const userExists = await User.findOne({ email: email });

  //If user exists
  if (userExists) {
    res.status(400);

    throw new Error("User Already Exists");
  }

  //If User does not exist, hash the entered Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create the new User with the name, email and hashed password
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  //If user is created, send confirmation with user data
  //send back JWT
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid User Data");
  }
});

//    Login User
//route   /api/users/login
//access  Public
const loginUser = asyncHandler(async (req, res) => {
  //
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  //
  // If user exists,
  // Compare entered Password with hashed Password
  // Async server Operation
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      message: `Welcome back, ${user.name} `,
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials.");
  }
});

//  Get Current User
//route   /api/users/getMe
//access  Private
const getMe = asyncHandler(async (req, res) => {
  //
  //Create user object from the req data
  const user = {
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
  };
  //Check user
  res.status(200).json(user);
});

// JWT generation
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = { registerUser, loginUser, getMe };
