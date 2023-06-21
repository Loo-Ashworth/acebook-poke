const mongoose = require("mongoose");
const User = require("../models/user");
const Post = require("../models/post");
const Like = require("../models/like");
const Comment = require("../models/comment");
const Friend = require("../models/friend");
const users = require("./data/users");
const postsData = require("./data/posts");
const commentsData = require("./data/comments");
const moment = require("moment");

mongoose.connect("mongodb://0.0.0.0/acebook", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to DB");
});

const seedDB = async () => {
  try {
    console.log("Clearing friend data...");
    await Friend.deleteMany({});
    console.log("Friend data cleared.");

    console.log("Clearing like data...");
    await Like.deleteMany({});
    console.log("Like data cleared.");

    console.log("Clearing comment data...");
    await Comment.deleteMany({});
    console.log("Comment data cleared.");

    console.log("Clearing post data...");
    await Post.deleteMany({});
    console.log("Post data cleared.");

    console.log("Clearing user data...");
    await User.deleteMany({});
    console.log("User data cleared.");

    let createdUsers = [];
    for (let userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`User ${user.email} created successfully.`);
      createdUsers.push(user); }

      for (let postData of postsData) {
        const user = createdUsers.find((u) => u.username === postData.user);

        const post = new Post({
          message: postData.message,
          user: user._id,
          createdAt: Date.now()
        });
        
        if (postData.image) {
          post.image = postData.image;
        }
        
        await post.save();
        console.log(`Post "${post.message}" created successfully.`);
      }
      for (let commentData of commentsData) {
        const postIndex = commentData.postIndex;
        const userIndex = commentData.userIndex;
        const post = postsData[postIndex];
        const user = createdUsers[userIndex];
      
        if (post) { // Check if the post exists
          const comment = new Comment({
            post: post._id,
            user: user.username,
            content: commentData.content,
          });
          await comment.save();
          console.log(`Comment "${comment.content}" created successfully.`);
        }
      }
      
    const accepted_friendship = new Friend({
      requester: createdUsers[1],
      recipient: createdUsers[0],
      friendship: true,
    });
    await accepted_friendship.save();
    console.log(
      `Accepted friendship between "${accepted_friendship.requester.username}" and "${accepted_friendship.recipient.username}" created successfully.`
    );

    const pending_friendship = new Friend({
      requester: createdUsers[2],
      recipient: createdUsers[0],
      friendship: null,
    });
    await pending_friendship.save();
    console.log(
      `Pending friendship between "${pending_friendship.requester.username}" and "${pending_friendship.recipient.username}" created successfully.`
    );
  } catch (err) {
    console.log(err);
  }
};

seedDB().then(() => {
  mongoose.connection.close();
  console.log("Database seeding completed. Connection closed.");
});
