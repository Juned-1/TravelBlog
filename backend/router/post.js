import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "../utils/constants.js";
import { conn } from "../utils/dbconnection.js";
export const writePost = async(req, res, next) => {
    const token = req.signedCookies[`${COOKIE_NAME}`];
    //console.log(token);
    if(!token || token.trim() === ""){
        return res.status(401).json({message : "Token Not Received"});
    }else{
        jwt.verify(token,process.env.JWT_SECRET, async(err,status) => {
            if(err){
                return res.status(401).json({message : "Token Expired"});
            }else{
                const decodedToken = jwt.decode(token, {
                    secret : process.env.JWT_SECRET
                });
                const values = [
                    decodedToken.id,
                    req.body.title,
                    req.body.subtitle,
                    req.body.post
                ];
                const sql = `INSERT INTO posts (user_id, post_title, post_subtitle, post_content) VALUES(?,?,?,?)`;
                await conn.query(sql,values,(err,result) => {
                    if(err){
                        console.log(err);
                        return res.status(500).json({ message: "error", result: err.message });
                    }else{
                        return res.status(200).json({ message: "ok", result: result });
                    }
                });
            }
        });
    }
}