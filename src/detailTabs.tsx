import { useState } from "react";
import type { Listing } from "./data/listings";
import { costPerKid, formatCurrency, formatHorizon, WORK_KIND_LABELS, MONEY_KIND_LABELS } from "./data/listings";
import { TrustBadgeRow, ProofRows } from "./insights";
import { ArrowLeft, MapPin, Users, DollarSign } from "lucide-react";

export function DetailView({ listing, onBack }: { listing: Listing; onBack: () => void }) {
  const [tab, setTab] = useState<"details" | "give">("details");
  const cpk = costPerKid(listing);
  const pct = Math.min(100, Math.round((listing.amountFunded / listing.amountSeeking) * 100));
  return (
    <div className="max-w-3xl">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="mb-3">
        <TrustBadgeRow listing={listing} />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{listing.title}</h1>
      {listing.organization && <p className="text-slate-600 mt-1">{listing.organization}</p>}
      <div className="mt-4 mb-5 flex gap-1 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setTab("details")}
          className={`px-4 py-2 text-sm font-bold border-b-2 -mb-px ${tab === "details" ? "border-[#4A94C8] text-[#2A3D55]" : "border-transparent text-slate-500"}`}
        >
          Details
        </button>
        <button
          type="button"
          onClick={() => setTab("give")}
          className={`px-4 py-2 text-sm font-bold border-b-2 -mb-px ${tab === "give" ? "border-[#4A94C8] text-[#2A3D55]" : "border-transparent text-slate-500"}`}
        >
          Give
        </button>
      </div>
      {tab === "give" ? (
        <DetailDoors listing={listing} />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
            <Metric label="Seeking" value={formatCurrency(listing.amountSeeking)} />
            <Metric label="Funded" value={formatCurrency(listing.amountFunded)} />
            <Metric label="Children" value={listing.kidsServed.toLocaleString()} />
            <Metric label="Per child" value={formatCurrency(cpk)} />
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-6">
            <div className="h-full bg-sky-600" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-slate-700 leading-relaxed mb-4">{listing.description}</p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
            <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" />{listing.metro}, {listing.state}</span>
            <span className="inline-flex items-center gap-1"><Users className="w-4 h-4" />{listing.kidsServed.toLocaleString()} children · {formatHorizon(listing)}</span>
            <span className="inline-flex items-center gap-1"><DollarSign className="w-4 h-4" />{formatCurrency(listing.amountSeeking)}</span>
          </div>
          {listing.successMetric && (
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 mb-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Success measure</p>
              <p className="text-sm text-slate-700">{listing.successMetric}</p>
            </div>
          )}
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 mb-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Unit cost</p>
            <p className="text-sm text-slate-700">
              {formatCurrency(listing.amountSeeking)} serves {listing.kidsServed.toLocaleString()} children over {formatHorizon(listing)} ({formatCurrency(cpk)} per child).
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">{listing.modelType}</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">{WORK_KIND_LABELS[listing.workKind]}</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">{MONEY_KIND_LABELS[listing.moneyKind]}</span>
            {listing.subjects.map((s) => (
              <span key={s} className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 text-xs font-medium">{s}</span>
            ))}
          </div>
          <ProofRows listing={listing} />
        </>
      )}
    </div>
  );
}

function DetailDoors({ listing }: { listing: Listing }) {
  const money = listing.moneyKind ?? "gift";
  const showGive = money === "gift" || money === "either";
  return (
    <div className={`grid gap-4 ${showGive ? "sm:grid-cols-2" : ""}`}>
      {showGive ? <GiveNowDoor /> : null}
      <TalkDoor defaultKind={money === "ownership" ? "ownership" : "gift"} />
    </div>
  );
}

function GiveNowDoor() {
  const [amount, setAmount] = useState("50");
  const [done, setDone] = useState(false);
  const presets = [25, 50, 100, 250];
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-semibold text-slate-900">Give now</p>
      <p className="text-sm text-slate-600 mt-1">Small gifts. Pick an amount.</p>
      <p className="text-sm text-slate-600 mt-1">Example listing. No charge on this site yet.</p>
      {done ? (
        <p className="text-sm font-medium text-sky-800 mt-3">Example listing. No charge on this site yet.</p>
      ) : (
        <form
          className="mt-3 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
        >
          <div className="flex flex-wrap gap-2">
            {presets.map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setAmount(String(n))}
                className={`px-3 py-1.5 rounded-full text-sm font-bold border ${amount === String(n) ? "bg-[#e8f4fb] border-[#4A94C8] text-[#2A3D55]" : "bg-white border-slate-200 text-slate-700"}`}
              >
                ${n}
              </button>
            ))}
          </div>
          <label className="block">
            <span className="block text-xs font-medium text-slate-500 mb-1">Amount</span>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
              className="w-full rounded-md border border-slate-200 text-sm py-2 px-3"
              inputMode="numeric"
            />
          </label>
          <button type="submit" className="w-full py-2.5 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700">
            Give now
          </button>
        </form>
      )}
    </div>
  );
}

function TalkDoor({ defaultKind }: { defaultKind: "gift" | "ownership" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [range, setRange] = useState("");
  const [kind, setKind] = useState<"gift" | "ownership">(defaultKind);
  const [move, setMove] = useState("");
  const [done, setDone] = useState(false);
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-semibold text-slate-900">Talk / wire / grant</p>
      <p className="text-sm text-slate-600 mt-1">{defaultKind === "ownership" ? "Ownership talk. Wire or a call. This is not a small gift." : "Bigger gifts. Wire, grant paper, or a call."}</p>
      {done ? (
        <p className="text-sm font-medium text-sky-800 mt-3">Thanks. This is a mock. Nobody is notified yet.</p>
      ) : (
        <form
          className="mt-3 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
        >
          <label className="block">
            <span className="block text-xs font-medium text-slate-500 mb-1">Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-slate-200 text-sm py-2 px-3" />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-500 mb-1">Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-slate-200 text-sm py-2 px-3" />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-500 mb-1">Amount range</span>
            <select value={range} onChange={(e) => setRange(e.target.value)} className="w-full rounded-md border border-slate-200 text-sm py-2 px-3 bg-white">
              <option value="">Choose a range</option>
              <option value="under-10k">Under $10k</option>
              <option value="10-50k">$10k to $50k</option>
              <option value="50-250k">$50k to $250k</option>
              <option value="250k-up">$250k and up</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-500 mb-1">Gift or Ownership</span>
            <select value={kind} onChange={(e) => setKind(e.target.value as "gift" | "ownership")} className="w-full rounded-md border border-slate-200 text-sm py-2 px-3 bg-white">
              <option value="gift">Gift</option>
              <option value="ownership">Ownership</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-500 mb-1">How to move money</span>
            <select value={move} onChange={(e) => setMove(e.target.value)} className="w-full rounded-md border border-slate-200 text-sm py-2 px-3 bg-white">
              <option value="">Choose a path</option>
              <option value="wire">Wire</option>
              <option value="grant">Grant paper</option>
              <option value="call">Call</option>
            </select>
          </label>
          <button type="submit" className="w-full py-2.5 rounded-lg bg-[#4A94C8] text-white text-sm font-medium hover:bg-[#3d86b8]">
            Send
          </button>
        </form>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-slate-900 mt-0.5">{value}</p>
    </div>
  );
}
