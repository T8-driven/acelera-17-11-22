import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { signUp, signIn } from "./controllers/users.controller.js";
import { postTweet, getTweets } from "./controllers/tweet.controller.js";

const app = express();
dotenv.config();
app.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);
try {
  await mongoClient.connect();
  console.log("MongoDB Conectado!");
} catch (err) {
  console.log(err);
}

const db = mongoClient.db("aceleraAuth");
export const usersCollection = db.collection("users");
export const sessionsCollection = db.collection("sessions");
export const tweetsCollection = db.collection("tweets");

app.post("/sign-up", signUp);
app.post("/sign-in", signIn);
app.post("/tweets", postTweet);
app.get("/tweets", getTweets);

app.listen(4000, () => console.log("Port 4000"));
