"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildBreakdown,
  defaultCtaForFunnel,
  defaultFunnelForPillar,
  generateConcept,
  generateIdeaBank,
  styleStats,
  suggestHookStyle,
  suggestPillar,
  uid,
  PILLARS,
  HOOK_STYLES,
  FUNNEL_INFO,
  type CtaTypeId,
  type FunnelStage,
  type GeneratedConcept,
  type HookStyleId,
  type IdeaCard,
  type PillarId,
  type SavedIdea,
} from "@/lib/content-lab";

const STORAGE_KEY = "zezu-content-lab-ideas";
const BANKS_STORAGE_KEY = "zezu-content-lab-idea-banks";

const PLATFORMS = ["TikTok", "Instagram Reels", "YouTube Shorts", "Other"] as const;

const CTA_TYPES: { id: CtaTypeId; label: string }[] = [
  { id: "follow", label: "Follow" },
  { id: "save", label: "Save" },
  { id: "comment", label: "Comment keyword" },
  { id: "tag-friend", label: "Tag a friend" },
  { id: "order-now", label: "Order now" },
  { id: "book-now", label: "Book now" },
];

function badgeColor(stage: FunnelStage): string {
  if (stage === "TOFU") return "bg-sky-500/15 text-sky-300 border-sky-500/40";
  if (stage === "MOFU") return "bg-amber-500/15 text-amber-300 border-amber-500/40";
  return "bg-accent/15 text-accent border-accent/40";
}

export default function ContentLabTool() {
  const [ideas, setIdeas] = useState<SavedIdea[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SavedIdea[]) : [];
    } catch {
      return [];
    }
  });

  // Add-idea form state
  const [reference, setReference] = useState("");
  const [platform, setPlatform] = useState<(typeof PLATFORMS)[number]>("TikTok");
  const [pillar, setPillar] = useState<PillarId>("dish-reveal");
  const [hookStyle, setHookStyle] = useState<HookStyleId>("visual-payoff");
  const [funnelStage, setFunnelStage] = useState<FunnelStage>("MOFU");
  const [ctaType, setCtaType] = useState<CtaTypeId>("save");
  const [notes, setNotes] = useState("");

  // Generator state (shared dish/brand inputs + active idea)
  const [dish, setDish] = useState("bao buns");
  const [brand, setBrand] = useState("Zezu");
  const [activeIdeaId, setActiveIdeaId] = useState<string | null>(null);
  const [concept, setConcept] = useState<GeneratedConcept | null>(null);

  // 20-idea banks, keyed by content pillar
  const [ideaBanks, setIdeaBanks] = useState<Partial<Record<PillarId, IdeaCard[]>>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem(BANKS_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Partial<Record<PillarId, IdeaCard[]>>) : {};
    } catch {
      return {};
    }
  });
  const [openBanks, setOpenBanks] = useState<Set<PillarId>>(new Set());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
    } catch {
      // ignore unavailable storage (private mode, quota, etc.)
    }
  }, [ideas]);

  useEffect(() => {
    try {
      localStorage.setItem(BANKS_STORAGE_KEY, JSON.stringify(ideaBanks));
    } catch {
      // ignore unavailable storage (private mode, quota, etc.)
    }
  }, [ideaBanks]);

  function applySuggestions(text: string) {
    setReference(text);
    if (!text.trim()) return;
    const p = suggestPillar(text);
    const h = suggestHookStyle(text);
    setPillar(p);
    setHookStyle(h);
    setFunnelStage(defaultFunnelForPillar(p));
  }

  function addIdea(e: React.FormEvent) {
    e.preventDefault();
    if (!reference.trim()) return;
    const idea: SavedIdea = {
      id: uid(),
      reference: reference.trim(),
      platform,
      pillar,
      hookStyle,
      funnelStage,
      ctaType,
      notes: notes.trim(),
      createdAt: Date.now(),
    };
    setIdeas((prev) => [idea, ...prev]);
    setReference("");
    setNotes("");
  }

  function removeIdea(id: string) {
    setIdeas((prev) => prev.filter((i) => i.id !== id));
    if (activeIdeaId === id) {
      setActiveIdeaId(null);
      setConcept(null);
    }
  }

  function generateFor(idea: SavedIdea) {
    setActiveIdeaId(idea.id);
    setConcept(
      generateConcept(idea.pillar, idea.hookStyle, idea.funnelStage, idea.ctaType, dish, brand)
    );
  }

  function regenerate() {
    const idea = ideas.find((i) => i.id === activeIdeaId);
    if (!idea) return;
    setConcept(
      generateConcept(idea.pillar, idea.hookStyle, idea.funnelStage, idea.ctaType, dish, brand)
    );
  }

  const breakdown = useMemo(() => buildBreakdown(ideas), [ideas]);
  const stats = useMemo(() => styleStats(ideas), [ideas]);

  function generateBank(pillarId: PillarId) {
    const stage = defaultFunnelForPillar(pillarId);
    const bank = generateIdeaBank(
      pillarId,
      dish.split(","),
      brand,
      stage,
      defaultCtaForFunnel(stage),
      20
    );
    setIdeaBanks((prev) => ({ ...prev, [pillarId]: bank }));
    setOpenBanks((prev) => new Set(prev).add(pillarId));
  }

  function generateAllBanks() {
    const next: Partial<Record<PillarId, IdeaCard[]>> = { ...ideaBanks };
    const opened = new Set(openBanks);
    for (const stat of stats) {
      const stage = defaultFunnelForPillar(stat.pillar);
      next[stat.pillar] = generateIdeaBank(
        stat.pillar,
        dish.split(","),
        brand,
        stage,
        defaultCtaForFunnel(stage),
        20
      );
      opened.add(stat.pillar);
    }
    setIdeaBanks(next);
    setOpenBanks(opened);
  }

  function toggleBankOpen(pillarId: PillarId) {
    setOpenBanks((prev) => {
      const next = new Set(prev);
      if (next.has(pillarId)) next.delete(pillarId);
      else next.add(pillarId);
      return next;
    });
  }

  function toggleIdeaDone(pillarId: PillarId, itemId: string) {
    setIdeaBanks((prev) => {
      const bank = prev[pillarId];
      if (!bank) return prev;
      return {
        ...prev,
        [pillarId]: bank.map((item) =>
          item.id === itemId ? { ...item, done: !item.done } : item
        ),
      };
    });
  }

  return (
    <div className="space-y-20">
      {/* Add idea */}
      <section>
        <h2 className="font-display text-2xl text-white sm:text-3xl">
          1. Drop In A Reference Video
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-white/55">
          Paste the link (or describe it) and tag the pattern it&apos;s using. We&apos;ll
          suggest the content pillar, hook style, and funnel stage from your
          text — override anything that&apos;s wrong before saving.
        </p>

        <form
          onSubmit={addIdea}
          className="mt-6 rounded-2xl border border-accent/40 bg-black p-5 sm:p-6"
        >
          <label className="block text-xs font-display tracking-[0.15em] text-white/50">
            Reference link / description
          </label>
          <textarea
            value={reference}
            onChange={(e) => applySuggestions(e.target.value)}
            placeholder="https://www.tiktok.com/... or describe the video — e.g. 'POV ordering at a noodle bar, wait for the broth pour'"
            rows={2}
            className="mt-2 w-full resize-none rounded-lg border border-white/15 bg-white/5 p-3 text-sm text-white placeholder:text-white/35 focus:border-accent focus:outline-none"
          />

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-xs font-display tracking-[0.15em] text-white/50">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as (typeof PLATFORMS)[number])}
                className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 p-2.5 text-sm text-white focus:border-accent focus:outline-none"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p} className="bg-black">
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-display tracking-[0.15em] text-white/50">
                Content pillar
              </label>
              <select
                value={pillar}
                onChange={(e) => {
                  const p = e.target.value as PillarId;
                  setPillar(p);
                  setFunnelStage(defaultFunnelForPillar(p));
                }}
                className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 p-2.5 text-sm text-white focus:border-accent focus:outline-none"
              >
                {PILLARS.map((p) => (
                  <option key={p.id} value={p.id} className="bg-black">
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-display tracking-[0.15em] text-white/50">
                Hook style
              </label>
              <select
                value={hookStyle}
                onChange={(e) => setHookStyle(e.target.value as HookStyleId)}
                className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 p-2.5 text-sm text-white focus:border-accent focus:outline-none"
              >
                {HOOK_STYLES.map((h) => (
                  <option key={h.id} value={h.id} className="bg-black">
                    {h.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-display tracking-[0.15em] text-white/50">
                Funnel stage
              </label>
              <select
                value={funnelStage}
                onChange={(e) => setFunnelStage(e.target.value as FunnelStage)}
                className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 p-2.5 text-sm text-white focus:border-accent focus:outline-none"
              >
                {(["TOFU", "MOFU", "BOFU"] as FunnelStage[]).map((f) => (
                  <option key={f} value={f} className="bg-black">
                    {FUNNEL_INFO[f].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-display tracking-[0.15em] text-white/50">
                CTA used in the reference
              </label>
              <select
                value={ctaType}
                onChange={(e) => setCtaType(e.target.value as CtaTypeId)}
                className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 p-2.5 text-sm text-white focus:border-accent focus:outline-none"
              >
                {CTA_TYPES.map((c) => (
                  <option key={c.id} value={c.id} className="bg-black">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-display tracking-[0.15em] text-white/50">
                Notes (optional)
              </label>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Why this one caught your eye"
                className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 p-2.5 text-sm text-white placeholder:text-white/35 focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-accent to-[#b93232] px-7 py-3 font-display text-sm tracking-wide text-white shadow-[0_0_24px_-6px_rgba(229,67,67,0.7)] transition-all hover:scale-105 hover:brightness-110"
          >
            Save To Database
          </button>
        </form>
      </section>

      {/* Idea database */}
      <section>
        <h2 className="font-display text-2xl text-white sm:text-3xl">
          2. The Idea Database
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-white/55">
          Every reference you&apos;ve saved, tagged by pattern. Set the dish and
          brand name once, then generate a Zezu-ready concept from any idea.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-display tracking-[0.15em] text-white/50">
              Dish(es) to feature
            </label>
            <input
              value={dish}
              onChange={(e) => setDish(e.target.value)}
              placeholder="e.g. truffle fried rice, bao buns, dumplings"
              className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 p-2.5 text-sm text-white placeholder:text-white/35 focus:border-accent focus:outline-none"
            />
            <p className="mt-1.5 text-[11px] text-white/35">
              Comma-separate a few for more variety across the 20-idea banks below.
            </p>
          </div>
          <div>
            <label className="block text-xs font-display tracking-[0.15em] text-white/50">
              Brand name
            </label>
            <input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 p-2.5 text-sm text-white focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {ideas.length === 0 ? (
          <p className="mt-8 rounded-xl border border-dashed border-white/15 p-8 text-center text-sm text-white/40">
            No ideas saved yet — add your first reference above.
          </p>
        ) : (
          <div className="mt-6 space-y-3">
            {ideas.map((idea) => {
              const pillarLabel = PILLARS.find((p) => p.id === idea.pillar)?.label;
              const hookLabel = HOOK_STYLES.find((h) => h.id === idea.hookStyle)?.label;
              const isActive = activeIdeaId === idea.id;
              return (
                <div
                  key={idea.id}
                  className={`rounded-xl border bg-black p-4 transition-colors sm:p-5 ${
                    isActive ? "border-accent" : "border-white/10 hover:border-white/25"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-sm text-white/85">{idea.reference}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] text-white/60">
                          {idea.platform}
                        </span>
                        <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] text-white/60">
                          {pillarLabel}
                        </span>
                        <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] text-white/60">
                          {hookLabel} hook
                        </span>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[11px] ${badgeColor(
                            idea.funnelStage
                          )}`}
                        >
                          {idea.funnelStage}
                        </span>
                      </div>
                      {idea.notes && (
                        <p className="mt-2 text-xs text-white/40">{idea.notes}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => generateFor(idea)}
                        className="rounded-full border-2 border-accent px-4 py-2 font-display text-xs tracking-wide text-white transition-all hover:scale-105 hover:bg-accent/10"
                      >
                        Generate Remix
                      </button>
                      <button
                        type="button"
                        onClick={() => removeIdea(idea.id)}
                        aria-label="Remove idea"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/50 transition-colors hover:border-accent hover:text-accent"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Content styles that work */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl text-white sm:text-3xl">
              3. Content Styles That Work
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-white/55">
              The content pillars actually showing up across the references
              you&apos;ve saved, ranked by how often they appear. Generate 20
              fresh ideas for any of them so you&apos;ve got a range to pick from.
            </p>
          </div>
          {stats.length > 0 && (
            <button
              type="button"
              onClick={generateAllBanks}
              className="shrink-0 rounded-full bg-gradient-to-b from-accent to-[#b93232] px-6 py-2.5 font-display text-xs tracking-wide text-white shadow-[0_0_24px_-6px_rgba(229,67,67,0.7)] transition-all hover:scale-105 hover:brightness-110"
            >
              Generate 20 For Every Style
            </button>
          )}
        </div>

        {stats.length === 0 ? (
          <p className="mt-8 rounded-xl border border-dashed border-white/15 p-8 text-center text-sm text-white/40">
            Save a few reference ideas above — once there&apos;s a pattern, we&apos;ll
            tell you which styles are working.
          </p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {stats.map((stat) => (
              <div
                key={stat.pillar}
                className="flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-black p-5"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-lg text-white">{stat.label}</h3>
                    <span className="shrink-0 font-display text-xs text-accent">
                      {stat.pct}% of saved ideas
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-white/55">{stat.blurb}</p>
                </div>
                <button
                  type="button"
                  onClick={() => generateBank(stat.pillar)}
                  className="self-start rounded-full border-2 border-accent px-5 py-2 font-display text-xs tracking-wide text-white transition-all hover:scale-105 hover:bg-accent/10"
                >
                  {ideaBanks[stat.pillar] ? "Regenerate 20 Ideas" : "Generate 20 Ideas"}
                </button>
              </div>
            ))}
          </div>
        )}

        {stats
          .filter((stat) => ideaBanks[stat.pillar]?.length)
          .map((stat) => {
            const bank = ideaBanks[stat.pillar]!;
            const open = openBanks.has(stat.pillar);
            const doneCount = bank.filter((item) => item.done).length;
            return (
              <div key={stat.pillar} className="mt-8 rounded-2xl border border-white/10 p-5 sm:p-6">
                <button
                  type="button"
                  onClick={() => toggleBankOpen(stat.pillar)}
                  className="flex w-full items-center justify-between gap-3 text-left"
                >
                  <h3 className="font-display text-lg text-white">
                    {stat.label} — 20 Ideas
                  </h3>
                  <span className="flex items-center gap-3 text-xs text-white/50">
                    {doneCount}/{bank.length} done
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full border border-white/25 transition-transform ${
                        open ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </span>
                </button>

                {open && (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {bank.map((item) => (
                      <div
                        key={item.id}
                        className={`rounded-xl border p-4 transition-colors ${
                          item.done
                            ? "border-emerald-500/50 bg-emerald-500/5"
                            : "border-white/10 bg-black"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] text-white/50">
                              {HOOK_STYLES.find((h) => h.id === item.hookStyle)?.label}
                            </span>
                            <p
                              className={`mt-2 text-sm leading-snug ${
                                item.done ? "text-white/40 line-through" : "text-white"
                              }`}
                            >
                              &ldquo;{item.hook}&rdquo;
                            </p>
                            <p className="mt-1 text-xs text-white/35">{item.dish}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleIdeaDone(stat.pillar, item.id)}
                            aria-pressed={item.done}
                            aria-label={item.done ? "Mark as not done" : "Mark as done"}
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm transition-colors ${
                              item.done
                                ? "border-emerald-500 bg-emerald-500 text-black"
                                : "border-white/25 text-transparent hover:border-emerald-400"
                            }`}
                          >
                            ✓
                          </button>
                        </div>

                        <details className="mt-3">
                          <summary className="cursor-pointer text-xs text-white/50 hover:text-accent">
                            View shot list
                          </summary>
                          <div className="mt-2 space-y-1.5 text-xs leading-relaxed text-white/55">
                            {item.shotList.map((shot) => (
                              <p key={shot.shot}>
                                <span className="text-accent">{shot.shot}.</span>{" "}
                                {shot.type} ({shot.durationSec}) — {shot.direction}
                                {shot.onScreenCaption && (
                                  <span className="text-white"> &ldquo;{shot.onScreenCaption}&rdquo;</span>
                                )}
                              </p>
                            ))}
                            <p className="pt-1 text-white/70">
                              <span className="text-accent">CTA:</span> {item.cta}
                            </p>
                          </div>
                        </details>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </section>

      {/* Generated concept */}
      {concept && (
        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-2xl text-white sm:text-3xl">
              4. Zezu Remix Concept
            </h2>
            <button
              type="button"
              onClick={regenerate}
              className="rounded-full border-2 border-accent px-5 py-2 font-display text-xs tracking-wide text-white transition-all hover:scale-105 hover:bg-accent/10"
            >
              Regenerate
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-accent/40 bg-black p-5 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full border px-3 py-1 font-display text-[11px] tracking-[0.1em] ${badgeColor(
                  concept.funnelStage
                )}`}
              >
                {FUNNEL_INFO[concept.funnelStage].label}
              </span>
              <span className="text-xs text-white/40">
                {FUNNEL_INFO[concept.funnelStage].goal}
              </span>
            </div>

            <h3 className="mt-4 font-display text-xl text-white sm:text-2xl">
              Hook: <span className="text-accent">&ldquo;{concept.hook}&rdquo;</span>
            </h3>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-white/15 text-xs font-display tracking-[0.1em] text-white/50">
                    <th className="py-2 pr-4">#</th>
                    <th className="py-2 pr-4">Shot Type</th>
                    <th className="py-2 pr-4">Time</th>
                    <th className="py-2 pr-4">Direction</th>
                    <th className="py-2 pr-4">On-Screen Caption</th>
                    <th className="py-2">Audio</th>
                  </tr>
                </thead>
                <tbody>
                  {concept.shotList.map((shot) => (
                    <tr key={shot.shot} className="border-b border-white/5 align-top text-white/75">
                      <td className="py-3 pr-4 font-display text-accent">{shot.shot}</td>
                      <td className="py-3 pr-4 whitespace-nowrap">{shot.type}</td>
                      <td className="py-3 pr-4 whitespace-nowrap text-white/45">
                        {shot.durationSec}
                      </td>
                      <td className="py-3 pr-4">{shot.direction}</td>
                      <td className="py-3 pr-4 font-medium text-white">
                        {shot.onScreenCaption || <span className="text-white/25">—</span>}
                      </td>
                      <td className="py-3 text-white/45">{shot.audioNote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
              <span className="font-display text-xs tracking-[0.15em] text-accent">CTA</span>
              <p className="mt-1 text-sm text-white/85">{concept.cta}</p>
            </div>

            <div className="mt-8">
              <span className="font-display text-xs tracking-[0.15em] text-white/50">
                Why This Is Built To Perform
              </span>
              <p className="mt-2 text-xs text-white/40">
                These are the proven levers behind reach — nothing (including us)
                can literally guarantee a view count, but every one of these
                being true is what separates videos that take off from ones
                that don&apos;t.
              </p>
              <ul className="mt-4 space-y-2">
                {concept.viralChecklist.map((check) => (
                  <li key={check.label} className="flex items-start gap-2.5 text-sm">
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] ${
                        check.met
                          ? "bg-accent/20 text-accent"
                          : "bg-white/10 text-white/40"
                      }`}
                    >
                      {check.met ? "✓" : "—"}
                    </span>
                    <span className={check.met ? "text-white/80" : "text-white/40"}>
                      {check.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Breakdown */}
      <section>
        <h2 className="font-display text-2xl text-white sm:text-3xl">
          5. Pattern Breakdown
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-white/55">
          What&apos;s actually in common across every idea you&apos;ve saved — the
          deeper read on hook, pillar, and CTA patterns, not just one video
          at a time.
        </p>

        {ideas.length === 0 ? (
          <p className="mt-8 rounded-xl border border-dashed border-white/15 p-8 text-center text-sm text-white/40">
            Save at least one idea to see the breakdown.
          </p>
        ) : (
          <div className="mt-6 space-y-8">
            {breakdown.topPattern && (
              <div className="rounded-xl border border-accent/40 bg-accent/5 p-4">
                <span className="font-display text-xs tracking-[0.15em] text-accent">
                  Dominant Pattern
                </span>
                <p className="mt-1 text-sm text-white/85">{breakdown.topPattern}</p>
              </div>
            )}

            <div className="grid gap-8 sm:grid-cols-2">
              <BreakdownBlock title="By Content Pillar" rows={breakdown.byPillar} />
              <BreakdownBlock title="By Hook Style" rows={breakdown.byHookStyle} />
              <BreakdownBlock title="By Funnel Stage" rows={breakdown.byFunnel} />
              <BreakdownBlock title="By CTA" rows={breakdown.byCta} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function BreakdownBlock({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; count: number; pct: number }[];
}) {
  return (
    <div>
      <span className="font-display text-xs tracking-[0.15em] text-white/50">{title}</span>
      <div className="mt-3 space-y-3">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>{row.label}</span>
              <span>
                {row.count} · {row.pct}%
              </span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-[#b93232]"
                style={{ width: `${row.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
