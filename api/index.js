const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

dotenv.config();

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log("Connected to MongoDB"))
        .catch((error) => {
            console.log(error);
        });

app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:4200"],
    })
);
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

app.listen(3000, () => {
    console.log("Backend server is running")
})