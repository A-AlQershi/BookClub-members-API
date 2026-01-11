require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const membersRoutes = require("./routes/membersRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.databaseURL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

app.get("/", (req, res) => {
  res.send("Welcome to the club!");
});

app.use("/members", membersRoutes);

app.listen(process.env.PORT);
