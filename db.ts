import {MongoClient} from "mongodb";

const MONGO_URI = process.env.MONGO_URI;


if (!MONGO_URI) {
    throw new Error("MongoDB URI is not defined");
}

const client = new MongoClient(MONGO_URI);
const DB_NAME = "mp-5";

const clientPromise = client.connect();

export async function getDatabase(){
    const connectedClient = await clientPromise;
    return connectedClient.db(DB_NAME);
}
