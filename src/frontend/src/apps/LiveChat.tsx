import { useEffect, useRef, useState } from "react";
import type { TextPlate, User, UsernameEffect } from "../types";

interface Message {
  id: string;
  from: string;
  text: string;
  time: number;
  effect: UsernameEffect;
  textPlate: TextPlate;
}

interface Props {
  user: User;
  userStore: Map<string, { username: string; password: string; user: User }>;
}

const STORAGE_KEY = "onyxos_chat_messages";
const WELCOME_MSG: Message = {
  id: "seed-1",
  from: "System",
  text: "Welcome to Onyx OS 95 Live Chat!",
  time: Date.now() - 60000,
  effect: "None",
  textPlate: "None",
};

function loadMessages(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Message[];
      return parsed.length > 0 ? parsed : [WELCOME_MSG];
    }
  } catch {
    /* noop */
  }
  return [WELCOME_MSG];
}

function saveMessages(msgs: Message[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: STORAGE_KEY,
        newValue: JSON.stringify(msgs),
        storageArea: localStorage,
      }),
    );
  } catch {
    /* noop */
  }
}

// ─── Effect / plate option lists ───────────────────────────────────────────

const EFFECT_OPTIONS: UsernameEffect[] = [
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
  "Shadow",
];

const EFFECT_LABELS: Record<UsernameEffect, string> = {
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
  Shadow: "🌑 Shadow",
};

const TEXT_PLATE_OPTIONS: TextPlate[] = [
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
  "LavaPlate",
];

const TEXT_PLATE_LABELS: Record<TextPlate, string> = {
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
  LavaPlate: "🌋 Lava",
};

const MATRIX_PLATE_COLORS: Partial<Record<TextPlate, string>> = {
  MatrixGreen: "#00ff41",
  MatrixRed: "#ff3030",
  MatrixBlue: "#30b0ff",
  MatrixYellow: "#ffe600",
  MatrixPurple: "#b040ff",
  MatrixPink: "#ff2d9b",
};

const MATRIX_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&?!<>[]{}^~";

// ─── Canvas Components ──────────────────────────────────────────────────────

function MatrixRainBg({
  color,
  width,
  height,
}: { color: string; width: number; height: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const CELL = 10;
    const FONT_SIZE = 10;
    const cols = Math.ceil(width / CELL);
    const rows = Math.ceil(height / CELL);
    const drops = new Array(cols)
      .fill(0)
      .map(() => -Math.floor(Math.random() * rows));
    let frame = 0;
    let raf: number;
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
          const ch =
            MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
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
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: "absolute",
        inset: 0,
        imageRendering: "pixelated",
        opacity: 0.9,
      }}
    />
  );
}

function GalaxyBg({ width, height }: { width: number; height: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const starCount = Math.floor((width * height) / 18);
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.2 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.04 + 0.01,
      hue: [0, 220, 270, 290][Math.floor(Math.random() * 4)],
      sat: Math.random() > 0.6 ? 70 : 0,
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
        c2: "rgba(0,0,0,0)",
      },
      {
        cx: width * 0.75,
        cy: height * 0.45,
        rx: width * 0.3,
        ry: height * 0.4,
        c1: "rgba(0,60,180,0.15)",
        c2: "rgba(0,0,0,0)",
      },
    ];
    for (const b of nebulaBlobs) {
      const g = ctx.createRadialGradient(
        b.cx,
        b.cy,
        0,
        b.cx,
        b.cy,
        Math.max(b.rx, b.ry),
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
    let raf: number;
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
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ position: "absolute", inset: 0 }}
    />
  );
}

function RainbowGradientBg({
  width,
  height,
}: { width: number; height: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let offset = 0;
    let raf: number;
    const draw = () => {
      offset = (offset + 0.8) % 360;
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      for (let i = 0; i <= 8; i++)
        grad.addColorStop(
          i / 8,
          `hsl(${(offset + (360 / 8) * i) % 360},100%,38%)`,
        );
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [width, height]);
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ position: "absolute", inset: 0, opacity: 0.9 }}
    />
  );
}

function NeonBg({ width, height }: { width: number; height: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let t = 0;
    let raf: number;
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
        width * 0.6,
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
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ position: "absolute", inset: 0, opacity: 0.85 }}
    />
  );
}

// ─── NEW TEXT PLATE CANVASES ────────────────────────────────────────────────

function FirePlateBg({ width, height }: { width: number; height: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = width;
    const H = height;
    // Heat buffer for cellular automaton fire
    const buf = new Uint8Array(W * (H + 2));
    let raf: number;
    const draw = () => {
      // Seed bottom row with random heat
      for (let x = 0; x < W; x++)
        buf[(H + 1) * W + x] =
          Math.random() > 0.4 ? 255 : Math.floor(Math.random() * 220);
      // Spread fire upward
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const below = buf[(y + 1) * W + ((x + W - 1) % W)];
          const below2 = buf[(y + 1) * W + x];
          const below3 = buf[(y + 1) * W + ((x + 1) % W)];
          const below4 = buf[(y + 2) * W + x];
          const avg = (below + below2 + below3 + below4) / 4;
          buf[y * W + x] = Math.max(0, avg - Math.random() * 8);
        }
      }
      // Render
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
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ position: "absolute", inset: 0 }}
    />
  );
}

function AuroraPlateBg({ width, height }: { width: number; height: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let t = 0;
    let raf: number;
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
          yBase + amp + 8,
        );
        grad.addColorStop(0, `hsla(${hue},100%,60%,0)`);
        grad.addColorStop(0.5, `hsla(${hue},100%,60%,0.55)`);
        grad.addColorStop(1, `hsla(${hue},100%,60%,0)`);
        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += 3) {
          const y =
            yBase +
            Math.sin(x * 0.06 + t + b * 2) * amp +
            Math.sin(x * 0.02 + t * 1.3) * amp * 0.5;
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
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ position: "absolute", inset: 0, opacity: 0.95 }}
    />
  );
}

function ScanlinesPlateBg({
  width,
  height,
}: { width: number; height: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let offset = 0;
    let raf: number;
    const draw = () => {
      offset = (offset + 0.5) % 4;
      ctx.clearRect(0, 0, width, height);
      // Dark greenish CRT background
      const bg = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7,
      );
      bg.addColorStop(0, "#0a1a0a");
      bg.addColorStop(1, "#030808");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
      // Scanlines
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      for (let y = offset; y < height; y += 4) ctx.fillRect(0, y, width, 2);
      // Phosphor glow tint
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
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ position: "absolute", inset: 0 }}
    />
  );
}

function ElectricPlateBg({ width, height }: { width: number; height: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let t = 0;
    let raf: number;
    interface Bolt {
      x1: number;
      y1: number;
      segs: number[];
      life: number;
      maxLife: number;
      hue: number;
    }
    let bolts: Bolt[] = [];
    const spawnBolt = () => {
      const x1 = Math.random() * width;
      const segsCount = 4 + Math.floor(Math.random() * 5);
      const segs: number[] = [];
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
        hue: Math.random() > 0.5 ? 200 : 280,
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
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ position: "absolute", inset: 0 }}
    />
  );
}

function LavaPlateBg({ width, height }: { width: number; height: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let t = 0;
    let raf: number;
    const BLOBS = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * width,
      y: height * (0.3 + Math.random() * 0.4),
      r: 8 + Math.random() * 10,
      vy: (Math.random() - 0.5) * 0.3,
      vx: (Math.random() - 0.5) * 0.15,
      phase: i * 1.2,
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
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ position: "absolute", inset: 0 }}
    />
  );
}

// ─── Text plate canvas background dispatcher ────────────────────────────────

function TextPlateBg({
  plate,
  width,
  height,
}: { plate: TextPlate; width: number; height: number }) {
  const matrixColor = MATRIX_PLATE_COLORS[plate];
  if (matrixColor)
    return <MatrixRainBg color={matrixColor} width={width} height={height} />;
  if (plate === "Galaxy") return <GalaxyBg width={width} height={height} />;
  if (plate === "Rainbow")
    return <RainbowGradientBg width={width} height={height} />;
  if (plate === "Neon") return <NeonBg width={width} height={height} />;
  if (plate === "FirePlate")
    return <FirePlateBg width={width} height={height} />;
  if (plate === "AuroraPlate")
    return <AuroraPlateBg width={width} height={height} />;
  if (plate === "ScanlinesPlate")
    return <ScanlinesPlateBg width={width} height={height} />;
  if (plate === "ElectricPlate")
    return <ElectricPlateBg width={width} height={height} />;
  if (plate === "LavaPlate")
    return <LavaPlateBg width={width} height={height} />;
  return null;
}

// ─── Animated Username Effect Components ────────────────────────────────────

function FireEffectText({ text }: { text: string }) {
  return (
    <span
      style={{
        background:
          "linear-gradient(180deg, #fff200 0%, #ff8c00 40%, #ff2000 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        fontWeight: "bold",
        textShadow: "none",
        filter: "drop-shadow(0 0 4px #ff6600)",
        animation: "fire-flicker 0.15s step-start infinite",
      }}
    >
      {text}
    </span>
  );
}

function IceEffectText({ text }: { text: string }) {
  return (
    <span
      style={{
        background:
          "linear-gradient(90deg, #a8e6ff 0%, #ffffff 40%, #80d0ff 70%, #b0f0ff 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        fontWeight: "bold",
        filter: "drop-shadow(0 0 5px #00ccff)",
        animation: "ice-shimmer 1.8s ease-in-out infinite",
      }}
    >
      {text}
    </span>
  );
}

function GlitchEffectText({ text }: { text: string }) {
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        fontWeight: "bold",
        color: "#00ffff",
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          color: "#ff0040",
          animation: "glitch-r 0.4s step-start infinite",
          opacity: 0.8,
          clipPath: "inset(40% 0 40% 0)",
        }}
      >
        {text}
      </span>
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          color: "#00ff80",
          animation: "glitch-g 0.4s step-start infinite",
          opacity: 0.8,
          clipPath: "inset(10% 0 60% 0)",
        }}
      >
        {text}
      </span>
      <span style={{ color: "#00ffff" }}>{text}</span>
    </span>
  );
}

function GoldEffectText({ text }: { text: string }) {
  return (
    <span
      style={{
        background:
          "linear-gradient(90deg, #b8860b 0%, #ffd700 30%, #fffacd 55%, #ffd700 75%, #b8860b 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        fontWeight: "bold",
        animation: "gold-shine 2.5s linear infinite",
        backgroundSize: "200% 100%",
      }}
    >
      {text}
    </span>
  );
}

function CyberpunkEffectText({ text }: { text: string }) {
  return (
    <span
      style={{
        fontWeight: "bold",
        animation: "cyberpunk-flicker 0.6s step-start infinite",
        textShadow: "0 0 8px #ff00aa, 0 0 16px #ff00aa",
        color: "#ff00aa",
        fontFamily: "Courier New, monospace",
      }}
    >
      {text}
    </span>
  );
}

function ShadowEffectText({ text }: { text: string }) {
  return (
    <span
      style={{
        color: "#c0a8d0",
        fontWeight: "bold",
        textShadow:
          "2px 2px 8px #330033, -2px 2px 6px #220022, 0 0 20px rgba(100,0,100,0.6)",
        animation: "shadow-wisp 2s ease-in-out infinite",
        fontFamily: "Tahoma, sans-serif",
      }}
    >
      {text}
    </span>
  );
}

// ─── Effect styles for username text colour ──────────────────────────────────

function getEffectStyle(effect: UsernameEffect): React.CSSProperties {
  switch (effect) {
    case "Rainbow":
      return {
        background: "linear-gradient(90deg,#f00,#f80,#ff0,#0f0,#00f,#80f)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        fontWeight: "bold",
      };
    case "MatrixGreen":
      return {
        color: "#00ff41",
        fontFamily: "Courier New,monospace",
        textShadow: "0 0 8px #00ff41",
        fontWeight: "bold",
      };
    case "MatrixRed":
      return {
        color: "#ff4141",
        fontFamily: "Courier New,monospace",
        textShadow: "0 0 8px #ff0000",
        fontWeight: "bold",
      };
    case "MatrixBlue":
      return {
        color: "#41b0ff",
        fontFamily: "Courier New,monospace",
        textShadow: "0 0 8px #0080ff",
        fontWeight: "bold",
      };
    case "Neon":
      return {
        color: "#ff00ff",
        textShadow: "0 0 6px #ff00ff, 0 0 12px #ff00ff",
        fontWeight: "bold",
      };
    default:
      return {};
  }
}

// Returns true for effects that use a custom React component rather than CSS style
function isComplexEffect(effect: UsernameEffect): boolean {
  return ["Fire", "Ice", "Glitch", "Gold", "Cyberpunk", "Shadow"].includes(
    effect,
  );
}

// ─── Username badge ──────────────────────────────────────────────────────────

function UsernameBadge({
  username,
  effect,
  plate,
}: { username: string; effect: UsernameEffect; plate?: TextPlate }) {
  const hasPlate = plate && plate !== "None";
  const isMatrixEffect =
    effect === "MatrixGreen" ||
    effect === "MatrixRed" ||
    effect === "MatrixBlue";
  const complex = isComplexEffect(effect);

  // No plate — just text effect (including complex animated effects)
  if (!hasPlate && !isMatrixEffect) {
    if (complex) {
      return renderComplexEffect(effect, username);
    }
    return <span style={getEffectStyle(effect)}>{username}</span>;
  }

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        padding: "0 4px",
        borderRadius: 2,
        overflow: "hidden",
        lineHeight: "18px",
        height: 18,
        minWidth: 50,
      }}
    >
      {hasPlate ? (
        <TextPlateBg plate={plate} width={130} height={18} />
      ) : (
        <MatrixRainBg
          color={MATRIX_PLATE_COLORS[effect as TextPlate] ?? "#00ff41"}
          width={130}
          height={18}
        />
      )}
      <span
        style={{
          position: "relative",
          zIndex: 1,
          ...(!complex ? getEffectStyle(effect) : {}),
        }}
      >
        {complex ? renderComplexEffect(effect, username) : username}
      </span>
    </span>
  );
}

function renderComplexEffect(effect: UsernameEffect, text: string) {
  switch (effect) {
    case "Fire":
      return <FireEffectText text={text} />;
    case "Ice":
      return <IceEffectText text={text} />;
    case "Glitch":
      return <GlitchEffectText text={text} />;
    case "Gold":
      return <GoldEffectText text={text} />;
    case "Cyberpunk":
      return <CyberpunkEffectText text={text} />;
    case "Shadow":
      return <ShadowEffectText text={text} />;
    default:
      return <span>{text}</span>;
  }
}

// ─── Main component ──────────────────────────────────────────────────────────

export function LiveChat({ user, userStore }: Props) {
  const [messages, setMessages] = useState<Message[]>(() => loadMessages());
  const [input, setInput] = useState("");
  const [localUser, setLocalUser] = useState<User>(user);
  const [pendingEffects, setPendingEffects] = useState<
    Record<string, UsernameEffect>
  >({});
  const [pendingPlates, setPendingPlates] = useState<Record<string, TextPlate>>(
    {},
  );
  const [applyFeedback, setApplyFeedback] = useState<Record<string, boolean>>(
    {},
  );
  const [applyPlateFeedback, setApplyPlateFeedback] = useState<
    Record<string, boolean>
  >({});
  const [selfEffect, setSelfEffect] = useState<UsernameEffect>(
    user.usernameEffect,
  );
  const [selfFeedback, setSelfFeedback] = useState(false);
  const [selfPlate, setSelfPlate] = useState<TextPlate>(
    user.textPlate ?? "None",
  );
  const [plateFeedback, setPlateFeedback] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isOwner = localUser.role === "Owner";
  const isPrivileged = localUser.role === "Owner" || localUser.role === "Admin";

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setMessages(loadMessages());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setMessages(loadMessages()), 2000);
    return () => clearInterval(id);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: messages triggers scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const msg: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      from: localUser.username,
      text,
      time: Date.now(),
      effect: localUser.usernameEffect,
      textPlate: localUser.textPlate ?? "None",
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

  const applyEffect = (targetUsername: string) => {
    const effect = pendingEffects[targetUsername] ?? "None";
    const entry = userStore.get(targetUsername);
    if (!entry) return;
    entry.user = { ...entry.user, usernameEffect: effect };
    persistUserField(targetUsername, { usernameEffect: effect });
    setApplyFeedback((prev) => ({ ...prev, [targetUsername]: true }));
    setTimeout(
      () => setApplyFeedback((prev) => ({ ...prev, [targetUsername]: false })),
      1500,
    );
  };

  const applyPlateForUser = (targetUsername: string) => {
    const plate = pendingPlates[targetUsername] ?? "None";
    const entry = userStore.get(targetUsername);
    if (!entry) return;
    entry.user = { ...entry.user, textPlate: plate };
    persistUserField(targetUsername, { textPlate: plate });
    setApplyPlateFeedback((prev) => ({ ...prev, [targetUsername]: true }));
    setTimeout(
      () =>
        setApplyPlateFeedback((prev) => ({ ...prev, [targetUsername]: false })),
      1500,
    );
  };

  const owners = [...userStore.values()].filter((e) => e.user.role === "Owner");
  const admins = [...userStore.values()].filter((e) => e.user.role === "Admin");
  const users = [...userStore.values()].filter((e) => e.user.role === "User");

  const renderUserRow = (
    e: { username: string; password: string; user: User },
    sectionColor: string,
  ) => {
    const canOwnerSet = isOwner && e.user.username !== localUser.username;
    return (
      <div
        key={e.user.id}
        style={{
          padding: "3px 4px",
          fontSize: 11,
          borderBottom: "1px solid #d0d0d0",
          background: "#c8c8c8",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginBottom: canOwnerSet ? 3 : 0,
          }}
        >
          <span
            style={{ fontSize: 8, color: e.user.isOnline ? "#008000" : "#800" }}
          >
            ●
          </span>
          <UsernameBadge
            username={e.user.username}
            effect={e.user.usernameEffect}
            plate={e.user.textPlate ?? "None"}
          />
          {e.user.role !== "User" && (
            <span
              style={{
                fontSize: 8,
                background: sectionColor,
                color: "#fff",
                padding: "0 3px",
                borderRadius: 2,
                marginLeft: "auto",
              }}
            >
              {e.user.role}
            </span>
          )}
        </div>
        {canOwnerSet && (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
              <select
                data-ocid={`livechat.effect_select.${e.user.username}`}
                value={pendingEffects[e.user.username] ?? e.user.usernameEffect}
                onChange={(ev) =>
                  setPendingEffects((prev) => ({
                    ...prev,
                    [e.user.username]: ev.target.value as UsernameEffect,
                  }))
                }
                style={{
                  flex: 1,
                  fontSize: 9,
                  fontFamily: "Tahoma, sans-serif",
                  border: "1px solid #808080",
                  background: "#fff",
                  padding: "1px 2px",
                }}
              >
                {EFFECT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {EFFECT_LABELS[opt]}
                  </option>
                ))}
              </select>
              <button
                type="button"
                data-ocid={`livechat.apply_effect_button.${e.user.username}`}
                className="btn-95"
                onClick={() => applyEffect(e.user.username)}
                style={{
                  fontSize: 9,
                  padding: "1px 4px",
                  whiteSpace: "nowrap",
                }}
              >
                {applyFeedback[e.user.username] ? "✓" : "FX"}
              </button>
            </div>
            <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
              <select
                data-ocid={`livechat.plate_select.${e.user.username}`}
                value={
                  pendingPlates[e.user.username] ?? e.user.textPlate ?? "None"
                }
                onChange={(ev) =>
                  setPendingPlates((prev) => ({
                    ...prev,
                    [e.user.username]: ev.target.value as TextPlate,
                  }))
                }
                style={{
                  flex: 1,
                  fontSize: 9,
                  fontFamily: "Tahoma, sans-serif",
                  border: "1px solid #808080",
                  background: "#fff",
                  padding: "1px 2px",
                }}
              >
                {TEXT_PLATE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {TEXT_PLATE_LABELS[opt]}
                  </option>
                ))}
              </select>
              <button
                type="button"
                data-ocid={`livechat.apply_plate_button.${e.user.username}`}
                className="btn-95"
                onClick={() => applyPlateForUser(e.user.username)}
                style={{
                  fontSize: 9,
                  padding: "1px 4px",
                  whiteSpace: "nowrap",
                }}
              >
                {applyPlateFeedback[e.user.username] ? "✓" : "🎨"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPrivilegedControls = () => (
    <div
      style={{
        padding: 4,
        background: "#000080",
        borderBottom: "2px solid #808080",
      }}
    >
      <div
        style={{
          color: "#fff",
          fontSize: 9,
          marginBottom: 2,
          fontWeight: "bold",
        }}
      >
        ✨ Username effect:
      </div>
      <div
        style={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <select
          data-ocid="livechat.self_effect_select"
          value={selfEffect}
          onChange={(ev) => setSelfEffect(ev.target.value as UsernameEffect)}
          style={{
            flex: 1,
            fontSize: 9,
            fontFamily: "Tahoma, sans-serif",
            border: "1px solid #606060",
            background: "#fff",
            padding: "1px 2px",
          }}
        >
          {EFFECT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {EFFECT_LABELS[opt]}
            </option>
          ))}
        </select>
        <button
          type="button"
          data-ocid="livechat.apply_self_effect_button"
          className="btn-95"
          onClick={applyOwnEffect}
          style={{
            fontSize: 9,
            padding: "1px 4px",
            whiteSpace: "nowrap",
            background: selfFeedback ? "#ccffcc" : undefined,
          }}
        >
          {selfFeedback ? "✓" : "Apply"}
        </button>
      </div>
      <div
        style={{
          color: "#ffe680",
          fontSize: 9,
          marginBottom: 2,
          fontWeight: "bold",
        }}
      >
        🎨 Text plate:
      </div>
      <div
        style={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <select
          data-ocid="livechat.self_plate_select"
          value={selfPlate}
          onChange={(ev) => setSelfPlate(ev.target.value as TextPlate)}
          style={{
            flex: 1,
            fontSize: 9,
            fontFamily: "Tahoma, sans-serif",
            border: "1px solid #606060",
            background: "#fff",
            padding: "1px 2px",
          }}
        >
          {TEXT_PLATE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {TEXT_PLATE_LABELS[opt]}
            </option>
          ))}
        </select>
        <button
          type="button"
          data-ocid="livechat.apply_plate_button"
          className="btn-95"
          onClick={applyOwnPlate}
          style={{
            fontSize: 9,
            padding: "1px 4px",
            whiteSpace: "nowrap",
            background: plateFeedback ? "#ccffcc" : undefined,
          }}
        >
          {plateFeedback ? "✓" : "Apply"}
        </button>
      </div>
      <div style={{ marginTop: 2, minHeight: 22 }}>
        <UsernameBadge
          username={localUser.username}
          effect={selfEffect}
          plate={selfPlate}
        />
      </div>
    </div>
  );

  // Non-privileged users get just an effect picker (no plates)
  const renderUserEffectControl = () => (
    <div
      style={{
        padding: 4,
        background: "#404080",
        borderBottom: "2px solid #808080",
      }}
    >
      <div
        style={{
          color: "#aad4ff",
          fontSize: 9,
          marginBottom: 2,
          fontWeight: "bold",
        }}
      >
        ✨ Your effect:
      </div>
      <div
        style={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <select
          data-ocid="livechat.self_effect_select"
          value={selfEffect}
          onChange={(ev) => setSelfEffect(ev.target.value as UsernameEffect)}
          style={{
            flex: 1,
            fontSize: 9,
            fontFamily: "Tahoma, sans-serif",
            border: "1px solid #606060",
            background: "#fff",
            padding: "1px 2px",
          }}
        >
          {EFFECT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {EFFECT_LABELS[opt]}
            </option>
          ))}
        </select>
        <button
          type="button"
          data-ocid="livechat.apply_self_effect_button"
          className="btn-95"
          onClick={applyOwnEffect}
          style={{
            fontSize: 9,
            padding: "1px 4px",
            whiteSpace: "nowrap",
            background: selfFeedback ? "#ccffcc" : undefined,
          }}
        >
          {selfFeedback ? "✓" : "Apply"}
        </button>
      </div>
      <div style={{ marginTop: 2, minHeight: 22 }}>
        <UsernameBadge
          username={localUser.username}
          effect={selfEffect}
          plate={selfPlate}
        />
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        fontFamily: "Tahoma, Verdana, sans-serif",
        fontSize: 11,
      }}
    >
      <style>{`
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
      `}</style>

      {/* Chat area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid #808080",
        }}
      >
        <div
          data-ocid="livechat.messages_panel"
          style={{
            flex: 1,
            overflow: "auto",
            background: "#fff",
            padding: 6,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={msg.id}
              data-ocid={`livechat.message.${i + 1}`}
              style={{ display: "flex", gap: 4, alignItems: "baseline" }}
            >
              <span style={{ fontSize: 9, color: "#888", flexShrink: 0 }}>
                {new Date(msg.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <UsernameBadge
                username={`${msg.from}:`}
                effect={msg.effect}
                plate={msg.textPlate ?? "None"}
              />
              <span style={{ color: "#000", wordBreak: "break-word" }}>
                {msg.text}
              </span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div
          style={{
            padding: 4,
            display: "flex",
            gap: 4,
            borderTop: "1px solid #808080",
            background: "#c0c0c0",
          }}
        >
          <input
            data-ocid="livechat.message_input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="text-input-95"
            style={{ flex: 1, boxSizing: "border-box" }}
            placeholder="Type a message..."
            maxLength={500}
          />
          <button
            type="button"
            data-ocid="livechat.send_button"
            className="btn-95"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>

      {/* User list sidebar */}
      <div
        style={{
          width: isOwner ? 170 : 155,
          background: "#c0c0c0",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        {isPrivileged ? renderPrivilegedControls() : renderUserEffectControl()}
        {isOwner && (
          <div
            style={{
              padding: "2px 4px",
              fontSize: 9,
              background: "#800080",
              color: "#fff",
              fontStyle: "italic",
            }}
          >
            👑 Owner: set effects on others below
          </div>
        )}
        {[
          { label: "Owners", list: owners, color: "#800080" },
          { label: "Admins", list: admins, color: "#000080" },
          { label: "Users", list: users, color: "#004000" },
        ].map(({ label, list, color }) => (
          <div key={label} style={{ marginBottom: 4 }}>
            <div
              style={{
                background: color,
                color: "#fff",
                padding: "2px 4px",
                fontSize: 10,
                fontWeight: "bold",
              }}
            >
              {label} ({list.length})
            </div>
            {list.map((e) => renderUserRow(e, color))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function persistUserField(username: string, fields: Partial<User>): void {
  try {
    const raw = localStorage.getItem("onyxos_users");
    if (!raw) return;
    const users = JSON.parse(raw) as Record<string, { user: User }>;
    if (users[username]) {
      users[username].user = { ...users[username].user, ...fields };
      localStorage.setItem("onyxos_users", JSON.stringify(users));
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "onyxos_users",
          newValue: JSON.stringify(users),
          storageArea: localStorage,
        }),
      );
    }
  } catch {
    /* noop */
  }
}
