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
  }).filter((r) => r.count > 0).sort((a, b) => b.cpk - a.cpk);

  const maxCpk = Math.max(1, ...rows.map((r) => r.cpk));
  const totalSeeking = listings.reduce((s, l) => s + l.amountSeeking, 0);
  const totalFunded = listings.reduce((s, l) => s + l.amountFunded, 0);
  const totalKids = listings.reduce((s, l) => s + l.kidsServed, 0);
  const fundedPct = totalSeeking > 0 ? Math.round((totalFunded / totalSeeking) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-[#e4ddd2] p-4 h-full flex flex-col">
      <div className="mb-3">
        <p className="text-sm font-extrabold text-[#2A3D55]">What it takes to reach one student</p>
        <p className="text-xs text-[#6b7786] mt-0.5">By kind of work. Click to filter.</p>
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between text-[11px] text-[#6b7786] mb-1">
          <span>{formatCurrency(totalFunded)} already moving</span>
          <span>{formatCurrency(Math.max(0, totalSeeking - totalFunded))} still open</span>
        </div>
        <div className="h-1.5 rounded-full bg-[#e8f4fb] overflow-hidden">
          <div className="h-full bg-[#4A94C8]" style={{ width: `${fundedPct}%` }} />
        </div>
      </div>
      <div className="flex-1 space-y-2.5">
        {rows.slice(0, 6).map((r) => {
          const active = subjectFilter === r.subject;
          return (
            <button key={r.subject} onClick={() => onSelectSubject(r.subject)} className="w-full text-left">
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span className={`text-[12px] font-bold ${active ? "text-[#4A94C8]" : "text-[#2A3D55]"}`}>{r.subject}</span>
                <span className="num text-[12px] font-extrabold text-[#2A3D55]">{formatCurrency(r.cpk)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#f6f1e8] overflow-hidden">
                <div className={`h-full rounded-full ${active ? "bg-[#4A94C8]" : "bg-[#8EC4E4]"}`} style={{ width: `${Math.max(8, (r.cpk / maxCpk) * 100)}%` }} />
              </div>
            </button>
          );
        })}
        {rows.length === 0 && <p className="text-sm text-[#6b7786] py-8 text-center">No listings in this view yet.</p>}
      </div>
      {totalKids > 0 && (
        <p className="text-[12px] text-[#6b7786] mt-3 pt-3 border-t border-[#f0e9de]">
          {formatCurrency(Math.round(totalSeeking / totalKids))} to reach one student in this view.
        </p>
      )}
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
    <div className="mb-4 p-4 rounded-xl border border-[#e4ddd2] bg-white">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-slate-900">Funding needed per student</p>
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
  const orgLine = [listing.organization, listing.metro, listing.state]
    .filter(Boolean)
    .join(" · ");
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
      className="w-full text-left rounded-xl border border-[#e4ddd2] bg-white hover:border-[#8EC4E4] hover:shadow-[0_8px_24px_rgba(42,61,85,0.06)] transition-all cursor-pointer overflow-hidden"
    >
      <div className="flex">
        <div className="hidden sm:block w-1.5 bg-[#8EC4E4] shrink-0" />
        <div className="flex-1 p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <TrustBadgeRow listing={listing} compact />
              <h3 className="font-extrabold text-[#2A3D55] text-[16px] leading-snug mt-2.5">{listing.title}</h3>
              <p className="text-[13px] text-[#6b7786] mt-1">{orgLine}</p>
              {listing.successMetric && (
                <p className="mt-2 text-[13px] text-[#3d4d5f] leading-snug line-clamp-2">{listing.successMetric}</p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3 sm:min-w-[280px] lg:text-right">
              <div>
                <p className="label">Ask</p>
                <p className="num text-[17px] font-extrabold text-[#2A3D55] mt-0.5">{formatCurrency(listing.amountSeeking)}</p>
                {listing.amountSeeking >= 1_000_000 ? (
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#4A94C8] mt-0.5">Large raise</p>
                ) : null}
              </div>
              <div>
                <p className="label">Per student</p>
                <p className="num text-[17px] font-extrabold text-[#2A3D55] mt-0.5">{formatCurrency(cpk)}</p>
              </div>
              <div>
                <p className="label">Students</p>
                <p className="num text-[17px] font-extrabold text-[#2A3D55] mt-0.5">{listing.kidsServed.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
