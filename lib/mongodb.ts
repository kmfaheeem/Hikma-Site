import { MongoClient, GridFSBucket, Db, ServerApiVersion } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

const uri: string = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Extend the globalThis type to include our MongoDB cached variables
const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
  _mongoHasConnected?: boolean;
};

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
    console.log("MongoDB connection promise created in development.");
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

/**
 * Get database instance and log connection status on first use.
 */
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;

  // Log connection status in development on first successful connection
  if (process.env.NODE_ENV === "development") {
    if (!globalWithMongo._mongoHasConnected) {
      console.log("✅ Successfully connected to MongoDB!");
      globalWithMongo._mongoHasConnected = true;
    }
  }

  // Use MONGODB_DB_NAME if set, otherwise default to the DB in the URI
  const dbName = process.env.MONGODB_DB_NAME;
  return client.db(dbName); // If dbName is undefined, it uses the default from the URI
}

/**
 * Get GridFS bucket for file storage.
 */
export async function getGridFSBucket(): Promise<GridFSBucket> {
  const db = await getDatabase(); // Reuse the getDatabase function
  const bucketName = process.env.MONGODB_GRIDFS_BUCKET || "files";
  return new GridFSBucket(db, { bucketName: bucketName });
}