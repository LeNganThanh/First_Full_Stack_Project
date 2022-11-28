//express-validator uses to check the validate type of input fields - good for email - check the length can check in schema
import { body, check, validationResult } from "express-validator";

//can use "check" or "body"
//.exist is not needed because in Schema it is already "require"

export const userValidation = [
  check("firstName")
    .escape()
    .trim()
    .isLength({ min: 3 })
    .withMessage("minimum character required is 3"),

  check("lastName")
    .escape()
    .trim()
    .isLength({ max: 20 })
    .withMessage("maximum characters allowed are 20"),

  check("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("please provide us with valid email"),

  /* check("password").exists().isLength({min:5, max:20}).withMessage("your password is too short or too long") */
  check("password")
    .exists()
    .isLength({ min: 3 })
    .withMessage("password is too shorts...")
    .isLength({ max: 20 })
    .withMessage("password is too long ..."),

  //check if any error - if not go to next - if has then throw out the error
  //this "Custom middleware" will send response to execute next step
  (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      next();
    } else {
      const error = result.errors.reduce((acc, currentItem) => {
        acc[currentItem.param] = currentItem.msg;
        return acc;
      }, {});
      next({ message: error });
    }
  },
];
/* 
  body("firstName")
    .escape() //clear an valid input like <h1>...<script>
    .trim() //clear the empty space between " "
    //withMessage use only for validation value check - cannot use just to have message
    //.withMessage("Please provide us the valid name")
    .isLength({ min: 2 })
    .withMessage("minimum length of first name should be 2"),
*/
