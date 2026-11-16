/** OpenStreetMap embed — no API key needed. Swap for Mapbox/Google if you prefer. */
export function MapEmbed({ lat, lng, label }: { lat: number; lng: number; label: string }) {
  const d = 0.0032;
  const bbox = [lng - d * 1.6, lat - d, lng + d * 1.6, lat + d].join(",");
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-line sm:aspect-[21/9]">
      <iframe
        title={`Map showing ${label}`}
        src={src}
        loading="lazy"
        className="absolute inset-0 h-full w-full border-0 grayscale-[0.85] contrast-[0.95] sepia-[0.15]"
      />
      <a
        href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`}
        target="_blank"
        rel="noreferrer"
        className="absolute right-4 bottom-4 rounded-full bg-paper px-4 py-2 text-[10px] tracking-[0.2em] uppercase shadow-sm hover:bg-ink hover:text-paper"
      >
        Open map ↗
      </a>
    </div>
  );
}
