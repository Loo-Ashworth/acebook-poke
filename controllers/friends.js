const Friend = require("../models/friend");

const FriendsController = {
  Index: async (req, res) => {
    try {
      const pendingFriendships = await Friend.find({
        friend: req.session.user._id,
        friendship: null,
      })
        .populate({ path: "user", select: "username" })
        .exec();

      const acceptedFriendships = await Friend.find({
        user: req.session.user._id,
        friendship: true,
      })
        .populate({ path: "friend", select: "username" })
        .exec();

      res.render("friends/index", {
        pendingFriendships: pendingFriendships,
        acceptedFriendships: acceptedFriendships,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  },

  Create: async (req, res) => {
    try {
      const existingFriendship = await Friend.findOne({
        user: req.session.user._id,
        friend: req.body.friendId,
      });

      if (!existingFriendship) {
        const friendship = new Friend({
          user: req.session.user._id,
          friend: req.body.friendId,
        });

        await friendship.save();
      }

      res.redirect("/friends");
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  },

  Accept: async (req, res) => {
    try {
      const existingFriendship = await Friend.findOne({
        user: req.session.user._id,
        friend: req.body.friendId,
      });

      if (existingFriendship) {
        existingFriendship.friendship = true;
        await existingFriendship.save();
      } else {
        return res.status(400).json({
          error: "No existing friendship to accept",
        });
      }

      res.redirect("/friends");
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  },

  Reject: async (req, res) => {
    try {
      const existingFriendship = await Friend.findOne({
        user: req.session.user._id,
        friend: req.body.friendId,
      });

      if (existingFriendship) {
        existingFriendship.friendship = false;
        await existingFriendship.save();
      } else {
        return res
          .status(400)
          .json({ error: "No existing friendship to reject." });
      }

      res.redirect("/friends");
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  },
};

module.exports = FriendsController;
