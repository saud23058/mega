import express from "express";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Connected to the server");
    });
    app.on("Error", (err) => {
      console.log("Error ", err);
      throw err;
    });
  })
  .catch((err) => {
    console.log("Connection error with DB");
  });
