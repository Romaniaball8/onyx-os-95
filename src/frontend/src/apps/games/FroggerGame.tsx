import { useCallback, useEffect, useRef, useState } from "react";

const CELL = 32;
const COLS = 13;
const ROWS = 12;
const W = COLS * CELL;
const H = ROWS * CELL;
const MAX_LIVES = 3;

type Vehicle = {
  x: number;
  y: number;
  w: number;
  speed: number;
  color: string;
};
type Log = { x: number; y: number; w: number; speed: number };

const ROAD_ROWS = [7, 8, 9, 10]; // row indices (frog starts at row 11)
const WATER_ROWS = [2, 3, 4, 5];
const GOAL_ROW = 1;

function makeLane(row: number): { vehicles: Vehicle[]; logs: Log[] } {
  const vehicles: Vehicle[] = [];
  const logs: Log[] = [];
  if (ROAD_ROWS.includes(row)) {
    const dir = row % 2 === 0 ? 1 : -1;
    const speed = (1 + (10 - row) * 0.3) * dir;
    const colors = ["#f44", "#f80", "#ff0", "#0af"];
    const count = 3 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++)
      vehicles.push({
        x: i * (COLS / count) * CELL,
        y: row * CELL + 4,
        w: CELL * 2,
        speed,
        color: colors[i % colors.length],
      });
  }
  if (WATER_ROWS.includes(row)) {
    const dir = row % 2 === 0 ? 1 : -1;
    const speed = (0.8 + (6 - row) * 0.2) * dir;
    const count = 3;
    for (let i = 0; i < count; i++)
      logs.push({
        x: i * (COLS / count) * CELL,
        y: row * CELL + 4,
        w: CELL * 3,
        speed,
      });
  }
  return { vehicles, logs };
}

function initLanes() {
  const lanes: ReturnType<typeof makeLane>[] = [];
  for (let r = 0; r < ROWS; r++) lanes.push(makeLane(r));
  return lanes;
}

export function FroggerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frogRef = useRef({ x: 6, y: ROWS - 1 }); // grid coords
  const lanesRef = useRef(initLanes());
  const livesRef = useRef(MAX_LIVES);
  const scoreRef = useRef(0);
  const aliveRef = useRef(false);
  const rafRef = useRef(0);
  const frameRef = useRef(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [status, setStatus] = useState<"idle" | "running" | "won" | "dead">(
    "idle",
  );

  const respawnFrog = useCallback(() => {
    frogRef.current = { x: 6, y: ROWS - 1 };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Background zones
    for (let r = 0; r < ROWS; r++) {
      if (r === 0 || r === GOAL_ROW) ctx.fillStyle = "#003300";
      else if (WATER_ROWS.includes(r)) ctx.fillStyle = "#001a4d";
      else if (ROAD_ROWS.includes(r)) ctx.fillStyle = "#333";
      else ctx.fillStyle = "#1a3300"; // median / safe zones
      ctx.fillRect(0, r * CELL, W, CELL);
    }
    // Lane lines on road
    for (const r of ROAD_ROWS) {
      ctx.fillStyle = "#fff";
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, r * CELL);
      ctx.lineTo(W, r * CELL);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    // Logs
    for (const lane of lanesRef.current) {
      for (const l of lane.logs) {
        ctx.fillStyle = "#7a4a10";
        ctx.fillRect(l.x, l.y, l.w, CELL - 8);
        ctx.fillStyle = "#9a6a20";
        ctx.fillRect(l.x + 2, l.y + 2, l.w - 4, 4);
      }
    }
    // Vehicles
    for (const lane of lanesRef.current) {
      for (const v of lane.vehicles) {
        ctx.fillStyle = v.color;
        ctx.fillRect(v.x, v.y, v.w, CELL - 8);
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillRect(v.x + 4, v.y + 2, 16, 6);
        ctx.fillRect(v.x + v.w - 20, v.y + 2, 16, 6);
      }
    }
    // Goal lily pads
    ctx.fillStyle = "#0a0";
    for (let c = 1; c < COLS; c += 3)
      ctx.fillRect(c * CELL + 4, GOAL_ROW * CELL + 4, CELL - 8, CELL - 8);
    // Frog
    const f = frogRef.current;
    ctx.fillStyle = "#0f0";
    ctx.fillRect(f.x * CELL + 6, f.y * CELL + 4, CELL - 12, CELL - 8);
    ctx.fillStyle = "#0a0";
    ctx.fillRect(f.x * CELL + 2, f.y * CELL + 8, 8, 10);
    ctx.fillRect(f.x * CELL + CELL - 10, f.y * CELL + 8, 8, 10);
    ctx.fillStyle = "#ff0";
    ctx.fillRect(f.x * CELL + 8, f.y * CELL + 5, 4, 4);
    ctx.fillRect(f.x * CELL + CELL - 12, f.y * CELL + 5, 4, 4);
    // HUD
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px Courier New";
    ctx.textAlign = "left";
    ctx.fillText(`SCORE: ${scoreRef.current}`, 4, 14);
    ctx.textAlign = "right";
    ctx.fillText(`LIVES: ${"♥".repeat(livesRef.current)}`, W - 4, 14);
  }, []);

  const loop = useCallback(() => {
    if (!aliveRef.current) return;
    frameRef.current++;
    // Move lanes
    for (const lane of lanesRef.current) {
      for (const v of lane.vehicles) {
        v.x += v.speed;
        if (v.speed > 0 && v.x > W + 10) v.x = -v.w - 10;
        if (v.speed < 0 && v.x + v.w < -10) v.x = W + 10;
      }
      for (const l of lane.logs) {
        l.x += l.speed;
        if (l.speed > 0 && l.x > W + 10) l.x = -l.w - 10;
        if (l.speed < 0 && l.x + l.w < -10) l.x = W + 10;
      }
    }
    const frog = frogRef.current;
    const frogPxX = frog.x * CELL + CELL / 2;
    // Frog on log — ride it
    if (WATER_ROWS.includes(frog.y)) {
      const laneData = lanesRef.current[frog.y];
      const onLog = laneData.logs.find(
        (l) => frogPxX > l.x + 4 && frogPxX < l.x + l.w - 4,
      );
      if (onLog) {
        frog.x += onLog.speed / CELL;
        frog.x = Math.max(0, Math.min(COLS - 1, frog.x));
      } else {
        // Fell in water
        livesRef.current--;
        setLives(livesRef.current);
        if (livesRef.current <= 0) {
          aliveRef.current = false;
          setStatus("dead");
          draw();
          return;
        }
        respawnFrog();
      }
    }
    // Check vehicle collisions
    if (ROAD_ROWS.includes(frog.y)) {
      const lane = lanesRef.current[frog.y];
      const hit = lane.vehicles.some(
        (v) => frogPxX > v.x + 4 && frogPxX < v.x + v.w - 4,
      );
      if (hit) {
        livesRef.current--;
        setLives(livesRef.current);
        if (livesRef.current <= 0) {
          aliveRef.current = false;
          setStatus("dead");
          draw();
          return;
        }
        respawnFrog();
      }
    }
    // Reached goal
    if (frog.y <= GOAL_ROW) {
      scoreRef.current += 100;
      setScore(scoreRef.current);
      respawnFrog();
    }
    draw();
    rafRef.current = requestAnimationFrame(loop);
  }, [draw, respawnFrog]);

  const startGame = useCallback(() => {
    lanesRef.current = initLanes();
    livesRef.current = MAX_LIVES;
    scoreRef.current = 0;
    setScore(0);
    setLives(MAX_LIVES);
    aliveRef.current = true;
    setStatus("running");
    respawnFrog();
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [loop, respawnFrog]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!aliveRef.current) return;
      const f = frogRef.current;
      if (e.key === "ArrowUp") f.y = Math.max(0, f.y - 1);
      else if (e.key === "ArrowDown") f.y = Math.min(ROWS - 1, f.y + 1);
      else if (e.key === "ArrowLeft") f.x = Math.max(0, f.x - 1);
      else if (e.key === "ArrowRight") f.x = Math.min(COLS - 1, f.x + 1);
      else return;
      e.preventDefault();
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
        width={W}
        height={H}
        data-ocid="frogger.canvas_target"
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
          <button
            type="button"
            data-ocid="frogger.start_button"
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
              Arrow keys to hop the frog across!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
