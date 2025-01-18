import mongoose from "mongoose";

export const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING)
        console.log("Hey Harish , MongoDB Connected SuccessFully  !")
    } catch (error) {
        console.log("Failed to Connect DB")
        console.log(error)
    }

}