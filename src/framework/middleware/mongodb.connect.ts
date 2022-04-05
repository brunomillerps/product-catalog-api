import mongoose from "mongoose";

const connectDB = (cb: mongoose.CallbackWithoutResult) => mongoose.connect(process.env.MONGO_DB_URL, cb)

const closeDB = (): Promise<void> => mongoose.connection.close()

export { connectDB, closeDB };
