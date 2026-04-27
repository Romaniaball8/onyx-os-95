import { useCallback, useEffect, useRef, useState } from "react";
const W = 500;
const H = 280;
const PADDLE_H = 50;
const PADDLE_W = 10;
const BALL_SIZE = 8;
const SPEED = 3;
const WIN_SCORE = 7;

type GameState = {
  ball: { x: number; y: number; vx: number; vy: number };
  p1: { y: number };
  p2: { y: number };
  score: [number, number];
  running: boolean;
};

function initState(): GameState {
  const angle = (Math.random() * 60 - 30) * (Math.PI / 180);
  const dir = Math.random() > 0.5 ? 1 : -1;
  return {
    ball: {
      x: W / 2,
      y: H / 2,
      vx: dir * SPEED * Math.cos(angle),
      vy: SPEED * Math.sin(angle),
    },
    p1: { y: H / 2 - PADDLE_H / 2 },
    p2: { y: H / 2 - PADDLE_H / 2 },
    score: [0, 0],
    running: true,
  };
}

export function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [gameStatus, setGameStatus] = useState<"idle" | "running" | "won">(
    "idle",
  );
  const [winner, setWinner] = useState<string>("");
  const rafRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const s = stateRef.current;
    if (!canvas || !s) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Background
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    // Center line
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = "#333";
    ctx.beginPath();
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.stroke();
    ctx.setLineDash([]);
    // Paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(8, s.p1.y, PADDLE_W, PADDLE_H);
    ctx.fillRect(W - 18, s.p2.y, PADDLE_W, PADDLE_H);
    // Ball
    ctx.fillStyle = "#fff";
    ctx.fillRect(
      s.ball.x - BALL_SIZE / 2,
      s.ball.y - BALL_SIZE / 2,
      BALL_SIZE,
      BALL_SIZE,
    );
    // Scores
    ctx.fillStyle = "#fff";
    ctx.font = "bold 24px Courier New";
    ctx.textAlign = "center";
    ctx.fillText(String(s.score[0]), W / 4, 30);
    ctx.fillText(String(s.score[1]), (3 * W) / 4, 30);
  }, []);

  const loop = useCallback(() => {
    const s = stateRef.current;
    if (!s?.running) return;
    const keys = keysRef.current;
    const spd = 4;
    if (keys.has("w") || keys.has("W")) s.p1.y = Math.max(0, s.p1.y - spd);
    if (keys.has("s") || keys.has("S"))
      s.p1.y = Math.min(H - PADDLE_H, s.p1.y + spd);
    if (keys.has("ArrowUp")) s.p2.y = Math.max(0, s.p2.y - spd);
    if (keys.has("ArrowDown")) s.p2.y = Math.min(H - PADDLE_H, s.p2.y + spd);

    s.ball.x += s.ball.vx;
    s.ball.y += s.ball.vy;

    if (s.ball.y <= 0 || s.ball.y >= H) s.ball.vy = -s.ball.vy;

    // Paddle collisions
    if (s.ball.x <= 18 && s.ball.y >= s.p1.y && s.ball.y <= s.p1.y + PADDLE_H) {
      s.ball.vx = Math.abs(s.ball.vx) * 1.05;
      s.ball.vy += (s.ball.y - (s.p1.y + PADDLE_H / 2)) * 0.1;
    }
    if (
      s.ball.x >= W - 18 &&
      s.ball.y >= s.p2.y &&
      s.ball.y <= s.p2.y + PADDLE_H
    ) {
      s.ball.vx = -Math.abs(s.ball.vx) * 1.05;
      s.ball.vy += (s.ball.y - (s.p2.y + PADDLE_H / 2)) * 0.1;
    }

    // Score
    if (s.ball.x < 0) {
      s.score[1]++;
      setScores([...s.score]);
      if (s.score[1] >= WIN_SCORE) {
        s.running = false;
        setGameStatus("won");
        setWinner("Player 2");
        draw();
        return;
      }
      Object.assign(s, { ...initState(), score: s.score });
    } else if (s.ball.x > W) {
      s.score[0]++;
      setScores([...s.score]);
      if (s.score[0] >= WIN_SCORE) {
        s.running = false;
        setGameStatus("won");
        setWinner("Player 1");
        draw();
        return;
      }
      Object.assign(s, { ...initState(), score: s.score });
    }

    // Clamp speed
    const speedMag = Math.sqrt(s.ball.vx ** 2 + s.ball.vy ** 2);
    if (speedMag > 8) {
      s.ball.vx = (s.ball.vx / speedMag) * 8;
      s.ball.vy = (s.ball.vy / speedMag) * 8;
    }

    draw();
    rafRef.current = requestAnimationFrame(loop);
  }, [draw]);

  const startGame = useCallback(() => {
    stateRef.current = initState();
    setScores([0, 0]);
    setGameStatus("running");
    setWinner("");
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (["ArrowUp", "ArrowDown"].includes(e.key)) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (gameStatus === "idle") draw();
  }, [draw, gameStatus]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        data-ocid="pong.canvas_target"
        style={{ border: "2px solid #444" }}
      />
      <div
        style={{
          color: "#fff",
          fontFamily: "Courier New, monospace",
          fontSize: 11,
        }}
      >
        P1 {scores[0]} — {scores[1]} P2 &nbsp;|&nbsp; W/S vs ↑↓ &nbsp;|&nbsp;
        First to {WIN_SCORE}
      </div>
      {gameStatus !== "running" && (
        <div style={{ textAlign: "center" }}>
          {gameStatus === "won" && (
            <div
              style={{
                color: "#ffd700",
                fontFamily: "Courier New, monospace",
                fontSize: 14,
                marginBottom: 6,
              }}
            >
              🏆 {winner} Wins!
            </div>
          )}
          <button
            type="button"
            data-ocid="pong.start_button"
            className="btn-95"
            onClick={startGame}
            style={{ background: "#c0c0c0" }}
          >
            {gameStatus === "idle" ? "Start Game" : "Play Again"}
          </button>
        </div>
      )}
    </div>
  );
}
