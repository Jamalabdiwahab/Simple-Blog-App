import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { ConnectToDB } from "./config/db.js";
import authRoutes from "./routes/user.route.js";
import blogRoutes from "./routes/blog.route.js"

const app = express();
const port = process.env.PORT || 5000;
const FRONTEND_URL=process.env.FRONTEND_URL;

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin:FRONTEND_URL,
    credentials:true
}));

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes)

app.use("/health",(_,res)=>{
    res.json({message:"server is healthy..."})
})

ConnectToDB().then(()=>{
    app.listen(port,()=>{
        console.log(`server is running on port http://localhost:${port}`);
    })
})