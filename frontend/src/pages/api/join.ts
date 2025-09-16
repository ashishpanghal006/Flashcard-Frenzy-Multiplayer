import { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // backend only
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { matchId, playerId } = req.body;
  if (!matchId || !playerId) return res.status(400).json({ error: "Missing data" });

  const db = await getDb();

  // ✅ only update players array, don’t create new doc
  await db.collection("matches").updateOne(
    { _id: new ObjectId(matchId) },
    { $addToSet: { players: playerId } }
  );

  // ✅ broadcast that a new player joined
  await supabase.channel(`match-${matchId}`).send({
    type: "broadcast",
    event: "player-joined",
    payload: { playerId },
  });

  res.json({ joined: true });
}