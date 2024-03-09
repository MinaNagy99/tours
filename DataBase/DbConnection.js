import mongoose from "mongoose";
const DbConnection = mongoose
  .connect(
    "mongodb+srv://minanagykhalefa:KABnpeDEzhopoRJV@cluster0.c1op2rb.mongodb.net/"
  )
  .then(() => {
    console.log("connection is done");
  })
  .catch((err) => {
    console.log(`err is : ${err}`);
  });

export default DbConnection;
