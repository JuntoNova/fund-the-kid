import { costPerKid, formatCurrency, listingProofRows, listingTrustBadges } from "./data/listings";
import { listingCardBadges } from "./data/cardBadges";
import type { Listing, TrustBadgeStyle } from "./data/listings";

export const SUBJECTS = [
  "STEM",
  "Literacy",
  "Civics",
  "Career pathways",
  "Early childhood",
  "Athletics",
  "Arts",
  "Tuition",
  "Therapy",
  "Tutoring",
  "Innovation",
];

const BADGE_STYLE: Record<TrustBadgeStyle, { bg: string; color: string }> = {
  entity: { bg: "#F6F1E8", color: "#2A3D55" },
  candid: { bg: "#F6E7B8", color: "#1a1a1a" },
  bbb: { bg: "#2A3D55", color: "#FFFFFF" },
  proof: { bg: "#8EC4E4", color: "#1a1a1a" },
  ein: { bg: "#C5DCCE", color: "#2A3D55" },
  self: { bg: "#F3C6D4", color: "#2A3D55" },
  example: { bg: "transparent", color: "#8a94a0" },
  money: { bg: "#e8f4fb", color: "#2A3D55" },
  work: { bg: "#C5DCCE", color: "#2A3D55" },
};

export function TrustBadgeRow({ listing, compact }: { listing: Listing; compact?: boolean }) {
  const badges = compact ? listingCardBadges(listing) : listingTrustBadges(listing);
  if (badges.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {badges.map((b) => {
        const s = BADGE_STYLE[b.style];
        const extra = b.style === "example" || b.style === "money" || b.style === "work" ? "border border-slate-200 font-semibold tracking-wide" : "";
        return (
          <span
            key={`${b.style}-${b.label}`}
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-extrabold ${extra}`}
            style={{ background: s.bg, color: s.color }}
          >
            {b.label}
          </span>
        );
      })}
    </div>
  );
}

export function ProofRows({ listing }: { listing: Listing }) {
  const rows = listingProofRows(listing);
  if (rows.length === 0) return null;
  return (
    <div className="mt-3 pt-3 border-t border-[#f0e9de]" onClick={(e) => e.stopPropagation()}>
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-1">Proof</p>
      {rows.map((row) => (
        <div key={row.title} className="flex items-start justify-between gap-3 py-2 border-b border-[#f6f1e8] last:border-b-0 text-[13px]">
          <span className="text-[#3d4d5f] leading-snug">{row.title}</span>
          {row.href ? (
            <a
              href={row.href}
              className="shrink-0 font-extrabold text-[12px] text-[#4A94C8] hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {row.linkLabel}
            </a>
          ) : (
            <span className="shrink-0 font-extrabold text-[12px] text-[#4A94C8]">{row.linkLabel}</span>
          )}
        </div>
      ))}
    </div>
  );
}

export function KidValueChart({
  listings,
  subjectFilter,
  onSelectSubject,
}: {
  listings: Listing[];
  subjectFilter: string;
  onSelectSubject: (s: string) => void;
}) {
  const rows = SUBJECTS.map((subject) => {
    const subset = listings.filter((l) => l.subjects.includes(subject));
    const seeking = subset.reduce((s, l) => s + l.amountSeeking, 0);
    const kids = subset.reduce((s, l) => s + l.kidsServed, 0);
    const cpk = kids > 0 ? Math.round(seeking / kids) : 0;
    return { subject, seeking, kids, cpk, count: subset.length };
  }).filter((r) => r.count > 0).sort((a, b) => a.cpk - b.cpk);

  const totalSeeking = listings.reduce((s, l) => s + l.amountSeeking, 0);
  const totalFunded = listings.reduce((s, l) => s + l.amountFunded, 0);
  const totalKids = listings.reduce((s, l) => s + l.kidsServed, 0);
  const fundedPct = totalSeeking > 0 ? Math.round((totalFunded / totalSeeking) * 100) : 0;
  const avg = totalKids > 0 ? Math.round(totalSeeking / totalKids) : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4">
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <p className="text-sm font-semibold text-slate-900">Cost to serve each child</p>
        {avg > 0 && <p className="text-xs text-slate-500 tabular-nums">{formatCurrency(avg)} average</p>}
      </div>
      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
        <span>{formatCurrency(totalFunded)} already moving</span>
        <span>{formatCurrency(Math.max(0, totalSeeking - totalFunded))} still open</span>
      </div>
      <div className="h-1.5 rounded-full bg-sky-100 overflow-hidden mb-3">
        <div className="h-full bg-sky-600" style={{ width: `${fundedPct}%` }} />
      </div>
      <div className="flex flex-wrap gap-2">
        {rows.map((r) => {
          const active = subjectFilter === r.subject;
          return (
            <button
              key={r.subject}
              onClick={() => onSelectSubject(r.subject)}
              className={`inline-flex items-baseline gap-1.5 rounded-full border px-3 py-1.5 text-left ${
                active
                  ? "border-sky-600 bg-sky-50 text-sky-900"
                  : "border-slate-200 bg-white text-slate-800 hover:border-sky-300"
              }`}
            >
              <span className="text-[13px] font-semibold">{r.subject}</span>
              <span className="text-[13px] font-bold tabular-nums">{formatCurrency(r.cpk)}</span>
            </button>
          );
        })}
        {rows.length === 0 && <p className="text-sm text-slate-500">No listings.</p>}
      </div>
    </div>
  );
}

export function CostPerKidSlider({
  listings,
  cpkMin,
  cpkMax,
  setCpkMin,
  setCpkMax,
}: {
  listings: Listing[];
  cpkMin: number | null;
  cpkMax: number | null;
  setCpkMin: (v: number | null) => void;
  setCpkMax: (v: number | null) => void;
}) {
  const lo = cpkMin ?? 0;
  const hi = cpkMax ?? 10000;
  const left = (lo / 10000) * 100;
  const right = (hi / 10000) * 100;
  function onMin(v: number) {
    const next = Math.min(v, hi);
    setCpkMin(next <= 0 ? null : next);
  }
  function onMax(v: number) {
    const next = Math.max(v, lo);
    setCpkMax(next >= 10000 ? null : next);
  }
  const hiLabel = hi >= 10000 ? "$10k+" : formatCurrency(hi);
  return (
    <div className="mb-4 p-4 rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-slate-900">Cost to serve each child</p>
        <p className="text-sm font-semibold text-slate-900 tabular-nums">
          {formatCurrency(lo)} to {hiLabel}
        </p>
      </div>
      <div className="relative h-8">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-slate-200" />
        <div className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-sky-500" style={{ left: `${left}%`, width: `${Math.max(0, right - left)}%` }} />
        <input type="range" min={0} max={10000} value={lo} onChange={(e) => onMin(Number(e.target.value))} className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-sky-600 [&::-webkit-slider-thumb]:shadow" />
        <input type="range" min={0} max={10000} value={hi} onChange={(e) => onMax(Number(e.target.value))} className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-sky-600 [&::-webkit-slider-thumb]:shadow" />
      </div>
      <div className="flex justify-between text-[11px] text-slate-400 mt-1">
        <span>$0</span>
        <span>$10k+</span>
      </div>
    </div>
  );
}

export function ListingCard({ listing, onClick }: { listing: Listing; onClick: () => void }) {
  const cpk = costPerKid(listing);
  const orgLine = [listing.organization, listing.state, `${listing.kidsServed.toLocaleString()} children`]
    .filter(Boolean)
    .join(" \u00b7 ");
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="w-full text-left p-4 rounded-xl border border-slate-200 bg-white hover:border-sky-300 hover:shadow-sm transition-all cursor-pointer"
    >
      <TrustBadgeRow listing={listing} compact />
      <h3 className="font-semibold text-[#2A3D55] text-[15px] leading-snug mt-2.5">{listing.title}</h3>
      <p className="text-sm text-slate-500 mt-0.5">{orgLine}</p>
      <div className="mt-3 flex items-start justify-between gap-4">
        <div className="shrink-0">
          <div className="text-lg font-bold text-[#2A3D55]">{formatCurrency(listing.amountSeeking)}</div>
          <div className="text-xs text-slate-500 mt-0.5">{formatCurrency(cpk)} per child</div>
        </div>
        {listing.successMetric && (
          <p className="flex-1 text-sm text-slate-600 leading-snug text-right pt-0.5">{listing.successMetric}</p>
        )}
      </div>
    </div>
  );
}
