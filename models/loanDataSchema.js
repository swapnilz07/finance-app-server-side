const mongoose = require("mongoose");

const myschema = new mongoose.Schema(
  {
    loan_name: { type: String },
    loan_data: { type: Array },
  },
  { strict: false }
);

const monmodel = mongoose.model("loan_data", myschema);

module.exports = monmodel;
