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

function GrowthArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M12 3 L19 12 L14.5 12 L14.5 21 L9.5 21 L9.5 12 L5 12 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function HeroOrbit() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      <div className="absolute inset-0 rounded-full border border-white/10" />
      <div className="absolute inset-[10%] rounded-full border border-dashed border-white/10 animate-spin-slow" />

      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          {NODES.map((node, i) => {
            const { x, y } = position(node.angle);
            return (
              <linearGradient
                key={node.label}
                id={`orbit-line-${i}`}
                x1="50"
                y1="50"
                x2={x}
                y2={y}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#e54343" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#e54343" stopOpacity="0.08" />
              </linearGradient>
            );
          })}
        </defs>

        {NODES.map((node, i) => {
          const { x, y } = position(node.angle);
          return (
            <path
              key={node.label}
              id={`orbit-path-${i}`}
              d={`M50,50 L${x},${y}`}
              fill="none"
              stroke={`url(#orbit-line-${i})`}
              strokeWidth="0.35"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}

        {/* growth pulses flowing outward from the hub along each connector */}
        {NODES.map((node, i) => (
          <circle key={node.label} r="0.9" fill="#e54343">
            <animateMotion
              dur="2.8s"
              begin={`${i * 0.4}s`}
              repeatCount="indefinite"
              rotate="auto"
            >
              <mpath href={`#orbit-path-${i}`} />
            </animateMotion>
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.15;0.85;1"
              dur="2.8s"
              begin={`${i * 0.4}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>

      {/* Center panel */}
      <div className="absolute left-1/2 top-1/2 flex h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-accent/60 bg-black text-center shadow-[0_0_80px_-10px_rgba(229,67,67,0.35)]">
        <div className="absolute inset-0 rounded-full animate-pulse-ring" />
        <div className="flex items-center gap-1.5 text-accent">
          <GrowthArrow className="h-3 w-3" />
          <span className="font-display text-[10px] tracking-[0.3em] sm:text-xs">
            ELEVATE
          </span>
          <GrowthArrow className="h-3 w-3" />
        </div>
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
            className="animate-bob absolute flex flex-col items-center justify-center gap-1 rounded-full border border-white/15 bg-black/80 backdrop-blur-sm"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: node.size,
              height: node.size,
              transform: "translate(-50%, -50%)",
              animationDelay: `${i * 0.6}s`,
            }}
          >
            <GrowthArrow className="h-3 w-3 text-accent/80" />
            <span className="px-2 text-center font-display text-[9px] leading-tight tracking-wide text-white/70 sm:text-[10px]">
              {node.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
