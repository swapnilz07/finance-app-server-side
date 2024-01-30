const express = require("express");
const router = new express.Router();
const userdb = require("../models/userSchema");
const bcrypt = require("bcrypt");
const authenticate = require("../middleware/authenticate");
const monmodel = require("../models/loanDataSchema");

// api for storing userData
router.post("/register", async (req, res) => {
  try {
    const { fname, lname, contact, email, password } = req.body;
    if (!fname || !lname || !contact || !email || !password) {
      res.boom.notFound("Invalid data");
    }
    const user = await userdb.findOne({ email: email });
    if (user) res.boom.badRequest("User Already Rigistered");

    const regiterUser = new userdb({
      firstname: fname,
      lastname: lname,
      contact_number: contact,
      email: email,
      password: password,
    });

    //hash user password
    const salt = await bcrypt.genSalt(10);
    regiterUser.password = await bcrypt.hash(password, salt);
    await regiterUser.save();
    return res.status(201).json("User registered successfully");
  } catch (error) {
    console.log("error", error.message);
    res.boom.badRequest(error.message);
  }
});

// This is login api
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("req.body", req.body);
    if (!email || !password) {
      return res.boom.notFound("Invalid data", req.body);
    }
    const user = await userdb.findOne({ email: email });
    if (!user) return res.boom.badRequest("User Not Found");

    const varifyUser = await bcrypt.compare(password, user.password);
    if (!varifyUser) return res.boom.badRequest("Invalid credentials");

    // generate token
    const token = await user.generateAuthtoken();

    // console.log("token ===>>>", token);

    // cookie genereate
    res.cookie("usercookie", token, {
      expiresIn: new Date(Date.now() + 900000),
      httpOnly: true,
    });

    const result = {
      user,
      token,
    };

    return res.status(200).json({ status: 200, result });
  } catch (error) {
    // return res.boom.badRequest(error.message, req.body);
    return res
      .status(500)
      .json({ data: req.body, error: error.message, status: 500 });
  }
});

// validate user API
router.get("/validuser", authenticate, async (req, res) => {
  try {
    const validUserOne = await userdb.findOne({ _id: req.userId });
    return res.status(200).json({ status: 200, validUserOne });
  } catch (error) {
    return res.status(500).json({ status: 500, error: error.message });
  }
});

// Logout API
router.get("/logout", authenticate, async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((currEl) => {
      return currEl.token !== req.token;
    });

    res.clearCookie("usercookie", { path: "/signin" });

    req.rootUser.save();

    res.status(200).json({ status: 200 });
  } catch (error) {
    res.status(401).json({ status: 401, error: error.message });
  }
});

// API for inserting loan data
router.post("/post", async (req, res) => {
  console.log("We are inside a post request function");

  const data = new monmodel(req.body);

  const val = await data.save();
  res.json(val);
});

// get api for loan data
router.get("/get", async (req, res) => {
  try {
    let filters = JSON.parse(req.query.filters) || {};
    let data = await monmodel.find(filters).lean();
    res.json(data?.at(0));
  } catch (error) {
    console.log("err", error);
  }
});

//put request to database updation and addition of loan data
router.put("/bank-data/:id", async (req, res) => {
  let id = req.params.id;
  let data = await monmodel.findById(id);
  if (!data) boom.badRequest("load data not found");
  await monmodel.updateOne({ _id: id }, { $addToSet: { loan_data: req.body } });
  res.json("data updated succesfully");
});

module.exports = router;
