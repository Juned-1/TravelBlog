import { COOKIE_NAME } from "../utils/constants.js";
import { conn } from "../utils/dbconnection.js";
export const getPost = async(req,res,next) => {
    let sql = "SELECT posts.post_id, posts.post_title, posts.post_subtitle, posts.post_content, users.firstName, users.lastName, posts.post_time FROM users,posts WHERE users.id = posts.user_id ORDER BY posts.post_time DESC LIMIT 10;";
    const searchQuery = req.body.search;
    if(searchQuery){
        sql = `SELECT posts.post_id, posts.post_title, posts.post_subtitle, posts.post_content, users.firstName, users.lastName, posts.post_time FROM users,posts WHERE users.id = posts.user_id AND posts.post_title LIKE '%${searchQuery}%';`;
    }
    await conn.query(sql,(err,result) => {
        if(err){
            return res.status(500).json({ message: "error", result: err.message });
            throw err;
        }else{
            const transformedResults = result.map(row => {
                const contentBuffer = row.post_content; // Accessing the BLOB data
                const contentString = contentBuffer ? contentBuffer.toString('utf8') : null;
                return { ...row, post_content: contentString };
            });
            return res.status(200).json({ message: "ok", result: transformedResults });
        }
    });
}