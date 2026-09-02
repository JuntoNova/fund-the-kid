import { useMemo, useState } from "react";
import {
  LISTINGS,
  costPerKid,
} from "./data/listings";
import type { Listing } from "./data/listings";
import { BrowseView } from "./browse";
import { DetailView, ListForm } from "./forms";
import { Plus } from "lucide-react";

type View = "browse" | "detail" | "list";

export default function App() {
  const [view, setView] = useState<View>("browse");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>(LISTINGS);

  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [successFilter, setSuccessFilter] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [cpkMin, setCpkMin] = useState<number | null>(null);
  const [cpkMax, setCpkMax] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (query) {
        const q = query.toLowerCase();
        const hay = `${l.title} ${l.description} ${l.organization ?? ""} ${l.metro} ${l.state} ${l.successMetric ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (stateFilter && l.state !== stateFilter) return false;
      if (modelFilter && l.modelType !== modelFilter) return false;
      if (subjectFilter && !l.subjects.includes(subjectFilter)) return false;
      if (successFilter && !(l.successMeasures ?? []).includes(successFilter as Listing["successMeasures"][number])) return false;
      const cpk = costPerKid(l);
      if (cpkMin != null && cpk < cpkMin) return false;
      if (cpkMax != null && cpk > cpkMax) return false;
      return true;
    });
  }, [listings, query, stateFilter, modelFilter, subjectFilter, successFilter, cpkMin, cpkMax]);

  const selected = listings.find((l) => l.id === selectedId) ?? null;
  const states = Array.from(new Set(listings.map((l) => l.state).filter((s) => s !== "Multi"))).sort();

  function openDetail(id: string) {
    setSelectedId(id);
    setView("detail");
  }

  function handleNewListing(listing: Listing) {
    setListings((prev) => [listing, ...prev]);
    setSelectedId(listing.id);
    setView("detail");
  }

  return (
    <div className="min-h-screen" style={{ background: "#F6F1E8" }}>
      <header className="border-b border-sky-100 bg-white/90 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => {
              setView("browse");
              setSelectedId(null);
            }}
            className="flex items-center gap-2.5 text-[#2A3D55] font-display font-semibold tracking-tight text-[17px]"
          >
            <img src="/mark.svg" alt="" className="w-9 h-9" />
            Fund the Kid
          </button>
          <nav className="flex items-center gap-2">
            <button
              onClick={() => setView("browse")}
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

      <main className="max-w-6xl mx-auto px-4 py-6">
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
            states={states}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            cpkMin={cpkMin}
            cpkMax={cpkMax}
            setCpkMin={setCpkMin}
            setCpkMax={setCpkMax}
            onOpen={openDetail}
          />
        )}
        {view === "detail" && selected && (
          <DetailView listing={selected} onBack={() => setView("browse")} />
        )}
        {view === "list" && (
          <ListForm onSubmit={handleNewListing} onCancel={() => setView("browse")} />
        )}
      </main>
    </div>
  );
}
