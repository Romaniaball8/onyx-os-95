import { useCallback, useEffect, useRef, useState } from "react";

const W = 480;
const H = 320;
const PADDLE_W = 70;
const PADDLE_H = 10;
const BALL_R = 6;
const BRICK_ROWS = 5;
const BRICK_COLS = 10;
const BRICK_W = 42;
const BRICK_H = 14;
const BRICK_GAP = 2;
const BRICK_OFFSET_X = 9;
const BRICK_OFFSET_Y = 30;
const PADDLE_SPEED = 6;
const MAX_LIVES = 3;

const ROW_COLORS = ["#ff4444", "#ff8800", "#ffee00", "#44ff44", "#44aaff"];

type Brick = { x: number; y: number; alive: boolean; color: string };

function makeBricks(): Brick[] {
  const bricks: Brick[] = [];
  for (let r = 0; r < BRICK_ROWS; r++)
    for (let c = 0; c < BRICK_COLS; c++)
      bricks.push({
        x: BRICK_OFFSET_X + c * (BRICK_W + BRICK_GAP),
        y: BRICK_OFFSET_Y + r * (BRICK_H + BRICK_GAP),
        alive: true,
        color: ROW_COLORS[r],
      });
  return bricks;
}

export function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bricksRef = useRef<Brick[]>([]);
  const paddleRef = useRef({ x: W / 2 - PADDLE_W / 2 });
  const ballRef = useRef({ x: W / 2, y: H - 40, vx: 3, vy: -4 });
  const livesRef = useRef(MAX_LIVES);
  const scoreRef = useRef(0);
  const aliveRef = useRef(false);
  const rafRef = useRef(0);
  const keysRef = useRef<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [status, setStatus] = useState<"idle" | "running" | "won" | "dead">(
    "idle",
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, W, H);
    // Bricks
    for (const b of bricksRef.current) {
      if (!b.alive) continue;
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, BRICK_W, BRICK_H);
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillRect(b.x, b.y, BRICK_W, 3);
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(b.x, b.y + BRICK_H - 3, BRICK_W, 3);
    }
    // Paddle
    const px = paddleRef.current.x;
    ctx.fillStyle = "#ccc";
    ctx.fillRect(px, H - PADDLE_H - 8, PADDLE_W, PADDLE_H);
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillRect(px, H - PADDLE_H - 8, PADDLE_W, 3);
    // Ball
    const ball = ballRef.current;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
    ctx.fill();
    // HUD
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px Courier New";
    ctx.textAlign = "left";
    ctx.fillText(`SCORE: ${scoreRef.current}`, 8, 18);
    ctx.textAlign = "right";
    ctx.fillText(`LIVES: ${"♥".repeat(livesRef.current)}`, W - 8, 18);
  }, []);

  const loop = useCallback(() => {
    if (!aliveRef.current) return;
    const keys = keysRef.current;
    if (keys.has("ArrowLeft"))
      paddleRef.current.x = Math.max(0, paddleRef.current.x - PADDLE_SPEED);
    if (keys.has("ArrowRight"))
      paddleRef.current.x = Math.min(
        W - PADDLE_W,
        paddleRef.current.x + PADDLE_SPEED,
      );
    const ball = ballRef.current;
    ball.x += ball.vx;
    ball.y += ball.vy;
    // Wall bounces
    if (ball.x - BALL_R <= 0) {
      ball.vx = Math.abs(ball.vx);
    }
    if (ball.x + BALL_R >= W) {
      ball.vx = -Math.abs(ball.vx);
    }
    if (ball.y - BALL_R <= 0) {
      ball.vy = Math.abs(ball.vy);
    }
    // Paddle bounce
    const px = paddleRef.current.x;
    const py = H - PADDLE_H - 8;
    if (
      ball.y + BALL_R >= py &&
      ball.y + BALL_R <= py + PADDLE_H &&
      ball.x >= px - BALL_R &&
      ball.x <= px + PADDLE_W + BALL_R
    ) {
      const rel = (ball.x - (px + PADDLE_W / 2)) / (PADDLE_W / 2);
      ball.vx = rel * 5;
      ball.vy = -Math.abs(ball.vy);
    }
    // Ball lost
    if (ball.y > H + 20) {
      livesRef.current--;
      setLives(livesRef.current);
      if (livesRef.current <= 0) {
        aliveRef.current = false;
        setStatus("dead");
        draw();
        return;
      }
      ball.x = W / 2;
      ball.y = H - 60;
      ball.vx = (Math.random() > 0.5 ? 1 : -1) * 3;
      ball.vy = -4;
    }
    // Brick collision
    for (const b of bricksRef.current) {
      if (!b.alive) continue;
      if (
        ball.x + BALL_R > b.x &&
        ball.x - BALL_R < b.x + BRICK_W &&
        ball.y + BALL_R > b.y &&
        ball.y - BALL_R < b.y + BRICK_H
      ) {
        b.alive = false;
        scoreRef.current += 10;
        setScore(scoreRef.current);
        const overlapLeft = ball.x + BALL_R - b.x;
        const overlapRight = b.x + BRICK_W - (ball.x - BALL_R);
        const overlapTop = ball.y + BALL_R - b.y;
        const overlapBottom = b.y + BRICK_H - (ball.y - BALL_R);
        const minH = Math.min(overlapLeft, overlapRight);
        const minV = Math.min(overlapTop, overlapBottom);
        if (minV < minH) ball.vy = -ball.vy;
        else ball.vx = -ball.vx;
        break;
      }
    }
    // Win check
    if (bricksRef.current.every((b) => !b.alive)) {
      aliveRef.current = false;
      setStatus("won");
      draw();
      return;
    }
    draw();
    rafRef.current = requestAnimationFrame(loop);
  }, [draw]);

  const startGame = useCallback(() => {
    bricksRef.current = makeBricks();
    paddleRef.current = { x: W / 2 - PADDLE_W / 2 };
    ballRef.current = { x: W / 2, y: H - 50, vx: 3, vy: -4 };
    livesRef.current = MAX_LIVES;
    scoreRef.current = 0;
    setScore(0);
    setLives(MAX_LIVES);
    aliveRef.current = true;
    setStatus("running");
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
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
    draw();
  }, [draw]);

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
        data-ocid="breakout.canvas_target"
        style={{ border: "2px solid #444", imageRendering: "pixelated" }}
      />
      <div
        style={{
          color: "#0ff",
          fontFamily: "Courier New, monospace",
          fontSize: 12,
        }}
      >
        Score: {score} &nbsp;|&nbsp; Lives: {"♥".repeat(lives)}
      </div>
      {status !== "running" && (
        <div style={{ textAlign: "center" }}>
          {status === "dead" && (
            <div
              style={{
                color: "#f00",
                fontFamily: "Courier New, monospace",
                fontSize: 13,
                marginBottom: 6,
              }}
            >
              GAME OVER
            </div>
          )}
          {status === "won" && (
            <div
              style={{
                color: "#ffd700",
                fontFamily: "Courier New, monospace",
                fontSize: 13,
                marginBottom: 6,
              }}
            >
              YOU WIN! 🎉
            </div>
          )}
          <button
            type="button"
            data-ocid="breakout.start_button"
            className="btn-95"
            onClick={startGame}
            style={{ background: "#c0c0c0" }}
          >
            {status === "idle" ? "Start Game" : "Play Again"}
          </button>
          {status === "idle" && (
            <div
              style={{
                color: "#888",
                fontFamily: "Tahoma, sans-serif",
                fontSize: 10,
                marginTop: 4,
              }}
            >
              ← → Move Paddle
            </div>
          )}
        </div>
      )}
    </div>
  );
}
