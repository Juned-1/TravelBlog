import { conn } from "../utils/dbconnection.js";
export const deletePost = async(req,res,next) => {
    const searchQuery = req.query.search;
    const search_id = +searchQuery; //converting string id into number
    let sql = `DELETE FROM  posts WHERE posts.post_id = ?;`;
    
    await conn.query(sql,searchQuery,(err,result) => {
        if(err){
            return res.status(500).json({ message: "error", result: err.message });
            throw err;
        }else{
            return res.status(200).json({ message: "ok", });
        }
    });
}