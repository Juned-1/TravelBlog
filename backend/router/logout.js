import { COOKIE_NAME } from "../utils/constants.js";
export const userlogout = async (req, res, next) => {
  try {
    //clear cookies if user login again
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: "localhost",
      signed: true,
      path: "/",
    });
    return res.status(200).json({message : "logout successful"});
  } catch (error) {
    console.log(error);
    return res.status(201).json({ message: "logout unsuccessful"});
  }
};
