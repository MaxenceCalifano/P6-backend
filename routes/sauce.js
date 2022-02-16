const express = require("express");
const router = express.Router();
const multer = require("../middlewares/multer-config");
const auth = require("../middlewares/auth");

const sauceController = require("../controllers/sauce");

router.post("/:id/like", sauceController.likeDislike);

router.get("/:id", auth, sauceController.getOneSauce);
router.get("/", auth, sauceController.getAllSauces);
router.put("/:id", auth, multer, sauceController.modifySauce);
router.delete("/:id", auth, sauceController.deleteSauce);
router.post("/", auth, multer, sauceController.addSauce);
module.exports = router;
