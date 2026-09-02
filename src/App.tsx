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
import { PrivacyView, TermsView, AboutView } from "./legal";
import { parseAsk } from "./filterAsk";
import { Menu } from "lucide-react";

type View = "browse" | "detail" | "list" | "privacy" | "terms" | "about";

function viewFromPath(path: string): View {
  const p = path.replace(/\/$/, "") || "/";
  if (p === "/privacy") return "privacy";
  if (p === "/terms") return "terms";
  if (p === "/about") return "about";
  return "browse";
}

export default function App() {
  const [view, setView] = useState<View>(() => viewFromPath(window.location.pathname));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>(LISTINGS);
  const [menuOpen, setMenuOpen] = useState(false);

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
      setMenuOpen(false);
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

  function closeMenu() {
    setMenuOpen(false);
  }

  function goBrowse() {
    if (window.location.pathname !== "/") window.history.pushState({}, "", "/");
    setView("browse");
    setSelectedId(null);
    closeMenu();
  }

  function goList() {
    if (window.location.pathname !== "/") window.history.pushState({}, "", "/");
    setView("list");
    closeMenu();
  }

  function goAbout() {
    window.history.pushState({}, "", "/about");
    setView("about");
    closeMenu();
  }

  function goPrivacy() {
    window.history.pushState({}, "", "/privacy");
    setView("privacy");
    closeMenu();
  }

  function goTerms() {
    window.history.pushState({}, "", "/terms");
    setView("terms");
    closeMenu();
  }

  function openDetail(id: string) {
    setSelectedId(id);
    setView("detail");
    closeMenu();
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

  const menuItem = (label: string, on: boolean, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      className={`block w-full text-left px-4 py-2.5 text-sm font-medium ${
        on ? "bg-sky-100 text-[#2A3D55]" : "text-[#2A3D55] hover:bg-[#e8f4fb]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F6F1E8" }}>
      <header className="border-b border-sky-100 bg-white/90 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goBrowse}
            className="min-w-0 flex items-center text-[#2A3D55]"
            aria-label="Fund the Kid home"
          >
            <span
              className="font-logo whitespace-nowrap text-[26px] sm:text-[34px] leading-none tracking-tight"
              style={{ color: "#2A3D55" }}
            >
              Fund the Kid
            </span>
          </button>
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="w-10 h-10 inline-flex items-center justify-center rounded-full text-[#2A3D55] hover:bg-sky-100"
              aria-label="Menu"
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              <Menu className="w-5 h-5" />
            </button>
            {menuOpen && (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-30 bg-black/20 sm:bg-transparent"
                  aria-label="Close menu"
                  onClick={closeMenu}
                />
                <div
                  className="fixed sm:absolute z-40 left-4 right-4 sm:left-auto sm:right-0 top-[4.25rem] sm:top-full sm:mt-2 sm:w-56 rounded-xl border border-sky-100 bg-white shadow-lg py-1"
                  role="menu"
                >
                  {menuItem("Browse", view === "browse" || view === "detail", goBrowse)}
                  {menuItem("List opportunity", view === "list", goList)}
                  {menuItem("About", view === "about", goAbout)}
                </div>
              </>
            )}
          </div>
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
        {view === "about" && <AboutView onBack={goBrowse} />}
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-6 w-full text-sm text-[#2A3D55]">
        <button type="button" onClick={goPrivacy} className="hover:underline">Privacy</button>
        <span className="mx-2">·</span>
        <button type="button" onClick={goTerms} className="hover:underline">Terms</button>
      </footer>
    </div>
  );
}
