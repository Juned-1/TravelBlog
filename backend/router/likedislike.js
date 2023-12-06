import { conn } from "../utils/dbconnection.js";
import { COOKIE_NAME } from "../utils/constants.js";
import jwt from "jsonwebtoken";

export const likedislike = async(req,res,next) => {
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
    // const searchQuery = req.query.search;
    // const search_id = +searchQuery; //converting string id into number
    const values = [
        req.body.post_id,
        decodedToken.id,
        req.body.val
    ];
    // let sql = `INSERT INTO post_likes_dislikes (post_id, user_id, reaction_type)
    //             VALUES (?, ?, ?);`
    let sql = `INSERT INTO post_likes_dislikes (post_id, user_id, reaction_type)
                VALUES (?,?,?)
                ON DUPLICATE KEY UPDATE reaction_type = NOT reaction_type;`
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