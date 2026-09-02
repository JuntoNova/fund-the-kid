import { costPerKid, formatCurrency, formatHorizon } from "./data/listings";
import type { Listing } from "./data/listings";
import { MapPin, Users } from "lucide-react";

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
    const funded = subset.reduce((s, l) => s + l.amountFunded, 0);
    const kids = subset.reduce((s, l) => s + l.kidsServed, 0);
    const cpk = kids > 0 ? Math.round(seeking / kids) : 0;
    return { subject, seeking, funded, open: Math.max(0, seeking - funded), kids, cpk, count: subset.length };
  }).filter((r) => r.count > 0);

  const maxCpk = Math.max(1, ...rows.map((r) => r.cpk));
  const totalSeeking = listings.reduce((s, l) => s + l.amountSeeking, 0);
  const totalFunded = listings.reduce((s, l) => s + l.amountFunded, 0);
  const totalKids = listings.reduce((s, l) => s + l.kidsServed, 0);
  const fundedPct = totalSeeking > 0 ? Math.round((totalFunded / totalSeeking) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col">
      <div className="mb-3">
        <p className="text-sm font-semibold text-slate-900">Cost to serve each child</p>
        <p className="text-xs text-slate-500">By category.</p>
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
          <span>{formatCurrency(totalFunded)} already moving</span>
          <span>{formatCurrency(Math.max(0, totalSeeking - totalFunded))} still open</span>
        </div>
        <div className="h-2.5 rounded-full bg-sky-100 overflow-hidden flex">
          <div className="h-full bg-sky-600" style={{ width: `${fundedPct}%` }} />
        </div>
      </div>
      <div className="flex-1 space-y-3">
        {rows.map((r) => {
          const active = subjectFilter === r.subject;
          return (
            <button key={r.subject} onClick={() => onSelectSubject(r.subject)} className={`w-full text-left ${active ? "opacity-100" : "hover:opacity-90"}`}>
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span className={`text-xs font-semibold ${active ? "text-sky-800" : "text-slate-800"}`}>{r.subject}</span>
                <span className="text-xs font-bold text-slate-900 tabular-nums">{formatCurrency(r.cpk)} per child</span>
              </div>
              <div className="h-7 rounded-md bg-slate-100 overflow-hidden relative">
                <div className={`h-full rounded-md ${active ? "bg-sky-600" : "bg-sky-400"}`} style={{ width: `${Math.max(8, (r.cpk / maxCpk) * 100)}%` }} />
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {r.kids.toLocaleString()} children · {r.count} opportunit{r.count === 1 ? "y" : "ies"}
              </p>
            </button>
          );
        })}
        {rows.length === 0 && <p className="text-sm text-slate-500 py-8 text-center">No listings.</p>}
      </div>
      {totalKids > 0 && (
        <p className="text-xs text-slate-500 mt-3">
          {formatCurrency(Math.round(totalSeeking / totalKids))} average per child in this view.
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
  const pct = Math.min(100, Math.round((listing.amountFunded / listing.amountSeeking) * 100));
  return (
    <button onClick={onClick} className="w-full text-left p-4 rounded-xl border border-slate-200 bg-white hover:border-sky-300 hover:shadow-sm transition-all">
      <h3 className="font-semibold text-slate-900 text-[15px] leading-snug">{listing.title}</h3>
      {listing.organization && <p className="text-sm text-slate-500 mt-0.5">{listing.organization}</p>}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{listing.metro}, {listing.state}</span>
        <span className="inline-flex items-center gap-1"><Users className="w-3.5 h-3.5" />{listing.kidsServed.toLocaleString()} children · {formatHorizon(listing)}</span>
      </div>
      <div className="mt-2.5 max-w-xs">
        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full bg-sky-600 rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-[11px] text-slate-500 mt-1">{pct}% funded · {formatCurrency(listing.amountFunded)} in</p>
      </div>
      <div className="mt-3 flex items-start gap-4">
        <div className="shrink-0">
          <div className="text-lg font-bold text-slate-900">{formatCurrency(listing.amountSeeking)}</div>
          <div className="text-xs text-slate-500 mt-0.5">{formatCurrency(cpk)} per child</div>
        </div>
        {listing.successMetric && (
          <p className="flex-1 text-sm text-slate-600 leading-snug pt-0.5">{listing.successMetric}</p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">{listing.modelType}</span>
        {listing.subjects.map((s) => (
          <span key={s} className="inline-flex items-center px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 text-xs font-medium">{s}</span>
        ))}
      </div>
    </button>
  );
}
