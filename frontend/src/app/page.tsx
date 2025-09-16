"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const startGame = async () => {
    const res = await fetch("/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hostId: "player1" }),
    });
    const data = await res.json();
    router.push(`/game?matchId=${data.matchId}&playerId=player1`);
  };

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">Flashcard Frenzy</h1>
      <button
        onClick={startGame}
        className="mt-5 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Start Game
      </button>
    </main>
  );
}