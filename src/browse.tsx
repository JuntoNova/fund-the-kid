import { useMemo, useState, type FormEvent } from "react";
import type { Listing, WorkKind, MoneyKind } from "./data/listings";
import { SUCCESS_MEASURES, WORK_KIND_LABELS, MONEY_KIND_LABELS } from "./data/listings";
import { NAME_TO_ABBR, ABBR_TO_NAME, STATE_CENTERS } from "./data/states";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { Search, Filter, X } from "lucide-react";
import { KidValueChart, CostPerKidSlider, ListingCard, SUBJECTS } from "./insights";

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const TRUST_CHIPS: { id: string; label: string }[] = [
  { id: "verified", label: "Verified entity" },
  { id: "nonprofit", label: "501(c)(3)" },
  { id: "for_profit_filed", label: "For-profit, state filed" },
  { id: "third_party_seal", label: "Has third-party seal" },
];

const PROOF_MEASURE_CHIPS: { measure: string; label: string }[] = [
  { measure: "Independent assessments", label: "Independent assessment" },
  { measure: "State assessments", label: "State scores" },
  { measure: "Credentials", label: "Job / credential" },
];

function Chip({
  label,
  on,
  warn,
  onClick,
}: {
  label: string;
  on: boolean;
  warn?: boolean;
  onClick: () => void;
}) {
  const cls = on
    ? "bg-[#e8f4fb] border-[#4A94C8] text-[#2A3D55]"
    : warn
      ? "bg-[#fdeef3] border-[#e7b3c3] text-[#2A3D55]"
      : "bg-white border-[#d9d0c4] text-[#2A3D55]";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-[13px] font-bold border ${cls}`}
    >
      {label}
    </button>
  );
}

function toggleId(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}


export function BrowseView(props: {
  listings: Listing[];
  allListings: Listing[];
  query: string;
  setQuery: (v: string) => void;
  stateFilter: string;
  setStateFilter: (v: string) => void;
  modelFilter: string;
  setModelFilter: (v: string) => void;
  subjectFilter: string;
  setSubjectFilter: (v: string) => void;
  successFilter: string;
  setSuccessFilter: (v: string) => void;
  trustFilters: string[];
  setTrustFilters: (v: string[]) => void;
  proofFilters: string[];
  setProofFilters: (v: string[]) => void;
  states: string[];
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  cpkMin: number | null;
  cpkMax: number | null;
  setCpkMin: (v: number | null) => void;
  setCpkMax: (v: number | null) => void;
  workKindFilter: string;
  setWorkKindFilter: (v: string) => void;
  moneyKindFilter: string;
  setMoneyKindFilter: (v: string) => void;
  onOpen: (id: string) => void;
  onAsk: (text: string) => string;
}) {
  const {
    listings, allListings, query, setQuery, stateFilter, setStateFilter,
    modelFilter, setModelFilter, subjectFilter, setSubjectFilter,
    successFilter, setSuccessFilter, trustFilters, setTrustFilters,
    proofFilters, setProofFilters, states,
    showFilters, setShowFilters, cpkMin, cpkMax, setCpkMin, setCpkMax,
    workKindFilter, setWorkKindFilter, moneyKindFilter, setMoneyKindFilter, onOpen, onAsk,
  } = props;
  const activeFilters =
    [stateFilter, subjectFilter, successFilter, workKindFilter, moneyKindFilter].filter(Boolean).length
    + (cpkMin != null || cpkMax != null ? 1 : 0)
    + trustFilters.length
    + proofFilters.length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title, place, organization." className="w-full pl-10 pr-3 py-2.5 rounded-full border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#e8f4fb] text-[#2A3D55] text-sm font-bold hover:bg-[#d9eef8]">
          <Filter className="w-4 h-4" /> Filters
          {activeFilters > 0 && <span className="ml-1 w-5 h-5 rounded-full bg-[#4A94C8] text-white text-xs flex items-center justify-center">{activeFilters}</span>}
        </button>
      </div>

      {showFilters && (
        <div className="mb-4 p-4 rounded-xl border border-slate-200 bg-white">
          <AskPanel onAsk={onAsk} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">State</label>
            <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="w-full rounded-md border border-slate-200 text-sm py-2 px-2 bg-white">
              <option value="">All states</option>
              {states.map((s) => <option key={s} value={s}>{ABBR_TO_NAME[s] ?? s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
            <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="w-full rounded-md border border-slate-200 text-sm py-2 px-2 bg-white">
              <option value="">All categories</option>
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Success measure</label>
            <select value={successFilter} onChange={(e) => setSuccessFilter(e.target.value)} className="w-full rounded-md border border-slate-200 text-sm py-2 px-2 bg-white">
              <option value="">All measures</option>
              {SUCCESS_MEASURES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Kind of work</label>
            <select value={workKindFilter} onChange={(e) => setWorkKindFilter(e.target.value)} className="w-full rounded-md border border-slate-200 text-sm py-2 px-2 bg-white">
              <option value="">All kinds of work</option>
              {(Object.keys(WORK_KIND_LABELS) as WorkKind[]).map((k) => <option key={k} value={k}>{WORK_KIND_LABELS[k]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Kind of money</label>
            <select value={moneyKindFilter} onChange={(e) => setMoneyKindFilter(e.target.value)} className="w-full rounded-md border border-slate-200 text-sm py-2 px-2 bg-white">
              <option value="">All kinds of money</option>
              {(Object.keys(MONEY_KIND_LABELS) as MoneyKind[]).map((k) => <option key={k} value={k}>{MONEY_KIND_LABELS[k]}</option>)}
            </select>
          </div>
          </div>

          <div className="mt-4">
            <p className="text-[11px] font-bold text-[#7a8794] mb-2">Trust the organization</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {TRUST_CHIPS.map((c) => (
                <Chip
                  key={c.id}
                  label={c.label}
                  on={trustFilters.includes(c.id)}
                  onClick={() => setTrustFilters(toggleId(trustFilters, c.id))}
                />
              ))}
            </div>
            <p className="text-[11px] font-bold text-[#7a8794] mb-2">Prove the work</p>
            <div className="flex flex-wrap gap-2">
              <Chip
                label="Has outcome proof"
                on={proofFilters.includes("outcome")}
                onClick={() => setProofFilters(toggleId(proofFilters, "outcome"))}
              />
              {PROOF_MEASURE_CHIPS.map((c) => (
                <Chip
                  key={c.measure}
                  label={c.label}
                  on={successFilter === c.measure}
                  onClick={() => setSuccessFilter(successFilter === c.measure ? "" : c.measure)}
                />
              ))}
              <Chip
                label="Claim only · no file"
                warn
                on={proofFilters.includes("claim_only")}
                onClick={() => setProofFilters(toggleId(proofFilters, "claim_only"))}
              />
            </div>
            <p className="text-xs text-[#7a8794] mt-3">
              Charity seals only on nonprofits. For-profits get state filing, EIN, and optional BBB Business. A claim without a file still lists. Donors who care filter it out.
            </p>
          </div>

          <div className="mt-4">
            <CostPerKidSlider listings={allListings} cpkMin={cpkMin} cpkMax={cpkMax} setCpkMin={setCpkMin} setCpkMax={setCpkMax} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <MapPanel listings={allListings} visible={listings} stateFilter={stateFilter} modelFilter={modelFilter} subjectFilter={subjectFilter} onSelectState={(abbr) => setStateFilter(abbr === stateFilter ? "" : abbr)} />
        <KidValueChart listings={listings} subjectFilter={subjectFilter} onSelectSubject={(s) => setSubjectFilter(s === subjectFilter ? "" : s)} />
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-500">{listings.length} opportunit{listings.length === 1 ? "y" : "ies"}{stateFilter ? ` in ${ABBR_TO_NAME[stateFilter] ?? stateFilter}` : ""}</p>
        {activeFilters > 0 ? (
          <button onClick={() => { setStateFilter(""); setModelFilter(""); setSubjectFilter(""); setSuccessFilter(""); setTrustFilters([]); setProofFilters([]); setCpkMin(null); setCpkMax(null); setWorkKindFilter(""); setMoneyKindFilter(""); }} className="text-sm text-sky-700 hover:text-sky-800 font-medium inline-flex items-center gap-1">
            <X className="w-3.5 h-3.5" /> Clear filters
          </button>
        ) : (
          <p className="text-sm text-slate-400">Click a state or a category to filter</p>
        )}
      </div>

      <div className="grid gap-3">
        {listings.map((l) => <ListingCard key={l.id} listing={l} onClick={() => onOpen(l.id)} />)}
        {listings.length === 0 && <div className="text-center py-16 text-slate-500 text-sm rounded-xl border border-dashed border-slate-200 bg-white">No matching listings.</div>}
      </div>
    </div>
  );
}

function MapPanel({
  listings, stateFilter, modelFilter, subjectFilter, onSelectState,
}: {
  listings: Listing[];
  visible: Listing[];
  stateFilter: string;
  modelFilter: string;
  subjectFilter: string;
  onSelectState: (abbr: string) => void;
}) {
  const [hover, setHover] = useState<{ abbr: string; x: number; y: number } | null>(null);
  const scoped = useMemo(() => listings.filter((l) => {
    if (modelFilter && l.modelType !== modelFilter) return false;
    if (subjectFilter && !l.subjects.includes(subjectFilter)) return false;
    return true;
  }), [listings, modelFilter, subjectFilter]);
  const byState = useMemo(() => {
    const map: Record<string, { count: number; seeking: number; funded: number; kids: number }> = {};
    for (const l of scoped) {
      if (l.state === "Multi") continue;
      if (!map[l.state]) map[l.state] = { count: 0, seeking: 0, funded: 0, kids: 0 };
      map[l.state].count += 1;
      map[l.state].seeking += l.amountSeeking;
      map[l.state].funded += l.amountFunded;
      map[l.state].kids += l.kidsServed;
    }
    return map;
  }, [scoped]);
  const maxSeeking = Math.max(1, ...Object.values(byState).map((s) => s.seeking));
  const center = stateFilter && STATE_CENTERS[stateFilter] ? STATE_CENTERS[stateFilter] : [-96.5, 38.5];
  const zoom = stateFilter ? (["TX", "CA", "AK"].includes(stateFilter) ? 3.2 : 4.4) : 1;
  const hoverStats = hover ? byState[hover.abbr] : null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden relative">
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Where the opportunities are</p>
          <p className="text-xs text-slate-500">Select a state to filter.</p>
        </div>
        {stateFilter && <button onClick={() => onSelectState(stateFilter)} className="text-xs font-medium text-sky-700 hover:text-sky-800">Back to U.S.</button>}
      </div>
      <div className="h-[280px] sm:h-[320px]">
        <ComposableMap projection="geoAlbersUsa" projectionConfig={{ scale: 800 }} width={800} height={500} style={{ width: "100%", height: "100%" }}>
          <ZoomableGroup center={center} zoom={zoom} translateExtent={[[-200, -100], [1000, 700]]}>
            <Geographies geography={GEO_URL}>
              {({ geographies }: { geographies: any[] }) => geographies.map((geo) => {
                const abbr = NAME_TO_ABBR[geo.properties.name] ?? "";
                const stats = byState[abbr];
                const active = stateFilter === abbr;
                const has = !!stats;
                const intensity = has ? 0.18 + (stats.seeking / maxSeeking) * 0.82 : 0;
                const fill = !has ? "#E2E8F0" : active ? "#4A94C8" : `rgba(74, 148, 200, ${intensity})`;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={(evt: any) => abbr && setHover({ abbr, x: evt.clientX, y: evt.clientY })}
                    onMouseMove={(evt: any) => abbr && setHover({ abbr, x: evt.clientX, y: evt.clientY })}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => abbr && onSelectState(abbr)}
                    style={{
                      default: { fill, stroke: "#fff", strokeWidth: 0.8, outline: "none", cursor: "pointer" },
                      hover: { fill: has ? "#6BABD6" : "#CBD5E1", stroke: "#fff", strokeWidth: 1, outline: "none", cursor: "pointer" },
                      pressed: { fill: "#4A94C8", outline: "none" },
                    }}
                  />
                );
              })}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
      {hover && (
        <div className="pointer-events-none fixed z-30 bg-slate-900 text-white text-xs rounded-md px-2.5 py-1.5 shadow-lg" style={{ left: hover.x + 12, top: hover.y + 12 }}>
          <p className="font-semibold">{ABBR_TO_NAME[hover.abbr] ?? hover.abbr}</p>
          {hoverStats ? (
            <p className="text-slate-300 mt-0.5">{hoverStats.count} listing{hoverStats.count === 1 ? "" : "s"}</p>
          ) : (
            <p className="text-slate-300 mt-0.5">No listings.</p>
          )}
        </div>
      )}
    </div>
  );
}

function AskPanel({ onAsk }: { onAsk: (text: string) => string }) {
  const [text, setText] = useState("");
  const [note, setNote] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    const next = onAsk(text);
    setNote(next);
  }
  return (
    <form onSubmit={submit} className="mb-4 pb-4 border-b border-[#f0e9de]">
      <label className="block text-[11px] font-bold text-[#7a8794] mb-2">Ask</label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="literacy in Texas with proof"
          className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
        />
        <button type="submit" className="rounded-lg px-4 py-2.5 text-sm font-bold bg-[#4A94C8] text-white hover:bg-[#3d86b8]">
          Set filters
        </button>
      </div>
      <p className="text-xs text-[#7a8794] mt-2">Examples: literacy in Texas with proof. Gift in Texas. Ownership company. Place in Houston.</p>
      {note ? <p className="text-sm text-[#2A3D55] mt-2">{note}</p> : null}
    </form>
  );
}
