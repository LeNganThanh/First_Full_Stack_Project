import jwt from "jsonwebtoken";
import UserCollection from "../models/user.schema.js";

export const verifyToken = async (req, res, next) => {
  try {
    //extracting token out of headers
    const { token } = req.headers;

    // console.log(req.cookies.token);
    //verify token
    const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

    //get user from database
    const user = await UserCollection.findById(decodeToken._id);
    //attaching user in request
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
