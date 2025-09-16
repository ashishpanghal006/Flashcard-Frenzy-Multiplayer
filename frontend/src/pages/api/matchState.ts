import { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const { matchId } = req.query;
  if (!matchId || typeof matchId !== "string") {
    return res.status(400).json({ error: "Missing matchId" });
  }

  const db = await getDb();
  const match = await db.collection("matches").findOne({ _id: new ObjectId(matchId) });

  if (!match) return res.status(404).json({ error: "Match not found" });

  res.json({
    questions: match.questions,
    currentIndex: match.currentIndex,
    scores: match.scores,
    players: match.players || [], // 👈 include players here
  });
}