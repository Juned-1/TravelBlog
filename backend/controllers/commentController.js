const { Op } = require("sequelize");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { jwtSecret, environment } = require("../configuration");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.writeComment = catchAsync(async (req, res, next) => {
  let newComment = await Comment.create({
    userId: req.tokenData.id,
    postId: req.params.postid,
    parentId: req.body.parentId,
    commentText: req.body.commentText,
  });
  if (!newComment) {
    return next(new AppError("Failed to write comments", 404));
  }
  newComment = newComment.toJSON();
  let user = await User.findByPk(req.tokenData.id);
  if (!user) {
    return next(new AppError("Something went wrong", 500));
  }
  user = user.toJSON();
  newComment.User = {
    firstName: user.firstName,
    lastName: user.lastName,
  };
  newComment.modification = true;
  res.status(200).json({
    status: "success",
    data: {
      comment: newComment,
    },
  });
});

exports.getComments = catchAsync(async (req, res, next) => {
  // if(environment === 'production'){
  //   token = req.signedCookies[`${COOKIE_NAME}`]; //-- only for deployment signed cookie work with browser not with postman
  // }else{
  //   token = req.cookies.auth_token;
  // }
  const token = req.cookies.auth_token;
  let modst = false;
  let decoded;
  if (token) {
    decoded = await promisify(jwt.verify)(token, jwtSecret);
    modst = true;
  }

  const postid = req.params.postid;
  const limitQuery = 20;
  const offsetVal = req.query.page ? (+req.query.page - 1) * limitQuery : 0;
  let parentid = null;
  if (req.body.parentid) {
    //using only for nested comments
    parentid = req.body.parentid;
  }
  let comments = await Comment.findAll({
    where: { postId: postid, parentId: parentid },
    include: [
      {
        model: User,
        attributes: ["firstName", "lastName"],
      },
    ],
    order: [["createdAt", "DESC"]],
    offset: offsetVal,
    limit: limitQuery,
  });
  if (!comments) {
    return next(new AppError("No comments on this post", 404));
  }
  comments = comments.map((comment) => {
    comment = comment.toJSON();
    if (!modst) comment.modification = false;
    else {
      comment.modification = comment.userId === decoded.id;
    }
    return comment;
  });
  res.status(200).json({
    status: "success",
    resultLength: comments.length,
    data: {
      comments,
    },
  });
});

exports.getSpecificComment = catchAsync(async (req, res, next) => {
  const commentid = req.params.commentid;
  let comment = await Comment.findByPk(commentid, {
    include: [
      {
        model: User,
        attributes: ["firstName", "lastName"],
      },
    ],
  });
  if (!comment) {
    return next(new AppError("No comments with given id", 404));
  }
  comment = comment.toJSON();
  comment.modification = comment.userId === req.tokenData.id;
  res.status(200).json({
    status: "success",
    data: {
      comment,
    },
  });
});

exports.editComment = catchAsync(async (req, res, next) => {
  const userid = req.tokenData.id;
  const commentid = req.params.commentid;
  const comment = await Comment.findByPk(commentid);
  if (!comment) {
    return next(new AppError("No comment exists with given id", 404));
  }
  const result = comment.toJSON();
  if (result.userId !== userid) {
    return next(
      new AppError("You are not authorised to edit this comment", 401)
    );
  }
  const update = await Comment.update(
    { commentText: req.body.commentText, createdAt: Date.now() },
    { where: { userId: userid, commentId: commentid }, individualHooks: true }
  );
  if (!update) {
    return next(new AppError("Failed to edit comment", 400));
  }
  let updatedData = await Comment.findByPk(commentid, {
    include: [
      {
        model: User,
        attributes: ["firstName", "lastName"],
      },
    ],
  });
  if (!updatedData) {
    return next(new AppError("Comment not found", 404));
  }
  updatedData = updatedData.toJSON();
  updatedData.modification = updatedData.userId === req.tokenData.id;
  res.status(200).json({
    status: "success",
    data: {
      comment: updatedData,
    },
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const userid = req.tokenData.id;
  const commentid = req.params.commentid;
  const comment = await Comment.findByPk(commentid);
  if (!comment) {
    return next(new AppError("No comment exists with given id", 404));
  }
  const result = comment.toJSON();
  if (result.userId !== userid) {
    return next(
      new AppError("You are not authorised to delete this comment", 401)
    );
  }
  const delValue = await Comment.destroy({
    where: {
      commentId: commentid,
    },
  });
  if (!delValue) {
    return next(new AppError(`No Comments is found with that ID`, 404));
  }
  return res.status(204).json({
    status: "success",
    data: null,
  });
});
