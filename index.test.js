const { Comment, Like, Post, Profile, User } = require("./index");
const { db } = require("./db/connection.js");
const {
  userSeed,
  profileSeed,
  postSeed,
  commentSeed,
  likeSeed,
} = require("./seed/index.js");

describe("Social Sequelzie Test", () => {
  /**
   * Runs the code prior to all tests
   */
  let users;
  let profiles;
  let posts;
  let comments;
  let likes;
  beforeAll(async () => {
    // the 'sync' method will create tables based on the model class
    // by setting 'force:true' the tables are recreated each time the test suite is run
    await db.sync({ force: true });
    users = await User.bulkCreate(userSeed);
    profiles = await Profile.bulkCreate(profileSeed);
    posts = await Post.bulkCreate(postSeed);
    comments = await Comment.bulkCreate(commentSeed);
    likes = await Like.bulkCreate(likeSeed);
  });

  // Write your tests here
  test("Can create a user", async () => {
    const user = await User.findByPk(1);

    expect(user).toEqual(
      expect.objectContaining({
        email: users[0].email,
        username: users[0].username,
      })
    );
  });

  test("Can create a profile", async () => {
    const profile = await Profile.findByPk(2);
    expect(profile).toBeInstanceOf(Profile);
  });

  test("Can create a post", async () => {
    const post = await Post.findByPk(1);
    expect(post instanceof Post).toBeTruthy();
  });

  test("Can create a comment", async () => {
    const comment = await Comment.findByPk(2);
    expect(comment).toBeInstanceOf(Comment);
  });

  test("Can create a like", async () => {
    const like = await Like.findByPk(1);
    expect(like).toEqual(
      expect.objectContaining({ reactionType: likes[0].reactionType })
    );
  });

  describe("user and profile relation", () => {
    let userProfile;
    let profileUser;
    beforeAll(async () => {
      const user = await User.findByPk(1);
      const profile = await Profile.findByPk(2);

      await user.setProfile(profile);

      userProfile = await user.getProfile();
      profileUser = await profile.getUser();
    });
    test("user can only have one profile", () => {
      expect(userProfile).toBeInstanceOf(Profile);
    });

    test("profile can only have one user", () => {
      expect(profileUser).toBeInstanceOf(User);
    });
  });

  describe("user and post relation", () => {
    let userPost;

    beforeAll(async () => {
      const post1 = await Post.findByPk(1);
      const post2 = await Post.findByPk(2);
      const user = await User.findByPk(2);
      await user.setPosts([post1, post2]);
      userPost = await user.getPosts();
    });

    test("post belongs to user", () => {
      expect(userPost).toHaveLength(2);
    });

    test("user can have many posts", () => {
      expect(userPost[0].UserId).toBe(2);
    });
  });

  describe("post and comment relation", () => {
    let postComments;
    beforeAll(async () => {
      const comment = await Comment.findByPk(1);
      const post = await Post.findByPk(2);

      await post.setComments([comment]);

      postComments = await post.getComments();
    });

    test("comment belongs to a post", () => {
      expect(postComments).toHaveLength(1);
    });

    test("post can have many comments", () => {
      expect(postComments[0].PostId).toBe(2);
    });
  });

  describe("user and like relation", () => {
    let userLikes;
    let likesArr;
    beforeAll(async () => {
      const user1 = await User.findByPk(4);
      const user2 = await User.findByPk(5);

      const like1 = await Like.findByPk(3);
      const like2 = await Like.findByPk(4);

      await user1.addLikes([like1, like2]);
      await like1.addUsers([user1, user2]);

      userLikes = await user1.getLikes();
      likesArr = await like1.getUsers();
    });

    test("user can have many likes", () => {
      expect(userLikes).toHaveLength(2);
    });

    test("likes can have many users", () => {
      expect(likesArr[0].id == likesArr[1].id).toBeFalsy();
    });
  });
});
