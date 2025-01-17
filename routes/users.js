const express = require("express");
const router = express.Router();
const { parser } = require("../services/cloudinaryService");
const UsersController = require("../controllers/users");

router.get("/new", UsersController.New);
router.post("/", parser.single("image"), UsersController.Create);

module.exports = router;
