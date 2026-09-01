import { useMemo, useState } from "react";
import {
  LISTINGS,
  costPerKid,
  formatCurrency,
} from "./data/listings";
import type { Listing, ModelType } from "./data/listings";
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
  const [showFilters, setShowFilters] = useState(true);
  const [cpkMin, setCpkMin] = useState<number | null>(null);
  const [cpkMax, setCpkMax] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (query) {
        const q = query.toLowerCase();
        const hay = `${l.title} ${l.description} ${l.organization ?? ""} ${l.metro} ${l.state}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (stateFilter && l.state !== stateFilter) return false;
      if (modelFilter && l.modelType !== modelFilter) return false;
      if (subjectFilter && !l.subjects.includes(subjectFilter)) return false;
      const cpk = costPerKid(l);
      if (cpkMin != null && cpk < cpkMin) return false;
      if (cpkMax != null && cpk > cpkMax) return false;
      return true;
    });
  }, [listings, query, stateFilter, modelFilter, subjectFilter, cpkMin, cpkMax]);

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
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => {
              setView("browse");
              setSelectedId(null);
            }}
            className="flex items-center gap-2.5 text-slate-900 font-semibold tracking-tight"
          >
            <div className="w-7 h-7 rounded-md bg-teal-600 flex items-center justify-center text-white text-[10px] font-bold leading-none">
              FTK
            </div>
            Fund the Kid
          </button>
          <nav className="flex items-center gap-2">
            <button
              onClick={() => setView("browse")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                view === "browse" ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Browse
            </button>
            <button
              onClick={() => setView("list")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-teal-600 text-white hover:bg-teal-700"
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
