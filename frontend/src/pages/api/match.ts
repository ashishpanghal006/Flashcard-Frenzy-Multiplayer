import { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if (req.method !== "POST") return res.status(405).end();

    const { hostId } = req.body;

    if (!hostId) return res.status(400).json({ error: "Missing hostId" });

    const db = await getDb();

    const questions = [
        { text: "2+2?", options: ["3", "4", "5"], correct: "4" },
        { text: "Capital of India?", options: ["Delhi", "Mumbai"], correct: "Delhi" },
        { text: "5 * 6?", options: ["30", "25", "40"], correct: "30" }
    ];

    const match = {
        hostId,
        questions,
        scores: {},
        currentIndex: 0,
        createdAt: new Date()
    };

    const result = await db.collection("matches").insertOne(match);

    res.json({ matchId: result.insertedId.toString() });
}