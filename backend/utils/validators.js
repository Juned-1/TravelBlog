const { body, validationResult, ValidationChain } = require("express-validator");
//import ValidationChain from "express-validator";
//validate function
exports.validate = (validations) => {
    return async(req, res, next) => {
        for(let validation of validations){
            const result = await validation.run(req);
            if(!result.isEmpty()){
                break;
            }
        }
        const errors = validationResult(req);
        if(errors.isEmpty()){
            return next();
        }
        return res.status(422).json({
            status: "error",
            message : errors.array()[0].msg
        }); //errors.array()
    }
};

//login validators chain
const loginValidator = [
    body("email").trim().isEmail().withMessage("Email is required"),
    body("password")
    .trim().notEmpty().withMessage("Password is required")
];

//sign up validator chain
const signUpValidator = [
    body("firstName").notEmpty().withMessage("First Name is required"),
    body("lastName").notEmpty().withMessage("Last Name is required"),
    body("dob").notEmpty().withMessage("DOB is required"),
    body("gender").notEmpty().withMessage("Gender is required"),
    body("email").trim().isEmail().withMessage("Email is required. Enter valid email!"),
    body("password")
    .trim().isLength({min: 6}).withMessage("Password should contain atleast 6 character")
    .matches(/^(?=.*[!@#$%^&*(),.?":{}|<>~_+;'"\[\]\/\\|])(?=.*\d)(?=.*[A-Z]).{6,}$/)
    .withMessage("Password should contain at least one special symbol, one digit, and one capital letter"),
    body("passwordConfirm")
    .trim().isLength({min : 6}).withMessage("Password Confirm should contain atleast 6 character")
    .matches(/^(?=.*[!@#$%^&*(),.?":{}|<>~_+;'"\[\]\/\\|])(?=.*\d)(?=.*[A-Z]).{6,}$/)
    .withMessage("Password Confirm should contain at least one special symbol, one digit, and one capital letter")
];
exports.validators = {loginValidator, signUpValidator};