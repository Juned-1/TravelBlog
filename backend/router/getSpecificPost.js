import { conn } from "../utils/dbconnection.js";
export const getSpecificPost = async(req,res,next) => {
    const searchQuery = req.query.search;
    const search_id = +searchQuery; //converting string id into number
    // let sql = `SELECT posts.post_id, posts.post_title, posts.post_subtitle, posts.post_content, users.firstName, users.lastName, posts.post_time, posts.post_video_url FROM users,posts WHERE users.id = posts.user_id AND posts.post_id = ?;`;
    let sql = `SELECT
                p.post_id,
                p.user_id,
                u.firstName,
                u.lastName,
                p.post_title,
                p.post_subtitle,
                p.post_content,
                p.post_time,
                COUNT(CASE WHEN pl.reaction_type = TRUE THEN 1 ELSE NULL END) AS like_count,
                COUNT(CASE WHEN pl.reaction_type = FALSE THEN 1 ELSE NULL END) AS dislike_count
            FROM
                posts p
            JOIN
                users u ON p.user_id = u.id
            LEFT JOIN
                post_likes_dislikes pl ON p.post_id = pl.post_id
            WHERE
                p.post_id = ?
            GROUP BY
                p.post_id, p.user_id, u.firstName, u.lastName, p.post_title, p.post_subtitle, p.post_content, p.post_time;
`
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
/*
SELECT
    p.post_id,
    p.user_id,
    p.post_title,
    p.post_subtitle,
    p.post_content,
    p.post_time,
    COUNT(CASE WHEN pl.reaction_type = TRUE THEN 1 ELSE NULL END) AS like_count,
    COUNT(CASE WHEN pl.reaction_type = FALSE THEN 1 ELSE NULL END) AS dislike_count
FROM
    posts p
LEFT JOIN
    post_likes_dislikes pl ON p.post_id = pl.post_id
WHERE
    p.post_id = your_post_id; -- Replace "your_post_id" with the actual post_id you're searching for
GROUP BY
    p.post_id, p.user_id, p.post_title, p.post_subtitle, p.post_content, p.post_time;

*/