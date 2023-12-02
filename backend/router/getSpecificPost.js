import { conn } from "../utils/dbconnection.js";
export const getSpecificPost = async(req,res,next) => {
    const searchQuery = req.query.search;
    const search_id = +searchQuery; //converting string id into number
    let sql = `SELECT posts.post_id, posts.post_title, posts.post_subtitle, posts.post_content, users.firstName, users.lastName, posts.post_time, posts.post_video_url FROM users,posts WHERE users.id = posts.user_id AND posts.post_id = ?;`;
    
    await conn.query(sql,searchQuery,(err,result) => {
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