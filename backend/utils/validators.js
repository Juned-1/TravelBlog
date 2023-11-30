import { body, validationResult } from "express-validator";
import ValidationChain from "express-validator";
//validate function
const validate = (validations) => {
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
        return res.status(422).json({errors : errors.array()});
    }
};
//login validator chain
const loginValidator = [
    body("email").trim().isEmail().withMessage("Email is required"),
    body("password").trim().isLength({min : 6}).withMessage("Passwor should contain atleast 6 character")
    
];
//validator chain
const signUpValidator = [
    body("firstName").notEmpty().withMessage("First Name is required"),
    body("lastName").notEmpty().withMessage("Last Name is required"),
    body("dob").notEmpty().withMessage("DOB is required"),
    body("gender").notEmpty().withMessage("Gender is required"),
    ...loginValidator,
];
export { loginValidator,signUpValidator, validate };