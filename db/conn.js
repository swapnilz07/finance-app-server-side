const mongoose = require("mongoose");
require("dotenv").config();

const encodedPassword = encodeURIComponent(process.env.PASSWORD);
const DB = `mongodb+srv://swapnilzakade33:${encodedPassword}@financeappdb.i2swymu.mongodb.net/Authuser`;

mongoose.connect(
  DB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) {
      console.log("DB connected");
    } else {
      console.log("error connecting DB : ", err.message);
    }
  }
);
