const { Op } = require("sequelize");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.writeComment = catchAsync(async (req, res, next) => {
  const newComment = await Comment.create({
    userId: req.tokenData.id,
    postId: req.params.postid,
    parentId: req.body.parentId,
    commentText: req.body.commentText,
  });
  if (!newComment) {
    return next(new AppError("Failed to write comments", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      comment: newComment.toJSON(),
    },
  });
});

exports.getComments = catchAsync(async (req, res, next) => {
  const postid = req.params.postid;
  const limitQuery = 20;
  const offsetVal = req.query.page ? (+req.query.page - 1) * limitQuery : 0;
  let parentid = null;
  if (req.body.parentid) {
    //using only for nested comments
    parentid = req.body.parentid;
  }
  const comments = await Comment.findAll({
    attributes: ["commentText", "commentId", "userId", "postId", "parentId"],
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
  const comment = await Comment.findByPk(commentid);
  if (!comment) {
    return next(new AppError("No comments with given id", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      comment: comment.toJSON(),
    },
  });
});
 
exports.editComment = catchAsync(async (req, res, next) => {
  const userid = req.tokenData.id;
  const commentid = req.params.commentid;
  const comment = await Comment.findByPk(commentid);
  if(!comment){
    return next(new AppError('No comment exists with given id',404));
  }
  const result = comment.toJSON();
  if(result.userId !== userid){
    return next(new AppError('You are not authorised to edit this comment',401));
  }
  const update = await Comment.update(
    { commentText: req.body.commentText, createdAt : Date.now() },
    { where: { userId: userid, commentId: commentid }, individualHooks: true }
  );
  if(!update){
    return next(new AppError('Failed to edit comment',400));
  }
  const updatedData = await Comment.findByPk(commentid);
  if(!updatedData){
    return next(new AppError('Comment not found',404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      comment: updatedData.toJSON()
    }
  });
});

exports.deleteComment = catchAsync(async (req,res,next) => {
  const userid = req.tokenData.id;
  const commentid = req.params.commentid;
  const comment = await Comment.findByPk(commentid);
  if(!comment){
    return next(new AppError('No comment exists with given id',404));
  }
  const result = comment.toJSON();
  if(result.userId !== userid){
    return next(new AppError('You are not authorised to delete this comment',401));
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