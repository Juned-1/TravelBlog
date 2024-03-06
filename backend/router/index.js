const { Router } = require("express");
const userRoute = require("./userRouter");
const blogRoute = require("./blogRouter");
const commentRoute = require('./commentRouter');

const appRouter = Router()
appRouter.use('/users',userRoute);
appRouter.use('/blogs',blogRoute);
appRouter.use('/comments',commentRoute);
module.exports = appRouter;