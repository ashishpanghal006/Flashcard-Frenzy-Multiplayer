"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Question = {
  text: string;
  options: string[];
  correct: string;
};

type Scores = { [playerId: string]: number };

export default function Game() {
  const searchParams = useSearchParams();
  const matchId = searchParams?.get("matchId") || "";
  const playerId = searchParams?.get("playerId") || "guest";

  const [question, setQuestion] = useState<Question | null>(null);
  const [scores, setScores] = useState<Scores>({});
  const [index, setIndex] = useState(0);
  const [players, setPlayers] = useState<string[]>([]);

  const fetchMatch = async () => {
    const res = await fetch(`/api/matchState?matchId=${matchId}`);
    const data = await res.json();
    setQuestion(data.questions[data.currentIndex]);
    setScores(data.scores || {});
    setIndex(data.currentIndex);
    setPlayers(data.players || []);
  };

  const answer = async (ans: string) => {
    await fetch("/api/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, playerId, answer: ans }),
    });
  };

  useEffect(() => {
    if (!matchId) return;
    fetchMatch();

    const channel = supabase
      .channel(`match-${matchId}`)
      .on("broadcast", { event: "score-update" }, (payload) => {
        setScores(payload.payload.scores);
      })
      .on("broadcast", { event: "player-joined" }, (payload) => {
        setPlayers(payload.payload.players);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  if (!question) return <p>Game over. Come back again.</p>;

  return (
    <main className="p-10">
      <h2 className="text-xl font-bold">Question {index + 1}</h2>
      <p className="mt-2">{question.text}</p>

      <div className="mt-4 space-y-2">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => answer(opt)}
            className="p-2 bg-yellow-300 text-black border border-black m-1"
          >
            {opt}
          </button>
        ))}
      </div>

      <h3 className="mt-6 text-lg font-bold">Scores</h3>
      <ul>
        {players.map((p) => (
          <li key={p}>
            {p} — {scores[p] ?? 0} points
          </li>
        ))}
      </ul>
    </main>
  );
}