import mongoose from "mongoose";

export async function connect() {
  try {
    // Connect to MongoDB
    mongoose.connect(process.env.MONGO_URI || "");

    // Listen to connection events
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("MongoDB connected");
    });
    connection.on("error", (error) => {
      console.log("Error connecting to MongoDB database : ", error);
      process.exit(1);
    });
  } catch (error) {
    console.log("Error connecting to database : ", error);
  }
}
