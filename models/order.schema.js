import mongoose from "mongoose";

const Schema = mongoose.Schema;

//order documents structure
const orderSchema = new Schema({
  //to set the peer to peer relationship "type" has to set up difference - has to be the same name used in schema
  records: [{ type: Schema.Types.ObjectId, ref: "records", required: true }],
  totalPrice: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
});

const OrderCollection = mongoose.model("orders", orderSchema);

export default OrderCollection;
