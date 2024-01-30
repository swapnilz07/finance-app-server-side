const express = require("express");
const app = express();
const PORT = process.env.PORT;

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

app.use("/", async (req, res) => {
  res.send("Server is running.");
});

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
