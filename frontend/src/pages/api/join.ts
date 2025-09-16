import { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role for server
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { matchId, playerId } = req.body;
  if (!matchId || !playerId) return res.status(400).json({ error: "Missing matchId or playerId" });

  const db = await getDb();

  const result = await db.collection("matches").findOneAndUpdate(
    { _id: new ObjectId(matchId) },
    { $addToSet: { players: playerId } },
    { returnDocument: "after" }
  );

  if (!result || !result.value) {
    return res.status(404).json({ error: "Match not found" });
  }

  const updatedMatch = result.value;

  // 🔥 broadcast updated players
  await supabase.channel(`match-${matchId}`).send({
    type: "broadcast",
    event: "player-joined",
    payload: { players: updatedMatch.players }
  });

  res.json({ players: updatedMatch.players });
}
