// --- Mongoose ---
const mongoose = require("mongoose");

const connectDB = async () => {
  //

  try {
    //
    //Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI);
    //
    //Confirm Connection
    console.log(`Mongo DB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    //

    //Send Error
    console.log(`Error : ${error.message}`.red.underline.bold);

    //Exit the entire Process in case of failure
    process.exit(1);
  }
};

//Export Connection
module.exports = connectDB;
