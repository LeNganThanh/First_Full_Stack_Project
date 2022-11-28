import mongoose from "mongoose";

const Schema = mongoose.Schema;

//document structure
const recordSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number, required: true },
  img: { type: String, required: true },
  price: { type: Number, required: true },
  //currency: {type: Enum, value:["EUR","USD"]}
});

//create collection and store type of documents
const RecordCollection = mongoose.model("records", recordSchema);

export default RecordCollection;
