import {
  usersCollection,
  sessionsCollection,
} from "../index.js";

import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";

export async function signUp(req, res) {
  const { name, email, password } = req.body;

  const hashPassword = bcrypt.hashSync(password, 10);

  try {
    await usersCollection.insertOne({ name, email, password: hashPassword });
    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(500);
  }
}

export async function signIn(req, res) {
  const { email, password } = req.body;
  const token = uuidV4();

  try {
    const userExists = await usersCollection.findOne({ email });
    if (!userExists) {
      return res.sendStatus(401);
    }

    const passwordOk = bcrypt.compare(password, userExists.password);
    if (!passwordOk) {
      return res.sendStatus(401);
    }

    await sessionsCollection.insertOne({ token, userId: userExists._id });

    res.send({ token });
  } catch (err) {
    res.sendStatus(500);
  }
}


