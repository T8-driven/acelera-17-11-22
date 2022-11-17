import {
  usersCollection,
  sessionsCollection,
  tweetsCollection,
} from "../index.js";

export async function postTweet(req, res) {
  const { text } = req.body;
  const { authorization } = req.headers;

  const token = authorization?.replace("Bearer ", "");
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const sessions = sessionsCollection.findOne({ token });
    const user = usersCollection.findOne({ _id: sessions.userId });

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

export async function getTweet(req, res) {
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
