const express = require("express");
const router = express.Router();
const CommentsController = require("../controllers/comments");

router.post("/", CommentsController.Create);

router.get("/:id/edit", CommentsController.edit);


router.put("/:id", CommentsController.update);


router.delete("/:id", CommentsController.delete);

module.exports = router;
