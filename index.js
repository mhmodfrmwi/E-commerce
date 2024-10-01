const express = require("express");
const connectToDb = require("./DB/connectToDb");
require("dotenv").config();
const morgan = require("morgan");
const app = express();
app.use(express.json());
app.use(morgan("tiny"));
const authRoute = require("./routes/authRoute");
const usersRoute = require("./routes/userRoute");
const productsRoute = require("./routes/productRoute");
const categoriesRoute = require("./routes/categoryRoute");
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/products", productsRoute);
app.use("/api/v1/categories", categoriesRoute);
connectToDb();
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
