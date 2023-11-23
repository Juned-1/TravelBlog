import { conn } from "../utils/dbconnection.js";
import { hash, compare } from "bcrypt";
import { COOKIE_NAME } from "../utils/constants.js";
import { createToken } from "../utils/token-manager.js";
export const userSignup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let userExist = false;
    await checkIfUserExist(email)
      .then(() => {
        userExist = false;
      })
      .catch(() => {
        userExist = true;
      });
    if (userExist)
      return res
        .status(401)
        .json({ message: "error", result: "user already exist" });
    else {
      let hashedPassword = await hash(password, 10);
      const sql = `INSERT INTO users (firstName,lastName, email, dob, gender, password) VALUES (?, ?, ?, ?, ?, ?)`;
      const values = [
        req.body.firstName,
        req.body.lastName,
        email,
        req.body.dob,
        req.body.gender,
        hashedPassword,
      ];
      await conn.query(sql, values, async(err, result) => {
        if (err) {
          res.status(500).json({ message: "error", result: err.message });
        } else {
          //clear cookies if user login again
          res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
          });
          //create token and cookies as response
          const token = createToken(
            result.insertId.toString(),
            email,
            req.body.firstName + ' ' + req.body.lastName,
            "7d"
          );
          
          const expires = new Date();
          expires.setDate(expires.getDate() + 7);
          //sending cookie HHTP only cookie from backend to front end, first parameter name of cookie, into root directories of cookies we want to show the cookies
          res.cookie(COOKIE_NAME, token, {
            path: "/",
            domain: "localhost",
            expires,
            httpOnly: true,
            signed: true,
          });
          return res.status(200).json({ message: "ok", result: req.body.firstName + ' ' +  req.body.lastName });
        }
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(201).json({ message: "ERROR", cause: error.message });
  }
};
const checkIfUserExist = async (email) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT COUNT(*) as count FROM users where email=?`;
    conn.query(sql, email, (err, result) => {
      if (err) {
        reject(err.message);
      } else {
        if (result[0].count > 0) reject(true);
        else resolve(false);
      }
    });
  });
};
