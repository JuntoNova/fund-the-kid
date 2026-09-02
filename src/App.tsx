import { useEffect, useMemo, useState } from "react";
import {
  LISTINGS,
  costPerKid,
  isVerifiedEntity,
  isNonprofit,
  isForProfitStateFiled,
  hasThirdPartySeal,
  hasOutcomeProof,
  isClaimOnly,
  matchesSuccessMeasure,
} from "./data/listings";
import type { Listing } from "./data/listings";
import { BrowseView } from "./browse";
import { DetailView, ListForm } from "./forms";
import { PrivacyView, TermsView } from "./legal";
import { parseAsk } from "./filterAsk";
import { Plus } from "lucide-react";

type View = "browse" | "detail" | "list" | "privacy" | "terms";

function viewFromPath(path: string): View {
  const p = path.replace(/\/$/, "") || "/";
  if (p === "/privacy") return "privacy";
  if (p === "/terms") return "terms";
  return "browse";
}

export default function App() {
  const [view, setView] = useState<View>(() => viewFromPath(window.location.pathname));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>(LISTINGS);

  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [successFilter, setSuccessFilter] = useState("");
  const [trustFilters, setTrustFilters] = useState<string[]>([]);
  const [proofFilters, setProofFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [cpkMin, setCpkMin] = useState<number | null>(null);
  const [cpkMax, setCpkMax] = useState<number | null>(null);

  useEffect(() => {
    function onPop() {
      const next = viewFromPath(window.location.pathname);
      setView(next);
      if (next === "browse") setSelectedId(null);
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (query) {
        const q = query.toLowerCase();
        const proofText = (l.proofs ?? []).map((p) => p.title).join(" ");
        const hay = `${l.title} ${l.description} ${l.organization ?? ""} ${l.metro} ${l.state} ${l.successMetric ?? ""} ${proofText}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (stateFilter && l.state !== stateFilter) return false;
      if (modelFilter && l.modelType !== modelFilter) return false;
      if (subjectFilter && !l.subjects.includes(subjectFilter)) return false;
      if (successFilter && !matchesSuccessMeasure(l, successFilter)) return false;
      if (trustFilters.includes("verified") && !isVerifiedEntity(l)) return false;
      if (trustFilters.includes("nonprofit") && !isNonprofit(l)) return false;
      if (trustFilters.includes("for_profit_filed") && !isForProfitStateFiled(l)) return false;
      if (trustFilters.includes("third_party_seal") && !hasThirdPartySeal(l)) return false;
      if (proofFilters.includes("outcome") && !hasOutcomeProof(l)) return false;
      if (proofFilters.includes("claim_only") && !isClaimOnly(l)) return false;
      const cpk = costPerKid(l);
      if (cpkMin != null && cpk < cpkMin) return false;
      if (cpkMax != null && cpk > cpkMax) return false;
      return true;
    });
  }, [listings, query, stateFilter, modelFilter, subjectFilter, successFilter, trustFilters, proofFilters, cpkMin, cpkMax]);

  const selected = listings.find((l) => l.id === selectedId) ?? null;
  const states = Array.from(new Set(listings.map((l) => l.state).filter((s) => s !== "Multi"))).sort();

  function goBrowse() {
    if (window.location.pathname !== "/") window.history.pushState({}, "", "/");
    setView("browse");
    setSelectedId(null);
  }

  function goPrivacy() {
    window.history.pushState({}, "", "/privacy");
    setView("privacy");
  }

  function goTerms() {
    window.history.pushState({}, "", "/terms");
    setView("terms");
  }

  function openDetail(id: string) {
    setSelectedId(id);
    setView("detail");
  }

  function handleNewListing(listing: Listing) {
    setListings((prev) => [listing, ...prev]);
    setSelectedId(listing.id);
    setView("detail");
  }

  function onAsk(text: string): string {
    const patch = parseAsk(text);
    setStateFilter(patch.stateFilter);
    setSubjectFilter(patch.subjectFilter);
    setSuccessFilter(patch.successFilter);
    setTrustFilters(patch.trustFilters);
    setProofFilters(patch.proofFilters);
    setCpkMin(patch.cpkMin);
    setCpkMax(patch.cpkMax);
    setShowFilters(true);
    return patch.note;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F6F1E8" }}>
      <header className="border-b border-sky-100 bg-white/90 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={goBrowse}
            className="flex items-center text-[#2A3D55]"
          >
            <span className="font-logo text-[34px] leading-none tracking-tight" style={{ color: "#2A3D55" }}>
              Fund the Kid
            </span>
          </button>
          <nav className="flex items-center gap-2">
            <button
              onClick={goBrowse}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                view === "browse" ? "bg-sky-100 text-[#2A3D55]" : "text-slate-600 hover:text-[#2A3D55]"
              }`}
            >
              Browse
            </button>
            <button
              onClick={() => setView("list")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-sky-600 text-white hover:bg-sky-700"
            >
              <Plus className="w-4 h-4" />
              List opportunity
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 flex-1 w-full">
        {view === "browse" && (
          <BrowseView
            listings={filtered}
            allListings={listings}
            query={query}
            setQuery={setQuery}
            stateFilter={stateFilter}
            setStateFilter={setStateFilter}
            modelFilter={modelFilter}
            setModelFilter={setModelFilter}
            subjectFilter={subjectFilter}
            setSubjectFilter={setSubjectFilter}
            successFilter={successFilter}
            setSuccessFilter={setSuccessFilter}
            trustFilters={trustFilters}
            setTrustFilters={setTrustFilters}
            proofFilters={proofFilters}
            setProofFilters={setProofFilters}
            states={states}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            cpkMin={cpkMin}
            cpkMax={cpkMax}
            setCpkMin={setCpkMin}
            setCpkMax={setCpkMax}
            onOpen={openDetail}
            onAsk={onAsk}
          />
        )}
        {view === "detail" && selected && (
          <DetailView listing={selected} onBack={goBrowse} />
        )}
        {view === "list" && (
          <ListForm onSubmit={handleNewListing} onCancel={goBrowse} />
        )}
        {view === "privacy" && <PrivacyView onBack={goBrowse} />}
        {view === "terms" && <TermsView onBack={goBrowse} />}
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-6 w-full text-sm text-[#2A3D55]">
        <button type="button" onClick={goPrivacy} className="hover:underline">Privacy</button>
        <span className="mx-2">·</span>
        <button type="button" onClick={goTerms} className="hover:underline">Terms</button>
      </footer>
    </div>
  );
}
