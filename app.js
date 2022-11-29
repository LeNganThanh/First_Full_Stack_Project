import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); //initial dotenv to make it work

import cookie from "cookie-parser"; //use to read token from cookies


//by import can use any suitable name for the router
import userRouter from "./routes/user.routes.js";
import orderRouter from "./routes/order.routes.js";
import recordRouter from "./routes/record.routes.js";
import { verifyToken } from "./middleware/verifyToken.middleWare.js";

//create express server
const app = express();

//process.env.PORT automatic given by "render"
const PORT = process.env.PORT || 4000;

//-----config "multer" package
//const upload = multer({ dest: "upload/" }); //"dest" -> destination
/* ---setup multer diskStorage---- 
1. destination has to be entered word - cb is callback -> can be any type 
2. file name
*/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let fullPath = "./upload/";

    cb(null, fullPath);
  },
  filename: function (req, file, cb) {
    let newFilename = new Date().getTime() + "_" + file.originalname;
    cb(null, newFilename);
  },
});
const upload = multer({ storage: storage });

const MONGO_URL = process.env.MONGO_URL;
/*
//connect to MongoDB on local machine only for test - for user - using mongo atlas 
import "./models/mongoose.connect.js"; //call from separate file
*/
mongoose.connect(MONGO_URL, () => {
  console.log("DB connection established!");
});

/* MVC
- Models : data storage
- Views : UI - frontend - presentational data
- Controllers: request handler, logic
 */
//connect to frontend - if allow everybody -->> origin: "*"
//exposedHeaders: allow user from frontend to see "token" - name "token" has to be the same everywhere
/* cors-----------need only when no build file in backend

app.use(
  cors({
    origin: "http://localhost:3000",
    exposedHeaders: ["token"],
  })
);
 */
//serve point direct to the folder where the images are
app.use(express.static("upload"));

app.use(cookie());
/* //use is for all of "/" for any methods : get, post, delete.....
app.use("/", (req, res, next) => {
  console.log(req.url);
  next();
}); */
//using morgan similar like comment above just to shows the status of command execute
//app.use(morgan("dev")); //tiny ~ dev
/* 
- app.use(express.json())-->> this is external middleware - a function get call
- app.use(middleware); -->> customer middle ware - function call direct
*/
app.use(express.json());

//get the index.html from frontend run on backend host
app.use(express.static("views/build"));
app.get("/", (req, res) => {
  res.sendFile("./views/build/index.html", { root: "." });
});

/* app.get(
  "/",
  //the middle ware "next" work only inside of the "get / - /user..." function
  //   (req, res, next) => {
  //     console.log("I am in the middle");
  //     next();
  //   },
  //   (req, res, next) => {
  //     console.log("I am second in the row");
  //     next();
  //   },
  (req, res) => {
    res.send("I am done");
  }
); */
/*//-----------Test--------------------
 function log(req, res, next) {
  console.log("I am first middleware.");
  next(); //send to pageNotFound.html
  //next("hello"); //run the error handle middleware - past the 404 error handle - anything inside next() throw error out
}
function checkMethod(req, res, next) {
  console.log("I am second middleware.");
  next();
}
function checkMiddleware(req, res, next) {
  console.log("I am third middleware.");
}
app.use([log, checkMethod, checkMiddleware]);
 //don't have to call one more app - just put next to each other - put in an array to group the middleware
//app.use(checkMethod);*/
//----------------Route------------------
// "/users" - GET - POST - PATCH - DELETE - put condition "/users" to avoid the going round from top to bottom from file to file - enter only with route "/users"
app.use("/users", upload.single("image"), userRouter);
/* 
//upload.single/array but the name "image" has to be the same the name in frontend ->auto create the folder and will attached req.file
//name "image" has to give in "thunder" value "image" - choose file 
 */
// "/records" - GET - POST - PATCH - DELETE
app.use("/record", recordRouter);

// "/orders" - GET - POST - PATCH - DELETE
app.use("/order", verifyToken, orderRouter);

//------------ERROR Handle-------------

//handle 404 - error throw by express - page not found - this err message has to be always at the bottom.
app.use((req, res, next) => {
  //res.json({ success: false, message: "No route found!" });
  res.sendFile("./views/pageNotFound.html", { root: "." });
});

//Universal error handle middleware 1-err,...,4.next - must be in order
//req along with an error enters into this middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ success: false, message: err.message });
});

//-----------------------------------//
//listening request on the port 4000
app.listen(PORT, () => console.log(`Server is running on port : ${PORT}`));
