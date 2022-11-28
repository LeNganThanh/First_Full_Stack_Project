import OrderCollection from "../models/order.schema.js";
import UserCollection from "../models/user.schema.js";

export const getAllOrders = async (req, res, next) => {
  //populate has to use the field name in OrderSchema
  //second argument to exclusive/inclusive - some data fields
  try {
    const orders = await OrderCollection.find()
      .populate("records", "-_id -__v")
      .populate("userId", "-_id -email -password -__v");
    res.json(orders);
  } catch (error) {
    // res.json({ success: false, message: error.message });
    next({ message: "Cannot get the orders list." }); //send to universal error handle in app.js to execute
  }
};
export const getSingleOrder = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updateOrder = await OrderCollection.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ success: true, order: updateOrder });
  } catch (error) {
    next({ message: "Order is not exist." });
  }
};
export const getPostOrder = async (req, res, next) => {
  try {
    const order = new OrderCollection(req.body);
    await order.save();

    //push the order to users to history all orders
    // const user = UserCollection.findById(order.userId);
    // user.orders.push(order._id);
    // await user.save();
    //-------//
    //using "update" that doesn't need "save" - the hash password will not change
    //update user after order
    const updateUser = await UserCollection.findByIdAndUpdate(
      order.userId,
      { $push: { orders: order._id } },
      { new: true }
    ).populate("orders");

    res.json({ success: true, data: updateUser });
  } catch (error) {
    next({ message: "Cannot add new order." });
  }
};
export const getUpdateOrder = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updateOrder = await OrderCollection.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ success: true, order: updateOrder });
  } catch (error) {
    next({ message: "Cannot update the order." });
  }
};
export const getDeleteOrder = async (req, res, next) => {
  try {
    const id = req.params.id;
    const existOrder = await OrderCollection.findById(id);
    if (existOrder) {
      await OrderCollection.deleteOne(existOrder._id);

      /* delete order from user's orders list
       */
      const updateUser = await UserCollection.findByIdAndUpdate(
        req.user._id,
        { $pull: { orders: id } },
        { new: true }
      ).populate("orders");
      res.json({ success: true, data: updateUser });
    } else {
      throw new Error("order is not exist!");
    }
  } catch (error) {
    next(error);
  }
};
