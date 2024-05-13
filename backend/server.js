const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const { applicationPort } = require("./configuration");
const globalErrorHandler = require("./controllers/errorController.js");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8100",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

//management chat api 
const chatRoute = require('./router/chatRouter')(io);
app.use("/api/v1/chats",chatRoute);
//App error handling 
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find url ${req.originalUrl} on this server!`, 404));
});
//Error handling middleware
app.use(globalErrorHandler);
//synchronous uncaught exception handling

process.on("uncaughtException", (err) => {
  console.log("Unhandled Exception! Exiting from process");
  console.log(err.name, err.message);
  //forceful termination
  process.exit(1);
});

const port = applicationPort || 8081
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
//handling unhandled rejection of promise whch emit an event, handling it by listening to obseravble
process.on("unhandledRejection", (err) => {
  console.log("Unhandled rejection! Exiting from process");
  console.log(err.name, err.message);
  server.close(() => {
    //graceful termination
    process.exit(1);
  });
});
