import mongoose from "mongoose";

const connectDB = async () => {
    const {MONGO} = process.env;
    try {
      await  mongoose.connect(MONGO!,{
            dbName: "video_call_users"
        });
        console.log("Database connected");

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
export default connectDB;