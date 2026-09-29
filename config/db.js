const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully..!");
  })
  .catch((error) => {
    console.log("Database Connection Failed");
    console.log(error);
  });

module.exports = mongoose;