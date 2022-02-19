const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //console.log(token);
    const decodedToken = jwt.verify(token,  "IFrnj1Fk9YN6vZ6PePDYUGdctYIRZMnzROO5lmGH");
    const userId = decodedToken.userId;
    req.auth = { userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error | "Requête non authentifiée" });
  }
};
