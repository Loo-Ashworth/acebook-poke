const mongoose = require("mongoose");
const Like = require("../../models/like");
require("../mongodb_helper");

const user_1 = {
  id: new mongoose.Types.ObjectId(),
};

const user_2 = {
  id: new mongoose.Types.ObjectId(),
};

const post = {
  id: new mongoose.Types.ObjectId(),
  user: user_1,
};

describe("Like model", () => {
  beforeEach(async () => {
    await mongoose.connection.collections.likes.drop();
  });

  it("a new Like is not liked by default", async () => {
    const like = new Like({ post: post.id, user: user_1.id });
    await like.save();

    const likes = await Like.find();
    expect(likes.length).toBe(1);
    expect(likes[0]).toMatchObject({ liked: false });
  });

  it("a post can have many likes", async () => {
    const first_like = new Like({ post: post.id, user: user_1.id });
    await first_like.save();
    const second_like = new Like({ post: post.id, user: user_2.id });
    await second_like.save();

    const likes = await Like.find({ post: post.id });
    expect(likes.length).toBe(2);
  });
});
