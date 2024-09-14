import mongoose from "mongoose";

const connectionStrings = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@links.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000`;

if (!connectionStrings) {
  throw new Error("Please provide a valid connection string")
}

const connectDB = async () => {
  // this ensure that connection is made before we interact with the database

  if (mongoose.connection?.readyState >= 1) {
    // to prevent re-initialization

    // console.log("=== Already Connected to MongoDb ===")
    return
  }

  try {

    // initialize connection
    console.log("=== Connecting to MongoDb ===")
    await mongoose.connect(connectionStrings);

  } catch (error) {

    // throwing error
    console.log("Error connecting to MongoDb", error);
    
  }
}

export default connectDB;

