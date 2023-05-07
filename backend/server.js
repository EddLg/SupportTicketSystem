//--------- Create Express Server --------
const PORT = process.env.PORT || 5000;

const colors = require("colors");
const express = require("express");
const dotenv = require("dotenv").config();

//import Error Handler
const { errorHandler } = require("./middleware/errorMiddleware");

//import Mongoose DB Connection
const connectDB = require("./config/db");

//Connect to DB
connectDB();

//Server Name
const app = express();

// This is the Body Parser, for the req.body
// The type of data must be specified
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//test -------------------------

const testFunction = (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    throw Error("Please enter all data");
  }
  res.status(201).json({ name: name, email: email, phone: phone });
};

app.post("/posts", (req, res) => {
  testFunction(req, res);
});

app.get("/posts", (req, res) => {
  res.send("Welcome To the APP");
});
// end test  --------------------

//Routes
//These are the Starting address for the routes in the userRoutes file
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/tickets", require("./routes/ticketRoutes"));

//Eror Handler
app.use(errorHandler);

//

//Start Server
app.listen(PORT, () => console.log(`Server Started on Port ${PORT}`));
