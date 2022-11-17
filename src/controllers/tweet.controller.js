import {
  usersCollection,
  sessionsCollection,
  tweetsCollection,
} from "../index.js";

import { ObjectId } from "mongodb";

export async function postTweet(req, res) {
  const { text } = req.body;
  const { authorization } = req.headers;

  const token = authorization?.replace("Bearer ", "");
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const sessions = await sessionsCollection.findOne({ token });
    const user = await usersCollection.findOne({ _id: sessions.userId });

    console.log(user);

    await tweetsCollection.insertOne({ text, userId: user._id });

    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(500);
  }
}

/* axios.post(
    "/tweet",
    { text: "Olá mundo" },
    { headers: { Authorization: "Bearer token" } }
  ); */

export async function getTweets(req, res) {
  const { authorization } = req.headers;

  const token = authorization?.replace("Bearer ", "");
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const tweets = await tweetsCollection.find().toArray();
    res.send(tweets);
  } catch (err) {
    res.sendStatus(500);
  }
}
