const express = require("express");
const connectToDb = require("./DB/connectToDb");
require("dotenv").config();
const app = express();
app.use(express.json());
const authRoute = require("./routes/authRoute");
const usersRoute = require("./routes/userRoute");
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", usersRoute);
connectToDb();
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
