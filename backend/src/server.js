import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { ConnectToDB } from "./config/db.js";
import authRoutes from "./routes/user.route.js"

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser())

app.use("/api/auth", authRoutes);

app.use("/health",(_,res)=>{
    res.json({message:"server is healthy..."})
})

ConnectToDB().then(()=>{
    app.listen(port,()=>{
        console.log(`server is running on port http://localhost:${port}`);
    })
})