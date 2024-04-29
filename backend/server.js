const { applicationPort } = require("./configuration");
const { server } = require("./socket");
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
