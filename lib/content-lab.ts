// Content Idea Database engine: turns a pasted reference video into a
// Zezu-ready concept (hook, shot list, on-screen captions, CTA), classified
// by funnel stage, and rolls saved ideas up into a pattern breakdown.

export type FunnelStage = "TOFU" | "MOFU" | "BOFU";

export type PillarId =
  | "dish-reveal"
  | "process-asmr"
  | "pov-order"
  | "price-value"
  | "comparison-ranking"
  | "staff-personality"
  | "limited-drop"
  | "myth-bust";

export type HookStyleId =
  | "pov"
  | "visual-payoff"
  | "controversial-claim"
  | "numbered-list"
  | "price-shock"
  | "sound-led"
  | "question";

export type CtaTypeId =
  | "follow"
  | "save"
  | "comment"
  | "tag-friend"
  | "order-now"
  | "book-now";

export type ShotListItem = {
  shot: number;
  type: string;
  durationSec: string;
  direction: string;
  onScreenCaption: string;
  audioNote: string;
};

export type ViralCheck = { label: string; met: boolean };

export type GeneratedConcept = {
  pillar: PillarId;
  hookStyle: HookStyleId;
  funnelStage: FunnelStage;
  hook: string;
  shotList: ShotListItem[];
  cta: string;
  viralChecklist: ViralCheck[];
};

export type SavedIdea = {
  id: string;
  reference: string;
  platform: "TikTok" | "Instagram Reels" | "YouTube Shorts" | "Other";
  pillar: PillarId;
  hookStyle: HookStyleId;
  funnelStage: FunnelStage;
  ctaType: CtaTypeId;
  notes: string;
  createdAt: number;
};

export const PILLARS: { id: PillarId; label: string; blurb: string }[] = [
  {
    id: "dish-reveal",
    label: "Dish Reveal",
    blurb: "One hero dish, shot for maximum craveability.",
  },
  {
    id: "process-asmr",
    label: "Process / ASMR",
    blurb: "Wok sizzle, pours, folds — satisfying no-dialogue craft shots.",
  },
  {
    id: "pov-order",
    label: "POV Order",
    blurb: "\"Come order with me\" — handheld, first-person, real-time.",
  },
  {
    id: "price-value",
    label: "Price / Value",
    blurb: "\"How much for this much food\" — value-led curiosity.",
  },
  {
    id: "comparison-ranking",
    label: "Comparison / Ranking",
    blurb: "Rating dishes or ranking against other spots — built-in debate.",
  },
  {
    id: "staff-personality",
    label: "Staff / Personality",
    blurb: "Chef or team personality, day-in-the-life, behind the pass.",
  },
  {
    id: "limited-drop",
    label: "Limited Drop",
    blurb: "New menu item or time-limited offer — urgency-led.",
  },
  {
    id: "myth-bust",
    label: "Myth-Bust / Educational",
    blurb: "\"You've been ordering it wrong\" — teaches while it sells.",
  },
];

export const HOOK_STYLES: { id: HookStyleId; label: string; blurb: string }[] = [
  { id: "pov", label: "POV", blurb: "Drops the viewer straight into the moment." },
  {
    id: "visual-payoff",
    label: "Visual Payoff",
    blurb: "\"Wait for it\" — withholds the reveal to the last second.",
  },
  {
    id: "controversial-claim",
    label: "Controversial Claim",
    blurb: "A bold, slightly argument-starting statement.",
  },
  { id: "numbered-list", label: "Numbered List", blurb: "\"3 things you need to try before...\"" },
  { id: "price-shock", label: "Price Shock", blurb: "Leads with a number — cost, portion, or deal." },
  { id: "sound-led", label: "Sound-Led", blurb: "No words — the sizzle/pour/crunch is the hook." },
  { id: "question", label: "Direct Question", blurb: "Asks something the viewer wants answered." },
];

export const FUNNEL_INFO: Record<
  FunnelStage,
  { label: string; goal: string; description: string }
> = {
  TOFU: {
    label: "TOFU — Top of Funnel",
    goal: "Reach new eyes",
    description:
      "Entertainment-first, low brand friction. Job is pure reach and shareability — not every TOFU video needs to sell anything.",
  },
  MOFU: {
    label: "MOFU — Middle of Funnel",
    goal: "Build desire & trust",
    description:
      "Shows the product, the quality, the value. Moves someone from \"that looks good\" to \"I want that.\"",
  },
  BOFU: {
    label: "BOFU — Bottom of Funnel",
    goal: "Drive the order / booking",
    description:
      "Direct offer, clear CTA, urgency. Spends the trust built by TOFU/MOFU content to convert right now.",
  },
};

const PILLAR_DEFAULT_FUNNEL: Record<PillarId, FunnelStage> = {
  "dish-reveal": "MOFU",
  "process-asmr": "TOFU",
  "pov-order": "MOFU",
  "price-value": "MOFU",
  "comparison-ranking": "TOFU",
  "staff-personality": "TOFU",
  "limited-drop": "BOFU",
  "myth-bust": "TOFU",
};

export function suggestPillar(text: string): PillarId {
  const t = text.toLowerCase();
  if (/(wok|sizzl|pour|fold|dough|knife|hand[- ]?pull|asmr)/.test(t)) return "process-asmr";
  if (/(£|\$|price|cost|how much|value|portion)/.test(t)) return "price-value";
  if (/(vs|versus|compare|rank|rating|best in|which is better)/.test(t)) return "comparison-ranking";
  if (/(pov|order with me|come order|queue|counter)/.test(t)) return "pov-order";
  if (/(chef|staff|team|day in the life|behind the pass|owner)/.test(t)) return "staff-personality";
  if (/(new menu|limited|drop|only today|back by|launch)/.test(t)) return "limited-drop";
  if (/(myth|wrong|actually|didn't know|most people)/.test(t)) return "myth-bust";
  return "dish-reveal";
}

export function suggestHookStyle(text: string): HookStyleId {
  const t = text.toLowerCase();
  if (/^pov[:\s]/.test(t) || t.includes("pov")) return "pov";
  if (/(£|\$|cost|price|how much)/.test(t)) return "price-shock";
  if (/(top \d|\d things|\d dishes|\d reasons)/.test(t)) return "numbered-list";
  if (/(wrong|myth|actually|unpopular|controvers)/.test(t)) return "controversial-claim";
  if (/\?\s*$/.test(text.trim())) return "question";
  if (/(wait for it|watch till the end|until the end)/.test(t)) return "visual-payoff";
  return "visual-payoff";
}

function hookLine(style: HookStyleId, dish: string, brand: string): string {
  const lines: Record<HookStyleId, string[]> = {
    pov: [
      `POV: you just found the best ${dish} in Leicester`,
      `POV: ${brand} hands you the ${dish} and your night is made`,
    ],
    "visual-payoff": [
      `Wait for the ${dish} reveal...`,
      `Nobody warned me the ${dish} looked like this`,
    ],
    "controversial-claim": [
      `You've been ordering Chinese food wrong — here's what to get instead`,
      `This is NOT what I expected from a Chinese restaurant in Leicester`,
    ],
    "numbered-list": [
      `3 dishes at ${brand} you need to try before everyone finds out`,
      `Rating every must-try dish at ${brand} so you don't have to`,
    ],
    "price-shock": [
      `This ${dish} costs less than your coffee order — here's what you get`,
      `How much food £10 gets you at ${brand}`,
    ],
    "sound-led": [
      `[No caption — let the sizzle of the ${dish} hit first]`,
      `[Open on sound: pour / crunch / sizzle of the ${dish}, text appears after 2s]`,
    ],
    question: [
      `Why is nobody talking about ${brand}'s ${dish}?`,
      `Is this the best ${dish} in Leicester?`,
    ],
  };
  return lines[style][0];
}

type ShotTemplateInput = { dish: string; brand: string };

function shotTemplates(pillar: PillarId, { dish, brand }: ShotTemplateInput): ShotListItem[] {
  const templates: Record<PillarId, ShotListItem[]> = {
    "dish-reveal": [
      { shot: 1, type: "Close-up / macro", durationSec: "0–2s", direction: `Hard cut straight to the ${dish}, steam or glaze visible, centre frame.`, onScreenCaption: `the ${dish} 🤤`, audioNote: "Trend audio starts on beat drop." },
      { shot: 2, type: "Slow-motion action", durationSec: "2–5s", direction: "Sauce pour, cheese pull, or fork lift in slow motion.", onScreenCaption: "wait for it...", audioNote: "Let natural sound peek through the music." },
      { shot: 3, type: "First bite / reaction", durationSec: "5–8s", direction: "Bite shot or genuine reaction cutaway.", onScreenCaption: "", audioNote: "Music continues." },
      { shot: 4, type: "Wide context shot", durationSec: "8–11s", direction: `Pull back to show the full plate / table setup at ${brand}.`, onScreenCaption: `only at ${brand}`, audioNote: "Music swells." },
      { shot: 5, type: "Text card / CTA", durationSec: "11–13s", direction: "End card with brand logo or handle.", onScreenCaption: "CTA goes here", audioNote: "Music tails out." },
    ],
    "process-asmr": [
      { shot: 1, type: "Macro, no cuts", durationSec: "0–3s", direction: `Wok flame / oil sizzle as the ${dish} hits the pan.`, onScreenCaption: "", audioNote: "Raw sound only — no music for first 3s." },
      { shot: 2, type: "Overhead static", durationSec: "3–7s", direction: "Toss, fold, or chop in one continuous take.", onScreenCaption: "", audioNote: "Raw sound continues, music fades in under it." },
      { shot: 3, type: "Macro detail", durationSec: "7–10s", direction: "Sauce coating, steam release, or garnish drop.", onScreenCaption: "", audioNote: "Music present, sound still audible." },
      { shot: 4, type: "Plate-up wide", durationSec: "10–13s", direction: `Final plate of the ${dish} set down.`, onScreenCaption: `${brand} doesn't cut corners`, audioNote: "Music peaks." },
      { shot: 5, type: "Text card / CTA", durationSec: "13–15s", direction: "Logo or handle end card.", onScreenCaption: "CTA goes here", audioNote: "Music tails out." },
    ],
    "pov-order": [
      { shot: 1, type: "POV handheld, walking in", durationSec: "0–3s", direction: `Phone-height POV entering ${brand}.`, onScreenCaption: `pov: you're ordering at ${brand}`, audioNote: "Trend audio from frame 1." },
      { shot: 2, type: "POV at counter", durationSec: "3–7s", direction: "Scanning the menu board or counter display.", onScreenCaption: "deciding what to get...", audioNote: "Music continues." },
      { shot: 3, type: "POV ordering", durationSec: "7–10s", direction: `Pointing at / ordering the ${dish}.`, onScreenCaption: `going with the ${dish}`, audioNote: "Natural sound peek optional." },
      { shot: 4, type: "Close-up handoff", durationSec: "10–13s", direction: "Food handed over / unboxed.", onScreenCaption: "", audioNote: "Music swells." },
      { shot: 5, type: "First bite + CTA card", durationSec: "13–16s", direction: "Bite reaction, cut to end card.", onScreenCaption: "CTA goes here", audioNote: "Music tails out." },
    ],
    "price-value": [
      { shot: 1, type: "Text card hook", durationSec: "0–2s", direction: "Bold on-screen number before any food is shown.", onScreenCaption: `how much food £10 gets you at ${brand}`, audioNote: "Trend audio starts immediately." },
      { shot: 2, type: "Wide reveal", durationSec: "2–6s", direction: `Full spread of what was bought, ${dish} included.`, onScreenCaption: "here's what I got", audioNote: "Music continues." },
      { shot: 3, type: "Itemised close-ups", durationSec: "6–11s", direction: "Quick cuts through each item with price overlay per cut.", onScreenCaption: `£x — ${dish}`, audioNote: "Cuts land on beat." },
      { shot: 4, type: "Verdict reaction", durationSec: "11–14s", direction: "Direct-to-camera or bite reaction giving the verdict.", onScreenCaption: "worth it? yes.", audioNote: "Music swells." },
      { shot: 5, type: "Text card / CTA", durationSec: "14–16s", direction: "Logo or handle end card.", onScreenCaption: "CTA goes here", audioNote: "Music tails out." },
    ],
    "comparison-ranking": [
      { shot: 1, type: "Text card hook", durationSec: "0–2s", direction: "Bold claim or ranking premise on screen.", onScreenCaption: `rating every ${dish} in Leicester`, audioNote: "Trend audio starts immediately." },
      { shot: 2, type: "Item 1", durationSec: "2–6s", direction: "Close-up + score overlay.", onScreenCaption: "spot 1 — 6/10", audioNote: "Cuts land on beat." },
      { shot: 3, type: "Item 2", durationSec: "6–10s", direction: "Close-up + score overlay.", onScreenCaption: "spot 2 — 7/10", audioNote: "Cuts land on beat." },
      { shot: 4, type: `${brand} reveal (highest score)`, durationSec: "10–14s", direction: `Close-up of ${brand}'s ${dish}, held longer than the rest.`, onScreenCaption: `${brand} — 9.5/10`, audioNote: "Music swells, beat drop lands here." },
      { shot: 5, type: "Text card / CTA", durationSec: "14–16s", direction: "Logo or handle end card.", onScreenCaption: "CTA goes here", audioNote: "Music tails out." },
    ],
    "staff-personality": [
      { shot: 1, type: "Talking head, handheld", durationSec: "0–3s", direction: "Staff/chef speaks straight to camera with energy.", onScreenCaption: `a day at ${brand}`, audioNote: "Voice leads, light music under." },
      { shot: 2, type: "Behind the pass", durationSec: "3–8s", direction: `Candid prep / cook footage of the ${dish}.`, onScreenCaption: "", audioNote: "Natural sound + music." },
      { shot: 3, type: "Personality beat", durationSec: "8–11s", direction: "Joke, reaction, or banter moment with the team.", onScreenCaption: "", audioNote: "Music continues." },
      { shot: 4, type: "Plate-up close", durationSec: "11–13s", direction: "Finished dish shot, proud hand-off.", onScreenCaption: `made with care at ${brand}`, audioNote: "Music swells." },
      { shot: 5, type: "Text card / CTA", durationSec: "13–15s", direction: "Logo or handle end card.", onScreenCaption: "CTA goes here", audioNote: "Music tails out." },
    ],
    "limited-drop": [
      { shot: 1, type: "Text card hook", durationSec: "0–2s", direction: "Urgency stated immediately — date or quantity limit.", onScreenCaption: `NEW at ${brand} — today only`, audioNote: "Trend audio starts immediately." },
      { shot: 2, type: "Close-up reveal", durationSec: "2–6s", direction: `First look at the ${dish}.`, onScreenCaption: `introducing the ${dish}`, audioNote: "Music continues." },
      { shot: 3, type: "Action / bite shot", durationSec: "6–10s", direction: "Bite or sauce pour, same energy as a dish reveal.", onScreenCaption: "", audioNote: "Music swells." },
      { shot: 4, type: "Urgency reminder", durationSec: "10–12s", direction: "Direct to camera or text restating the limit.", onScreenCaption: "while stock lasts", audioNote: "Music peaks." },
      { shot: 5, type: "Text card / CTA", durationSec: "12–14s", direction: "Logo, handle, and ordering link end card.", onScreenCaption: "CTA goes here", audioNote: "Music tails out." },
    ],
    "myth-bust": [
      { shot: 1, type: "Talking head or text card", durationSec: "0–3s", direction: "State the myth/mistake plainly.", onScreenCaption: "you've been ordering this wrong", audioNote: "Voice or trend audio leads." },
      { shot: 2, type: "Demonstration", durationSec: "3–8s", direction: `Show the \"wrong\" way vs the right way with the ${dish}.`, onScreenCaption: "here's why", audioNote: "Music under voice." },
      { shot: 3, type: "Payoff close-up", durationSec: "8–11s", direction: "The correct result, looking as good as possible.", onScreenCaption: "do this instead", audioNote: "Music swells." },
      { shot: 4, type: `Brand tie-in`, durationSec: "11–13s", direction: `Show it done properly at ${brand}.`, onScreenCaption: `this is how ${brand} does it`, audioNote: "Music continues." },
      { shot: 5, type: "Text card / CTA", durationSec: "13–15s", direction: "Logo or handle end card.", onScreenCaption: "CTA goes here", audioNote: "Music tails out." },
    ],
  };
  return templates[pillar];
}

const CTA_LIBRARY: Record<FunnelStage, Record<CtaTypeId, string[]>> = {
  TOFU: {
    follow: ["Follow for more Leicester food finds"],
    save: ["Save this before it leaves the menu"],
    comment: ["Comment your Leicester food recommendation 👇"],
    "tag-friend": ["Tag someone who needs to try this"],
    "order-now": ["Follow for more — link in bio when you're ready to order"],
    "book-now": ["Follow for more — book via link in bio"],
  },
  MOFU: {
    follow: ["Follow — new menu drops every week"],
    save: ["Save this for your next visit"],
    comment: ["Comment 'MENU' and we'll send the full menu"],
    "tag-friend": ["Tag the friend you're bringing next time"],
    "order-now": ["Save this — order link in bio"],
    "book-now": ["Save this — booking link in bio"],
  },
  BOFU: {
    follow: ["Follow so you don't miss the next drop"],
    save: ["Save it — gone once stock runs out"],
    comment: ["Comment 'YES' and we'll send the order link"],
    "tag-friend": ["Tag who's ordering this with you tonight"],
    "order-now": ["Order now — link in bio, today only"],
    "book-now": ["Table for 2 this weekend? Book via link in bio"],
  },
};

function viralChecklist(pillar: PillarId, hookStyle: HookStyleId): ViralCheck[] {
  return [
    { label: "Hook lands in the first 1–2 seconds, before any logo or intro", met: true },
    { label: "Single focal subject in frame 1 — no split attention", met: true },
    {
      label: "Has a visual or audio payoff moment (pour, bite, reveal, score)",
      met: ["visual-payoff", "sound-led", "price-shock"].includes(hookStyle) || pillar !== "staff-personality",
    },
    { label: "On-screen captions carry the story with sound off", met: true },
    { label: "Runs 9–16s — short enough to loop, long enough to land the payoff", met: true },
    {
      label: "Pattern interrupt or stakes (ranking, countdown, urgency, bold claim)",
      met: ["comparison-ranking", "limited-drop", "myth-bust"].includes(pillar) ||
        ["controversial-claim", "numbered-list"].includes(hookStyle),
    },
    { label: "CTA placed after the payoff, not before it", met: true },
  ];
}

export function generateConcept(
  pillar: PillarId,
  hookStyle: HookStyleId,
  funnelStage: FunnelStage,
  ctaType: CtaTypeId,
  dish: string,
  brand: string
): GeneratedConcept {
  const safeDish = dish.trim() || "signature dish";
  const safeBrand = brand.trim() || "Zezu";
  const ctaOptions = CTA_LIBRARY[funnelStage][ctaType];
  return {
    pillar,
    hookStyle,
    funnelStage,
    hook: hookLine(hookStyle, safeDish, safeBrand),
    shotList: shotTemplates(pillar, { dish: safeDish, brand: safeBrand }),
    cta: ctaOptions[0],
    viralChecklist: viralChecklist(pillar, hookStyle),
  };
}

export function defaultFunnelForPillar(pillar: PillarId): FunnelStage {
  return PILLAR_DEFAULT_FUNNEL[pillar];
}

export type BreakdownRow = { label: string; count: number; pct: number };

export type Breakdown = {
  total: number;
  byPillar: BreakdownRow[];
  byHookStyle: BreakdownRow[];
  byFunnel: BreakdownRow[];
  byCta: BreakdownRow[];
  topPattern: string | null;
};

function tally<T extends string>(
  ideas: SavedIdea[],
  key: keyof SavedIdea,
  labels: Record<T, string>
): BreakdownRow[] {
  const total = ideas.length || 1;
  const counts = new Map<string, number>();
  for (const idea of ideas) {
    const value = String(idea[key]);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([value, count]) => ({
      label: labels[value as T] ?? value,
      count,
      pct: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

export function buildBreakdown(ideas: SavedIdea[]): Breakdown {
  const pillarLabels = Object.fromEntries(PILLARS.map((p) => [p.id, p.label])) as Record<
    string,
    string
  >;
  const hookLabels = Object.fromEntries(HOOK_STYLES.map((h) => [h.id, h.label])) as Record<
    string,
    string
  >;
  const ctaLabels: Record<string, string> = {
    follow: "Follow",
    save: "Save",
    comment: "Comment keyword",
    "tag-friend": "Tag a friend",
    "order-now": "Order now",
    "book-now": "Book now",
  };
  const funnelLabels: Record<string, string> = {
    TOFU: "TOFU — reach",
    MOFU: "MOFU — desire",
    BOFU: "BOFU — convert",
  };

  const byPillar = tally(ideas, "pillar", pillarLabels);
  const byHookStyle = tally(ideas, "hookStyle", hookLabels);
  const byFunnel = tally(ideas, "funnelStage", funnelLabels);
  const byCta = tally(ideas, "ctaType", ctaLabels);

  const topPattern =
    ideas.length > 0 && byPillar[0] && byHookStyle[0]
      ? `${byPillar[0].label} + ${byHookStyle[0].label} hooks (${byPillar[0].pct}% / ${byHookStyle[0].pct}% of saved ideas)`
      : null;

  return { total: ideas.length, byPillar, byHookStyle, byFunnel, byCta, topPattern };
}
