import { r as reactExports, j as jsxRuntimeExports } from "./index-D7X0lYXV.js";
const COLORS = [
  "#000000",
  "#808080",
  "#800000",
  "#808000",
  "#008000",
  "#008080",
  "#000080",
  "#800080",
  "#c0c0c0",
  "#ffffff",
  "#ff0000",
  "#ffff00",
  "#00ff00",
  "#00ffff",
  "#0000ff",
  "#ff00ff",
  "#ff8040",
  "#804000"
];
function PaintApp() {
  const canvasRef = reactExports.useRef(null);
  const [color, setColor] = reactExports.useState("#000000");
  const [bgColor] = reactExports.useState("#ffffff");
  const [tool, setTool] = reactExports.useState("pen");
  const [size, setSize] = reactExports.useState(2);
  const isDrawingRef = reactExports.useRef(false);
  const lastPosRef = reactExports.useRef(null);
  const startPosRef = reactExports.useRef(null);
  const snapshotRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [bgColor]);
  const getPos = reactExports.useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);
  const floodFill = reactExports.useCallback((x, y, fillColor) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const tx = Math.floor(x);
    const ty = Math.floor(y);
    const idx = (ty * canvas.width + tx) * 4;
    const targetR = data[idx];
    const targetG = data[idx + 1];
    const targetB = data[idx + 2];
    const fill = Number.parseInt(fillColor.slice(1), 16);
    const fr = fill >> 16 & 255;
    const fg = fill >> 8 & 255;
    const fb = fill & 255;
    if (fr === targetR && fg === targetG && fb === targetB) return;
    const stack = [[tx, ty]];
    while (stack.length) {
      const item = stack.pop();
      if (!item) break;
      const [cx, cy] = item;
      if (cx < 0 || cx >= canvas.width || cy < 0 || cy >= canvas.height)
        continue;
      const i = (cy * canvas.width + cx) * 4;
      if (data[i] !== targetR || data[i + 1] !== targetG || data[i + 2] !== targetB)
        continue;
      data[i] = fr;
      data[i + 1] = fg;
      data[i + 2] = fb;
      data[i + 3] = 255;
      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }
    ctx.putImageData(imgData, 0, 0);
  }, []);
  const onMouseDown = reactExports.useCallback(
    (e) => {
      const pos = getPos(e);
      isDrawingRef.current = true;
      startPosRef.current = pos;
      lastPosRef.current = pos;
      if (tool === "fill") {
        floodFill(pos.x, pos.y, color);
        return;
      }
      const canvas = canvasRef.current;
      const ctx = canvas == null ? void 0 : canvas.getContext("2d");
      if (ctx && (tool === "line" || tool === "rect")) {
        snapshotRef.current = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
      }
      if (tool === "pen" || tool === "eraser") {
        if (!ctx) return;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
      }
    },
    [tool, color, floodFill, getPos]
  );
  const onMouseMove = reactExports.useCallback(
    (e) => {
      if (!isDrawingRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas == null ? void 0 : canvas.getContext("2d");
      if (!ctx) return;
      const pos = getPos(e);
      ctx.lineWidth = size;
      if (tool === "pen") {
        ctx.strokeStyle = color;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else if (tool === "eraser") {
        ctx.strokeStyle = bgColor;
        ctx.lineWidth = size * 4;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else if (tool === "line" && snapshotRef.current && startPosRef.current) {
        ctx.putImageData(snapshotRef.current, 0, 0);
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo(startPosRef.current.x, startPosRef.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else if (tool === "rect" && snapshotRef.current && startPosRef.current) {
        ctx.putImageData(snapshotRef.current, 0, 0);
        ctx.beginPath();
        ctx.strokeStyle = color;
        const w = pos.x - startPosRef.current.x;
        const h = pos.y - startPosRef.current.y;
        ctx.strokeRect(startPosRef.current.x, startPosRef.current.y, w, h);
      }
      lastPosRef.current = pos;
    },
    [tool, color, bgColor, size, getPos]
  );
  const onMouseUp = reactExports.useCallback(() => {
    var _a;
    isDrawingRef.current = false;
    startPosRef.current = null;
    snapshotRef.current = null;
    const ctx = (_a = canvasRef.current) == null ? void 0 : _a.getContext("2d");
    ctx == null ? void 0 : ctx.beginPath();
  }, []);
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas == null ? void 0 : canvas.getContext("2d");
    if (!ctx || !canvas) return;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
  const tools = [
    { id: "pen", label: "Pencil", emoji: "✏️" },
    { id: "eraser", label: "Eraser", emoji: "🧹" },
    { id: "fill", label: "Fill", emoji: "🪣" },
    { id: "line", label: "Line", emoji: "╱" },
    { id: "rect", label: "Rectangle", emoji: "▭" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        height: "100%",
        fontFamily: "Tahoma, Verdana, sans-serif",
        fontSize: 11,
        background: "#c0c0c0"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              width: 44,
              borderRight: "1px solid #808080",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              padding: 4,
              background: "#c0c0c0"
            },
            children: [
              tools.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": `paint.tool_${t.id}`,
                  title: t.label,
                  onClick: () => setTool(t.id),
                  style: {
                    width: 32,
                    height: 28,
                    background: "#c0c0c0",
                    border: "2px solid",
                    borderColor: tool === t.id ? "#808080 #fff #fff #808080" : "#fff #808080 #808080 #fff",
                    cursor: "pointer",
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0
                  },
                  children: t.emoji
                },
                t.id
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: 32, marginTop: 8 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "paint-size", style: { fontSize: 9 }, children: "Size" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "paint-size",
                    type: "range",
                    min: 1,
                    max: 20,
                    value: size,
                    onChange: (e) => setSize(Number(e.target.value)),
                    style: { width: "100%" }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "paint.clear_button",
                  onClick: clearCanvas,
                  style: {
                    marginTop: 8,
                    width: 32,
                    fontSize: 9,
                    padding: "2px 0",
                    background: "#c0c0c0",
                    border: "2px solid",
                    borderColor: "#fff #808080 #808080 #fff",
                    cursor: "pointer"
                  },
                  children: "Clear"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              flex: 1,
              overflow: "auto",
              background: "#808080",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              padding: 4
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "canvas",
              {
                ref: canvasRef,
                width: 460,
                height: 340,
                "data-ocid": "paint.canvas_target",
                style: {
                  cursor: tool === "eraser" ? "cell" : tool === "fill" ? "crosshair" : "crosshair",
                  display: "block"
                },
                onMouseDown,
                onMouseMove,
                onMouseUp,
                onMouseLeave: onMouseUp
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              width: 44,
              borderLeft: "1px solid #808080",
              padding: 4,
              background: "#c0c0c0"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: 4, fontSize: 9 }, children: "Color" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    width: 24,
                    height: 24,
                    background: color,
                    border: "2px solid",
                    borderColor: "#808080 #fff #fff #808080",
                    marginBottom: 6
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 1
                  },
                  children: COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": `paint.color.${c.slice(1)}`,
                      onClick: () => setColor(c),
                      "aria-label": c,
                      style: {
                        width: 16,
                        height: 16,
                        background: c,
                        border: color === c ? "2px solid #000" : "1px solid #808080",
                        cursor: "pointer",
                        padding: 0
                      }
                    },
                    c
                  ))
                }
              )
            ]
          }
        )
      ]
    }
  );
}
export {
  PaintApp
};
