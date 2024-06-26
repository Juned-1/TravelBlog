const { Sequelize, Op } = require("sequelize");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { jwtSecret, environment } = require("../configuration");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { User, Post, PostLike, Followship } = require("../models");

const search = (query) => {
  let clause = {};
  if (
    Object.keys(query).includes("title") &&
    Object.keys(query).includes("subtitle")
  ) {
    clause[Op.or] = [];
    clause[Op.or].push({
      title: { [Op.like]: `%${decodeURIComponent(query.title)}%` },
    });
    clause[Op.or].push({
      subtitle: { [Op.like]: `%${decodeURIComponent(query.subtitle)}%` },
    });
  } else if (Object.keys(query).includes("title")) {
    clause = {
      ...clause,
      title: { [Op.like]: `%${decodeURIComponent(query.title)}%` },
    };
  } else if (Object.keys(query).includes("subtitle")) {
    clause = {
      ...clause,
      subtitle: { [Op.like]: `%${decodeURIComponent(query.subtitle)}%` },
    };
  }
  return clause;
};
//writing post
exports.writePost = catchAsync(async (req, res, next) => {
  let post = await Post.create({
    userId: req.tokenData.id, //req.body.id,
    title: req.body.title,
    subtitle: req.body.subtitle,
    content: req.body.content,
  });
  const user = await User.findOne({
    attributes : [ "firstName", "lastName" ],
    where : { id : req.tokenData.id },
  });
  post = post.toJSON();
  post.user = user.toJSON(); 
  return res.status(201).json({
    status: "success",
    data: {
      post,
    },
  });
});

//getting specific post
exports.getSpecificPost = catchAsync(async (req, res, next) => {
  let result = await Post.findOne({
    attributes: [
      "id",
      "userId",
      "title",
      "subtitle",
      "content",
      "time",
      [Sequelize.literal("User.firstName"), "firstName"],
      [Sequelize.literal("User.lastName"), "lastName"],
      [
        Sequelize.literal(
          `(SELECT COUNT(*) FROM PostLikes WHERE PostLikes.postId = Post.id AND PostLikes.reactionType = 'like')`
        ),
        "likeCount",
      ],
      [
        Sequelize.literal(
          `(SELECT COUNT(*) FROM PostLikes WHERE PostLikes.postId = Post.id AND PostLikes.reactionType = 'dislike')`
        ),
        "dislikeCount",
      ],
    ],
    include: [
      {
        model: User,
        attributes: [],
        where: { /*id: Sequelize.col("Post.userId")*/ },
      },
    ],
    where: { id: req.params.id },
    //logging : console.log
  });
  // console.log(result);
  // console.log(req.params.id);
  if (!result) {
    return next(new AppError("Post does not exist with given ID", 404));
  }
  result = result.toJSON();
  //updating total post read
  const user = await User.findByPk(result.userId);
  await user.update({
    totalPostRead : user.totalPostRead === null ? 1 : user.totalPostRead + 1
  });
  
  const token = req.cookies.auth_token;
  let isfollowed = false;
  let self = false;
  let decoded;
  if (token) {
    decoded = await promisify(jwt.verify)(token, jwtSecret);
    if(decoded){
      self = result.userId === decoded.id;
    }
    let follow = await Followship.findOne({
      where : {followingId : result.userId, followerId : decoded.id }
    });
    if(follow){
      isfollowed = true;
    }
  }
  
  return res.status(200).json({
    status: "success",
    isfollowed,
    self,
    data: {
      post: result,
    },
  });
});

//edit post controller
exports.editPost = catchAsync(async (req, res, next) => {
  const updatedData = {
    title: req.body.title,
    subtitle: req.body.subtitle,
    content: req.body.content,
  };

  const userId = req.tokenData.id; //req.body.userId;
  const postId = req.params.id; //postId

  const result = await Post.update(updatedData, {
    where: {
      userId: userId,
      id: postId,
    },
    individualHooks: true,
  });
  if (!result) {
    return next(new AppError("Post does not exist with given ID", 404));
  }
  return res.status(200).json({
    status: "success",
    data: updatedData,
  });
});

//delete a post written
exports.deletePost = catchAsync(async (req, res, next) => {
  const result = await Post.destroy({
    where: {
      id: req.params.id,
    },
  });
  if (!result) {
    return next(new AppError(`No result is found with that ID`, 404));
  }
  return res.status(204).json({
    status: "success",
    data: null,
  });
});

//Like -- Dislike
exports.likedislike = catchAsync(async (req, res, next) => {
  const postid = req.params.id;
  const userid = req.tokenData.id; //req.body.userId;
  //console.log(req.body);
  const likes = await PostLike.findOne({
    attributes: ["userId", "postId", "reactionType"],
    where: { userId: userid, postId: postid },
  });
  if (!likes) {
    await PostLike.create({
      userId: userid,
      postId: postid,
      reactionType: req.body.reactionType,
    });
  } else if (likes.toJSON().reactionType != req.body.reactionType) {
    likes.reactionType = req.body.reactionType;
    await PostLike.update(likes.toJSON(), {
      where: {
        userId: userid,
        postId: postid,
      },
      individualHooks: true,
    });
  } else {
    await PostLike.destroy({
      where: {
        postId: postid,
        userId: userid,
      },
    });
  }
  let countLike = await PostLike.findOne({
    attributes: [
      [
        Sequelize.literal(
          `(SELECT COUNT(*) FROM PostLikes WHERE PostLikes.postId = :postId AND PostLikes.reactionType = 'like')`
        ),
        "likeCount",
      ],
      [
        Sequelize.literal(
          `(SELECT COUNT(*) FROM PostLikes WHERE PostLikes.postId = :postId AND PostLikes.reactionType = 'dislike')`
        ),
        "dislikeCount",
      ],
    ],
    where: { postId: postid },
    replacements: { postId: postid },
  });

  if (!countLike) {
    countLike = { likeCount: 0, dislikeCount: 0 };
  }
  return res.status(200).json({
    status: "success",
    data: {
      countLike,
    },
  });
});

//getting post
exports.getPost = catchAsync(async (req, res, next) => {
  //let sql = "SELECT posts.post_id, posts.post_title, posts.post_subtitle, posts.post_content, posts.post_video_url, users.firstName, users.lastName, posts.post_time FROM users,posts WHERE users.id = posts.user_id ORDER BY posts.post_time DESC LIMIT 10 OFFSET ?;";
  const limitQuery = 10;
  const offsetVal = req.query.page ? (+req.query.page - 1) * limitQuery : 0;
  const whereClause = search(req.query);
  //console.log(whereClause);
  const result = await Post.findAll({
    attributes: [
      "id",
      "userId",
      "title",
      "subtitle",
      "content",
      [Sequelize.literal("User.firstName"), "firstName"],
      [Sequelize.literal("User.lastName"), "lastName"],
      "time",
    ],
    include: [
      {
        model: User, // Assuming your User model is named User
        attributes: [], // Ensure no attributes from User model are selected separately
      },
    ],
    where: whereClause,
    order: [["time", "DESC"]],
    limit: limitQuery,
    offset: offsetVal,
  });
  return res.status(200).json({
    status: "success",
    resultLength: result.length,
    data: {
      blogs: result,
    },
  });
});

//getting user specific password
exports.getUserPost = catchAsync(async (req, res, next) => {
  const limitQuery = 10;
  const offsetVal = req.query.page ? (+req.query.page - 1) * limitQuery : 0;
  //const uemail = req.tokenData.email;
  const uid = req.params.userid || req.tokenData.id;
  const whereClause = search(req.query);
  let mod = false;
  if (req.tokenData && req.tokenData.id) {
    mod = true;
  }
  const result = await Post.findAll({
    attributes: [
      "id",
      "userId",
      "title",
      "subtitle",
      "content",
      [Sequelize.literal("User.firstName"), "firstName"],
      [Sequelize.literal("User.lastName"), "lastName"],
      "time",
    ],
    include: [
      {
        model: User, // Assuming your User model is named User
        attributes: [], // Ensure no attributes from User model are selected separately
        where: { id: uid },
      },
    ],
    where: whereClause,
    order: [["time", "DESC"]],
    limit: limitQuery,
    offset: offsetVal,
  });
  return res.status(200).json({
    status: "success",
    resultLength: result.length,
    modification: mod,
    data: {
      blogs: result,
    },
  });
});