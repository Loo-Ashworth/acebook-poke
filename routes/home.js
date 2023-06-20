const express = require("express");
const router = express.Router();

const HomeController = require("../controllers/home");

router.get("/", HomeController.Index);

module.exports = router;

// router.get("/", (req, res) => {
//   req.excludeLayout = true;
//   HomeController.Index(req, res);
// });
