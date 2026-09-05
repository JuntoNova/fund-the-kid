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
import { ListForm } from "./forms";
import { DetailView } from "./detailTabs";
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
  const [workKindFilter, setWorkKindFilter] = useState("");
  const [moneyKindFilter, setMoneyKindFilter] = useState("");

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
      if (workKindFilter && l.workKind !== workKindFilter) return false;
      if (moneyKindFilter && l.moneyKind !== moneyKindFilter) return false;
      return true;
    }).sort((a, b) => b.amountSeeking - a.amountSeeking);
  }, [listings, query, stateFilter, modelFilter, subjectFilter, successFilter, trustFilters, proofFilters, cpkMin, cpkMax, workKindFilter, moneyKindFilter]);

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
    setWorkKindFilter(patch.workKindFilter);
    setMoneyKindFilter(patch.moneyKindFilter);
    setShowFilters(true);
    return patch.note;
  }

  const menuItem = (label: string, on: boolean, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      className={`block w-full text-left px-4 py-2.5 text-sm font-semibold ${
        on ? "bg-[#e8f4fb] text-[#2A3D55]" : "text-[#2A3D55] hover:bg-[#f6f1e8]"
      }`}
    >
      {label}
    </button>
  );

  const navLink = (label: string, on: boolean, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 text-[13px] font-semibold tracking-wide ${
        on ? "text-[#2A3D55]" : "text-[#6b7786] hover:text-[#2A3D55]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F6F1E8" }}>
      <header className="border-b border-[#e4ddd2] bg-white/92 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-[72px] flex items-center justify-between gap-6">
          <button
            type="button"
            onClick={goBrowse}
            className="min-w-0 flex items-baseline gap-3 text-[#2A3D55]"
            aria-label="Fund the Kid home"
          >
            <span
              className="font-logo whitespace-nowrap text-[28px] sm:text-[32px] leading-none"
              style={{ color: "#2A3D55" }}
            >
              Fund the Kid
            </span>
            <span className="hidden sm:inline text-[11px] font-bold uppercase tracking-[0.16em] text-[#6b7786]">
              Help kids learn
            </span>
          </button>
          <nav className="hidden md:flex items-center gap-1">
            {navLink("Browse", view === "browse" || view === "detail", goBrowse)}
            {navLink("About", view === "about", goAbout)}
            <button
              type="button"
              onClick={goList}
              className="ml-2 inline-flex items-center px-3.5 py-2 rounded-md bg-[#4A94C8] text-white text-[13px] font-bold hover:bg-[#3d86b8]"
            >
              List a program
            </button>
          </nav>
          <div className="relative shrink-0 md:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="w-10 h-10 inline-flex items-center justify-center rounded-md text-[#2A3D55] hover:bg-[#e8f4fb]"
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
                  className="fixed inset-0 z-30 bg-black/20"
                  aria-label="Close menu"
                  onClick={closeMenu}
                />
                <div
                  className="fixed z-40 left-4 right-4 top-[4.6rem] rounded-xl border border-[#e4ddd2] bg-white shadow-lg py-1"
                  role="menu"
                >
                  {menuItem("Browse", view === "browse" || view === "detail", goBrowse)}
                  {menuItem("List a program", view === "list", goList)}
                  {menuItem("About", view === "about", goAbout)}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-7 flex-1 w-full">
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
            workKindFilter={workKindFilter}
            setWorkKindFilter={setWorkKindFilter}
            moneyKindFilter={moneyKindFilter}
            setMoneyKindFilter={setMoneyKindFilter}
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

      <footer className="border-t border-[#e4ddd2] mt-8">
        <div className="max-w-6xl mx-auto px-4 py-6 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[13px] text-[#6b7786]">
          <p>A place to fund work that helps kids learn. Listings today are examples.</p>
          <div className="flex items-center gap-3">
            <button type="button" onClick={goAbout} className="hover:text-[#2A3D55]">About</button>
            <span aria-hidden="true">·</span>
            <button type="button" onClick={goPrivacy} className="hover:text-[#2A3D55]">Privacy</button>
            <span aria-hidden="true">·</span>
            <button type="button" onClick={goTerms} className="hover:text-[#2A3D55]">Terms</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
