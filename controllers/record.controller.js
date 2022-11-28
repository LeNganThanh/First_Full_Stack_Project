import RecordCollection from "../models/record.schema.js";

//GET - all records
export const getAllRecords = async (req, res, next) => {
  //res.send("Received get request on record.");
  try {
    const records = await RecordCollection.find();
    res.json(records); //without async/await this line execute first -->>undefined
  } catch (error) {
    next({ message: "Cannot get the records list." });
  }
};

//GET - a single record
export const getSingleRecord = async (req, res, next) => {
  try {
    const id = req.params.id;
    const singleRecord = await RecordCollection.findById(id);
    res.json({ success: true, record: singleRecord });
  } catch (error) {
    next({ message: "Record is not exist" });
  }
};

//POST - request to create record
export const getPostRecord = async (req, res, next) => {
  try {
    const record = new RecordCollection(req.body);
    await record.save();

    res.json({ success: true, record });
  } catch (error) {
    next({ message: "Cannot add the new record." });
  }
};

//PATCH - update data
export const getUpdateRecord = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updateRecord = await RecordCollection.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.json({ success: true, record: updateRecord });
  } catch (error) {
    next({ message: "Cannot update the record." });
  }
};

//DELETE - delete data
export const getDeleteRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    //const deleteRecord = await RecordCollection.findByIdAndDelete(id);
    //findByIdAndRemove is the same}
    const existId = await RecordCollection.findById(id);

    if (existId) {
      const deleteItem = await RecordCollection.deleteOne({ _id: existId._id });
      const records = await RecordCollection.find();
      res.json({ success: true, records });
    } else {
      throw new Error("This ID is not exist.");
    }
  } catch (error) {
    next({ message: "Record is not exist." });
  }
};
