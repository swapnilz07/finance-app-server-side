const jwt = require("jsonwebtoken");
const userdb = require("../models/userSchema");
const secret_key = "thisismysecretkeyforfinanceappok";

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw new Error("Authentication failed: Token is missing.");
    }

    const verifytoken = jwt.verify(token, secret_key);

    if (!verifytoken || !verifytoken._id) {
      throw new Error("Authentication failed: Invalid token.");
    }

    const rootUser = await userdb.findOne({ _id: verifytoken._id });

    if (!rootUser) {
      throw new Error("Authentication failed: User not found.");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({ message: error.message });
  }
};

module.exports = authenticate;
