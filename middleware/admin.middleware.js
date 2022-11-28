import { check, validationResult } from "express-validator";

export const adminValidation = (req, res, next) => {
  //if user is admin -->> next()
  //else --->> const err = new Error("unauthorized access!")
  // check("role");
  if (req.user.role === "admin") {
    next();
  } else {
    if (
      req.user._id.toString() === req.params.id ||
      req.user.orders.includes(req.params.id)
    ) {
      next();
    } else {
      const error = new Error("unauthorized access.");
      error.status = 403;
      next(error);
    }
  }
};
