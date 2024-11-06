const express = require("express");
const dbConnect = require("./configs/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const authRouter = require("./routes/authRoute");
const calonRouter = require("./routes/kandidatRoute");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/user", authRouter);
app.use("/kandidat",calonRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server sedang berjalan di PORT ${PORT}`);
});
