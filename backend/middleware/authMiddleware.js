// Protected Routes Middleware

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

//Protect Routes Function
const protect = asyncHandler(async (req, res, next) => {
  //Initialize a token variable
  let token;

  //Check for Bearer Token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from Request Header
      // Split after "space" ,turns String into array
      //Get the 2nd element, after "Bearer" = Token
      token = req.headers.authorization.split(" ")[1];
      //
      //Verify Token using the encryption secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //
      // Get User from Token by the encrypted ID
      // Exclude the password from the User
      // The Token includes the hashed ID and password
      // Password needs to be excluded
      req.user = await User.findById(decoded.id).select("-password");

      // Next because it is a Middleware
      next();
    } catch (error) {
      console.log(error);
      //401 = unauthorized
      res.status(401);
      throw new Error("Not Authorized.");
    }
  }

  //If Token does not exist
  if (!token) {
    res.status(401);
    throw new Error("Not Authorized.");
  }
});

module.exports = { protect };
