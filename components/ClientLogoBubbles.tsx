import Image from "next/image";

type Bubble = {
  name: string;
  src: string;
  size: number;
  duration: number;
  delay: number;
  style: { top?: string; bottom?: string; left?: string; right?: string };
};

const BUBBLES: Bubble[] = [
  {
    name: "Smoky'z Grill",
    src: "/clients/smokyz.png",
    size: 64,
    duration: 7,
    delay: 0,
    style: { top: "-6%", left: "-14%" },
  },
  {
    name: "OGZ",
    src: "/clients/ogz.png",
    size: 58,
    duration: 8,
    delay: 0.5,
    style: { top: "2%", right: "-16%" },
  },
  {
    name: "Manjaros Restaurant",
    src: "/clients/manjaros.png",
    size: 60,
    duration: 6.5,
    delay: 1,
    style: { bottom: "8%", left: "-18%" },
  },
  {
    name: "Savouries by Sara",
    src: "/clients/savouries-by-sara.png",
    size: 56,
    duration: 7.5,
    delay: 1.5,
    style: { bottom: "-8%", right: "-10%" },
  },
];

export default function ClientLogoBubbles() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      {BUBBLES.map((bubble, i) => (
        <div
          key={bubble.name}
          className="animate-drift absolute"
          style={{
            ...bubble.style,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
          }}
        >
          <div
            className="animate-pop-in overflow-hidden rounded-full border-2 border-accent/70 bg-black shadow-[0_0_30px_-8px_rgba(229,67,67,0.6)]"
            style={{
              width: bubble.size,
              height: bubble.size,
              animationDelay: `${0.4 + i * 0.25}s`,
            }}
          >
            <Image
              src={bubble.src}
              alt={bubble.name}
              width={bubble.size}
              height={bubble.size}
              className="h-full w-full object-contain p-2"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
