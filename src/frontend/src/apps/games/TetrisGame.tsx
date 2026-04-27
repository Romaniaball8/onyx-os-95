import { useCallback, useEffect, useRef, useState } from "react";

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
  "#f0a000",
];

const SHAPES: number[][][] = [
  [],
  [[1, 1, 1, 1]], // I
  [
    [2, 2],
    [2, 2],
  ], // O
  [
    [0, 3, 0],
    [3, 3, 3],
  ], // T
  [
    [0, 4, 4],
    [4, 4, 0],
  ], // S
  [
    [5, 5, 0],
    [0, 5, 5],
  ], // Z
  [
    [6, 0, 0],
    [6, 6, 6],
  ], // J
  [
    [0, 0, 7],
    [7, 7, 7],
  ], // L
];

type Piece = { shape: number[][]; x: number; y: number; type: number };

function randomPiece(): Piece {
  const type = Math.floor(Math.random() * 7) + 1;
  const shape = SHAPES[type].map((r) => [...r]);
  return {
    shape,
    x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
    y: 0,
    type,
  };
}

function rotate(shape: number[][]): number[][] {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated: number[][] = Array.from({ length: cols }, () =>
    Array(rows).fill(0),
  );
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) rotated[c][rows - 1 - r] = shape[r][c];
  return rotated;
}

function emptyBoard(): number[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function fits(
  board: number[][],
  piece: Piece,
  dx = 0,
  dy = 0,
  shape = piece.shape,
): boolean {
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

function merge(board: number[][], piece: Piece): number[][] {
  const b = board.map((r) => [...r]);
  for (let r = 0; r < piece.shape.length; r++)
    for (let c = 0; c < piece.shape[r].length; c++)
      if (piece.shape[r][c] && piece.y + r >= 0)
        b[piece.y + r][piece.x + c] = piece.shape[r][c];
  return b;
}

function clearLines(board: number[][]): [number[][], number] {
  const newBoard = board.filter((row) => row.some((c) => c === 0));
  const cleared = ROWS - newBoard.length;
  const empty: number[][] = Array.from({ length: cleared }, () =>
    Array(COLS).fill(0),
  );
  return [[...empty, ...newBoard], cleared];
}

export function TetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<number[][]>(emptyBoard());
  const pieceRef = useRef<Piece>(randomPiece());
  const nextRef = useRef<Piece>(randomPiece());
  const scoreRef = useRef(0);
  const aliveRef = useRef(false);
  const rafRef = useRef(0);
  const lastDropRef = useRef(0);
  const dropIntervalRef = useRef(600);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<"idle" | "running" | "dead">("idle");

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, W, H);
    // Grid
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 0.5;
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        ctx.strokeRect(c * CELL, r * CELL, CELL, CELL);
      }
    // Board
    boardRef.current.forEach((row, r) =>
      row.forEach((v, c) => {
        if (!v) return;
        ctx.fillStyle = COLORS[v];
        ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, 4);
      }),
    );
    // Ghost
    const piece = pieceRef.current;
    let ghostY = piece.y;
    while (fits(boardRef.current, piece, 0, ghostY - piece.y + 1)) ghostY++;
    if (ghostY !== piece.y) {
      piece.shape.forEach((row, r) =>
        row.forEach((v, c) => {
          if (!v) return;
          ctx.fillStyle = "rgba(255,255,255,0.12)";
          ctx.fillRect(
            (piece.x + c) * CELL + 1,
            (ghostY + r) * CELL + 1,
            CELL - 2,
            CELL - 2,
          );
        }),
      );
    }
    // Active piece
    piece.shape.forEach((row, r) =>
      row.forEach((v, c) => {
        if (!v) return;
        const px = (piece.x + c) * CELL;
        const py = (piece.y + r) * CELL;
        ctx.fillStyle = COLORS[v];
        ctx.fillRect(px + 1, py + 1, CELL - 2, CELL - 2);
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillRect(px + 1, py + 1, CELL - 2, 4);
      }),
    );
  }, []);

  const loop = useCallback(
    (ts: number) => {
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
            600 - Math.floor(scoreRef.current / 500) * 50,
          );
          const next = nextRef.current;
          pieceRef.current = {
            ...next,
            x: Math.floor(COLS / 2) - Math.floor(next.shape[0].length / 2),
            y: 0,
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
    [draw],
  );

  const startGame = useCallback(() => {
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

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!aliveRef.current) return;
      const piece = pieceRef.current;
      if (e.key === "ArrowLeft" && fits(boardRef.current, piece, -1, 0)) {
        piece.x--;
        draw();
      } else if (
        e.key === "ArrowRight" &&
        fits(boardRef.current, piece, 1, 0)
      ) {
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
        data-ocid="tetris.canvas_target"
        style={{ border: "2px solid #444", imageRendering: "pixelated" }}
      />
      <div
        style={{
          color: "#0ff",
          fontFamily: "Courier New, monospace",
          fontSize: 13,
        }}
      >
        Score: {score}
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
            data-ocid="tetris.start_button"
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
              ← → Move &nbsp;|&nbsp; ↑ Rotate &nbsp;|&nbsp; ↓ Soft Drop
              &nbsp;|&nbsp; Space Hard Drop
            </div>
          )}
        </div>
      )}
    </div>
  );
}
