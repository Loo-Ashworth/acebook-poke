const Comment = require("../models/comment");

const CommentsController = {
  Create: async (req, res) => {
    const comment = new Comment({
      post: req.body.postId,
      user: req.session.user.username,
      content: req.body.commentContent,
    });

    try {
      await comment.save();
      res.redirect("/posts");
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/posts");
    }
  },
  edit: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);
      res.render("edit-comment", { comment });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/posts");
    }
  },

  update: async (req, res) => {
    try {
      await Comment.findByIdAndUpdate(req.params.id, {
        content: req.body.updatedContent,
      });
      res.redirect("/posts");
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/posts");
    }
  },

  delete: async (req, res) => {
    try {
      await Comment.findByIdAndDelete(req.params.id);
      res.redirect("/posts");
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/posts");
    }
  },
};

module.exports = CommentsController;
