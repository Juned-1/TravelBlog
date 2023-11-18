import appRouter  from "./router/index.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ credentials : true, origin : 'http://localhost:8100'}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use("/",appRouter);
app.listen(8081, ()=>{
    console.log("Listening");
})
