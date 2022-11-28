import UserCollection from "../models/user.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; //any name could be

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserCollection.find();
    res.json(users);
  } catch (error) {
    next({ message: "Cannot get the users list." });
  }
};
export const getSingleUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    //const user = await UserCollection.findOne({ firstName: id });
    const user = await UserCollection.findById(id);
    res.json({ success: true, user });
  } catch (error) {
    const err = new Error("User is not exist.");
    err.status = 404;
    next(err);
  }
};

//Register / SignUp user
export const getPostUser = async (req, res, next) => {
  try {
    /* HASH password to be secured--------------
    has to be execute before store into database 
    bcrypt.hash -->> asynchronous // bcrypt.hashSync -->> synchronous
    bcrypt.compare -->> asynchronous // bcrypt.compareSync -->> synchronous

    **saltOrRounds- 2.parameter of bcrypt.hash set the length of each character wanted - 10 is enough - 20 takes too long to hash

    //this part could execute in useSchema - can use here - the same  */
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    //set the has pw to new insert value
    req.body.password = hashedPassword;

    const newUser = new UserCollection(req.body);
    //set image
    if (req.file) {
      newUser.profileImage = `http://localhost:4000/${req.file.filename}`;
    }
    await newUser.save();
    //console.log(newUser.fullName);
    res.json({ success: true, newUser });
  } catch (error) {
    if (error.message.includes("E11000")) {
      next({ message: "Email is already exist." });
    } else {
      next({ message: "Cannot add the new user." });
    }
  }
};
export const getUpdateUser = async (req, res, next) => {
  try {
    let user = await UserCollection.findById(req.params.id);
    //update user with image
    if (req.file) {
      user.profileImage = `http://localhost:4000/${req.file.filename}`;
    }

    if (req.body.password) {
      let hashedPass = await bcrypt.hash(req.body.password, 10);
      user.password = hashedPass;
    }
    await user.save();

    let newBody = {};
    for (const key in req.body) {
      if (req.body[key] !== "" && key !== "password") {
        newBody[key] = req.body[key];
      }
    }

    const id = req.params.id;

    const updateUser = await UserCollection.findByIdAndUpdate(id, newBody, {
      new: true,
    }).populate("orders");

    res.json({ success: true, data: updateUser });
  } catch (error) {
    next({ message: "Cannot update the user." });
  }
};

//Login
export const getLogin = async (req, res, next) => {
  try {
    //select field to frontend
    const user = await UserCollection.findOne({ email: req.body.email }).select(
      "_id firstName lastName email password"
    );
    if (user) {
      //compare password user entered to hash password in database
      const verify = await bcrypt.compare(req.body.password, user.password);
      if (verify) {
        //certificate user for server to define next req from user
        /* -----authentication - create token----------
        1. first arg in sign is payload (user's data) - at least 1 unique value - can be "_id" or "id".....
        2. signature - secret key code stores in ".env"
        3... optional
        */
        let token = jwt.sign(
          { _id: user._id, firstName: user.firstName },
          process.env.TOKEN_SECRET_KEY
          /*  { expiresIn: "1h", issuer: "Le", audience: "student" } */
        );
        // user.token = token;
        // await user.save();
        const updateUser = await UserCollection.findByIdAndUpdate(
          user._id,
          { token: token },
          { new: true }
        )
          .select("_id firstName lastName email token orders password")
          .populate({
            path: "orders",
            populate: {
              path: "records",
              model: "records",
            },
          });

        //should not send token to user
        //res.json({ success: true, data: user, token });
        //res.cookie("token", token); //frontend doesn't have to do anything
        res.header("token", token); //can be in header or cookie
        res.json({ success: true, data: updateUser });

        // res.header("token", token).json({ success: true, data: updateUser });
      } else {
        throw new Error("Password is wrong!");
      }
    } else {
      throw new Error("Email is not exist.");
    }
  } catch (error) {
    next(error);
  }
};

export const getDeleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const existID = await UserCollection.findById(id);
    if (existID) {
      const deleteUser = await UserCollection.deleteOne({ _id: existID });
      const users = await UserCollection.find();
      res.json({ success: true, users });
    } else {
      throw new Error("This ID is not exist.");
    }
  } catch (error) {
    next({ message: "User is not exist." });
  }
};

//
export const checkUserToken = async (req, res, next) => {
  try {
    const token = req.headers.token;
    const decode = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

    const user = await UserCollection.findById(decode._id).populate("orders");
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
