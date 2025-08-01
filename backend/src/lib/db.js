import mongoose from "mongoose";

export const connectDB = async () =>{
    try {
       const conn =  await mongoose.connect(process.env.MONGO_URI);
       console.log(`Connected to MongoDB ${conn.connection.host}`);
    } catch (error) {
        console.log("Fail to connect to MongoDB", error);
        process.exit(1);

    }
} 