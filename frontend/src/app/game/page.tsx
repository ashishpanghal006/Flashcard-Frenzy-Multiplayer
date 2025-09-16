import { Suspense } from "react";
import Game from "./Game"; // we’ll move your logic into Game.tsx

export default function GamePage() {
  return (
    <Suspense fallback={<div>Loading game...</div>}>
      <Game />
    </Suspense>
  );
}