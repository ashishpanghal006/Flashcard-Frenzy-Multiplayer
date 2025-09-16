"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Game() {
  const searchParams = useSearchParams();
  const matchId = searchParams?.get("matchId") || "";
  const playerId = searchParams?.get("playerId") || "guest";

  const [question, setQuestion] = useState<any>(null);
  const [scores, setScores] = useState<any>({});
  const [index, setIndex] = useState(0);

  const fetchMatch = async () => {
    const res = await fetch(`/api/matchState?matchId=${matchId}`);
    const data = await res.json();
    setQuestion(data.questions[data.currentIndex]);
    setScores(data.scores);
    setIndex(data.currentIndex);
  };

  const answer = async (ans: string) => {
    const res = await fetch("/api/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, playerId, answer: ans }),
    });
    const data = await res.json();
    setScores(data.scores);
    fetchMatch();
  };

  useEffect(() => {
    if (matchId) fetchMatch();
  }, [matchId]);

  if (!question) return <p>over.......come back again.</p>;

  return (
    <main className="p-10">
      <h2 className="text-xl font-bold">Question {index + 1}</h2>
      <p className="mt-2">{question.text}</p>
      <div className="mt-4 space-y-2">
        {question.options.map((opt: string, i: number) => (
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
      <pre>{JSON.stringify(scores, null, 2)}</pre>
    </main>
  );
}