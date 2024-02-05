const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
exports.getUserDetails = catchAsync(async(req,res,next) => {
    const uid = req.body.id; //decodedToken.id
    const userDetails = await User.findOne({
        attributes : [
            "firstName",
            "lastName",
            "dob",
            "gender"
        ],
        where: {
            id : uid
        }
    })
    if(!userDetails){
        return next(new AppError("User does not exist",400)); //bad request
    }
    return res.status(200).json({
        status : "success",
        data: {
            userDetails
        }
    })
});