const express = require("express");
const app = express();

require("./db/conn");
const router = require("./routes/router");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const boom = require("express-boom");
const mongoose = require("mongoose");

app.use(express.json());
app.use(cookieParser());
app.use(boom());
app.use(cors());
app.use(router);

app.listen(2022, () => {
  console.log("Server statted at port : 2022");
});
