import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectMongoDB from "./db/connectMongoDB.js";
import cors from "cors";
import authRoutes from "./routes/auth.route.js"
import cutriRoutes from "./routes/cutri.route.js"
import dotbaucuRoutes from "./routes/dotbaucu.route.js"
import donviRoutes from "./routes/donvibaucu.route.js"
import ungcuvienRoutes from "./routes/ungcuvien.route.js"
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

app.use("/api/auth", authRoutes )
app.use("/api/cutri", cutriRoutes )
app.use("/api/dotbaucu", dotbaucuRoutes )
app.use("/api/donvi", donviRoutes )
app.use("/api/ungcuvien", ungcuvienRoutes )

app.listen(5000, () => {
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
});