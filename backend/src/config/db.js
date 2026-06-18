import mongoose from "mongoose";

export async function ConnectToDB() {

    const Mongo_uri=process.env.MONGO_LOCAL_URI

    if(!Mongo_uri){
        throw new Error("mongo is not connected, please check your env")
    }
    try {
        await mongoose.connect(Mongo_uri);
        console.log("MongoDB connected successfully.");
    } catch (error) {
        console.error("error connected mongo db: ",error);
        process.exit(1)
    }
    
}