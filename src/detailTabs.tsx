import { useEffect, useState } from "react";
import type { Listing } from "./data/listings";
import { costPerKid, formatCurrency, formatHorizon, WORK_KIND_LABELS, MONEY_KIND_LABELS } from "./data/listings";
import { TrustBadgeRow, ProofRows } from "./insights";
import { ArrowLeft, MapPin, Users, DollarSign } from "lucide-react";

export function DetailView({ listing, onBack }: { listing: Listing; onBack: () => void }) {
  const cpk = costPerKid(listing);
  const pct = Math.min(100, Math.round((listing.amountFunded / listing.amountSeeking) * 100));

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [listing.id]);

  return (
    <div className="max-w-3xl">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-[#6b7786] hover:text-[#2A3D55] mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to browse
      </button>
      <div className="rounded-xl border border-[#e4ddd2] bg-white overflow-hidden">
      <div className="p-5 sm:p-7">
      <div className="mb-3">
        <TrustBadgeRow listing={listing} />
      </div>
      <h1 className="text-[26px] sm:text-[30px] font-extrabold text-[#2A3D55] tracking-tight leading-tight">{listing.title}</h1>
      {listing.organization && <p className="text-[#3d4d5f] mt-1.5">{listing.organization}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#e4ddd2] border border-[#e4ddd2] rounded-xl overflow-hidden my-5">
        <Metric label="Needed" value={formatCurrency(listing.amountSeeking)} />
        <Metric label="Funded" value={formatCurrency(listing.amountFunded)} />
        <Metric label="Students" value={listing.kidsServed.toLocaleString()} />
        <Metric label="Per student" value={formatCurrency(cpk)} />
      </div>
      <div className="h-1.5 rounded-full bg-[#e8f4fb] overflow-hidden mb-6">
        <div className="h-full bg-[#4A94C8]" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[#3d4d5f] leading-relaxed mb-4">{listing.description}</p>
      <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
        <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" />{listing.metro}, {listing.state}</span>
        <span className="inline-flex items-center gap-1"><Users className="w-4 h-4" />{listing.kidsServed.toLocaleString()} students · {formatHorizon(listing)}</span>
        <span className="inline-flex items-center gap-1"><DollarSign className="w-4 h-4" />{formatCurrency(listing.amountSeeking)}</span>
      </div>
      {listing.successMetric && (
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 mb-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Success measure</p>
          <p className="text-sm text-slate-700">{listing.successMetric}</p>
        </div>
      )}
      <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 mb-4">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">To reach one student</p>
        <p className="text-sm text-slate-700">
          {formatCurrency(listing.amountSeeking)} reaches {listing.kidsServed.toLocaleString()} students over {formatHorizon(listing)} ({formatCurrency(cpk)} per student).
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
      </div>
      </div>
      <div className="mt-6">
        <DetailDoors listing={listing} />
      </div>
    </div>
  );
}

function DetailDoors({ listing }: { listing: Listing }) {
  const money = listing.moneyKind ?? "gift";
  const showGive = money === "gift" || money === "either";
  return (
    <div className="space-y-4">
      <TalkDoor defaultKind={money === "ownership" ? "ownership" : "gift"} />
      {showGive ? <GiveNowDoor /> : null}
    </div>
  );
}

function GiveNowDoor() {
  const [amount, setAmount] = useState("50");
  const [done, setDone] = useState(false);
  const presets = [25, 50, 100, 250];
  return (
    <div className="rounded-xl border border-[#e4ddd2] bg-white p-5">
      <p className="text-sm font-semibold text-slate-900">Small gift</p>
      <p className="text-sm text-slate-600 mt-1">For a card gift under $1,000. Not the path for a foundation or a DAF.</p>
      {done ? (
        <p className="text-sm font-medium text-sky-800 mt-3">Recorded on this demo. No charge yet.</p>
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
          <button type="submit" className="w-full py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-medium hover:bg-slate-50">
            Record a small gift
          </button>
        </form>
      )}
    </div>
  );
}

function TalkDoor({ defaultKind }: { defaultKind: "gift" | "ownership" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [range, setRange] = useState("");
  const [kind, setKind] = useState<"gift" | "ownership">(defaultKind);
  const [move, setMove] = useState("");
  const [done, setDone] = useState(false);
  return (
    <div className="rounded-xl border border-[#e4ddd2] bg-white p-5">
      <p className="text-sm font-semibold text-slate-900">Wire, grant, DAF, or ownership</p>
      <p className="text-sm text-slate-600 mt-1">
        {defaultKind === "ownership"
          ? "This listing is asking for an ownership stake. A program officer can follow up on a call or with documents."
          : "This is the path for a large gift. Foundation, DAF, wire, or grant paper."}
      </p>
      {done ? (
        <p className="text-sm font-medium text-sky-800 mt-3">Request recorded on this demo. No one is notified yet.</p>
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
            <span className="block text-xs font-medium text-slate-500 mb-1">Work email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-slate-200 text-sm py-2 px-3" />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-500 mb-1">Foundation, DAF, or firm</span>
            <input value={org} onChange={(e) => setOrg(e.target.value)} className="w-full rounded-md border border-slate-200 text-sm py-2 px-3" />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-500 mb-1">Amount range</span>
            <select value={range} onChange={(e) => setRange(e.target.value)} className="w-full rounded-md border border-slate-200 text-sm py-2 px-3 bg-white">
              <option value="">Choose a range</option>
              <option value="under-250k">Under $250k</option>
              <option value="250k-1m">$250k to $1M</option>
              <option value="1-5m">$1M to $5M</option>
              <option value="5m-up">$5M and up</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-500 mb-1">Gift or ownership</span>
            <select value={kind} onChange={(e) => setKind(e.target.value as "gift" | "ownership")} className="w-full rounded-md border border-slate-200 text-sm py-2 px-3 bg-white">
              <option value="gift">Gift</option>
              <option value="ownership">Ownership</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-500 mb-1">How the money would move</span>
            <select value={move} onChange={(e) => setMove(e.target.value)} className="w-full rounded-md border border-slate-200 text-sm py-2 px-3 bg-white">
              <option value="">Choose a path</option>
              <option value="wire">Wire</option>
              <option value="grant">Grant paper</option>
              <option value="daf">Donor-advised fund</option>
              <option value="foundation">Foundation grant</option>
              <option value="ownership-docs">Ownership documents</option>
              <option value="call">Call with a program officer</option>
            </select>
          </label>
          <button type="submit" className="w-full py-2.5 rounded-lg bg-[#4A94C8] text-white text-sm font-medium hover:bg-[#3d86b8]">
            Request a follow-up
          </button>
        </form>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-3 sm:p-4">
      <p className="label">{label}</p>
      <p className="num text-lg font-extrabold text-[#2A3D55] mt-1">{value}</p>
    </div>
  );
}
