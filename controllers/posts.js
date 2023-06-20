const postService = require("../services/postService");
const userService = require("../services/userService");
const likeService = require("../services/likeService");
const commentService = require("../services/commentService");
const cloudinaryService = require("../services/cloudinaryService");

const PostsController = {
  Index: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.redirect("/sessions/new");
      }
      const currentUser = await userService.getCurrentUser(
        req.session.user._id
      );
      let posts = await postService.getPosts();

      for (let post of posts) {
        post.likesCount = await likeService.getLikesCount(post._id);

        const user = await userService.getUserById(post.user);
        post.username = user.username;
        post.currentUser = currentUser.username === post.username;

        const likes = await likeService.getLikesByPostId(post._id);
        post.likedBy = likes.map((like) => like.user.username);

        post.comments = await commentService.getCommentsByPostId(post._id);
        post.comments = post.comments.map((comment) => ({ comment }));
      }
      posts = posts.map((post) => ({ post }));
      res.render("posts/index", { posts: posts });
    } catch (err) {
      throw err;
    }
  },
  New: (req, res) => {
    res.render("posts/new", {});
  },
  Create: async (req, res) => {
    const { message } = req.body;

    const image = req.file
      ? await cloudinaryService.uploadImage(req.file.path)
      : "";

    const postData = {
      message,
      image,
      user: req.session.user,
    };

    try {
      const post = await postService.savePost(postData);

      if (req.accepts("json")) {
        res.render(
          "partials/posts/post",
          { layout: false, post },
          (err, html) => {
            if (err) {
              res.status(500).json({ error: "Could not render post" });
            } else {
              res.json({ html });
            }
          }
        );
      } else {
        return res.status(201).redirect("/posts");
      }
    } catch (error) {
      return res.status(400).render("posts/new", {
        error: "An error occurred while creating the post.",
      });
    }
  },
};

module.exports = PostsController;
