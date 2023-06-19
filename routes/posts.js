const express = require("express");
const router = express.Router();
const { parser } = require("../cloudinary");
const PostsController = require("../controllers/posts");
const CommentController = require("../controllers/comments");

router.get("/", PostsController.Index);
router.post("/", parser.single("image"), PostsController.Create);
router.get("/new", PostsController.New);
router.get("/:postId", PostsController.Show);
router.post("/:postId/comments", CommentController.CreateComment);

module.exports = router;
