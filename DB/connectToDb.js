const mongoose = require("mongoose");
const connectToDb = () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("Connected!"));
};
module.exports = connectToDb;
