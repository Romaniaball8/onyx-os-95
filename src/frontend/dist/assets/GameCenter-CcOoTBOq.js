import { r as reactExports, j as jsxRuntimeExports } from "./index-D7X0lYXV.js";
const W$5 = 480;
const H$5 = 320;
const PADDLE_W$1 = 70;
const PADDLE_H$1 = 10;
const BALL_R = 6;
const BRICK_ROWS = 5;
const BRICK_COLS = 10;
const BRICK_W = 42;
const BRICK_H = 14;
const BRICK_GAP = 2;
const BRICK_OFFSET_X = 9;
const BRICK_OFFSET_Y = 30;
const PADDLE_SPEED = 6;
const MAX_LIVES$1 = 3;
const ROW_COLORS = ["#ff4444", "#ff8800", "#ffee00", "#44ff44", "#44aaff"];
function makeBricks() {
  const bricks = [];
  for (let r = 0; r < BRICK_ROWS; r++)
    for (let c = 0; c < BRICK_COLS; c++)
      bricks.push({
        x: BRICK_OFFSET_X + c * (BRICK_W + BRICK_GAP),
        y: BRICK_OFFSET_Y + r * (BRICK_H + BRICK_GAP),
        alive: true,
        color: ROW_COLORS[r]
      });
  return bricks;
}
function BreakoutGame() {
  const canvasRef = reactExports.useRef(null);
  const bricksRef = reactExports.useRef([]);
  const paddleRef = reactExports.useRef({ x: W$5 / 2 - PADDLE_W$1 / 2 });
  const ballRef = reactExports.useRef({ x: W$5 / 2, y: H$5 - 40, vx: 3, vy: -4 });
  const livesRef = reactExports.useRef(MAX_LIVES$1);
  const scoreRef = reactExports.useRef(0);
  const aliveRef = reactExports.useRef(false);
  const rafRef = reactExports.useRef(0);
  const keysRef = reactExports.useRef(/* @__PURE__ */ new Set());
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(MAX_LIVES$1);
  const [status, setStatus] = reactExports.useState(
    "idle"
  );
  const draw = reactExports.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, W$5, H$5);
    for (const b of bricksRef.current) {
      if (!b.alive) continue;
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, BRICK_W, BRICK_H);
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillRect(b.x, b.y, BRICK_W, 3);
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(b.x, b.y + BRICK_H - 3, BRICK_W, 3);
    }
    const px = paddleRef.current.x;
    ctx.fillStyle = "#ccc";
    ctx.fillRect(px, H$5 - PADDLE_H$1 - 8, PADDLE_W$1, PADDLE_H$1);
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillRect(px, H$5 - PADDLE_H$1 - 8, PADDLE_W$1, 3);
    const ball = ballRef.current;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px Courier New";
    ctx.textAlign = "left";
    ctx.fillText(`SCORE: ${scoreRef.current}`, 8, 18);
    ctx.textAlign = "right";
    ctx.fillText(`LIVES: ${"♥".repeat(livesRef.current)}`, W$5 - 8, 18);
  }, []);
  const loop = reactExports.useCallback(() => {
    if (!aliveRef.current) return;
    const keys = keysRef.current;
    if (keys.has("ArrowLeft"))
      paddleRef.current.x = Math.max(0, paddleRef.current.x - PADDLE_SPEED);
    if (keys.has("ArrowRight"))
      paddleRef.current.x = Math.min(
        W$5 - PADDLE_W$1,
        paddleRef.current.x + PADDLE_SPEED
      );
    const ball = ballRef.current;
    ball.x += ball.vx;
    ball.y += ball.vy;
    if (ball.x - BALL_R <= 0) {
      ball.vx = Math.abs(ball.vx);
    }
    if (ball.x + BALL_R >= W$5) {
      ball.vx = -Math.abs(ball.vx);
    }
    if (ball.y - BALL_R <= 0) {
      ball.vy = Math.abs(ball.vy);
    }
    const px = paddleRef.current.x;
    const py = H$5 - PADDLE_H$1 - 8;
    if (ball.y + BALL_R >= py && ball.y + BALL_R <= py + PADDLE_H$1 && ball.x >= px - BALL_R && ball.x <= px + PADDLE_W$1 + BALL_R) {
      const rel = (ball.x - (px + PADDLE_W$1 / 2)) / (PADDLE_W$1 / 2);
      ball.vx = rel * 5;
      ball.vy = -Math.abs(ball.vy);
    }
    if (ball.y > H$5 + 20) {
      livesRef.current--;
      setLives(livesRef.current);
      if (livesRef.current <= 0) {
        aliveRef.current = false;
        setStatus("dead");
        draw();
        return;
      }
      ball.x = W$5 / 2;
      ball.y = H$5 - 60;
      ball.vx = (Math.random() > 0.5 ? 1 : -1) * 3;
      ball.vy = -4;
    }
    for (const b of bricksRef.current) {
      if (!b.alive) continue;
      if (ball.x + BALL_R > b.x && ball.x - BALL_R < b.x + BRICK_W && ball.y + BALL_R > b.y && ball.y - BALL_R < b.y + BRICK_H) {
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
    if (bricksRef.current.every((b) => !b.alive)) {
      aliveRef.current = false;
      setStatus("won");
      draw();
      return;
    }
    draw();
    rafRef.current = requestAnimationFrame(loop);
  }, [draw]);
  const startGame = reactExports.useCallback(() => {
    bricksRef.current = makeBricks();
    paddleRef.current = { x: W$5 / 2 - PADDLE_W$1 / 2 };
    ballRef.current = { x: W$5 / 2, y: H$5 - 50, vx: 3, vy: -4 };
    livesRef.current = MAX_LIVES$1;
    scoreRef.current = 0;
    setScore(0);
    setLives(MAX_LIVES$1);
    aliveRef.current = true;
    setStatus("running");
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);
  reactExports.useEffect(() => {
    const down = (e) => {
      keysRef.current.add(e.key);
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
    };
    const up = (e) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);
  reactExports.useEffect(() => {
    draw();
  }, [draw]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "canvas",
          {
            ref: canvasRef,
            width: W$5,
            height: H$5,
            "data-ocid": "breakout.canvas_target",
            style: { border: "2px solid #444", imageRendering: "pixelated" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              color: "#0ff",
              fontFamily: "Courier New, monospace",
              fontSize: 12
            },
            children: [
              "Score: ",
              score,
              "  |  Lives: ",
              "♥".repeat(lives)
            ]
          }
        ),
        status !== "running" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
          status === "dead" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                color: "#f00",
                fontFamily: "Courier New, monospace",
                fontSize: 13,
                marginBottom: 6
              },
              children: "GAME OVER"
            }
          ),
          status === "won" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                color: "#ffd700",
                fontFamily: "Courier New, monospace",
                fontSize: 13,
                marginBottom: 6
              },
              children: "YOU WIN! 🎉"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "breakout.start_button",
              className: "btn-95",
              onClick: startGame,
              style: { background: "#c0c0c0" },
              children: status === "idle" ? "Start Game" : "Play Again"
            }
          ),
          status === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                color: "#888",
                fontFamily: "Tahoma, sans-serif",
                fontSize: 10,
                marginTop: 4
              },
              children: "← → Move Paddle"
            }
          )
        ] })
      ]
    }
  );
}
const CELL$3 = 32;
const COLS$4 = 13;
const ROWS$4 = 12;
const W$4 = COLS$4 * CELL$3;
const H$4 = ROWS$4 * CELL$3;
const MAX_LIVES = 3;
const ROAD_ROWS = [7, 8, 9, 10];
const WATER_ROWS = [2, 3, 4, 5];
const GOAL_ROW = 1;
function makeLane(row) {
  const vehicles = [];
  const logs = [];
  if (ROAD_ROWS.includes(row)) {
    const dir = row % 2 === 0 ? 1 : -1;
    const speed = (1 + (10 - row) * 0.3) * dir;
    const colors = ["#f44", "#f80", "#ff0", "#0af"];
    const count = 3 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++)
      vehicles.push({
        x: i * (COLS$4 / count) * CELL$3,
        y: row * CELL$3 + 4,
        w: CELL$3 * 2,
        speed,
        color: colors[i % colors.length]
      });
  }
  if (WATER_ROWS.includes(row)) {
    const dir = row % 2 === 0 ? 1 : -1;
    const speed = (0.8 + (6 - row) * 0.2) * dir;
    const count = 3;
    for (let i = 0; i < count; i++)
      logs.push({
        x: i * (COLS$4 / count) * CELL$3,
        y: row * CELL$3 + 4,
        w: CELL$3 * 3,
        speed
      });
  }
  return { vehicles, logs };
}
function initLanes() {
  const lanes = [];
  for (let r = 0; r < ROWS$4; r++) lanes.push(makeLane(r));
  return lanes;
}
function FroggerGame() {
  const canvasRef = reactExports.useRef(null);
  const frogRef = reactExports.useRef({ x: 6, y: ROWS$4 - 1 });
  const lanesRef = reactExports.useRef(initLanes());
  const livesRef = reactExports.useRef(MAX_LIVES);
  const scoreRef = reactExports.useRef(0);
  const aliveRef = reactExports.useRef(false);
  const rafRef = reactExports.useRef(0);
  const frameRef = reactExports.useRef(0);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(MAX_LIVES);
  const [status, setStatus] = reactExports.useState(
    "idle"
  );
  const respawnFrog = reactExports.useCallback(() => {
    frogRef.current = { x: 6, y: ROWS$4 - 1 };
  }, []);
  const draw = reactExports.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    for (let r = 0; r < ROWS$4; r++) {
      if (r === 0 || r === GOAL_ROW) ctx.fillStyle = "#003300";
      else if (WATER_ROWS.includes(r)) ctx.fillStyle = "#001a4d";
      else if (ROAD_ROWS.includes(r)) ctx.fillStyle = "#333";
      else ctx.fillStyle = "#1a3300";
      ctx.fillRect(0, r * CELL$3, W$4, CELL$3);
    }
    for (const r of ROAD_ROWS) {
      ctx.fillStyle = "#fff";
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, r * CELL$3);
      ctx.lineTo(W$4, r * CELL$3);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    for (const lane of lanesRef.current) {
      for (const l of lane.logs) {
        ctx.fillStyle = "#7a4a10";
        ctx.fillRect(l.x, l.y, l.w, CELL$3 - 8);
        ctx.fillStyle = "#9a6a20";
        ctx.fillRect(l.x + 2, l.y + 2, l.w - 4, 4);
      }
    }
    for (const lane of lanesRef.current) {
      for (const v of lane.vehicles) {
        ctx.fillStyle = v.color;
        ctx.fillRect(v.x, v.y, v.w, CELL$3 - 8);
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillRect(v.x + 4, v.y + 2, 16, 6);
        ctx.fillRect(v.x + v.w - 20, v.y + 2, 16, 6);
      }
    }
    ctx.fillStyle = "#0a0";
    for (let c = 1; c < COLS$4; c += 3)
      ctx.fillRect(c * CELL$3 + 4, GOAL_ROW * CELL$3 + 4, CELL$3 - 8, CELL$3 - 8);
    const f = frogRef.current;
    ctx.fillStyle = "#0f0";
    ctx.fillRect(f.x * CELL$3 + 6, f.y * CELL$3 + 4, CELL$3 - 12, CELL$3 - 8);
    ctx.fillStyle = "#0a0";
    ctx.fillRect(f.x * CELL$3 + 2, f.y * CELL$3 + 8, 8, 10);
    ctx.fillRect(f.x * CELL$3 + CELL$3 - 10, f.y * CELL$3 + 8, 8, 10);
    ctx.fillStyle = "#ff0";
    ctx.fillRect(f.x * CELL$3 + 8, f.y * CELL$3 + 5, 4, 4);
    ctx.fillRect(f.x * CELL$3 + CELL$3 - 12, f.y * CELL$3 + 5, 4, 4);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px Courier New";
    ctx.textAlign = "left";
    ctx.fillText(`SCORE: ${scoreRef.current}`, 4, 14);
    ctx.textAlign = "right";
    ctx.fillText(`LIVES: ${"♥".repeat(livesRef.current)}`, W$4 - 4, 14);
  }, []);
  const loop = reactExports.useCallback(() => {
    if (!aliveRef.current) return;
    frameRef.current++;
    for (const lane of lanesRef.current) {
      for (const v of lane.vehicles) {
        v.x += v.speed;
        if (v.speed > 0 && v.x > W$4 + 10) v.x = -v.w - 10;
        if (v.speed < 0 && v.x + v.w < -10) v.x = W$4 + 10;
      }
      for (const l of lane.logs) {
        l.x += l.speed;
        if (l.speed > 0 && l.x > W$4 + 10) l.x = -l.w - 10;
        if (l.speed < 0 && l.x + l.w < -10) l.x = W$4 + 10;
      }
    }
    const frog = frogRef.current;
    const frogPxX = frog.x * CELL$3 + CELL$3 / 2;
    if (WATER_ROWS.includes(frog.y)) {
      const laneData = lanesRef.current[frog.y];
      const onLog = laneData.logs.find(
        (l) => frogPxX > l.x + 4 && frogPxX < l.x + l.w - 4
      );
      if (onLog) {
        frog.x += onLog.speed / CELL$3;
        frog.x = Math.max(0, Math.min(COLS$4 - 1, frog.x));
      } else {
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
    if (ROAD_ROWS.includes(frog.y)) {
      const lane = lanesRef.current[frog.y];
      const hit = lane.vehicles.some(
        (v) => frogPxX > v.x + 4 && frogPxX < v.x + v.w - 4
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
    if (frog.y <= GOAL_ROW) {
      scoreRef.current += 100;
      setScore(scoreRef.current);
      respawnFrog();
    }
    draw();
    rafRef.current = requestAnimationFrame(loop);
  }, [draw, respawnFrog]);
  const startGame = reactExports.useCallback(() => {
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
  reactExports.useEffect(() => {
    const handleKey = (e) => {
      if (!aliveRef.current) return;
      const f = frogRef.current;
      if (e.key === "ArrowUp") f.y = Math.max(0, f.y - 1);
      else if (e.key === "ArrowDown") f.y = Math.min(ROWS$4 - 1, f.y + 1);
      else if (e.key === "ArrowLeft") f.x = Math.max(0, f.x - 1);
      else if (e.key === "ArrowRight") f.x = Math.min(COLS$4 - 1, f.x + 1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);
  reactExports.useEffect(() => {
    draw();
  }, [draw]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "canvas",
          {
            ref: canvasRef,
            width: W$4,
            height: H$4,
            "data-ocid": "frogger.canvas_target",
            style: { border: "2px solid #444", imageRendering: "pixelated" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              color: "#0ff",
              fontFamily: "Courier New, monospace",
              fontSize: 12
            },
            children: [
              "Score: ",
              score,
              "  |  Lives: ",
              "♥".repeat(lives)
            ]
          }
        ),
        status !== "running" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
          status === "dead" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                color: "#f00",
                fontFamily: "Courier New, monospace",
                fontSize: 13,
                marginBottom: 6
              },
              children: "GAME OVER"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "frogger.start_button",
              className: "btn-95",
              onClick: startGame,
              style: { background: "#c0c0c0" },
              children: status === "idle" ? "Start Game" : "Play Again"
            }
          ),
          status === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                color: "#888",
                fontFamily: "Tahoma, sans-serif",
                fontSize: 10,
                marginTop: 4
              },
              children: "Arrow keys to hop the frog across!"
            }
          )
        ] })
      ]
    }
  );
}
const ROWS$3 = 9;
const COLS$3 = 9;
const MINES = 10;
function buildBoard(firstClick) {
  const cells = Array.from(
    { length: ROWS$3 },
    () => Array.from({ length: COLS$3 }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborCount: 0
    }))
  );
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS$3);
    const c = Math.floor(Math.random() * COLS$3);
    if (cells[r][c].isMine) continue;
    if (Math.abs(r - firstClick.r) <= 1 && Math.abs(c - firstClick.c) <= 1)
      continue;
    cells[r][c].isMine = true;
    placed++;
  }
  for (let r = 0; r < ROWS$3; r++) {
    for (let c = 0; c < COLS$3; c++) {
      if (cells[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < ROWS$3 && nc >= 0 && nc < COLS$3 && cells[nr][nc].isMine)
            count++;
        }
      }
      cells[r][c].neighborCount = count;
    }
  }
  return cells;
}
function revealFlood(board, r, c) {
  const b = board.map((row) => row.map((cell) => ({ ...cell })));
  const queue = [[r, c]];
  while (queue.length) {
    const item = queue.shift();
    if (!item) break;
    const [cr, cc] = item;
    if (cr < 0 || cr >= ROWS$3 || cc < 0 || cc >= COLS$3) continue;
    const cell = b[cr][cc];
    if (cell.isRevealed || cell.isFlagged || cell.isMine) continue;
    cell.isRevealed = true;
    if (cell.neighborCount === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          queue.push([cr + dr, cc + dc]);
        }
      }
    }
  }
  return b;
}
const NUM_COLORS = {
  1: "#0000ff",
  2: "#008000",
  3: "#ff0000",
  4: "#000080",
  5: "#800000",
  6: "#008080",
  7: "#000",
  8: "#808080"
};
function renderCell(r, c, cell, onClick, onRightClick) {
  const revealed = (cell == null ? void 0 : cell.isRevealed) ?? false;
  const mine = (cell == null ? void 0 : cell.isMine) ?? false;
  const flagged = (cell == null ? void 0 : cell.isFlagged) ?? false;
  const n = (cell == null ? void 0 : cell.neighborCount) ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: () => onClick(r, c),
      onContextMenu: (e) => onRightClick(e, r, c),
      style: {
        width: 22,
        height: 22,
        background: "#c0c0c0",
        border: "2px solid",
        borderColor: revealed ? "#808080 #fff #fff #808080" : "#fff #808080 #808080 #fff",
        fontSize: 11,
        fontWeight: "bold",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        color: n > 0 ? NUM_COLORS[n] : "#000",
        fontFamily: "Tahoma, sans-serif",
        flexShrink: 0
      },
      children: flagged && !revealed ? "🚩" : revealed ? mine ? "💣" : n > 0 ? n : "" : ""
    }
  );
}
function MinesweeperGame() {
  const [board, setBoard] = reactExports.useState(null);
  const [status, setStatus] = reactExports.useState(
    "idle"
  );
  const [flagCount, setFlagCount] = reactExports.useState(0);
  const resetGame = reactExports.useCallback(() => {
    setBoard(null);
    setStatus("idle");
    setFlagCount(0);
  }, []);
  const handleClick = reactExports.useCallback(
    (r, c) => {
      if (status === "won" || status === "lost") return;
      setBoard((prev) => {
        const b = prev ?? buildBoard({ r, c });
        const cell = b[r][c];
        if (cell.isRevealed || cell.isFlagged) return prev;
        if (cell.isMine) {
          const revealed = b.map(
            (row) => row.map((cl) => ({
              ...cl,
              isRevealed: cl.isMine ? true : cl.isRevealed
            }))
          );
          setStatus("lost");
          return revealed;
        }
        const newBoard = revealFlood(b, r, c);
        const safeLeft = newBoard.flat().filter((cl) => !cl.isMine && !cl.isRevealed).length;
        if (safeLeft === 0) setStatus("won");
        else setStatus("playing");
        return newBoard;
      });
    },
    [status]
  );
  const handleRightClick = reactExports.useCallback(
    (e, r, c) => {
      e.preventDefault();
      if (status === "won" || status === "lost") return;
      setBoard((prev) => {
        if (!prev) return prev;
        const b = prev.map((row) => row.map((cl) => ({ ...cl })));
        const cell = b[r][c];
        if (cell.isRevealed) return prev;
        cell.isFlagged = !cell.isFlagged;
        setFlagCount((f) => f + (cell.isFlagged ? 1 : -1));
        return b;
      });
    },
    [status]
  );
  const rows = Array.from(
    { length: ROWS$3 },
    (_, r) => Array.from({ length: COLS$3 }, (_2, c) => ({ r, c }))
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontFamily: "Tahoma, Verdana, sans-serif", fontSize: 11 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          background: "#c0c0c0",
          border: "2px solid",
          borderColor: "#808080 #fff #fff #808080",
          padding: "4px 8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
          fontWeight: "bold",
          fontFamily: "Courier New, monospace",
          fontSize: 13
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "💣 ",
            MINES - flagCount
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "minesweeper.reset_button",
              onClick: resetGame,
              style: {
                fontSize: 16,
                background: "#c0c0c0",
                border: "2px solid",
                borderColor: "#fff #808080 #808080 #fff",
                cursor: "pointer",
                padding: "0 4px"
              },
              children: status === "won" ? "😎" : status === "lost" ? "😵" : "🙂"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "⬜ ",
            ROWS$3 * COLS$3
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "minesweeper.canvas_target",
        style: {
          display: "inline-flex",
          flexDirection: "column",
          border: "2px solid",
          borderColor: "#808080 #fff #fff #808080"
        },
        children: rows.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex" }, children: row.map(({ r, c }) => {
          var _a;
          return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: renderCell(
            r,
            c,
            (_a = board == null ? void 0 : board[r]) == null ? void 0 : _a[c],
            handleClick,
            handleRightClick
          ) }, `${r}-${c}`);
        }) }, `row-${row[0].r}`))
      }
    ),
    (status === "won" || status === "lost") && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          marginTop: 8,
          textAlign: "center",
          fontWeight: "bold",
          color: status === "won" ? "#008000" : "#c00",
          fontSize: 13
        },
        children: status === "won" ? "You Win! 🎉" : "BOOM! Game Over."
      }
    )
  ] });
}
const CELL$2 = 14;
const COLS$2 = 28;
const ROWS$2 = 31;
const W$3 = COLS$2 * CELL$2;
const H$3 = ROWS$2 * CELL$2 + 40;
const POWER_DURATION = 420;
const GHOST_SCORE_CHAIN = [200, 400, 800, 1600];
const PACMAN_SPEED = 8;
const GHOST_SPEED = 10;
const GHOST_SPEED_SCARED = 16;
const MAZE_TEMPLATE = [
  "1111111111111111111111111111",
  "1222222222222112222222222221",
  "1211112111121121111211112011",
  "1311112111121121111211113011",
  "1211112111121121111211112011",
  "1222222222222222222222222221",
  "1211112112111111112112111201",
  "1211112112111111112112111201",
  "1222222112222112222112222221",
  "1111112111110001111011111111",
  "1111112111100000011101111111",
  "1111112110000000000011111111",
  "1111112110111441110011111111",
  "0000002000155551000200000000",
  "1111112110111111110011111111",
  "1111112110000000000011111111",
  "1111112111100000011101111111",
  "1111112111110001111011111111",
  "1222222222222112222222222221",
  "1211112111121121111211112011",
  "1211112111121121111211112011",
  "1322112222222022222222113211",
  "1112112112111111112112112111",
  "1112112112111111112112112111",
  "1222222112222112222112222221",
  "1211111111121121111111111201",
  "1211111111121121111111111201",
  "1222222222222222222222222221",
  "1111111111111111111111111111",
  "0000000000000000000000000000",
  "0000000000000000000000000000"
];
function buildMap() {
  return MAZE_TEMPLATE.map((row) => row.split("").map(Number));
}
function isWalkable(map, x, y, ghostHouseOk = false) {
  if (x < 0 || x >= COLS$2 || y < 0 || y >= ROWS$2) return false;
  const v = map[y][x];
  if (v === 1) return false;
  if (v === 4) return ghostHouseOk;
  if (v === 5) return ghostHouseOk;
  return true;
}
function manhattanDist(ax, ay, bx, by) {
  return Math.abs(ax - bx) + Math.abs(ay - by);
}
function makeGhosts() {
  return [
    {
      name: "blinky",
      x: 14,
      y: 11,
      dir: { x: -1, y: 0 },
      mode: "scatter",
      color: "#ff0000",
      scatterTarget: { x: COLS$2 - 1, y: 0 },
      frightenedFlash: false,
      eyeOnly: false,
      inHouse: false,
      exitTimer: 0
    },
    {
      name: "pinky",
      x: 13,
      y: 14,
      dir: { x: 1, y: 0 },
      mode: "scatter",
      color: "#ffb8ff",
      scatterTarget: { x: 0, y: 0 },
      frightenedFlash: false,
      eyeOnly: false,
      inHouse: true,
      exitTimer: 60
    },
    {
      name: "inky",
      x: 11,
      y: 14,
      dir: { x: 0, y: 1 },
      mode: "scatter",
      color: "#00ffff",
      scatterTarget: { x: COLS$2 - 1, y: ROWS$2 - 1 },
      frightenedFlash: false,
      eyeOnly: false,
      inHouse: true,
      exitTimer: 180
    },
    {
      name: "clyde",
      x: 16,
      y: 14,
      dir: { x: 0, y: -1 },
      mode: "scatter",
      color: "#ffb852",
      scatterTarget: { x: 0, y: ROWS$2 - 1 },
      frightenedFlash: false,
      eyeOnly: false,
      inHouse: true,
      exitTimer: 300
    }
  ];
}
function chaseTarget(ghost, pac, blinky) {
  switch (ghost.name) {
    case "blinky":
      return { x: pac.x, y: pac.y };
    case "pinky": {
      const tx = pac.x + pac.dir.x * 4;
      const ty = pac.y + pac.dir.y * 4;
      return {
        x: Math.max(0, Math.min(COLS$2 - 1, tx)),
        y: Math.max(0, Math.min(ROWS$2 - 1, ty))
      };
    }
    case "inky": {
      const px2 = pac.x + pac.dir.x * 2;
      const py2 = pac.y + pac.dir.y * 2;
      const tx = px2 + (px2 - blinky.x);
      const ty = py2 + (py2 - blinky.y);
      return {
        x: Math.max(0, Math.min(COLS$2 - 1, tx)),
        y: Math.max(0, Math.min(ROWS$2 - 1, ty))
      };
    }
    case "clyde": {
      const dist = manhattanDist(ghost.x, ghost.y, pac.x, pac.y);
      if (dist > 8) return { x: pac.x, y: pac.y };
      return ghost.scatterTarget;
    }
  }
}
function moveGhost(ghost, map, pac, blinky) {
  if (ghost.inHouse) {
    const targetX = 14;
    const targetY = 11;
    if (ghost.x !== targetX) {
      const dx = targetX > ghost.x ? 1 : -1;
      ghost.x += dx;
    } else if (ghost.y > targetY) {
      ghost.y -= 1;
    } else {
      ghost.inHouse = false;
      ghost.dir = { x: -1, y: 0 };
    }
    return;
  }
  if (ghost.mode === "eaten") {
    const doorX = 14;
    const doorY = 12;
    if (ghost.x === doorX && ghost.y === doorY) {
      ghost.y = 14;
      ghost.mode = "scatter";
      ghost.eyeOnly = false;
      ghost.inHouse = true;
      ghost.exitTimer = 120;
      return;
    }
    const dirs2 = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 }
    ];
    const possible2 = dirs2.filter((d) => {
      const nx = ghost.x + d.x;
      const ny = ghost.y + d.y;
      return isWalkable(map, nx, ny, true);
    });
    if (possible2.length > 0) {
      const best2 = possible2.reduce((a, b) => {
        const da = manhattanDist(ghost.x + a.x, ghost.y + a.y, doorX, doorY);
        const db = manhattanDist(ghost.x + b.x, ghost.y + b.y, doorX, doorY);
        return da < db ? a : b;
      });
      ghost.dir = best2;
      ghost.x += best2.x;
      ghost.y += best2.y;
      if (ghost.x < 0) ghost.x = COLS$2 - 1;
      if (ghost.x >= COLS$2) ghost.x = 0;
    }
    return;
  }
  const dirs = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 }
  ];
  const possible = dirs.filter((d) => {
    if (d.x === -ghost.dir.x && d.y === -ghost.dir.y) return false;
    const nx = ghost.x + d.x;
    const ny = ghost.y + d.y;
    return isWalkable(map, nx, ny, false);
  });
  if (possible.length === 0) {
    const rev = dirs.find(
      (d) => isWalkable(map, ghost.x + d.x, ghost.y + d.y, false)
    );
    if (rev) {
      ghost.dir = rev;
      ghost.x += rev.x;
      ghost.y += rev.y;
    }
    return;
  }
  let target;
  if (ghost.mode === "frightened") {
    const chosen = possible[Math.floor(Math.random() * possible.length)];
    ghost.dir = chosen;
    ghost.x += chosen.x;
    ghost.y += chosen.y;
    if (ghost.x < 0) ghost.x = COLS$2 - 1;
    if (ghost.x >= COLS$2) ghost.x = 0;
    return;
  }
  if (ghost.mode === "scatter") {
    target = ghost.scatterTarget;
  } else {
    target = chaseTarget(ghost, pac, blinky);
  }
  const best = possible.reduce((a, b) => {
    const da = manhattanDist(ghost.x + a.x, ghost.y + a.y, target.x, target.y);
    const db = manhattanDist(ghost.x + b.x, ghost.y + b.y, target.x, target.y);
    return da < db ? a : b;
  });
  ghost.dir = best;
  ghost.x += best.x;
  ghost.y += best.y;
  if (ghost.x < 0) ghost.x = COLS$2 - 1;
  if (ghost.x >= COLS$2) ghost.x = 0;
}
function drawGhost(ctx, ghost, frame) {
  const px = ghost.x * CELL$2 + 1;
  const py = ghost.y * CELL$2 + 40;
  const r = CELL$2 / 2 - 1;
  const cx = px + r + 1;
  const cy = py + r + 1;
  if (ghost.mode === "eaten") {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.ellipse(cx - 3, cy - 1, 3, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 3, cy - 1, 3, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#00f";
    ctx.beginPath();
    ctx.arc(cx - 2 + ghost.dir.x, cy - 1 + ghost.dir.y, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 4 + ghost.dir.x, cy - 1 + ghost.dir.y, 1.5, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  const flash = ghost.frightenedFlash && Math.floor(frame / 8) % 2 === 0;
  const bodyColor = ghost.mode === "frightened" ? flash ? "#fff" : "#0000ff" : ghost.color;
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, 0, false);
  const bottom = py + CELL$2 - 1;
  ctx.lineTo(px + CELL$2 - 2, bottom);
  const waveW = (CELL$2 - 2) / 3;
  for (let i = 0; i < 3; i++) {
    const wx = px + CELL$2 - 2 - i * waveW;
    ctx.lineTo(wx - waveW * 0.5, bottom - 3);
    ctx.lineTo(wx - waveW, bottom);
  }
  ctx.lineTo(px + 1, bottom);
  ctx.closePath();
  ctx.fill();
  if (ghost.mode === "frightened") {
    ctx.fillStyle = flash ? "#f00" : "#ffb8ff";
    ctx.beginPath();
    ctx.arc(cx - 3, cy - 1, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 3, cy - 1, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = flash ? "#f00" : "#ffb8ff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 4, cy + 3);
    ctx.lineTo(cx - 2, cy + 1);
    ctx.lineTo(cx, cy + 3);
    ctx.lineTo(cx + 2, cy + 1);
    ctx.lineTo(cx + 4, cy + 3);
    ctx.stroke();
  } else {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.ellipse(cx - 3, cy - 1, 2.5, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 3, cy - 1, 2.5, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#00b";
    ctx.beginPath();
    ctx.arc(
      cx - 3 + ghost.dir.x * 1.5,
      cy - 1 + ghost.dir.y * 1.5,
      1.5,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      cx + 3 + ghost.dir.x * 1.5,
      cy - 1 + ghost.dir.y * 1.5,
      1.5,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}
function drawPacman(ctx, pac, deathAnim) {
  const px = pac.x * CELL$2 + CELL$2 / 2;
  const py = pac.y * CELL$2 + CELL$2 / 2 + 40;
  const r = CELL$2 / 2 - 1;
  if (deathAnim > 0) {
    const progress = deathAnim / 60;
    const startAngle = Math.PI * progress;
    ctx.fillStyle = "#ff0";
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.arc(
      px,
      py,
      r * (1 - progress * 0.5),
      startAngle,
      Math.PI * 2 - startAngle
    );
    ctx.closePath();
    ctx.fill();
    return;
  }
  const angle = Math.atan2(pac.dir.y, pac.dir.x);
  const mouthAngle = pac.mouth / 5 * 0.45;
  ctx.fillStyle = "#ffff00";
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.arc(px, py, r, angle + mouthAngle, angle + Math.PI * 2 - mouthAngle);
  ctx.closePath();
  ctx.fill();
}
function drawMaze(ctx, map, frame) {
  var _a, _b, _c, _d;
  for (let row = 0; row < ROWS$2; row++) {
    for (let col = 0; col < COLS$2; col++) {
      const v = map[row][col];
      const px = col * CELL$2;
      const py = row * CELL$2 + 40;
      if (v === 1) {
        ctx.fillStyle = "#000080";
        ctx.fillRect(px, py, CELL$2, CELL$2);
        ctx.strokeStyle = "#0000ff";
        ctx.lineWidth = 1.5;
        if (row === 0 || ((_a = map[row - 1]) == null ? void 0 : _a[col]) !== 1) {
          ctx.beginPath();
          ctx.moveTo(px + 1, py + 1);
          ctx.lineTo(px + CELL$2 - 1, py + 1);
          ctx.stroke();
        }
        if (row === ROWS$2 - 1 || ((_b = map[row + 1]) == null ? void 0 : _b[col]) !== 1) {
          ctx.beginPath();
          ctx.moveTo(px + 1, py + CELL$2 - 1);
          ctx.lineTo(px + CELL$2 - 1, py + CELL$2 - 1);
          ctx.stroke();
        }
        if (col === 0 || ((_c = map[row]) == null ? void 0 : _c[col - 1]) !== 1) {
          ctx.beginPath();
          ctx.moveTo(px + 1, py + 1);
          ctx.lineTo(px + 1, py + CELL$2 - 1);
          ctx.stroke();
        }
        if (col === COLS$2 - 1 || ((_d = map[row]) == null ? void 0 : _d[col + 1]) !== 1) {
          ctx.beginPath();
          ctx.moveTo(px + CELL$2 - 1, py + 1);
          ctx.lineTo(px + CELL$2 - 1, py + CELL$2 - 1);
          ctx.stroke();
        }
      } else if (v === 4) {
        ctx.fillStyle = "#000";
        ctx.fillRect(px, py, CELL$2, CELL$2);
        ctx.fillStyle = "#ffb8ae";
        ctx.fillRect(px + 1, py + CELL$2 / 2 - 1, CELL$2 - 2, 3);
      } else if (v === 5) {
        ctx.fillStyle = "#000";
        ctx.fillRect(px, py, CELL$2, CELL$2);
      } else if (v === 2) {
        ctx.fillStyle = "#000";
        ctx.fillRect(px, py, CELL$2, CELL$2);
        ctx.fillStyle = "#ffdd99";
        ctx.beginPath();
        ctx.arc(px + CELL$2 / 2, py + CELL$2 / 2, 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (v === 3) {
        const pulse = 0.8 + 0.2 * Math.sin(frame * 0.1);
        ctx.fillStyle = "#000";
        ctx.fillRect(px, py, CELL$2, CELL$2);
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(px + CELL$2 / 2, py + CELL$2 / 2, 5 * pulse, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = "#000";
        ctx.fillRect(px, py, CELL$2, CELL$2);
      }
    }
  }
}
function drawHUD(ctx, score, lives, level) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W$3, 40);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 11px 'Courier New', monospace";
  ctx.textAlign = "left";
  ctx.fillText("1UP", 4, 12);
  ctx.fillStyle = "#fff";
  ctx.fillText(score.toString().padStart(6, "0"), 4, 26);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(`LEVEL ${level}`, W$3 / 2, 20);
  ctx.textAlign = "right";
  ctx.fillText("LIVES", W$3 - 4, 12);
  for (let i = 0; i < lives; i++) {
    const lx = W$3 - 10 - i * 16;
    const ly = 26;
    ctx.fillStyle = "#ff0";
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.arc(lx, ly, 6, 0.3, Math.PI * 2 - 0.3);
    ctx.closePath();
    ctx.fill();
  }
}
function PacManGame() {
  const canvasRef = reactExports.useRef(null);
  const mapRef = reactExports.useRef(buildMap());
  const pacRef = reactExports.useRef({
    x: 14,
    y: 23,
    dir: { x: 0, y: 0 },
    nextDir: { x: -1, y: 0 },
    mouth: 0,
    mouthOpen: true
  });
  const ghostsRef = reactExports.useRef(makeGhosts());
  const scoreRef = reactExports.useRef(0);
  const livesRef = reactExports.useRef(3);
  const levelRef = reactExports.useRef(1);
  const powerRef = reactExports.useRef(0);
  const ghostEatChainRef = reactExports.useRef(0);
  const frameRef = reactExports.useRef(0);
  const aliveRef = reactExports.useRef(false);
  const rafRef = reactExports.useRef(0);
  const deathAnimRef = reactExports.useRef(0);
  const modeTimerRef = reactExports.useRef(0);
  const scatterRef = reactExports.useRef(true);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(3);
  const [level, setLevel] = reactExports.useState(1);
  const [status, setStatus] = reactExports.useState("idle");
  const draw = reactExports.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W$3, H$3);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W$3, H$3);
    drawMaze(ctx, mapRef.current, frameRef.current);
    for (const g of ghostsRef.current) {
      drawGhost(ctx, g, frameRef.current);
    }
    if (deathAnimRef.current > 0) {
      drawPacman(ctx, pacRef.current, deathAnimRef.current);
    } else {
      drawPacman(ctx, pacRef.current, 0);
    }
    drawHUD(ctx, scoreRef.current, livesRef.current, levelRef.current);
  }, []);
  const resetPositions = reactExports.useCallback(() => {
    pacRef.current = {
      x: 14,
      y: 23,
      dir: { x: 0, y: 0 },
      nextDir: { x: -1, y: 0 },
      mouth: 0,
      mouthOpen: true
    };
    ghostsRef.current = makeGhosts();
    powerRef.current = 0;
    ghostEatChainRef.current = 0;
  }, []);
  const startLevel = reactExports.useCallback(() => {
    mapRef.current = buildMap();
    resetPositions();
    frameRef.current = 0;
    modeTimerRef.current = 0;
    scatterRef.current = true;
  }, [resetPositions]);
  const loop = reactExports.useCallback(() => {
    var _a;
    if (!aliveRef.current) return;
    frameRef.current++;
    if (deathAnimRef.current > 0) {
      deathAnimRef.current--;
      draw();
      if (deathAnimRef.current === 0) {
        livesRef.current--;
        setLives(livesRef.current);
        if (livesRef.current <= 0) {
          aliveRef.current = false;
          setStatus("dead");
          draw();
          return;
        }
        resetPositions();
      }
      rafRef.current = requestAnimationFrame(loop);
      return;
    }
    const p = pacRef.current;
    modeTimerRef.current++;
    const modeCycle = [420, 1200, 420, 1200, 420, 1200, 420];
    let cumulative = 0;
    let newScatter = false;
    for (let i = 0; i < modeCycle.length; i++) {
      cumulative += modeCycle[i];
      if (modeTimerRef.current < cumulative) {
        newScatter = i % 2 === 0;
        break;
      }
    }
    if (newScatter !== scatterRef.current) {
      scatterRef.current = newScatter;
      for (const g of ghostsRef.current) {
        if (g.mode !== "frightened" && g.mode !== "eaten" && !g.inHouse) {
          g.mode = newScatter ? "scatter" : "chase";
          g.dir = { x: -g.dir.x, y: -g.dir.y };
        }
      }
    }
    for (const g of ghostsRef.current) {
      if (g.inHouse && g.exitTimer > 0) {
        g.exitTimer--;
        if (g.exitTimer === 0) ;
      }
    }
    if (powerRef.current > 0) {
      powerRef.current--;
      if (powerRef.current <= 120) {
        for (const g of ghostsRef.current) {
          if (g.mode === "frightened") g.frightenedFlash = true;
        }
      }
      if (powerRef.current === 0) {
        ghostEatChainRef.current = 0;
        for (const g of ghostsRef.current) {
          if (g.mode === "frightened") {
            g.mode = scatterRef.current ? "scatter" : "chase";
            g.frightenedFlash = false;
          }
        }
      }
    }
    if (frameRef.current % 3 === 0) {
      if (p.mouthOpen) {
        p.mouth = Math.min(p.mouth + 1, 5);
        if (p.mouth >= 5) p.mouthOpen = false;
      } else {
        p.mouth = Math.max(p.mouth - 1, 0);
        if (p.mouth <= 0) p.mouthOpen = true;
      }
    }
    if (isWalkable(mapRef.current, p.x + p.nextDir.x, p.y + p.nextDir.y)) {
      p.dir = { ...p.nextDir };
    }
    const pacSpeed = PACMAN_SPEED;
    if (frameRef.current % pacSpeed === 0) {
      const nx = p.x + p.dir.x;
      const ny = p.y + p.dir.y;
      if (p.dir.x === -1 && p.x === 0) {
        p.x = COLS$2 - 1;
      } else if (p.dir.x === 1 && p.x === COLS$2 - 1) {
        p.x = 0;
      } else if (isWalkable(mapRef.current, nx, ny)) {
        p.x = nx;
        p.y = ny;
      }
      const cell = (_a = mapRef.current[p.y]) == null ? void 0 : _a[p.x];
      if (cell === 2) {
        mapRef.current[p.y][p.x] = 0;
        scoreRef.current += 10;
        setScore(scoreRef.current);
      } else if (cell === 3) {
        mapRef.current[p.y][p.x] = 0;
        scoreRef.current += 50;
        setScore(scoreRef.current);
        powerRef.current = POWER_DURATION;
        ghostEatChainRef.current = 0;
        for (const g of ghostsRef.current) {
          if (g.mode !== "eaten") {
            g.mode = "frightened";
            g.frightenedFlash = false;
            g.dir = { x: -g.dir.x, y: -g.dir.y };
          }
        }
      }
    }
    const ghostSpeed = ghostsRef.current.some(
      (g) => g.mode === "frightened" && !g.inHouse
    ) ? GHOST_SPEED_SCARED : GHOST_SPEED;
    if (frameRef.current % ghostSpeed === 0) {
      const blinky = ghostsRef.current[0];
      for (const g of ghostsRef.current) {
        if (g.inHouse && g.exitTimer > 0) continue;
        moveGhost(g, mapRef.current, p, blinky);
      }
    }
    for (const g of ghostsRef.current) {
      if (g.x === p.x && g.y === p.y && !g.inHouse) {
        if (g.mode === "frightened") {
          g.mode = "eaten";
          g.frightenedFlash = false;
          g.eyeOnly = true;
          const pts = GHOST_SCORE_CHAIN[Math.min(ghostEatChainRef.current, 3)];
          ghostEatChainRef.current = Math.min(ghostEatChainRef.current + 1, 3);
          scoreRef.current += pts;
          setScore(scoreRef.current);
        } else if (g.mode !== "eaten") {
          deathAnimRef.current = 60;
          setStatus("dying");
          p.dir = { x: 0, y: 0 };
          draw();
          rafRef.current = requestAnimationFrame(loop);
          return;
        }
      }
    }
    if (!mapRef.current.some((row) => row.some((v) => v === 2 || v === 3))) {
      aliveRef.current = false;
      levelRef.current++;
      setLevel(levelRef.current);
      setStatus("won");
      draw();
      return;
    }
    draw();
    rafRef.current = requestAnimationFrame(loop);
  }, [draw, resetPositions]);
  const startGame = reactExports.useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    scoreRef.current = 0;
    livesRef.current = 3;
    levelRef.current = 1;
    setScore(0);
    setLives(3);
    setLevel(1);
    deathAnimRef.current = 0;
    startLevel();
    aliveRef.current = true;
    setStatus("running");
    rafRef.current = requestAnimationFrame(loop);
  }, [loop, startLevel]);
  const nextLevel = reactExports.useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    deathAnimRef.current = 0;
    startLevel();
    aliveRef.current = true;
    setStatus("running");
    rafRef.current = requestAnimationFrame(loop);
  }, [loop, startLevel]);
  reactExports.useEffect(() => {
    const handleKey = (e) => {
      const dirs = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }
      };
      const d = dirs[e.key];
      if (d) {
        pacRef.current.nextDir = d;
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);
  reactExports.useEffect(() => {
    draw();
  }, [draw]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        background: "#000",
        padding: 8,
        borderRadius: 4
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "canvas",
          {
            ref: canvasRef,
            width: W$3,
            height: H$3,
            "data-ocid": "pacman.canvas_target",
            style: {
              border: "2px solid #0000ff",
              imageRendering: "pixelated",
              display: "block"
            }
          }
        ),
        status !== "running" && status !== "dying" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: { textAlign: "center", fontFamily: "Courier New, monospace" },
            children: [
              status === "dead" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#f00", fontSize: 14, marginBottom: 6 }, children: [
                "GAME OVER — Score: ",
                score
              ] }),
              status === "won" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#ffd700", fontSize: 14, marginBottom: 6 }, children: [
                "LEVEL ",
                level,
                " CLEAR! Lives: ",
                lives,
                " 🎉"
              ] }),
              status === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#ffff00", fontSize: 11, marginBottom: 4 }, children: "Arrow keys to move. Eat all dots. Avoid ghosts!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "pacman.start_button",
                  className: "btn-95",
                  onClick: status === "won" ? nextLevel : startGame,
                  style: { background: "#c0c0c0", cursor: "pointer" },
                  children: status === "idle" ? "Start Game" : status === "won" ? "Next Level" : "Play Again"
                }
              )
            ]
          }
        )
      ]
    }
  );
}
const W$2 = 500;
const H$2 = 280;
const PADDLE_H = 50;
const PADDLE_W = 10;
const BALL_SIZE = 8;
const SPEED = 3;
const WIN_SCORE = 7;
function initState() {
  const angle = (Math.random() * 60 - 30) * (Math.PI / 180);
  const dir = Math.random() > 0.5 ? 1 : -1;
  return {
    ball: {
      x: W$2 / 2,
      y: H$2 / 2,
      vx: dir * SPEED * Math.cos(angle),
      vy: SPEED * Math.sin(angle)
    },
    p1: { y: H$2 / 2 - PADDLE_H / 2 },
    p2: { y: H$2 / 2 - PADDLE_H / 2 },
    score: [0, 0],
    running: true
  };
}
function PongGame() {
  const canvasRef = reactExports.useRef(null);
  const stateRef = reactExports.useRef(null);
  const keysRef = reactExports.useRef(/* @__PURE__ */ new Set());
  const [scores, setScores] = reactExports.useState([0, 0]);
  const [gameStatus, setGameStatus] = reactExports.useState(
    "idle"
  );
  const [winner, setWinner] = reactExports.useState("");
  const rafRef = reactExports.useRef(0);
  const draw = reactExports.useCallback(() => {
    const canvas = canvasRef.current;
    const s = stateRef.current;
    if (!canvas || !s) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W$2, H$2);
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = "#333";
    ctx.beginPath();
    ctx.moveTo(W$2 / 2, 0);
    ctx.lineTo(W$2 / 2, H$2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#fff";
    ctx.fillRect(8, s.p1.y, PADDLE_W, PADDLE_H);
    ctx.fillRect(W$2 - 18, s.p2.y, PADDLE_W, PADDLE_H);
    ctx.fillStyle = "#fff";
    ctx.fillRect(
      s.ball.x - BALL_SIZE / 2,
      s.ball.y - BALL_SIZE / 2,
      BALL_SIZE,
      BALL_SIZE
    );
    ctx.fillStyle = "#fff";
    ctx.font = "bold 24px Courier New";
    ctx.textAlign = "center";
    ctx.fillText(String(s.score[0]), W$2 / 4, 30);
    ctx.fillText(String(s.score[1]), 3 * W$2 / 4, 30);
  }, []);
  const loop = reactExports.useCallback(() => {
    const s = stateRef.current;
    if (!(s == null ? void 0 : s.running)) return;
    const keys = keysRef.current;
    const spd = 4;
    if (keys.has("w") || keys.has("W")) s.p1.y = Math.max(0, s.p1.y - spd);
    if (keys.has("s") || keys.has("S"))
      s.p1.y = Math.min(H$2 - PADDLE_H, s.p1.y + spd);
    if (keys.has("ArrowUp")) s.p2.y = Math.max(0, s.p2.y - spd);
    if (keys.has("ArrowDown")) s.p2.y = Math.min(H$2 - PADDLE_H, s.p2.y + spd);
    s.ball.x += s.ball.vx;
    s.ball.y += s.ball.vy;
    if (s.ball.y <= 0 || s.ball.y >= H$2) s.ball.vy = -s.ball.vy;
    if (s.ball.x <= 18 && s.ball.y >= s.p1.y && s.ball.y <= s.p1.y + PADDLE_H) {
      s.ball.vx = Math.abs(s.ball.vx) * 1.05;
      s.ball.vy += (s.ball.y - (s.p1.y + PADDLE_H / 2)) * 0.1;
    }
    if (s.ball.x >= W$2 - 18 && s.ball.y >= s.p2.y && s.ball.y <= s.p2.y + PADDLE_H) {
      s.ball.vx = -Math.abs(s.ball.vx) * 1.05;
      s.ball.vy += (s.ball.y - (s.p2.y + PADDLE_H / 2)) * 0.1;
    }
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
    } else if (s.ball.x > W$2) {
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
    const speedMag = Math.sqrt(s.ball.vx ** 2 + s.ball.vy ** 2);
    if (speedMag > 8) {
      s.ball.vx = s.ball.vx / speedMag * 8;
      s.ball.vy = s.ball.vy / speedMag * 8;
    }
    draw();
    rafRef.current = requestAnimationFrame(loop);
  }, [draw]);
  const startGame = reactExports.useCallback(() => {
    stateRef.current = initState();
    setScores([0, 0]);
    setGameStatus("running");
    setWinner("");
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);
  reactExports.useEffect(() => {
    const down = (e) => {
      keysRef.current.add(e.key);
      if (["ArrowUp", "ArrowDown"].includes(e.key)) e.preventDefault();
    };
    const up = (e) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);
  reactExports.useEffect(() => {
    if (gameStatus === "idle") draw();
  }, [draw, gameStatus]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "canvas",
          {
            ref: canvasRef,
            width: W$2,
            height: H$2,
            "data-ocid": "pong.canvas_target",
            style: { border: "2px solid #444" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              color: "#fff",
              fontFamily: "Courier New, monospace",
              fontSize: 11
            },
            children: [
              "P1 ",
              scores[0],
              " — ",
              scores[1],
              " P2  |  W/S vs ↑↓  |  First to ",
              WIN_SCORE
            ]
          }
        ),
        gameStatus !== "running" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
          gameStatus === "won" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                color: "#ffd700",
                fontFamily: "Courier New, monospace",
                fontSize: 14,
                marginBottom: 6
              },
              children: [
                "🏆 ",
                winner,
                " Wins!"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "pong.start_button",
              className: "btn-95",
              onClick: startGame,
              style: { background: "#c0c0c0" },
              children: gameStatus === "idle" ? "Start Game" : "Play Again"
            }
          )
        ] })
      ]
    }
  );
}
const CELL$1 = 16;
const COLS$1 = 20;
const ROWS$1 = 18;
const CANVAS_W = COLS$1 * CELL$1;
const CANVAS_H = ROWS$1 * CELL$1;
function rand(max) {
  return Math.floor(Math.random() * max);
}
function randFood(snake) {
  let p;
  do {
    p = { x: rand(COLS$1), y: rand(ROWS$1) };
  } while (snake.some((s) => s.x === p.x && s.y === p.y));
  return p;
}
function SnakeGame() {
  const canvasRef = reactExports.useRef(null);
  const stateRef = reactExports.useRef({
    snake: [{ x: 10, y: 9 }],
    dir: "right",
    nextDir: "right",
    food: { x: 15, y: 9 },
    score: 0,
    alive: false,
    started: false
  });
  const [displayScore, setDisplayScore] = reactExports.useState(0);
  const [status, setStatus] = reactExports.useState("idle");
  const rafRef = reactExports.useRef(0);
  const lastTickRef = reactExports.useRef(0);
  const draw = reactExports.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = "#f00";
    ctx.fillRect(s.food.x * CELL$1 + 1, s.food.y * CELL$1 + 1, CELL$1 - 2, CELL$1 - 2);
    s.snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? "#0f0" : "#080";
      ctx.fillRect(seg.x * CELL$1 + 1, seg.y * CELL$1 + 1, CELL$1 - 2, CELL$1 - 2);
    });
  }, []);
  const tick = reactExports.useCallback(
    (ts) => {
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
        if (head.x < 0 || head.x >= COLS$1 || head.y < 0 || head.y >= ROWS$1) {
          s.alive = false;
          setStatus("dead");
          draw();
          return;
        }
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
    [draw]
  );
  const startGame = reactExports.useCallback(() => {
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
  reactExports.useEffect(() => {
    const handleKey = (e) => {
      const s = stateRef.current;
      if (!s.alive) return;
      const map = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right"
      };
      const newDir = map[e.key];
      if (!newDir) return;
      const opposites = {
        up: "down",
        down: "up",
        left: "right",
        right: "left"
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
  reactExports.useEffect(() => {
    draw();
  }, [draw]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "canvas",
          {
            ref: canvasRef,
            width: CANVAS_W,
            height: CANVAS_H,
            "data-ocid": "snake.canvas_target",
            style: { border: "2px solid #444", imageRendering: "pixelated" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              color: "#0f0",
              fontFamily: "Courier New, monospace",
              fontSize: 13
            },
            children: [
              "Score: ",
              displayScore
            ]
          }
        ),
        status !== "running" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
          status === "dead" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                color: "#f00",
                fontFamily: "Courier New, monospace",
                fontSize: 13,
                marginBottom: 6
              },
              children: "GAME OVER"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "snake.start_button",
              className: "btn-95",
              onClick: startGame,
              style: { background: "#c0c0c0" },
              children: status === "idle" ? "Start Game" : "Play Again"
            }
          ),
          status === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                color: "#888",
                fontFamily: "Tahoma, sans-serif",
                fontSize: 10,
                marginTop: 4
              },
              children: "Arrow keys or WASD to move"
            }
          )
        ] })
      ]
    }
  );
}
const W$1 = 480;
const H$1 = 320;
const ALIEN_ROWS = 4;
const ALIEN_COLS = 10;
const ALIEN_W = 32;
const ALIEN_H = 24;
const ALIEN_GAP_X = 10;
const ALIEN_GAP_Y = 8;
const ALIEN_START_X = 20;
const ALIEN_START_Y = 30;
const PLAYER_W = 32;
const PLAYER_H = 16;
const BULLET_W = 3;
const BULLET_H = 10;
const PLAYER_SPEED = 4;
const BULLET_SPEED = 6;
const ALIEN_BULLET_SPEED = 3;
function makeAliens() {
  const aliens = [];
  for (let r = 0; r < ALIEN_ROWS; r++)
    for (let c = 0; c < ALIEN_COLS; c++)
      aliens.push({
        x: ALIEN_START_X + c * (ALIEN_W + ALIEN_GAP_X),
        y: ALIEN_START_Y + r * (ALIEN_H + ALIEN_GAP_Y),
        alive: true,
        row: r
      });
  return aliens;
}
function drawAlienShape(ctx, x, y, row, frame) {
  const colors = ["#ff4444", "#ff44ff", "#44ffff", "#44ff44"];
  ctx.fillStyle = colors[row % colors.length];
  const px = (dx, dy, w = 3, h = 3) => ctx.fillRect(x + dx, y + dy, w, h);
  if (row < 2) {
    if (frame === 0) {
      px(3, 0, 20, 3);
      px(0, 3, 3, 3);
      px(23, 3, 3, 3);
      px(0, 6, 26, 3);
      px(3, 9, 3, 3);
      px(7, 9, 3, 3);
      px(13, 9, 3, 3);
      px(17, 9, 3, 3);
      px(0, 12, 6, 3);
      px(20, 12, 6, 3);
      px(7, 12, 3, 3);
      px(16, 12, 3, 3);
    } else {
      px(3, 0, 20, 3);
      px(0, 3, 3, 3);
      px(23, 3, 3, 3);
      px(0, 6, 26, 3);
      px(0, 9, 3, 3);
      px(6, 9, 3, 3);
      px(14, 9, 3, 3);
      px(23, 9, 3, 3);
      px(3, 12, 6, 3);
      px(17, 12, 6, 3);
      px(10, 12, 3, 3);
    }
  } else {
    if (frame === 0) {
      px(9, 0, 8, 3);
      px(3, 3, 20, 3);
      px(0, 6, 26, 3);
      px(0, 9, 7, 3);
      px(10, 9, 6, 3);
      px(19, 9, 7, 3);
      px(3, 12, 3, 3);
      px(20, 12, 3, 3);
    } else {
      px(9, 0, 8, 3);
      px(3, 3, 20, 3);
      px(0, 6, 26, 3);
      px(0, 9, 5, 3);
      px(11, 9, 4, 3);
      px(21, 9, 5, 3);
      px(0, 12, 3, 3);
      px(23, 12, 3, 3);
    }
  }
}
function SpaceInvadersGame() {
  const canvasRef = reactExports.useRef(null);
  const aliensRef = reactExports.useRef([]);
  const playerRef = reactExports.useRef({ x: W$1 / 2 - PLAYER_W / 2 });
  const bulletRef = reactExports.useRef(null);
  const alienBulletsRef = reactExports.useRef([]);
  const alienDirRef = reactExports.useRef(1);
  const alienTickRef = reactExports.useRef(0);
  const frameRef = reactExports.useRef(0);
  const aliveRef = reactExports.useRef(false);
  const rafRef = reactExports.useRef(0);
  const keysRef = reactExports.useRef(/* @__PURE__ */ new Set());
  const scoreRef = reactExports.useRef(0);
  const [score, setScore] = reactExports.useState(0);
  const [status, setStatus] = reactExports.useState(
    "idle"
  );
  const [msg, setMsg] = reactExports.useState("");
  const draw = reactExports.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W$1, H$1);
    ctx.fillStyle = "#fff";
    for (let i = 0; i < 40; i++) {
      const sx = (i * 73 + 11) % W$1;
      const sy = (i * 47 + 7) % H$1;
      ctx.fillRect(sx, sy, 1, 1);
    }
    for (const a of aliensRef.current) {
      if (a.alive) drawAlienShape(ctx, a.x, a.y, a.row, frameRef.current);
    }
    const px = playerRef.current.x;
    ctx.fillStyle = "#0f0";
    ctx.fillRect(px + 12, H$1 - PLAYER_H - 4, 8, 4);
    ctx.fillRect(px + 6, H$1 - PLAYER_H, 20, 4);
    ctx.fillRect(px, H$1 - PLAYER_H + 4, 32, 8);
    if (bulletRef.current) {
      ctx.fillStyle = "#ff0";
      ctx.fillRect(
        bulletRef.current.x,
        bulletRef.current.y,
        BULLET_W,
        BULLET_H
      );
    }
    ctx.fillStyle = "#f44";
    for (const b of alienBulletsRef.current) {
      ctx.fillRect(b.x, b.y, BULLET_W, BULLET_H);
    }
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px Courier New";
    ctx.textAlign = "left";
    ctx.fillText(`SCORE: ${scoreRef.current}`, 8, 16);
    const alive = aliensRef.current.filter((a) => a.alive).length;
    ctx.textAlign = "right";
    ctx.fillText(`ALIENS: ${alive}`, W$1 - 8, 16);
  }, []);
  const loop = reactExports.useCallback(() => {
    if (!aliveRef.current) return;
    const keys = keysRef.current;
    if (keys.has("ArrowLeft"))
      playerRef.current.x = Math.max(0, playerRef.current.x - PLAYER_SPEED);
    if (keys.has("ArrowRight"))
      playerRef.current.x = Math.min(
        W$1 - PLAYER_W,
        playerRef.current.x + PLAYER_SPEED
      );
    if (bulletRef.current) {
      bulletRef.current.y -= BULLET_SPEED;
      if (bulletRef.current.y < 0) bulletRef.current = null;
      else {
        for (const a of aliensRef.current) {
          if (!a.alive || !bulletRef.current) continue;
          const b = bulletRef.current;
          if (b.x >= a.x && b.x <= a.x + ALIEN_W && b.y <= a.y + ALIEN_H && b.y >= a.y) {
            a.alive = false;
            bulletRef.current = null;
            scoreRef.current += 10;
            setScore(scoreRef.current);
            break;
          }
        }
      }
    }
    alienBulletsRef.current = alienBulletsRef.current.filter((b) => b.y < H$1);
    for (const b of alienBulletsRef.current) {
      b.y += ALIEN_BULLET_SPEED;
    }
    const px = playerRef.current.x;
    for (const b of alienBulletsRef.current) {
      if (b.x >= px && b.x <= px + PLAYER_W && b.y >= H$1 - PLAYER_H - 4) {
        aliveRef.current = false;
        setStatus("dead");
        setMsg("YOU WERE HIT!");
        draw();
        return;
      }
    }
    alienTickRef.current++;
    const alive = aliensRef.current.filter((a) => a.alive);
    if (alive.length === 0) {
      aliveRef.current = false;
      setStatus("won");
      setMsg("YOU WIN!");
      draw();
      return;
    }
    const speed = Math.max(
      6,
      24 - Math.floor((ALIEN_ROWS * ALIEN_COLS - alive.length) * 0.4)
    );
    if (alienTickRef.current % speed === 0) {
      frameRef.current = 1 - frameRef.current;
      let descend = false;
      const leftmost = Math.min(...alive.map((a) => a.x));
      const rightmost = Math.max(...alive.map((a) => a.x + ALIEN_W));
      if (alienDirRef.current === 1 && rightmost >= W$1 - 5) descend = true;
      if (alienDirRef.current === -1 && leftmost <= 5) descend = true;
      if (descend) {
        for (const a of aliensRef.current) {
          if (a.alive) a.y += 12;
        }
        alienDirRef.current *= -1;
      } else {
        for (const a of aliensRef.current) {
          if (a.alive) a.x += alienDirRef.current * 10;
        }
      }
      if (alive.some((a) => a.y + ALIEN_H >= H$1 - PLAYER_H - 8)) {
        aliveRef.current = false;
        setStatus("dead");
        setMsg("ALIENS INVADED!");
        draw();
        return;
      }
    }
    if (Math.random() < 0.015 && alive.length > 0) {
      const shooter = alive[Math.floor(Math.random() * alive.length)];
      alienBulletsRef.current.push({
        x: shooter.x + ALIEN_W / 2,
        y: shooter.y + ALIEN_H
      });
    }
    draw();
    rafRef.current = requestAnimationFrame(loop);
  }, [draw]);
  const startGame = reactExports.useCallback(() => {
    aliensRef.current = makeAliens();
    playerRef.current = { x: W$1 / 2 - PLAYER_W / 2 };
    bulletRef.current = null;
    alienBulletsRef.current = [];
    alienDirRef.current = 1;
    alienTickRef.current = 0;
    frameRef.current = 0;
    scoreRef.current = 0;
    setScore(0);
    aliveRef.current = true;
    setStatus("running");
    setMsg("");
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);
  reactExports.useEffect(() => {
    const down = (e) => {
      keysRef.current.add(e.key);
      if (e.key === " " && aliveRef.current && !bulletRef.current) {
        bulletRef.current = {
          x: playerRef.current.x + PLAYER_W / 2 - 1,
          y: H$1 - PLAYER_H - 14
        };
      }
      if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
    };
    const up = (e) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);
  reactExports.useEffect(() => {
    draw();
  }, [draw]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "canvas",
          {
            ref: canvasRef,
            width: W$1,
            height: H$1,
            "data-ocid": "spaceinvaders.canvas_target",
            style: { border: "2px solid #444", imageRendering: "pixelated" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              color: "#0ff",
              fontFamily: "Courier New, monospace",
              fontSize: 12
            },
            children: [
              "Score: ",
              score
            ]
          }
        ),
        status !== "running" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
          (status === "dead" || status === "won") && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                color: status === "won" ? "#ffd700" : "#f00",
                fontFamily: "Courier New, monospace",
                fontSize: 13,
                marginBottom: 6
              },
              children: msg
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "spaceinvaders.start_button",
              className: "btn-95",
              onClick: startGame,
              style: { background: "#c0c0c0" },
              children: status === "idle" ? "Start Game" : "Play Again"
            }
          ),
          status === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                color: "#888",
                fontFamily: "Tahoma, sans-serif",
                fontSize: 10,
                marginTop: 4
              },
              children: "← → Move  |  Space Shoot"
            }
          )
        ] })
      ]
    }
  );
}
const COLS = 10;
const ROWS = 20;
const CELL = 24;
const W = COLS * CELL;
const H = ROWS * CELL;
const COLORS = [
  "",
  "#00f0f0",
  "#f0f000",
  "#a000f0",
  "#00f000",
  "#f00000",
  "#0000f0",
  "#f0a000"
];
const SHAPES = [
  [],
  [[1, 1, 1, 1]],
  // I
  [
    [2, 2],
    [2, 2]
  ],
  // O
  [
    [0, 3, 0],
    [3, 3, 3]
  ],
  // T
  [
    [0, 4, 4],
    [4, 4, 0]
  ],
  // S
  [
    [5, 5, 0],
    [0, 5, 5]
  ],
  // Z
  [
    [6, 0, 0],
    [6, 6, 6]
  ],
  // J
  [
    [0, 0, 7],
    [7, 7, 7]
  ]
  // L
];
function randomPiece() {
  const type = Math.floor(Math.random() * 7) + 1;
  const shape = SHAPES[type].map((r) => [...r]);
  return {
    shape,
    x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
    y: 0,
    type
  };
}
function rotate(shape) {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated = Array.from(
    { length: cols },
    () => Array(rows).fill(0)
  );
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) rotated[c][rows - 1 - r] = shape[r][c];
  return rotated;
}
function emptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}
function fits(board, piece, dx = 0, dy = 0, shape = piece.shape) {
  for (let r = 0; r < shape.length; r++)
    for (let c = 0; c < shape[r].length; c++)
      if (shape[r][c]) {
        const nx = piece.x + c + dx;
        const ny = piece.y + r + dy;
        if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
        if (ny >= 0 && board[ny][nx]) return false;
      }
  return true;
}
function merge(board, piece) {
  const b = board.map((r) => [...r]);
  for (let r = 0; r < piece.shape.length; r++)
    for (let c = 0; c < piece.shape[r].length; c++)
      if (piece.shape[r][c] && piece.y + r >= 0)
        b[piece.y + r][piece.x + c] = piece.shape[r][c];
  return b;
}
function clearLines(board) {
  const newBoard = board.filter((row) => row.some((c) => c === 0));
  const cleared = ROWS - newBoard.length;
  const empty = Array.from(
    { length: cleared },
    () => Array(COLS).fill(0)
  );
  return [[...empty, ...newBoard], cleared];
}
function TetrisGame() {
  const canvasRef = reactExports.useRef(null);
  const boardRef = reactExports.useRef(emptyBoard());
  const pieceRef = reactExports.useRef(randomPiece());
  const nextRef = reactExports.useRef(randomPiece());
  const scoreRef = reactExports.useRef(0);
  const aliveRef = reactExports.useRef(false);
  const rafRef = reactExports.useRef(0);
  const lastDropRef = reactExports.useRef(0);
  const dropIntervalRef = reactExports.useRef(600);
  const [score, setScore] = reactExports.useState(0);
  const [status, setStatus] = reactExports.useState("idle");
  const draw = reactExports.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 0.5;
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        ctx.strokeRect(c * CELL, r * CELL, CELL, CELL);
      }
    boardRef.current.forEach(
      (row, r) => row.forEach((v, c) => {
        if (!v) return;
        ctx.fillStyle = COLORS[v];
        ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, 4);
      })
    );
    const piece = pieceRef.current;
    let ghostY = piece.y;
    while (fits(boardRef.current, piece, 0, ghostY - piece.y + 1)) ghostY++;
    if (ghostY !== piece.y) {
      piece.shape.forEach(
        (row, r) => row.forEach((v, c) => {
          if (!v) return;
          ctx.fillStyle = "rgba(255,255,255,0.12)";
          ctx.fillRect(
            (piece.x + c) * CELL + 1,
            (ghostY + r) * CELL + 1,
            CELL - 2,
            CELL - 2
          );
        })
      );
    }
    piece.shape.forEach(
      (row, r) => row.forEach((v, c) => {
        if (!v) return;
        const px = (piece.x + c) * CELL;
        const py = (piece.y + r) * CELL;
        ctx.fillStyle = COLORS[v];
        ctx.fillRect(px + 1, py + 1, CELL - 2, CELL - 2);
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillRect(px + 1, py + 1, CELL - 2, 4);
      })
    );
  }, []);
  const loop = reactExports.useCallback(
    (ts) => {
      if (!aliveRef.current) return;
      if (ts - lastDropRef.current > dropIntervalRef.current) {
        lastDropRef.current = ts;
        const piece = pieceRef.current;
        if (fits(boardRef.current, piece, 0, 1)) {
          piece.y++;
        } else {
          boardRef.current = merge(boardRef.current, piece);
          const [nb, cleared] = clearLines(boardRef.current);
          boardRef.current = nb;
          const pts = [0, 100, 300, 500, 800][cleared] ?? 0;
          scoreRef.current += pts;
          setScore(scoreRef.current);
          dropIntervalRef.current = Math.max(
            100,
            600 - Math.floor(scoreRef.current / 500) * 50
          );
          const next = nextRef.current;
          pieceRef.current = {
            ...next,
            x: Math.floor(COLS / 2) - Math.floor(next.shape[0].length / 2),
            y: 0
          };
          nextRef.current = randomPiece();
          if (!fits(boardRef.current, pieceRef.current)) {
            aliveRef.current = false;
            setStatus("dead");
            draw();
            return;
          }
        }
      }
      draw();
      rafRef.current = requestAnimationFrame(loop);
    },
    [draw]
  );
  const startGame = reactExports.useCallback(() => {
    boardRef.current = emptyBoard();
    pieceRef.current = randomPiece();
    nextRef.current = randomPiece();
    scoreRef.current = 0;
    dropIntervalRef.current = 600;
    setScore(0);
    aliveRef.current = true;
    setStatus("running");
    lastDropRef.current = 0;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);
  reactExports.useEffect(() => {
    const handleKey = (e) => {
      if (!aliveRef.current) return;
      const piece = pieceRef.current;
      if (e.key === "ArrowLeft" && fits(boardRef.current, piece, -1, 0)) {
        piece.x--;
        draw();
      } else if (e.key === "ArrowRight" && fits(boardRef.current, piece, 1, 0)) {
        piece.x++;
        draw();
      } else if (e.key === "ArrowDown") {
        if (fits(boardRef.current, piece, 0, 1)) {
          piece.y++;
          draw();
        }
      } else if (e.key === "ArrowUp") {
        const rot = rotate(piece.shape);
        if (fits(boardRef.current, piece, 0, 0, rot)) {
          piece.shape = rot;
          draw();
        }
      } else if (e.key === " ") {
        while (fits(boardRef.current, piece, 0, 1)) piece.y++;
        draw();
      } else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      cancelAnimationFrame(rafRef.current);
    };
  }, [draw]);
  reactExports.useEffect(() => {
    draw();
  }, [draw]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "canvas",
          {
            ref: canvasRef,
            width: W,
            height: H,
            "data-ocid": "tetris.canvas_target",
            style: { border: "2px solid #444", imageRendering: "pixelated" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              color: "#0ff",
              fontFamily: "Courier New, monospace",
              fontSize: 13
            },
            children: [
              "Score: ",
              score
            ]
          }
        ),
        status !== "running" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
          status === "dead" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                color: "#f00",
                fontFamily: "Courier New, monospace",
                fontSize: 13,
                marginBottom: 6
              },
              children: "GAME OVER"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "tetris.start_button",
              className: "btn-95",
              onClick: startGame,
              style: { background: "#c0c0c0" },
              children: status === "idle" ? "Start Game" : "Play Again"
            }
          ),
          status === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                color: "#888",
                fontFamily: "Tahoma, sans-serif",
                fontSize: 10,
                marginTop: 4
              },
              children: "← → Move  |  ↑ Rotate  |  ↓ Soft Drop  |  Space Hard Drop"
            }
          )
        ] })
      ]
    }
  );
}
const ICONS = {
  snake: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: "40",
      height: "40",
      viewBox: "0 0 40 40",
      style: { imageRendering: "pixelated" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Snake" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "40", height: "40", fill: "#000" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "4", y: "20", width: "8", height: "8", fill: "#00c000" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "12", y: "20", width: "8", height: "8", fill: "#008000" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "20", y: "20", width: "8", height: "8", fill: "#008000" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "20", y: "12", width: "8", height: "8", fill: "#008000" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "28", y: "12", width: "8", height: "8", fill: "#00e000" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "30", y: "13", width: "2", height: "2", fill: "#fff" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "32", y: "13", width: "2", height: "2", fill: "#fff" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "8", y: "8", width: "8", height: "8", fill: "#e00000" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "10", y: "6", width: "2", height: "2", fill: "#004400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "9", y: "9", width: "2", height: "2", fill: "#ff4444" })
      ]
    }
  ),
  minesweeper: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: "40",
      height: "40",
      viewBox: "0 0 40 40",
      style: { imageRendering: "pixelated" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Minesweeper" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "40", height: "40", fill: "#c0c0c0" }),
        [0, 1, 2, 3].map(
          (r) => [0, 1, 2, 3].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "rect",
            {
              x: 2 + c * 9,
              y: 2 + r * 9,
              width: "8",
              height: "8",
              fill: r === 1 && c === 2 ? "#000" : r === 3 && c === 0 ? "#000" : "#d4d0c8",
              stroke: "#808080",
              strokeWidth: "0.5"
            },
            `${r}-${c}`
          ))
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "20", y: "16", width: "4", height: "4", fill: "#e00" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "18", y: "18", width: "8", height: "2", fill: "#800" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "22", y: "14", width: "2", height: "8", fill: "#800" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "19", y: "15", width: "2", height: "2", fill: "#800" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "23", y: "15", width: "2", height: "2", fill: "#800" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "23", y: "21", width: "2", height: "2", fill: "#800" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "19", y: "21", width: "2", height: "2", fill: "#800" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "30", y: "8", width: "2", height: "12", fill: "#444" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "32", y: "8", width: "6", height: "4", fill: "#e00" })
      ]
    }
  ),
  pong: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: "40",
      height: "40",
      viewBox: "0 0 40 40",
      style: { imageRendering: "pixelated" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Pong" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "40", height: "40", fill: "#000" }),
        [2, 8, 14, 20, 26, 32].map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "19", y, width: "2", height: "4", fill: "#333" }, y)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "4", y: "10", width: "4", height: "20", fill: "#fff" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "32", y: "12", width: "4", height: "20", fill: "#fff" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "18", y: "18", width: "4", height: "4", fill: "#fff" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "10", y: "4", width: "2", height: "6", fill: "#888" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "26", y: "4", width: "2", height: "6", fill: "#888" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "28", y: "4", width: "2", height: "2", fill: "#888" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "28", y: "8", width: "2", height: "2", fill: "#888" })
      ]
    }
  ),
  tetris: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: "40",
      height: "40",
      viewBox: "0 0 40 40",
      style: { imageRendering: "pixelated" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Tetris" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "40", height: "40", fill: "#111" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "4", y: "4", width: "7", height: "7", fill: "#00f0f0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "12", y: "4", width: "7", height: "7", fill: "#00f0f0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "20", y: "4", width: "7", height: "7", fill: "#00f0f0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "28", y: "4", width: "7", height: "7", fill: "#00f0f0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "12", y: "12", width: "7", height: "7", fill: "#a000f0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "4", y: "20", width: "7", height: "7", fill: "#a000f0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "12", y: "20", width: "7", height: "7", fill: "#a000f0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "20", y: "20", width: "7", height: "7", fill: "#a000f0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "20", y: "12", width: "7", height: "7", fill: "#f0f000" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "28", y: "12", width: "7", height: "7", fill: "#f0f000" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "20", y: "20", width: "0", height: "0", fill: "#f0f000" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "20", y: "28", width: "7", height: "7", fill: "#00f000" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "28", y: "28", width: "7", height: "7", fill: "#00f000" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "4", y: "28", width: "7", height: "7", fill: "#f00000" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "12", y: "28", width: "7", height: "7", fill: "#f00000" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "4", y: "4", width: "7", height: "2", fill: "rgba(255,255,255,0.3)" })
      ]
    }
  ),
  spaceinvaders: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: "40",
      height: "40",
      viewBox: "0 0 40 40",
      style: { imageRendering: "pixelated" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Space Invaders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "40", height: "40", fill: "#000" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "5", y: "3", width: "1", height: "1", fill: "#fff" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "15", y: "7", width: "1", height: "1", fill: "#fff" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "32", y: "2", width: "1", height: "1", fill: "#fff" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "38", y: "12", width: "1", height: "1", fill: "#fff" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "10", y: "8", width: "4", height: "4", fill: "#0f0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "26", y: "8", width: "4", height: "4", fill: "#0f0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "8", y: "12", width: "24", height: "4", fill: "#0f0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "12", y: "16", width: "4", height: "4", fill: "#0f0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "24", y: "16", width: "4", height: "4", fill: "#0f0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "16", y: "16", width: "8", height: "4", fill: "#0f0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "8", y: "20", width: "6", height: "4", fill: "#0f0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "26", y: "20", width: "6", height: "4", fill: "#0f0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "14", y: "13", width: "3", height: "3", fill: "#000" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "23", y: "13", width: "3", height: "3", fill: "#000" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "18", y: "34", width: "4", height: "3", fill: "#0f0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "14", y: "35", width: "12", height: "3", fill: "#0f0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "10", y: "36", width: "20", height: "2", fill: "#0f0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "19", y: "28", width: "2", height: "4", fill: "#ff0" })
      ]
    }
  ),
  breakout: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: "40",
      height: "40",
      viewBox: "0 0 40 40",
      style: { imageRendering: "pixelated" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Breakout" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "40", height: "40", fill: "#111" }),
        [0, 1, 2].map(
          (r) => [0, 1, 2, 3].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "rect",
            {
              x: 1 + c * 10,
              y: 2 + r * 6,
              width: "9",
              height: "5",
              fill: ["#ff4444", "#ff8800", "#ffee00"][r]
            },
            `${r}-${c}`
          ))
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "41", y: "2", width: "9", height: "5", fill: "#ff4444" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "16", y: "24", width: "5", height: "5", fill: "#fff" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "8", y: "34", width: "22", height: "4", fill: "#aaa" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "8", y: "34", width: "22", height: "1", fill: "rgba(255,255,255,0.5)" })
      ]
    }
  ),
  frogger: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: "40",
      height: "40",
      viewBox: "0 0 40 40",
      style: { imageRendering: "pixelated" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Frogger" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "40", height: "40", fill: "#001a4d" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "28", width: "40", height: "8", fill: "#7a4a10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2", y: "29", width: "36", height: "2", fill: "#9a6a20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "36", width: "40", height: "4", fill: "#333" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "14", y: "10", width: "12", height: "14", fill: "#0c0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "12", y: "6", width: "16", height: "8", fill: "#0e0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "12", y: "4", width: "6", height: "6", fill: "#0e0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "22", y: "4", width: "6", height: "6", fill: "#0e0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "13", y: "5", width: "3", height: "3", fill: "#ff0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "24", y: "5", width: "3", height: "3", fill: "#ff0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "14", y: "6", width: "2", height: "2", fill: "#000" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "25", y: "6", width: "2", height: "2", fill: "#000" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "6", y: "16", width: "8", height: "4", fill: "#0a0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "26", y: "16", width: "8", height: "4", fill: "#0a0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "4", y: "20", width: "6", height: "3", fill: "#0c0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "30", y: "20", width: "6", height: "3", fill: "#0c0" })
      ]
    }
  ),
  pacman: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: "40",
      height: "40",
      viewBox: "0 0 40 40",
      style: { imageRendering: "pixelated" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Pac-Man" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "40", height: "40", fill: "#000" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "0", width: "40", height: "4", fill: "#00c" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "36", width: "40", height: "4", fill: "#00c" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "0", width: "4", height: "40", fill: "#00c" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "36", y: "0", width: "4", height: "40", fill: "#00c" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "8", y: "18", width: "3", height: "3", fill: "#ffdd88" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "18", y: "18", width: "3", height: "3", fill: "#ffdd88" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "28", y: "18", width: "3", height: "3", fill: "#ffdd88" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "6", y: "8", width: "5", height: "5", fill: "#fff" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "8", y: "22", width: "16", height: "14", fill: "#ff0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "12", y: "20", width: "8", height: "18", fill: "#ff0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "16", y: "19", width: "4", height: "4", fill: "#ff0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "20", y: "26", width: "6", height: "6", fill: "#000" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "20", y: "30", width: "8", height: "4", fill: "#000" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "11", y: "23", width: "3", height: "3", fill: "#000" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "27", y: "20", width: "10", height: "10", fill: "#ff4444" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "25", y: "22", width: "14", height: "8", fill: "#ff4444" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "25", y: "30", width: "3", height: "4", fill: "#ff4444" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "29", y: "30", width: "4", height: "4", fill: "#ff4444" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "34", y: "30", width: "5", height: "4", fill: "#ff4444" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "28", y: "23", width: "2", height: "2", fill: "#fff" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "33", y: "23", width: "2", height: "2", fill: "#fff" })
      ]
    }
  )
};
const GAMES = [
  {
    id: "snake",
    label: "Snake",
    desc: "Classic Snake — eat apples, grow longer!",
    bg: "#000"
  },
  {
    id: "minesweeper",
    label: "Minesweeper",
    desc: "Uncover all squares without hitting mines.",
    bg: "#c0c0c0"
  },
  {
    id: "pong",
    label: "Pong",
    desc: "Classic Pong — first to 7 points wins!",
    bg: "#000"
  },
  {
    id: "tetris",
    label: "Tetris",
    desc: "Stack falling tetrominoes to clear lines!",
    bg: "#111"
  },
  {
    id: "spaceinvaders",
    label: "Space Invaders",
    desc: "Shoot aliens before they reach Earth!",
    bg: "#000"
  },
  {
    id: "breakout",
    label: "Breakout",
    desc: "Smash all bricks with a bouncing ball!",
    bg: "#111"
  },
  {
    id: "frogger",
    label: "Frogger",
    desc: "Hop your frog safely across traffic and water!",
    bg: "#001a4d"
  },
  {
    id: "pacman",
    label: "Pac-Man",
    desc: "Eat all dots and dodge the ghosts!",
    bg: "#000"
  }
];
const GAME_COMPONENTS = {
  snake: /* @__PURE__ */ jsxRuntimeExports.jsx(SnakeGame, {}),
  minesweeper: /* @__PURE__ */ jsxRuntimeExports.jsx(MinesweeperGame, {}),
  pong: /* @__PURE__ */ jsxRuntimeExports.jsx(PongGame, {}),
  tetris: /* @__PURE__ */ jsxRuntimeExports.jsx(TetrisGame, {}),
  spaceinvaders: /* @__PURE__ */ jsxRuntimeExports.jsx(SpaceInvadersGame, {}),
  breakout: /* @__PURE__ */ jsxRuntimeExports.jsx(BreakoutGame, {}),
  frogger: /* @__PURE__ */ jsxRuntimeExports.jsx(FroggerGame, {}),
  pacman: /* @__PURE__ */ jsxRuntimeExports.jsx(PacManGame, {})
};
function GameCenter() {
  const [activeGame, setActiveGame] = reactExports.useState(null);
  if (activeGame) {
    const game = GAMES.find((g) => g.id === activeGame);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", height: "100%" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: {
            padding: "4px 8px",
            borderBottom: "1px solid #808080",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "Tahoma, sans-serif",
            fontSize: 11
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "btn-95",
                "data-ocid": "gamecenter.back_button",
                onClick: () => setActiveGame(null),
                children: "◀ Back"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: game.label })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: game.bg,
            overflow: "auto",
            padding: 8
          },
          children: GAME_COMPONENTS[activeGame]
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        padding: 12,
        fontFamily: "Tahoma, Verdana, sans-serif",
        fontSize: 11,
        height: "100%",
        overflowY: "auto"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              marginBottom: 8,
              fontWeight: "bold",
              borderBottom: "1px solid #808080",
              paddingBottom: 4
            },
            children: "🕹️ Game Center — Choose a Game"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: GAMES.map((g, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `gamecenter.item.${i + 1}`,
            style: {
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 10px",
              background: "#c0c0c0",
              border: "2px solid",
              borderColor: "#fff #808080 #808080 #fff",
              cursor: "pointer"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 40, height: 40, flexShrink: 0 }, children: ICONS[g.id] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold" }, children: g.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#555" }, children: g.desc })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": `gamecenter.play_button.${i + 1}`,
                  className: "btn-95",
                  onClick: () => setActiveGame(g.id),
                  children: "▶ Play"
                }
              )
            ]
          },
          g.id
        )) })
      ]
    }
  );
}
export {
  GameCenter
};
