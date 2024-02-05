const { Router } = require("express");
const userRoute = require("./userRouter");
const blogRoute = require("./blogRouter");


const appRouter = Router()
appRouter.use('/users',userRoute);
appRouter.use('/blogs',blogRoute);

module.exports = appRouter;