import { r as reactExports, j as jsxRuntimeExports } from "./index-D7X0lYXV.js";
const STORAGE_KEY = "onyxos_chat_messages";
const WELCOME_MSG = {
  id: "seed-1",
  from: "System",
  text: "Welcome to Onyx OS 95 Live Chat!",
  time: Date.now() - 6e4,
  effect: "None",
  textPlate: "None"
};
function loadMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.length > 0 ? parsed : [WELCOME_MSG];
    }
  } catch {
  }
  return [WELCOME_MSG];
}
function saveMessages(msgs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: STORAGE_KEY,
        newValue: JSON.stringify(msgs),
        storageArea: localStorage
      })
    );
  } catch {
  }
}
const EFFECT_OPTIONS = [
  "None",
  "Rainbow",
  "MatrixGreen",
  "MatrixRed",
  "MatrixBlue",
  "Neon",
  "Fire",
  "Ice",
  "Glitch",
  "Gold",
  "Cyberpunk",
  "Shadow"
];
const EFFECT_LABELS = {
  None: "None",
  Rainbow: "Rainbow",
  MatrixGreen: "Matrix (Green)",
  MatrixRed: "Matrix (Red)",
  MatrixBlue: "Matrix (Blue)",
  Neon: "Neon",
  Fire: "🔥 Fire",
  Ice: "❄️ Ice",
  Glitch: "⚡ Glitch",
  Gold: "✨ Gold",
  Cyberpunk: "🌆 Cyberpunk",
  Shadow: "🌑 Shadow"
};
const TEXT_PLATE_OPTIONS = [
  "None",
  "MatrixGreen",
  "MatrixRed",
  "MatrixBlue",
  "MatrixYellow",
  "MatrixPurple",
  "MatrixPink",
  "Galaxy",
  "Rainbow",
  "Neon",
  "FirePlate",
  "AuroraPlate",
  "ScanlinesPlate",
  "ElectricPlate",
  "LavaPlate"
];
const TEXT_PLATE_LABELS = {
  None: "None",
  MatrixGreen: "Matrix (Green)",
  MatrixRed: "Matrix (Red)",
  MatrixBlue: "Matrix (Blue)",
  MatrixYellow: "Matrix (Yellow)",
  MatrixPurple: "Matrix (Purple)",
  MatrixPink: "Matrix (Pink)",
  Galaxy: "Galaxy",
  Rainbow: "Rainbow",
  Neon: "Neon",
  FirePlate: "🔥 Fire",
  AuroraPlate: "🌌 Aurora",
  ScanlinesPlate: "📺 Scanlines",
  ElectricPlate: "⚡ Electric",
  LavaPlate: "🌋 Lava"
};
const MATRIX_PLATE_COLORS = {
  MatrixGreen: "#00ff41",
  MatrixRed: "#ff3030",
  MatrixBlue: "#30b0ff",
  MatrixYellow: "#ffe600",
  MatrixPurple: "#b040ff",
  MatrixPink: "#ff2d9b"
};
const MATRIX_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&?!<>[]{}^~";
function MatrixRainBg({
  color,
  width,
  height
}) {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const CELL = 10;
    const FONT_SIZE = 10;
    const cols = Math.ceil(width / CELL);
    const rows = Math.ceil(height / CELL);
    const drops = new Array(cols).fill(0).map(() => -Math.floor(Math.random() * rows));
    let frame = 0;
    let raf;
    ctx.imageSmoothingEnabled = false;
    const draw = () => {
      frame++;
      if (frame % 4 !== 0) {
        raf = requestAnimationFrame(draw);
        return;
      }
      ctx.fillStyle = "rgba(0,0,0,0.40)";
      ctx.fillRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = false;
      ctx.font = `bold ${FONT_SIZE}px "Courier New", monospace`;
      ctx.textBaseline = "top";
      ctx.textAlign = "left";
      for (let col = 0; col < cols; col++) {
        const headRow = drops[col];
        const trailLen = Math.min(6, headRow + rows);
        for (let t = 0; t <= trailLen; t++) {
          const row = headRow - t;
          if (row < 0 || row >= rows) continue;
          const ch = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
          ctx.globalAlpha = t === 0 ? 1 : Math.max(0, 1 - t / (trailLen + 1));
          ctx.fillStyle = t === 0 ? "#ffffff" : color;
          ctx.fillText(ch, col * CELL, row * CELL);
        }
        ctx.globalAlpha = 1;
        drops[col]++;
        if (headRow - trailLen > rows)
          drops[col] = -Math.floor(Math.random() * rows);
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [color, width, height]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      width,
      height,
      style: {
        position: "absolute",
        inset: 0,
        imageRendering: "pixelated",
        opacity: 0.9
      }
    }
  );
}
function GalaxyBg({ width, height }) {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const starCount = Math.floor(width * height / 18);
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.2 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.04 + 0.01,
      hue: [0, 220, 270, 290][Math.floor(Math.random() * 4)],
      sat: Math.random() > 0.6 ? 70 : 0
    }));
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#02000a";
    ctx.fillRect(0, 0, width, height);
    const nebulaBlobs = [
      {
        cx: width * 0.3,
        cy: height * 0.5,
        rx: width * 0.35,
        ry: height * 0.4,
        c1: "rgba(80,0,140,0.18)",
        c2: "rgba(0,0,0,0)"
      },
      {
        cx: width * 0.75,
        cy: height * 0.45,
        rx: width * 0.3,
        ry: height * 0.4,
        c1: "rgba(0,60,180,0.15)",
        c2: "rgba(0,0,0,0)"
      }
    ];
    for (const b of nebulaBlobs) {
      const g = ctx.createRadialGradient(
        b.cx,
        b.cy,
        0,
        b.cx,
        b.cy,
        Math.max(b.rx, b.ry)
      );
      g.addColorStop(0, b.c1);
      g.addColorStop(1, b.c2);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(b.cx, b.cy, b.rx, b.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    const nebulaSnapshot = ctx.getImageData(0, 0, width, height);
    let t = 0;
    let raf;
    const draw = () => {
      ctx.putImageData(nebulaSnapshot, 0, 0);
      t += 0.016;
      for (const s of stars) {
        ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(s.phase + t * s.speed));
        ctx.fillStyle = s.sat > 0 ? `hsl(${s.hue},${s.sat}%,90%)` : "#ffffff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [width, height]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      width,
      height,
      style: { position: "absolute", inset: 0 }
    }
  );
}
function RainbowGradientBg({
  width,
  height
}) {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let offset = 0;
    let raf;
    const draw = () => {
      offset = (offset + 0.8) % 360;
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      for (let i = 0; i <= 8; i++)
        grad.addColorStop(
          i / 8,
          `hsl(${(offset + 360 / 8 * i) % 360},100%,38%)`
        );
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [width, height]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      width,
      height,
      style: { position: "absolute", inset: 0, opacity: 0.9 }
    }
  );
}
function NeonBg({ width, height }) {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let t = 0;
    let raf;
    const draw = () => {
      t += 0.03;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#0a0010";
      ctx.fillRect(0, 0, width, height);
      const cx = width / 2 + Math.sin(t) * (width * 0.3);
      const grad = ctx.createRadialGradient(
        cx,
        height / 2,
        0,
        cx,
        height / 2,
        width * 0.6
      );
      const alpha = 0.5 + 0.3 * Math.sin(t * 1.4);
      grad.addColorStop(0, `rgba(255,0,255,${alpha})`);
      grad.addColorStop(0.5, `rgba(120,0,200,${alpha * 0.5})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [width, height]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      width,
      height,
      style: { position: "absolute", inset: 0, opacity: 0.85 }
    }
  );
}
function FirePlateBg({ width, height }) {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = width;
    const H = height;
    const buf = new Uint8Array(W * (H + 2));
    let raf;
    const draw = () => {
      for (let x = 0; x < W; x++)
        buf[(H + 1) * W + x] = Math.random() > 0.4 ? 255 : Math.floor(Math.random() * 220);
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const below = buf[(y + 1) * W + (x + W - 1) % W];
          const below2 = buf[(y + 1) * W + x];
          const below3 = buf[(y + 1) * W + (x + 1) % W];
          const below4 = buf[(y + 2) * W + x];
          const avg = (below + below2 + below3 + below4) / 4;
          buf[y * W + x] = Math.max(0, avg - Math.random() * 8);
        }
      }
      const imgData = ctx.createImageData(W, H);
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const v = buf[y * W + x];
          const idx = (y * W + x) * 4;
          imgData.data[idx] = Math.min(255, v * 2);
          imgData.data[idx + 1] = Math.max(0, v - 80);
          imgData.data[idx + 2] = 0;
          imgData.data[idx + 3] = v > 8 ? 255 : 0;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      raf = requestAnimationFrame(draw);
    };
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    draw();
    return () => cancelAnimationFrame(raf);
  }, [width, height]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      width,
      height,
      style: { position: "absolute", inset: 0 }
    }
  );
}
function AuroraPlateBg({ width, height }) {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let t = 0;
    let raf;
    const BANDS = 4;
    const draw = () => {
      t += 0.018;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#010a08";
      ctx.fillRect(0, 0, width, height);
      for (let b = 0; b < BANDS; b++) {
        const hue = (140 + b * 40 + Math.sin(t * 0.7 + b) * 30) % 360;
        const yBase = height * (0.2 + b * 0.15);
        const amp = height * 0.08 * (1 + Math.sin(t * 0.5 + b * 1.2));
        const grad = ctx.createLinearGradient(
          0,
          yBase - amp - 8,
          0,
          yBase + amp + 8
        );
        grad.addColorStop(0, `hsla(${hue},100%,60%,0)`);
        grad.addColorStop(0.5, `hsla(${hue},100%,60%,0.55)`);
        grad.addColorStop(1, `hsla(${hue},100%,60%,0)`);
        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += 3) {
          const y = yBase + Math.sin(x * 0.06 + t + b * 2) * amp + Math.sin(x * 0.02 + t * 1.3) * amp * 0.5;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [width, height]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      width,
      height,
      style: { position: "absolute", inset: 0, opacity: 0.95 }
    }
  );
}
function ScanlinesPlateBg({
  width,
  height
}) {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let offset = 0;
    let raf;
    const draw = () => {
      offset = (offset + 0.5) % 4;
      ctx.clearRect(0, 0, width, height);
      const bg = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7
      );
      bg.addColorStop(0, "#0a1a0a");
      bg.addColorStop(1, "#030808");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      for (let y = offset; y < height; y += 4) ctx.fillRect(0, y, width, 2);
      const glow = ctx.createLinearGradient(0, 0, 0, height);
      glow.addColorStop(0, "rgba(0,255,80,0.04)");
      glow.addColorStop(0.5, "rgba(0,255,80,0.08)");
      glow.addColorStop(1, "rgba(0,255,80,0.04)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [width, height]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      width,
      height,
      style: { position: "absolute", inset: 0 }
    }
  );
}
function ElectricPlateBg({ width, height }) {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let t = 0;
    let raf;
    let bolts = [];
    const spawnBolt = () => {
      const x1 = Math.random() * width;
      const segsCount = 4 + Math.floor(Math.random() * 5);
      const segs = [];
      let cy = 0;
      for (let i = 0; i < segsCount; i++) {
        cy += height / segsCount + (Math.random() - 0.5) * (height * 0.3);
        segs.push(cy);
      }
      bolts.push({
        x1,
        y1: 0,
        segs,
        life: 0,
        maxLife: 6 + Math.floor(Math.random() * 8),
        hue: Math.random() > 0.5 ? 200 : 280
      });
    };
    const draw = () => {
      t++;
      ctx.fillStyle = "rgba(0,0,10,0.8)";
      ctx.fillRect(0, 0, width, height);
      if (t % 8 === 0 && bolts.length < 3) spawnBolt();
      bolts = bolts.filter((b) => b.life < b.maxLife);
      for (const b of bolts) {
        const alpha = 1 - b.life / b.maxLife;
        ctx.shadowColor = `hsla(${b.hue},100%,70%,${alpha})`;
        ctx.shadowBlur = 6;
        ctx.strokeStyle = `hsla(${b.hue},100%,80%,${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(b.x1, b.y1);
        let px = b.x1;
        for (const sy of b.segs) {
          px += (Math.random() - 0.5) * width * 0.4;
          ctx.lineTo(Math.max(0, Math.min(width, px)), sy);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
        b.life++;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [width, height]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      width,
      height,
      style: { position: "absolute", inset: 0 }
    }
  );
}
function LavaPlateBg({ width, height }) {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let t = 0;
    let raf;
    const BLOBS = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * width,
      y: height * (0.3 + Math.random() * 0.4),
      r: 8 + Math.random() * 10,
      vy: (Math.random() - 0.5) * 0.3,
      vx: (Math.random() - 0.5) * 0.15,
      phase: i * 1.2
    }));
    const draw = () => {
      t += 0.012;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#1a0400";
      ctx.fillRect(0, 0, width, height);
      for (const b of BLOBS) {
        b.y += b.vy;
        b.x += b.vx;
        if (b.y < -b.r) b.y = height + b.r;
        if (b.y > height + b.r) b.y = -b.r;
        if (b.x < -b.r) b.x = width + b.r;
        if (b.x > width + b.r) b.x = -b.r;
        const pulse = b.r * (0.8 + 0.4 * Math.sin(t * 2 + b.phase));
        const hue = 20 + Math.sin(t + b.phase) * 15;
        const grd = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, pulse * 2);
        grd.addColorStop(0, `hsla(${hue},100%,55%,0.9)`);
        grd.addColorStop(0.5, `hsla(${hue - 10},90%,35%,0.5)`);
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(b.x, b.y, pulse * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [width, height]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      width,
      height,
      style: { position: "absolute", inset: 0 }
    }
  );
}
function TextPlateBg({
  plate,
  width,
  height
}) {
  const matrixColor = MATRIX_PLATE_COLORS[plate];
  if (matrixColor)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MatrixRainBg, { color: matrixColor, width, height });
  if (plate === "Galaxy") return /* @__PURE__ */ jsxRuntimeExports.jsx(GalaxyBg, { width, height });
  if (plate === "Rainbow")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(RainbowGradientBg, { width, height });
  if (plate === "Neon") return /* @__PURE__ */ jsxRuntimeExports.jsx(NeonBg, { width, height });
  if (plate === "FirePlate")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(FirePlateBg, { width, height });
  if (plate === "AuroraPlate")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AuroraPlateBg, { width, height });
  if (plate === "ScanlinesPlate")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ScanlinesPlateBg, { width, height });
  if (plate === "ElectricPlate")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ElectricPlateBg, { width, height });
  if (plate === "LavaPlate")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LavaPlateBg, { width, height });
  return null;
}
function FireEffectText({ text }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      style: {
        background: "linear-gradient(180deg, #fff200 0%, #ff8c00 40%, #ff2000 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        fontWeight: "bold",
        textShadow: "none",
        filter: "drop-shadow(0 0 4px #ff6600)",
        animation: "fire-flicker 0.15s step-start infinite"
      },
      children: text
    }
  );
}
function IceEffectText({ text }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      style: {
        background: "linear-gradient(90deg, #a8e6ff 0%, #ffffff 40%, #80d0ff 70%, #b0f0ff 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        fontWeight: "bold",
        filter: "drop-shadow(0 0 5px #00ccff)",
        animation: "ice-shimmer 1.8s ease-in-out infinite"
      },
      children: text
    }
  );
}
function GlitchEffectText({ text }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      style: {
        position: "relative",
        display: "inline-block",
        fontWeight: "bold",
        color: "#00ffff"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            style: {
              position: "absolute",
              left: 0,
              top: 0,
              color: "#ff0040",
              animation: "glitch-r 0.4s step-start infinite",
              opacity: 0.8,
              clipPath: "inset(40% 0 40% 0)"
            },
            children: text
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            style: {
              position: "absolute",
              left: 0,
              top: 0,
              color: "#00ff80",
              animation: "glitch-g 0.4s step-start infinite",
              opacity: 0.8,
              clipPath: "inset(10% 0 60% 0)"
            },
            children: text
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#00ffff" }, children: text })
      ]
    }
  );
}
function GoldEffectText({ text }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      style: {
        background: "linear-gradient(90deg, #b8860b 0%, #ffd700 30%, #fffacd 55%, #ffd700 75%, #b8860b 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        fontWeight: "bold",
        animation: "gold-shine 2.5s linear infinite",
        backgroundSize: "200% 100%"
      },
      children: text
    }
  );
}
function CyberpunkEffectText({ text }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      style: {
        fontWeight: "bold",
        animation: "cyberpunk-flicker 0.6s step-start infinite",
        textShadow: "0 0 8px #ff00aa, 0 0 16px #ff00aa",
        color: "#ff00aa",
        fontFamily: "Courier New, monospace"
      },
      children: text
    }
  );
}
function ShadowEffectText({ text }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      style: {
        color: "#c0a8d0",
        fontWeight: "bold",
        textShadow: "2px 2px 8px #330033, -2px 2px 6px #220022, 0 0 20px rgba(100,0,100,0.6)",
        animation: "shadow-wisp 2s ease-in-out infinite",
        fontFamily: "Tahoma, sans-serif"
      },
      children: text
    }
  );
}
function getEffectStyle(effect) {
  switch (effect) {
    case "Rainbow":
      return {
        background: "linear-gradient(90deg,#f00,#f80,#ff0,#0f0,#00f,#80f)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        fontWeight: "bold"
      };
    case "MatrixGreen":
      return {
        color: "#00ff41",
        fontFamily: "Courier New,monospace",
        textShadow: "0 0 8px #00ff41",
        fontWeight: "bold"
      };
    case "MatrixRed":
      return {
        color: "#ff4141",
        fontFamily: "Courier New,monospace",
        textShadow: "0 0 8px #ff0000",
        fontWeight: "bold"
      };
    case "MatrixBlue":
      return {
        color: "#41b0ff",
        fontFamily: "Courier New,monospace",
        textShadow: "0 0 8px #0080ff",
        fontWeight: "bold"
      };
    case "Neon":
      return {
        color: "#ff00ff",
        textShadow: "0 0 6px #ff00ff, 0 0 12px #ff00ff",
        fontWeight: "bold"
      };
    default:
      return {};
  }
}
function isComplexEffect(effect) {
  return ["Fire", "Ice", "Glitch", "Gold", "Cyberpunk", "Shadow"].includes(
    effect
  );
}
function UsernameBadge({
  username,
  effect,
  plate
}) {
  const hasPlate = plate && plate !== "None";
  const isMatrixEffect = effect === "MatrixGreen" || effect === "MatrixRed" || effect === "MatrixBlue";
  const complex = isComplexEffect(effect);
  if (!hasPlate && !isMatrixEffect) {
    if (complex) {
      return renderComplexEffect(effect, username);
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: getEffectStyle(effect), children: username });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      style: {
        position: "relative",
        display: "inline-block",
        padding: "0 4px",
        borderRadius: 2,
        overflow: "hidden",
        lineHeight: "18px",
        height: 18,
        minWidth: 50
      },
      children: [
        hasPlate ? /* @__PURE__ */ jsxRuntimeExports.jsx(TextPlateBg, { plate, width: 130, height: 18 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          MatrixRainBg,
          {
            color: MATRIX_PLATE_COLORS[effect] ?? "#00ff41",
            width: 130,
            height: 18
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            style: {
              position: "relative",
              zIndex: 1,
              ...!complex ? getEffectStyle(effect) : {}
            },
            children: complex ? renderComplexEffect(effect, username) : username
          }
        )
      ]
    }
  );
}
function renderComplexEffect(effect, text) {
  switch (effect) {
    case "Fire":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(FireEffectText, { text });
    case "Ice":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(IceEffectText, { text });
    case "Glitch":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(GlitchEffectText, { text });
    case "Gold":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(GoldEffectText, { text });
    case "Cyberpunk":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CyberpunkEffectText, { text });
    case "Shadow":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ShadowEffectText, { text });
    default:
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: text });
  }
}
function LiveChat({ user, userStore }) {
  const [messages, setMessages] = reactExports.useState(() => loadMessages());
  const [input, setInput] = reactExports.useState("");
  const [localUser, setLocalUser] = reactExports.useState(user);
  const [pendingEffects, setPendingEffects] = reactExports.useState({});
  const [pendingPlates, setPendingPlates] = reactExports.useState(
    {}
  );
  const [applyFeedback, setApplyFeedback] = reactExports.useState(
    {}
  );
  const [applyPlateFeedback, setApplyPlateFeedback] = reactExports.useState({});
  const [selfEffect, setSelfEffect] = reactExports.useState(
    user.usernameEffect
  );
  const [selfFeedback, setSelfFeedback] = reactExports.useState(false);
  const [selfPlate, setSelfPlate] = reactExports.useState(
    user.textPlate ?? "None"
  );
  const [plateFeedback, setPlateFeedback] = reactExports.useState(false);
  const bottomRef = reactExports.useRef(null);
  const isOwner = localUser.role === "Owner";
  const isPrivileged = localUser.role === "Owner" || localUser.role === "Admin";
  reactExports.useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setMessages(loadMessages());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  reactExports.useEffect(() => {
    const id = setInterval(() => setMessages(loadMessages()), 2e3);
    return () => clearInterval(id);
  }, []);
  reactExports.useEffect(() => {
    var _a;
    (_a = bottomRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const msg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      from: localUser.username,
      text,
      time: Date.now(),
      effect: localUser.usernameEffect,
      textPlate: localUser.textPlate ?? "None"
    };
    const updated = [...loadMessages(), msg];
    saveMessages(updated);
    setMessages(updated);
    setInput("");
  };
  const applyOwnEffect = () => {
    const entry = userStore.get(localUser.username);
    if (entry) entry.user = { ...entry.user, usernameEffect: selfEffect };
    setLocalUser({ ...localUser, usernameEffect: selfEffect });
    setSelfFeedback(true);
    setTimeout(() => setSelfFeedback(false), 1500);
    persistUserField(localUser.username, { usernameEffect: selfEffect });
  };
  const applyOwnPlate = () => {
    const entry = userStore.get(localUser.username);
    if (entry) entry.user = { ...entry.user, textPlate: selfPlate };
    setLocalUser({ ...localUser, textPlate: selfPlate });
    setPlateFeedback(true);
    setTimeout(() => setPlateFeedback(false), 1500);
    persistUserField(localUser.username, { textPlate: selfPlate });
  };
  const applyEffect = (targetUsername) => {
    const effect = pendingEffects[targetUsername] ?? "None";
    const entry = userStore.get(targetUsername);
    if (!entry) return;
    entry.user = { ...entry.user, usernameEffect: effect };
    persistUserField(targetUsername, { usernameEffect: effect });
    setApplyFeedback((prev) => ({ ...prev, [targetUsername]: true }));
    setTimeout(
      () => setApplyFeedback((prev) => ({ ...prev, [targetUsername]: false })),
      1500
    );
  };
  const applyPlateForUser = (targetUsername) => {
    const plate = pendingPlates[targetUsername] ?? "None";
    const entry = userStore.get(targetUsername);
    if (!entry) return;
    entry.user = { ...entry.user, textPlate: plate };
    persistUserField(targetUsername, { textPlate: plate });
    setApplyPlateFeedback((prev) => ({ ...prev, [targetUsername]: true }));
    setTimeout(
      () => setApplyPlateFeedback((prev) => ({ ...prev, [targetUsername]: false })),
      1500
    );
  };
  const owners = [...userStore.values()].filter((e) => e.user.role === "Owner");
  const admins = [...userStore.values()].filter((e) => e.user.role === "Admin");
  const users = [...userStore.values()].filter((e) => e.user.role === "User");
  const renderUserRow = (e, sectionColor) => {
    const canOwnerSet = isOwner && e.user.username !== localUser.username;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          padding: "3px 4px",
          fontSize: 11,
          borderBottom: "1px solid #d0d0d0",
          background: "#c8c8c8"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginBottom: canOwnerSet ? 3 : 0
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: { fontSize: 8, color: e.user.isOnline ? "#008000" : "#800" },
                    children: "●"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  UsernameBadge,
                  {
                    username: e.user.username,
                    effect: e.user.usernameEffect,
                    plate: e.user.textPlate ?? "None"
                  }
                ),
                e.user.role !== "User" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: {
                      fontSize: 8,
                      background: sectionColor,
                      color: "#fff",
                      padding: "0 3px",
                      borderRadius: 2,
                      marginLeft: "auto"
                    },
                    children: e.user.role
                  }
                )
              ]
            }
          ),
          canOwnerSet && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 2 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 2, alignItems: "center" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  "data-ocid": `livechat.effect_select.${e.user.username}`,
                  value: pendingEffects[e.user.username] ?? e.user.usernameEffect,
                  onChange: (ev) => setPendingEffects((prev) => ({
                    ...prev,
                    [e.user.username]: ev.target.value
                  })),
                  style: {
                    flex: 1,
                    fontSize: 9,
                    fontFamily: "Tahoma, sans-serif",
                    border: "1px solid #808080",
                    background: "#fff",
                    padding: "1px 2px"
                  },
                  children: EFFECT_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt, children: EFFECT_LABELS[opt] }, opt))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": `livechat.apply_effect_button.${e.user.username}`,
                  className: "btn-95",
                  onClick: () => applyEffect(e.user.username),
                  style: {
                    fontSize: 9,
                    padding: "1px 4px",
                    whiteSpace: "nowrap"
                  },
                  children: applyFeedback[e.user.username] ? "✓" : "FX"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 2, alignItems: "center" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  "data-ocid": `livechat.plate_select.${e.user.username}`,
                  value: pendingPlates[e.user.username] ?? e.user.textPlate ?? "None",
                  onChange: (ev) => setPendingPlates((prev) => ({
                    ...prev,
                    [e.user.username]: ev.target.value
                  })),
                  style: {
                    flex: 1,
                    fontSize: 9,
                    fontFamily: "Tahoma, sans-serif",
                    border: "1px solid #808080",
                    background: "#fff",
                    padding: "1px 2px"
                  },
                  children: TEXT_PLATE_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt, children: TEXT_PLATE_LABELS[opt] }, opt))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": `livechat.apply_plate_button.${e.user.username}`,
                  className: "btn-95",
                  onClick: () => applyPlateForUser(e.user.username),
                  style: {
                    fontSize: 9,
                    padding: "1px 4px",
                    whiteSpace: "nowrap"
                  },
                  children: applyPlateFeedback[e.user.username] ? "✓" : "🎨"
                }
              )
            ] })
          ] })
        ]
      },
      e.user.id
    );
  };
  const renderPrivilegedControls = () => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        padding: 4,
        background: "#000080",
        borderBottom: "2px solid #808080"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              color: "#fff",
              fontSize: 9,
              marginBottom: 2,
              fontWeight: "bold"
            },
            children: "✨ Username effect:"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              gap: 2,
              alignItems: "center",
              marginBottom: 4
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  "data-ocid": "livechat.self_effect_select",
                  value: selfEffect,
                  onChange: (ev) => setSelfEffect(ev.target.value),
                  style: {
                    flex: 1,
                    fontSize: 9,
                    fontFamily: "Tahoma, sans-serif",
                    border: "1px solid #606060",
                    background: "#fff",
                    padding: "1px 2px"
                  },
                  children: EFFECT_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt, children: EFFECT_LABELS[opt] }, opt))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "livechat.apply_self_effect_button",
                  className: "btn-95",
                  onClick: applyOwnEffect,
                  style: {
                    fontSize: 9,
                    padding: "1px 4px",
                    whiteSpace: "nowrap",
                    background: selfFeedback ? "#ccffcc" : void 0
                  },
                  children: selfFeedback ? "✓" : "Apply"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              color: "#ffe680",
              fontSize: 9,
              marginBottom: 2,
              fontWeight: "bold"
            },
            children: "🎨 Text plate:"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              gap: 2,
              alignItems: "center",
              marginBottom: 4
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  "data-ocid": "livechat.self_plate_select",
                  value: selfPlate,
                  onChange: (ev) => setSelfPlate(ev.target.value),
                  style: {
                    flex: 1,
                    fontSize: 9,
                    fontFamily: "Tahoma, sans-serif",
                    border: "1px solid #606060",
                    background: "#fff",
                    padding: "1px 2px"
                  },
                  children: TEXT_PLATE_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt, children: TEXT_PLATE_LABELS[opt] }, opt))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "livechat.apply_plate_button",
                  className: "btn-95",
                  onClick: applyOwnPlate,
                  style: {
                    fontSize: 9,
                    padding: "1px 4px",
                    whiteSpace: "nowrap",
                    background: plateFeedback ? "#ccffcc" : void 0
                  },
                  children: plateFeedback ? "✓" : "Apply"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 2, minHeight: 22 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          UsernameBadge,
          {
            username: localUser.username,
            effect: selfEffect,
            plate: selfPlate
          }
        ) })
      ]
    }
  );
  const renderUserEffectControl = () => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        padding: 4,
        background: "#404080",
        borderBottom: "2px solid #808080"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              color: "#aad4ff",
              fontSize: 9,
              marginBottom: 2,
              fontWeight: "bold"
            },
            children: "✨ Your effect:"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              gap: 2,
              alignItems: "center",
              marginBottom: 4
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  "data-ocid": "livechat.self_effect_select",
                  value: selfEffect,
                  onChange: (ev) => setSelfEffect(ev.target.value),
                  style: {
                    flex: 1,
                    fontSize: 9,
                    fontFamily: "Tahoma, sans-serif",
                    border: "1px solid #606060",
                    background: "#fff",
                    padding: "1px 2px"
                  },
                  children: EFFECT_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt, children: EFFECT_LABELS[opt] }, opt))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "livechat.apply_self_effect_button",
                  className: "btn-95",
                  onClick: applyOwnEffect,
                  style: {
                    fontSize: 9,
                    padding: "1px 4px",
                    whiteSpace: "nowrap",
                    background: selfFeedback ? "#ccffcc" : void 0
                  },
                  children: selfFeedback ? "✓" : "Apply"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 2, minHeight: 22 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          UsernameBadge,
          {
            username: localUser.username,
            effect: selfEffect,
            plate: selfPlate
          }
        ) })
      ]
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        height: "100%",
        fontFamily: "Tahoma, Verdana, sans-serif",
        fontSize: 11
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes fire-flicker {
          0%,100% { filter: drop-shadow(0 0 3px #ff6600) brightness(1); }
          25% { filter: drop-shadow(0 0 6px #ff3300) brightness(1.15); }
          50% { filter: drop-shadow(0 0 2px #ff9900) brightness(0.9); }
          75% { filter: drop-shadow(0 0 8px #ff4400) brightness(1.2); }
        }
        @keyframes ice-shimmer {
          0%,100% { filter: drop-shadow(0 0 4px #00ccff) brightness(1); }
          50% { filter: drop-shadow(0 0 8px #80eeff) brightness(1.2); }
        }
        @keyframes glitch-r {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(2px); }
          40% { transform: translateX(-1px); }
          60% { transform: translateX(3px); }
          80% { transform: translateX(-2px); }
        }
        @keyframes glitch-g {
          0%,100% { transform: translateX(0); }
          30% { transform: translateX(-3px); }
          60% { transform: translateX(1px); }
        }
        @keyframes gold-shine {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        @keyframes cyberpunk-flicker {
          0%,100% { color: #ff00aa; text-shadow: 0 0 8px #ff00aa, 0 0 16px #ff00aa; }
          25% { color: #00d4ff; text-shadow: 0 0 8px #00d4ff, 0 0 16px #00d4ff; }
          50% { color: #ff00aa; text-shadow: 0 0 12px #ff00aa, 0 0 24px #ff00aa; }
          75% { color: #00d4ff; text-shadow: 0 0 6px #00d4ff; }
        }
        @keyframes shadow-wisp {
          0%,100% { text-shadow: 2px 2px 8px #330033, -2px 2px 6px #220022, 0 0 20px rgba(100,0,100,0.6); }
          50% { text-shadow: 4px 4px 16px #550055, -4px 2px 12px #440044, 0 0 30px rgba(140,0,140,0.8); }
        }
      ` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              flex: 1,
              display: "flex",
              flexDirection: "column",
              borderRight: "1px solid #808080"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "livechat.messages_panel",
                  style: {
                    flex: 1,
                    overflow: "auto",
                    background: "#fff",
                    padding: 6,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2
                  },
                  children: [
                    messages.map((msg, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        "data-ocid": `livechat.message.${i + 1}`,
                        style: { display: "flex", gap: 4, alignItems: "baseline" },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 9, color: "#888", flexShrink: 0 }, children: new Date(msg.time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            UsernameBadge,
                            {
                              username: `${msg.from}:`,
                              effect: msg.effect,
                              plate: msg.textPlate ?? "None"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#000", wordBreak: "break-word" }, children: msg.text })
                        ]
                      },
                      msg.id
                    )),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: bottomRef })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    padding: 4,
                    display: "flex",
                    gap: 4,
                    borderTop: "1px solid #808080",
                    background: "#c0c0c0"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        "data-ocid": "livechat.message_input",
                        type: "text",
                        value: input,
                        onChange: (e) => setInput(e.target.value),
                        onKeyDown: (e) => e.key === "Enter" && sendMessage(),
                        className: "text-input-95",
                        style: { flex: 1, boxSizing: "border-box" },
                        placeholder: "Type a message...",
                        maxLength: 500
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "livechat.send_button",
                        className: "btn-95",
                        onClick: sendMessage,
                        children: "Send"
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              width: isOwner ? 170 : 155,
              background: "#c0c0c0",
              display: "flex",
              flexDirection: "column",
              overflow: "auto"
            },
            children: [
              isPrivileged ? renderPrivilegedControls() : renderUserEffectControl(),
              isOwner && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    padding: "2px 4px",
                    fontSize: 9,
                    background: "#800080",
                    color: "#fff",
                    fontStyle: "italic"
                  },
                  children: "👑 Owner: set effects on others below"
                }
              ),
              [
                { label: "Owners", list: owners, color: "#800080" },
                { label: "Admins", list: admins, color: "#000080" },
                { label: "Users", list: users, color: "#004000" }
              ].map(({ label, list, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 4 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      background: color,
                      color: "#fff",
                      padding: "2px 4px",
                      fontSize: 10,
                      fontWeight: "bold"
                    },
                    children: [
                      label,
                      " (",
                      list.length,
                      ")"
                    ]
                  }
                ),
                list.map((e) => renderUserRow(e, color))
              ] }, label))
            ]
          }
        )
      ]
    }
  );
}
function persistUserField(username, fields) {
  try {
    const raw = localStorage.getItem("onyxos_users");
    if (!raw) return;
    const users = JSON.parse(raw);
    if (users[username]) {
      users[username].user = { ...users[username].user, ...fields };
      localStorage.setItem("onyxos_users", JSON.stringify(users));
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "onyxos_users",
          newValue: JSON.stringify(users),
          storageArea: localStorage
        })
      );
    }
  } catch {
  }
}
export {
  LiveChat
};
