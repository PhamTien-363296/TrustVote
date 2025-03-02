import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectMongoDB from "./db/connectMongoDB.js";
import cors from "cors";
import authRoutes from "./routes/auth.route.js"

dotenv.config();



const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;



app.use(morgan("tiny"));
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true, limit: "500mb" }));
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);



app.get("/", (req, res) => {
    res.send("Xin chào bạn");
});


app.use("/api/auth",authRoutes )


app.listen(5000, () => {
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
});