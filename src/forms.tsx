import { useState } from "react";
import type { Listing, ModelType } from "./data/listings";
import { costPerKid, formatCurrency, formatHorizon } from "./data/listings";
import { SUBJECTS, TrustBadgeRow, ProofRows } from "./insights";
import { ArrowLeft, MapPin, Users, DollarSign } from "lucide-react";

const MODEL_TYPES: ModelType[] = ["Microschool","Charter","Private","Supplemental","Hybrid","Homeschool co-op","For-profit","Other"];

function formatMonths(months: number): string {
  if (months < 12) return months === 1 ? "1 month" : `${months} months`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (rem === 0) return years === 1 ? "1 year" : `${years} years`;
  return `${years === 1 ? "1 year" : `${years} years`} ${rem === 1 ? "1 month" : `${rem} months`}`;
}

export function DetailView({ listing, onBack }: { listing: Listing; onBack: () => void }) {
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
        <Metric label="Seeking" value={formatCurrency(listing.amountSeeking)} />
        <Metric label="Funded" value={formatCurrency(listing.amountFunded)} />
        <Metric label="Children" value={listing.kidsServed.toLocaleString()} />
        <Metric label="Per child" value={formatCurrency(cpk)} />
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-6">
        <div className="h-full bg-teal-600" style={{ width: `${pct}%` }} />
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
        {listing.subjects.map((s) => (
          <span key={s} className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 text-xs font-medium">{s}</span>
        ))}
      </div>
      <ProofRows listing={listing} />
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

export function ListForm({ onSubmit, onCancel }: { onSubmit: (listing: Listing) => void; onCancel: () => void }) {
  const [title, setTitle] = useState("");
  const [org, setOrg] = useState("");
  const [amount, setAmount] = useState("");
  const [kids, setKids] = useState("");
  const [months, setMonths] = useState(12);
  const [state, setState] = useState("TX");
  const [metro, setMetro] = useState("");
  const [modelType, setModelType] = useState<ModelType>("Microschool");
  const [subjects, setSubjects] = useState<string[]>(["STEM"]);
  const [description, setDescription] = useState("");

  const amountN = Number(String(amount).replace(/[^0-9]/g, "")) || 0;
  const kidsN = Number(String(kids).replace(/[^0-9]/g, "")) || 0;
  const previewCpk = kidsN > 0 ? Math.round(amountN / kidsN) : null;
  const left = ((months - 1) / 59) * 100;

  function toggleSubject(s: string) {
    setSubjects((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !amountN || !kidsN) return;
    onSubmit({
      id: String(Date.now()),
      title,
      organization: org || undefined,
      amountSeeking: amountN,
      amountFunded: 0,
      kidsServed: kidsN,
      timeHorizonYears: months / 12,
      timeHorizonMonths: months,
      state,
      metro: metro || state,
      description,
      modelType,
      subjects,
      successMeasures: [],
      entityType: "other",
      credentials: [],
      proofs: [],
    });
  }

  return (
    <div className="max-w-2xl">
      <button onClick={onCancel} className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">List an opportunity</h1>
      <p className="text-sm text-slate-600 mb-6">Required fields.</p>
      <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-xl border border-slate-200 p-6">
        <Field label="Title / name of the opportunity" required>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-md border border-slate-200 text-sm py-2 px-3" required />
        </Field>
        <Field label="Organization">
          <input value={org} onChange={(e) => setOrg(e.target.value)} className="w-full rounded-md border border-slate-200 text-sm py-2 px-3" />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Amount to raise" required>
            <input value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-md border border-slate-200 text-sm py-2 px-3" placeholder="2500000" required />
          </Field>
          <Field label="Children served" required>
            <input value={kids} onChange={(e) => setKids(e.target.value)} className="w-full rounded-md border border-slate-200 text-sm py-2 px-3" required />
          </Field>
        </div>
        {previewCpk != null && <p className="text-sm text-slate-600">{formatCurrency(previewCpk)} per child</p>}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Time horizon</span>
            <span className="text-sm font-semibold text-slate-900 tabular-nums">{formatMonths(months)}</span>
          </div>
          <div className="relative h-8">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-slate-200" />
            <div className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-teal-500" style={{ left: 0, width: `${left}%` }} />
            <input
              type="range"
              min={1}
              max={60}
              step={1}
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="absolute inset-0 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-teal-600 [&::-webkit-slider-thumb]:shadow"
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>1 month</span>
            <span>5 years</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="State">
            <input value={state} onChange={(e) => setState(e.target.value.toUpperCase())} className="w-full rounded-md border border-slate-200 text-sm py-2 px-3" />
          </Field>
          <Field label="Metro">
            <input value={metro} onChange={(e) => setMetro(e.target.value)} className="w-full rounded-md border border-slate-200 text-sm py-2 px-3" />
          </Field>
        </div>
        <Field label="Model">
          <select value={modelType} onChange={(e) => setModelType(e.target.value as ModelType)} className="w-full rounded-md border border-slate-200 text-sm py-2 px-3 bg-white">
            {MODEL_TYPES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Categories">
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map((s) => (
              <button type="button" key={s} onClick={() => toggleSubject(s)} className={`px-2 py-1 rounded-md text-xs font-medium border ${subjects.includes(s) ? "bg-teal-600 text-white border-teal-600" : "bg-white text-slate-700 border-slate-200"}`}>{s}</button>
            ))}
          </div>
        </Field>
        <Field label="Description">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full rounded-md border border-slate-200 text-sm py-2 px-3" />
        </Field>
        <button type="submit" className="w-full py-2.5 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700">Publish listing</button>
      </form>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1">{label}{required ? " *" : ""}</span>
      {children}
    </label>
  );
}
