import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";
import { conn } from "../utils/dbconnection.js";

export const userLogin = async(req,res,next) => {
    try {
        const { email,password } = req.body;
        const sql = "SELECT * from users where email=?";
        await conn.query(sql,email,async(err,result)=>{
            if(err){
                return res.status(500).json({"message" : "error", "result" : err.message});
            }else{
                if(result.length <= 0){
                    return res.status(401).send("User is not registered");
                }else{
                    //we can not directly decrypt password. It needs lot of computations. So we compare with encrypted password by compare method
                    const isPasswordCorrect = await compare(password,result[0].password);
                    if(!isPasswordCorrect){
                        return res.status(403).send("Incorrect password");
                    }
                    //clear cookies if user login again
                    res.clearCookie(COOKIE_NAME,{
                        httpOnly : true,
                        domain : "localhost",
                        signed : true,
                        path : "/",
                    });
                    //create token and cookies as response
                    const token = createToken(result[0].id.toString(),result[0].email,"7d");
                    const expires = new Date();
                    expires.setDate(expires.getDate() + 7);
                    //sending cookie HHTP only cookie from backend to front end, first parameter name of cookie, into root directories of cookies we want to show the cookies
                    res.cookie(COOKIE_NAME,token,{path : "/", domain : "localhost",
                        expires, httpOnly: true, signed : true });
                    return res.status(200).json({"message" : "Ok", id : result[0].name,email : result[0].email}); //200 -- ok
                }
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(201).json({"message" : "ERROR", cause : error.message});
    }
}