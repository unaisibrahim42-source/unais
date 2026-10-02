import Image from "next/image";

type Bubble = {
  name: string;
  src: string;
  size: number;
  duration: number;
  delay: number;
  top: string;
  left: string;
};

// Positions are percentages of the whole hero section, kept well within
// 0-100 on every axis so bubbles never clip at the viewport edge.
const BUBBLES: Bubble[] = [
  { name: "Smoky'z Grill", src: "/clients/smokyz.png", size: 112, duration: 7, delay: 0, top: "6%", left: "56%" },
  { name: "OGZ", src: "/clients/ogz.png", size: 100, duration: 8, delay: 0.3, top: "4%", left: "86%" },
  { name: "Spicy Wok Express", src: "/clients/spicy-wok.png", size: 108, duration: 6.5, delay: 0.6, top: "38%", left: "92%" },
  { name: "Savouries by Sara", src: "/clients/savouries-by-sara.png", size: 96, duration: 7.5, delay: 0.9, top: "76%", left: "88%" },
  { name: "Billy's Boxing", src: "/clients/billys-boxing.png", size: 110, duration: 6.8, delay: 1.2, top: "86%", left: "64%" },
  { name: "Manjaros Restaurant", src: "/clients/manjaros.png", size: 100, duration: 7.2, delay: 1.5, top: "72%", left: "42%" },
  { name: "Smash & Grub", src: "/clients/smash-n-grub.png", size: 104, duration: 7.8, delay: 1.8, top: "56%", left: "50%" },
];

export default function ClientLogoBubbles() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      {BUBBLES.map((bubble, i) => (
        <div
          key={bubble.name}
          className="animate-drift absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            top: bubble.top,
            left: bubble.left,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
          }}
        >
          <div
            className="animate-pop-in"
            style={{ animationDelay: `${0.4 + i * 0.2}s` }}
          >
            <div
              className="pointer-events-auto overflow-hidden rounded-full border-[3px] border-accent bg-black shadow-[0_0_36px_-6px_rgba(229,67,67,0.75)] transition-transform duration-300 ease-out hover:scale-[1.15]"
              style={{ width: bubble.size, height: bubble.size }}
            >
              <Image
                src={bubble.src}
                alt={bubble.name}
                width={bubble.size}
                height={bubble.size}
                className="h-full w-full object-contain p-2.5"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
