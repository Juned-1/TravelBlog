import mysql from "mysql";
export const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
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