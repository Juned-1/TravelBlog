import mysql from "mysql";
import dotenv from 'dotenv'

dotenv.config();
const pwd = process.env.PASSWORD;

export const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: pwd,
    database: 'travelblog'
});

conn.connect((err)=>{
    if(err){
        throw err;
        console.log(err);
    }
    else{
        console.log("connected");
    }
});
