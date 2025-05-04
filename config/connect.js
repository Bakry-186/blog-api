import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("connected to DB");
});
