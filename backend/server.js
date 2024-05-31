const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const { applicationPort } = require("./configuration");
const globalErrorHandler = require("./controllers/errorController.js");
const { crossOrigin } = require('./configuration');
const AppError = require('./utils/appError');
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: crossOrigin,//'https://travelblogbackend-kvtl.onrender.com',
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
	//console.log("a user connected", socket.id);

	const userId = socket.handshake.query.userId;
	if (userId != "undefined") userSocketMap[userId] = socket.id;

	// io.emit() is used to send events to all the connected clients
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// socket.on() is used to listen to the events. can be used both on client and server side
	socket.on("disconnect", () => {
		//console.log("user disconnected", socket.id);
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});
//management chat api
const chatRoute = require("./router/chatRouter")(io, getReceiverSocketId);
app.use("/api/v1/chats", chatRoute);
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

const port = applicationPort || 3000;
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

process.on('SIGTERM', () => {
  console.log('SIGTERM received shutting down gracefully');
  //It will handle all hanging request then close server
  server.close(() => {
    console.log('Server terminated!');
  });
  //do not process.exit, sigterm will automatically exit from processs.
});