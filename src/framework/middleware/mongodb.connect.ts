import mongoose from "mongoose";

const connectDB = () => mongoose.connect(process.env.MONGO_URL)

const closeDB = (): Promise<void> => mongoose.connection.close()

export { connectDB, closeDB };
