const { default: mongoose } = require("mongoose");

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database Connected");
  } catch (error) {
    console.log("Database Error");
  }
};

module.exports = dbConnect;
