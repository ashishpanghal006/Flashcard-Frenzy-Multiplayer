import { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { matchId, playerId, answer } = req.body;
  const db = await getDb();

  const match = await db.collection("matches").findOne({ _id: new ObjectId(matchId) });
  if (!match) return res.status(404).json({ error: "Match not found" });

  const currentQ = match.questions[match.currentIndex];
  let correct = false;
  
  if (currentQ.correct === answer) {
    correct = true;
    match.scores[playerId] = (match.scores[playerId] || 0) + 1;
  }

  // move to next question
  match.currentIndex += 1;

  await db.collection("matches").updateOne(
    { _id: new ObjectId(matchId) },
    { $set: { scores: match.scores, currentIndex: match.currentIndex } }
  );

  res.json({ correct, scores: match.scores, nextIndex: match.currentIndex });
}
