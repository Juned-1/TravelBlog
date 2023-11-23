import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";
export const createToken = (id, email, name, expiresIn) => {
    const payload = {id,email,name};
    const tokens = jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn, //expires time
    });
    return tokens;
}
export const verifyToken = async (req, res, next) => {
    //res.setHeader('Access-Control-Allow-Credentials',true);
    const token = req.signedCookies[`${COOKIE_NAME}`];
    if(!token || token.trim() == ""){
        return res.status(401).json({message : "Token Not Received"});
    }
    return new Promise((resolve,reject) => {
        return jwt.verify(token,process.env.JWT_SECRET,(err,status)=>{
            if(err){
                reject(err.message);
                return res.status(401).json({message : "Token Expired"});
            }else{
                console.log("Token verification successful");
                resolve();
                res.locals.jwtData = "success";
                return res.status(200).json({message : "Token verified"});
                //return next(); //return to next middleware
            }
        });

    })
}