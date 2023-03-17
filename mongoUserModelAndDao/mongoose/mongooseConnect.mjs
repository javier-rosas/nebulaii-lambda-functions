import mongoose from "mongoose";

let conn = null;
const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
};

export async function mongooseConnect() {
  if (conn == null) {
    conn = mongoose.connect(`${uri}/${dbName}`, options).then(() => mongoose);
    // `await`ing connection after assigning to the `conn` variable
    // to avoid multiple function calls creating new connections
    await conn;
  }
  return conn;
}
