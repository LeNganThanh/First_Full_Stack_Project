import mongoose from "mongoose";
import RecordCollection from "../models/record.schema.js";
import UserCollection from "../models/user.schema.js";
import OrderCollection from "../models/order.schema.js";

//install faker -->> npm i @faker-js/faker -D
import { faker } from "@faker-js/faker";

mongoose.connect("mongodb://127.0.0.1:27017/full-app-database");

async function addRecord() {
  const recordPromises = Array(10)
    .fill(null)
    .map(() => {
      const record = new RecordCollection({
        title: faker.commerce.productName(),
        author: faker.name.fullName(),
        year: faker.date.past().getFullYear(),
        img: faker.image.image(),
        price: faker.commerce.price(),
      });
      return record.save();
    });
  await Promise.all(recordPromises);
  mongoose.connection.close();
}
//addRecord();

async function addUser() {
  const userPromises = Array(10)
    .fill(null)
    .map(() => {
      const user = new UserCollection({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      });
      return user.save();
    });
  await Promise.all(userPromises);
  mongoose.connection.close();
}

//addUser();

async function addOrder() {
  const orderPromises = Array(10)
    .fill(null)
    .map(() => {
      const order = new OrderCollection({
        records: [faker.datatype.number(), faker.datatype.number()],
        totalPrice: faker.commerce.price(),
      });
      return order.save();
    });
  await Promise.all(orderPromises);
  mongoose.connection.close();
}
addOrder();
