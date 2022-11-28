import mongoose from "mongoose";
import bcrypt from "bcrypt";
//import {Schema, model} from "mongoose"; //destructure directly

const Schema = mongoose.Schema;

//user documents structure
const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["user", "admin"], default: "user" }, //enum to give the role - after setting "admin" before public page to all user delete "admin"
  token: { type: String },
  profileImage: {
    type: String,
    default: function () {
      return `https://joeschmoe.io/api/v1/${this.firstName}`;
    },
  },
  password: { type: String, required: true },
  orders: [{ type: Schema.Types.ObjectId, ref: "orders" }],
});
/*  
//this part is added into Schema
{
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }

//create a virtual fullName out of 2 input firstName and lastName
userSchema.virtual("fullName").get(function () {
  return this.firstName + " " + this.lastName;
});

userSchema.virtual("domain").get(function () {
  return this.email.split("@")[1].split(".")[0];
});

//this executes before save - use this middleware to hash the password before store database
//the condition need to check only if we use "pre save" here
userSchema.pre("save", function (next) {
   if(this.isModify("password")){
      const hashedPassword = bcrypt.hashSync(this.password, 10);
  this.password = hashedPassword;
  }

  console.log("I am pre-save middleware.");
  next();
});

//this executes save to store new user
userSchema.post("save", function () {
  console.log("I am post-save function");
});
 */
const UserCollection = mongoose.model("users", userSchema);

//create index for unique item
UserCollection.createIndexes({ email: 1 });

export default UserCollection;
