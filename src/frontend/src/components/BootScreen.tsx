import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  onComplete: () => void;
}

export function BootScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"logo" | "loading" | "done">("logo");
  const audioCtxRef = useRef<AudioContext | null>(null);
  const hasPlayedRef = useRef(false);

  // Synthesize Windows 95-style startup chime using Web Audio API
  const playStartupChime = useCallback(() => {
    if (hasPlayedRef.current) return;
    hasPlayedRef.current = true;
    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const melody = [
        { freq: 261.63, start: 0.0, dur: 0.22, vol: 0.18 },
        { freq: 329.63, start: 0.18, dur: 0.22, vol: 0.18 },
        { freq: 392.0, start: 0.36, dur: 0.22, vol: 0.18 },
        { freq: 523.25, start: 0.54, dur: 0.42, vol: 0.2 },
        { freq: 659.25, start: 0.72, dur: 0.54, vol: 0.18 },
        { freq: 783.99, start: 0.9, dur: 0.72, vol: 0.16 },
      ];
      const harmony = [
        { freq: 329.63, start: 0.54, dur: 0.42, vol: 0.1 },
        { freq: 392.0, start: 0.54, dur: 0.42, vol: 0.1 },
        { freq: 523.25, start: 0.9, dur: 0.72, vol: 0.08 },
        { freq: 659.25, start: 0.9, dur: 0.72, vol: 0.06 },
      ];

      for (const note of [...melody, ...harmony]) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "triangle";
        osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.start);
        gain.gain.setValueAtTime(0, ctx.currentTime + note.start);
        gain.gain.linearRampToValueAtTime(
          note.vol,
          ctx.currentTime + note.start + 0.03,
        );
        gain.gain.setValueAtTime(
          note.vol,
          ctx.currentTime + note.start + note.dur - 0.08,
        );
        gain.gain.linearRampToValueAtTime(
          0,
          ctx.currentTime + note.start + note.dur,
        );
        osc.start(ctx.currentTime + note.start);
        osc.stop(ctx.currentTime + note.start + note.dur + 0.01);
      }
    } catch {
      /* AudioContext unavailable — silently skip */
    }
  }, []);

  useEffect(() => {
    const logoTimer = setTimeout(() => {
      setPhase("loading");
      playStartupChime();
    }, 800);
    return () => clearTimeout(logoTimer);
  }, [playStartupChime]);

  useEffect(() => {
    if (phase !== "loading") return;
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 8 + 2;
      if (current >= 100) {
        current = 100;
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setPhase("done");
          setTimeout(onComplete, 300);
        }, 400);
      } else {
        setProgress(Math.floor(current));
      }
    }, 80);
    return () => clearInterval(interval);
  }, [phase, onComplete]);

  return (
    <div
      data-ocid="boot.screen"
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        opacity: phase === "done" ? 0 : 1,
        transition: "opacity 0.3s ease",
      }}
    >
      {/* Onyx OS 95 Logo — uses the uploaded user image */}
      <div
        style={{
          marginBottom: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          filter: "drop-shadow(0 0 24px rgba(80,160,255,0.5))",
        }}
      >
        <img
          src="/assets/onyx-logo.png"
          alt="Onyx OS 95 Logo"
          width={160}
          height={160}
          style={{ imageRendering: "auto", objectFit: "contain" }}
        />
      </div>

      <div
        style={{
          color: "#c0c0c0",
          fontFamily: "Georgia, serif",
          fontSize: 24,
          fontWeight: "bold",
          letterSpacing: 2,
          marginBottom: 6,
          textShadow: "0 0 16px rgba(100,160,255,0.6)",
        }}
      >
        Onyx OS 95
      </div>
      <div
        style={{
          color: "#666",
          fontFamily: "Tahoma, Verdana, sans-serif",
          fontSize: 11,
          marginBottom: 36,
          letterSpacing: 1,
        }}
      >
        v1.0
      </div>

      {phase === "loading" && (
        <div style={{ width: 300 }}>
          <div
            style={{
              border: "2px solid",
              borderColor: "#222 #555 #555 #222",
              padding: 2,
              background: "#111",
            }}
          >
            <div
              data-ocid="boot.loading_bar"
              style={{
                height: 16,
                width: `${progress}%`,
                background:
                  "linear-gradient(180deg, #4080ff 0%, #1040c0 50%, #2060e8 100%)",
                transition: "width 0.08s linear",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
              }}
            />
          </div>
          <div
            style={{
              color: "#555",
              fontFamily: "Tahoma, sans-serif",
              fontSize: 10,
              marginTop: 6,
              textAlign: "center",
            }}
          >
            {progress < 100 ? "Loading Onyx OS 95..." : "Starting..."}
          </div>
        </div>
      )}
    </div>
  );
}
