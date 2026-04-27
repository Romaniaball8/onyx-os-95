import { useCallback, useEffect, useRef, useState } from "react";

const CELL = 16;
const COLS = 20;
const ROWS = 18;
const CANVAS_W = COLS * CELL;
const CANVAS_H = ROWS * CELL;

type Dir = "up" | "down" | "left" | "right";
type Point = { x: number; y: number };

function rand(max: number) {
  return Math.floor(Math.random() * max);
}
function randFood(snake: Point[]): Point {
  let p: Point;
  do {
    p = { x: rand(COLS), y: rand(ROWS) };
  } while (snake.some((s) => s.x === p.x && s.y === p.y));
  return p;
}

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    snake: [{ x: 10, y: 9 }],
    dir: "right" as Dir,
    nextDir: "right" as Dir,
    food: { x: 15, y: 9 },
    score: 0,
    alive: false,
    started: false,
  });
  const [displayScore, setDisplayScore] = useState(0);
  const [status, setStatus] = useState<"idle" | "running" | "dead">("idle");
  const rafRef = useRef<number>(0);
  const lastTickRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    // Food
    ctx.fillStyle = "#f00";
    ctx.fillRect(s.food.x * CELL + 1, s.food.y * CELL + 1, CELL - 2, CELL - 2);
    // Snake
    s.snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? "#0f0" : "#080";
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });
  }, []);

  const tick = useCallback(
    (ts: number) => {
      const s = stateRef.current;
      if (!s.alive) return;
      if (ts - lastTickRef.current > 150) {
        lastTickRef.current = ts;
        s.dir = s.nextDir;
        const head = { ...s.snake[0] };
        if (s.dir === "up") head.y--;
        else if (s.dir === "down") head.y++;
        else if (s.dir === "left") head.x--;
        else head.x++;
        // Wall collision
        if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
          s.alive = false;
          setStatus("dead");
          draw();
          return;
        }
        // Self collision
        if (s.snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
          s.alive = false;
          setStatus("dead");
          draw();
          return;
        }
        const ate = head.x === s.food.x && head.y === s.food.y;
        s.snake = [head, ...s.snake];
        if (!ate) s.snake.pop();
        else {
          s.score++;
          setDisplayScore(s.score);
          s.food = randFood(s.snake);
        }
      }
      draw();
      rafRef.current = requestAnimationFrame(tick);
    },
    [draw],
  );

  const startGame = useCallback(() => {
    const s = stateRef.current;
    s.snake = [{ x: 10, y: 9 }];
    s.dir = "right";
    s.nextDir = "right";
    s.food = { x: 15, y: 9 };
    s.score = 0;
    s.alive = true;
    s.started = true;
    setDisplayScore(0);
    setStatus("running");
    lastTickRef.current = 0;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (!s.alive) return;
      const map: Record<string, Dir> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right",
      };
      const newDir = map[e.key];
      if (!newDir) return;
      const opposites: Record<Dir, Dir> = {
        up: "down",
        down: "up",
        left: "right",
        right: "left",
      };
      if (newDir !== opposites[s.dir]) {
        s.nextDir = newDir;
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
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
        width={CANVAS_W}
        height={CANVAS_H}
        data-ocid="snake.canvas_target"
        style={{ border: "2px solid #444", imageRendering: "pixelated" }}
      />
      <div
        style={{
          color: "#0f0",
          fontFamily: "Courier New, monospace",
          fontSize: 13,
        }}
      >
        Score: {displayScore}
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
          <button
            type="button"
            data-ocid="snake.start_button"
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
              Arrow keys or WASD to move
            </div>
          )}
        </div>
      )}
    </div>
  );
}
