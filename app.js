const express = require("express");
const userRouter = require("./routes/users");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const cardsRouter = require("./routes/cards");
const adminRoutes = require("./routes/admin");
require("dotenv/config");

const PORT = 3002;
const app = express();

app.use(require("morgan")("dev"));
app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/cards", cardsRouter);

app.use("/api/admin", adminRoutes);

connect();
async function connect() {
  try {
    await mongoose.connect("mongodb://127.0.0.1/ree");
    console.log("connect to db");
    app.listen(PORT, () => console.log(`listening to port ${PORT}`));
  } catch (e) {
    console.log("failed to connect", e.message);
  }
}
