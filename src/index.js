import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";

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
    console.log("Connection error with DB", err);
  });
