const NODES = [
  { label: "NORTHPEAK", angle: -90, size: 76 },
  { label: "VELA", angle: -30, size: 64 },
  { label: "ORBIT&CO", angle: 30, size: 72 },
  { label: "ATLAS", angle: 90, size: 64 },
  { label: "FLUX", angle: 150, size: 68 },
  { label: "MONARCH", angle: 210, size: 72 },
];

const RADIUS = 42;

function position(angle: number) {
  const rad = (angle * Math.PI) / 180;
  const x = 50 + RADIUS * Math.cos(rad);
  const y = 50 + RADIUS * Math.sin(rad);
  return { x, y };
}

export default function HeroOrbit() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      <div className="absolute inset-0 rounded-full border border-white/10" />
      <div className="absolute inset-[10%] rounded-full border border-dashed border-white/10 animate-spin-slow" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {NODES.map((node) => {
          const { x, y } = position(node.angle);
          return (
            <line
              key={node.label}
              x1="50"
              y1="50"
              x2={x}
              y2={y}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="0.3"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {/* Center panel */}
      <div className="absolute left-1/2 top-1/2 flex h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-accent/60 bg-black text-center shadow-[0_0_80px_-10px_rgba(229,67,67,0.35)]">
        <div className="absolute inset-0 rounded-full animate-pulse-ring" />
        <span className="font-display text-[10px] tracking-[0.3em] text-accent sm:text-xs">
          ELEVATE
        </span>
        <h1 className="mt-3 px-6 font-display text-2xl leading-[0.95] text-white sm:text-3xl md:text-4xl">
          WE MAKE
          <br />
          YOU <span className="text-accent">UNMISSABLE</span>
        </h1>
      </div>

      {/* Orbiting nodes */}
      {NODES.map((node, i) => {
        const { x, y } = position(node.angle);
        return (
          <div
            key={node.label}
            className="animate-bob absolute flex items-center justify-center rounded-full border border-white/15 bg-black/80 backdrop-blur-sm"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: node.size,
              height: node.size,
              transform: "translate(-50%, -50%)",
              animationDelay: `${i * 0.6}s`,
            }}
          >
            <span className="px-2 text-center font-display text-[9px] leading-tight tracking-wide text-white/70 sm:text-[10px]">
              {node.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
