import { useCallback, useState } from "react";

const ROWS = 9;
const COLS = 9;
const MINES = 10;

type CellState = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborCount: number;
};

function buildBoard(firstClick: { r: number; c: number }): CellState[][] {
  const cells: CellState[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborCount: 0,
    })),
  );
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (cells[r][c].isMine) continue;
    if (Math.abs(r - firstClick.r) <= 1 && Math.abs(c - firstClick.c) <= 1)
      continue;
    cells[r][c].isMine = true;
    placed++;
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (cells[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (
            nr >= 0 &&
            nr < ROWS &&
            nc >= 0 &&
            nc < COLS &&
            cells[nr][nc].isMine
          )
            count++;
        }
      }
      cells[r][c].neighborCount = count;
    }
  }
  return cells;
}

function revealFlood(
  board: CellState[][],
  r: number,
  c: number,
): CellState[][] {
  const b = board.map((row) => row.map((cell) => ({ ...cell })));
  const queue: [number, number][] = [[r, c]];
  while (queue.length) {
    const item = queue.shift();
    if (!item) break;
    const [cr, cc] = item;
    if (cr < 0 || cr >= ROWS || cc < 0 || cc >= COLS) continue;
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

const NUM_COLORS: Record<number, string> = {
  1: "#0000ff",
  2: "#008000",
  3: "#ff0000",
  4: "#000080",
  5: "#800000",
  6: "#008080",
  7: "#000",
  8: "#808080",
};

function renderCell(
  r: number,
  c: number,
  cell: CellState | undefined,
  onClick: (r: number, c: number) => void,
  onRightClick: (e: React.MouseEvent, r: number, c: number) => void,
) {
  const revealed = cell?.isRevealed ?? false;
  const mine = cell?.isMine ?? false;
  const flagged = cell?.isFlagged ?? false;
  const n = cell?.neighborCount ?? 0;
  return (
    <button
      type="button"
      onClick={() => onClick(r, c)}
      onContextMenu={(e) => onRightClick(e, r, c)}
      style={{
        width: 22,
        height: 22,
        background: "#c0c0c0",
        border: "2px solid",
        borderColor: revealed
          ? "#808080 #fff #fff #808080"
          : "#fff #808080 #808080 #fff",
        fontSize: 11,
        fontWeight: "bold",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        color: n > 0 ? NUM_COLORS[n] : "#000",
        fontFamily: "Tahoma, sans-serif",
        flexShrink: 0,
      }}
    >
      {flagged && !revealed
        ? "🚩"
        : revealed
          ? mine
            ? "💣"
            : n > 0
              ? n
              : ""
          : ""}
    </button>
  );
}

export function MinesweeperGame() {
  const [board, setBoard] = useState<CellState[][] | null>(null);
  const [status, setStatus] = useState<"idle" | "playing" | "won" | "lost">(
    "idle",
  );
  const [flagCount, setFlagCount] = useState(0);

  const resetGame = useCallback(() => {
    setBoard(null);
    setStatus("idle");
    setFlagCount(0);
  }, []);

  const handleClick = useCallback(
    (r: number, c: number) => {
      if (status === "won" || status === "lost") return;
      setBoard((prev) => {
        const b = prev ?? buildBoard({ r, c });
        const cell = b[r][c];
        if (cell.isRevealed || cell.isFlagged) return prev;
        if (cell.isMine) {
          const revealed = b.map((row) =>
            row.map((cl) => ({
              ...cl,
              isRevealed: cl.isMine ? true : cl.isRevealed,
            })),
          );
          setStatus("lost");
          return revealed;
        }
        const newBoard = revealFlood(b, r, c);
        const safeLeft = newBoard
          .flat()
          .filter((cl) => !cl.isMine && !cl.isRevealed).length;
        if (safeLeft === 0) setStatus("won");
        else setStatus("playing");
        return newBoard;
      });
    },
    [status],
  );

  const handleRightClick = useCallback(
    (e: React.MouseEvent, r: number, c: number) => {
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
    [status],
  );

  const rows = Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) => ({ r, c })),
  );

  return (
    <div style={{ fontFamily: "Tahoma, Verdana, sans-serif", fontSize: 11 }}>
      <div
        style={{
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
          fontSize: 13,
        }}
      >
        <span>💣 {MINES - flagCount}</span>
        <button
          type="button"
          data-ocid="minesweeper.reset_button"
          onClick={resetGame}
          style={{
            fontSize: 16,
            background: "#c0c0c0",
            border: "2px solid",
            borderColor: "#fff #808080 #808080 #fff",
            cursor: "pointer",
            padding: "0 4px",
          }}
        >
          {status === "won" ? "😎" : status === "lost" ? "😵" : "🙂"}
        </button>
        <span>⬜ {ROWS * COLS}</span>
      </div>

      <div
        data-ocid="minesweeper.canvas_target"
        style={{
          display: "inline-flex",
          flexDirection: "column",
          border: "2px solid",
          borderColor: "#808080 #fff #fff #808080",
        }}
      >
        {rows.map((row) => (
          <div key={`row-${row[0].r}`} style={{ display: "flex" }}>
            {row.map(({ r, c }) => (
              <span key={`${r}-${c}`}>
                {renderCell(
                  r,
                  c,
                  board?.[r]?.[c],
                  handleClick,
                  handleRightClick,
                )}
              </span>
            ))}
          </div>
        ))}
      </div>

      {(status === "won" || status === "lost") && (
        <div
          style={{
            marginTop: 8,
            textAlign: "center",
            fontWeight: "bold",
            color: status === "won" ? "#008000" : "#c00",
            fontSize: 13,
          }}
        >
          {status === "won" ? "You Win! 🎉" : "BOOM! Game Over."}
        </div>
      )}
    </div>
  );
}
