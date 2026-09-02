import { useState } from "react";
import type { Credential, EntityType, Listing, ModelType, MoneyKind, Proof, WorkKind } from "./data/listings";
import { costPerKid, formatCurrency, formatHorizon, WORK_KIND_LABELS, MONEY_KIND_LABELS } from "./data/listings";
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
        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">{WORK_KIND_LABELS[listing.workKind]}</span>
        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">{MONEY_KIND_LABELS[listing.moneyKind]}</span>
        {listing.subjects.map((s) => (
          <span key={s} className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 text-xs font-medium">{s}</span>
        ))}
      </div>
      <ProofRows listing={listing} />
      <DetailDoors listing={listing} />
    </div>
  );
}

function DetailDoors({ listing }: { listing: Listing }) {
  const money = listing.moneyKind ?? "gift";
  const showGive = money === "gift" || money === "either";
  return (
    <div className={`mt-6 grid gap-4 ${showGive ? "sm:grid-cols-2" : ""}`}>
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
        <p className="text-sm font-medium text-teal-800 mt-3">Example listing. No charge on this site yet.</p>
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
          <button type="submit" className="w-full py-2.5 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700">
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
        <p className="text-sm font-medium text-teal-800 mt-3">Thanks. This is a mock. Nobody is notified yet.</p>
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
  const [workKind, setWorkKind] = useState<WorkKind>("program");
  const [moneyKind, setMoneyKind] = useState<MoneyKind>("gift");
  const [entityType, setEntityType] = useState<EntityType>("other");
  const [successMetric, setSuccessMetric] = useState("");
  const [irsOn, setIrsOn] = useState(false);
  const [irsHref, setIrsHref] = useState("");
  const [irsFile, setIrsFile] = useState("");
  const [candidOn, setCandidOn] = useState(false);
  const [candidHref, setCandidHref] = useState("");
  const [candidFile, setCandidFile] = useState("");
  const [bbbOn, setBbbOn] = useState(false);
  const [bbbHref, setBbbHref] = useState("");
  const [bbbFile, setBbbFile] = useState("");
  const [sosOn, setSosOn] = useState(false);
  const [sosHref, setSosHref] = useState("");
  const [sosFile, setSosFile] = useState("");
  const [einOn, setEinOn] = useState(false);
  const [einHref, setEinHref] = useState("");
  const [einFile, setEinFile] = useState("");
  const [proofRows, setProofRows] = useState<{ title: string; href: string; fileName: string; thirdParty: boolean }[]>([
    { title: "", href: "", fileName: "", thirdParty: false },
  ]);

  const amountN = Number(String(amount).replace(/[^0-9]/g, "")) || 0;
  const kidsN = Number(String(kids).replace(/[^0-9]/g, "")) || 0;
  const previewCpk = kidsN > 0 ? Math.round(amountN / kidsN) : null;
  const left = ((months - 1) / 59) * 100;

  function toggleSubject(s: string) {
    setSubjects((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  }

  function pushSeal(list: Credential[], on: boolean, kind: Credential["kind"], label: string, href: string, fileName: string) {
    if (!on) return;
    list.push({
      kind,
      label,
      href: href.trim() || undefined,
      fileName: fileName.trim() || undefined,
    });
  }

  function buildCredentials(): Credential[] {
    const list: Credential[] = [];
    if (entityType === "nonprofit") {
      pushSeal(list, irsOn, "irs_determination", "IRS determination letter", irsHref, irsFile);
      pushSeal(list, candidOn, "candid_gold", "Candid Gold", candidHref, candidFile);
      pushSeal(list, bbbOn, "bbb_wise_giving", "BBB Wise Giving", bbbHref, bbbFile);
    }
    if (entityType === "for-profit") {
      pushSeal(list, sosOn, "sos_filing", "State SOS filing", sosHref, sosFile);
      pushSeal(list, einOn, "ein_verified", "EIN verified", einHref, einFile);
    }
    return list;
  }

  function buildProofs(): Proof[] {
    return proofRows
      .filter((r) => r.title.trim())
      .map((r) => ({
        title: r.title.trim(),
        thirdParty: r.thirdParty,
        href: r.href.trim() || undefined,
        fileName: r.fileName.trim() || undefined,
      }));
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
      entityType,
      credentials: buildCredentials(),
      proofs: buildProofs(),
      successMetric: successMetric.trim() || undefined,
      workKind,
      moneyKind,
      example: false,
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Kind of work">
            <select value={workKind} onChange={(e) => setWorkKind(e.target.value as WorkKind)} className="w-full rounded-md border border-slate-200 text-sm py-2 px-3 bg-white">
              {(Object.keys(WORK_KIND_LABELS) as WorkKind[]).map((k) => <option key={k} value={k}>{WORK_KIND_LABELS[k]}</option>)}
            </select>
          </Field>
          <Field label="Kind of money">
            <select value={moneyKind} onChange={(e) => setMoneyKind(e.target.value as MoneyKind)} className="w-full rounded-md border border-slate-200 text-sm py-2 px-3 bg-white">
              {(Object.keys(MONEY_KIND_LABELS) as MoneyKind[]).map((k) => <option key={k} value={k}>{MONEY_KIND_LABELS[k]}</option>)}
            </select>
          </Field>
        </div>
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

        <div className="pt-4 mt-2 border-t border-slate-200 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Credibility</h2>
            <p className="text-sm text-slate-600 mt-1">Optional. Empty still publishes.</p>
          </div>
          <Field label="Legal shape">
            <select value={entityType} onChange={(e) => setEntityType(e.target.value as EntityType)} className="w-full rounded-md border border-slate-200 text-sm py-2 px-3 bg-white">
              <option value="other">Other</option>
              <option value="nonprofit">Nonprofit 501(c)(3)</option>
              <option value="for-profit">For-profit</option>
            </select>
          </Field>
          {entityType === "nonprofit" && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Seals / filings</p>
              <SealRow label="IRS letter" on={irsOn} setOn={setIrsOn} href={irsHref} setHref={setIrsHref} fileName={irsFile} setFileName={setIrsFile} />
              <SealRow label="Candid" on={candidOn} setOn={setCandidOn} href={candidHref} setHref={setCandidHref} fileName={candidFile} setFileName={setCandidFile} />
              <SealRow label="BBB Wise Giving" on={bbbOn} setOn={setBbbOn} href={bbbHref} setHref={setBbbHref} fileName={bbbFile} setFileName={setBbbFile} />
            </div>
          )}
          {entityType === "for-profit" && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Seals / filings</p>
              <SealRow label="SOS filing" on={sosOn} setOn={setSosOn} href={sosHref} setHref={setSosHref} fileName={sosFile} setFileName={setSosFile} />
              <SealRow label="EIN" on={einOn} setOn={setEinOn} href={einHref} setHref={setEinHref} fileName={einFile} setFileName={setEinFile} />
            </div>
          )}
          <Field label="Success claim">
            <input value={successMetric} onChange={(e) => setSuccessMetric(e.target.value)} className="w-full rounded-md border border-slate-200 text-sm py-2 px-3" placeholder="One sentence." />
          </Field>
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Proof</p>
            <div className="space-y-3">
              {proofRows.map((row, i) => (
                <div key={i} className="rounded-md border border-slate-200 p-3 space-y-2">
                  <input value={row.title} onChange={(e) => setProofRows((prev) => prev.map((r, idx) => idx === i ? { ...r, title: e.target.value } : r))} placeholder="Title" className="w-full rounded-md border border-slate-200 text-sm py-2 px-3" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input value={row.href} onChange={(e) => setProofRows((prev) => prev.map((r, idx) => idx === i ? { ...r, href: e.target.value } : r))} placeholder="URL" className="w-full rounded-md border border-slate-200 text-sm py-2 px-3" />
                    <label className="block text-xs text-slate-500">
                      File
                      <input type="file" className="block w-full text-xs mt-1" onChange={(e) => setProofRows((prev) => prev.map((r, idx) => idx === i ? { ...r, fileName: e.target.files?.[0]?.name ?? "" } : r))} />
                      {row.fileName ? <span className="block mt-1 text-slate-600">On file: {row.fileName}</span> : null}
                    </label>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" checked={row.thirdParty} onChange={(e) => setProofRows((prev) => prev.map((r, idx) => idx === i ? { ...r, thirdParty: e.target.checked } : r))} />
                    Third-party
                  </label>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setProofRows((prev) => [...prev, { title: "", href: "", fileName: "", thirdParty: false }])} className="mt-2 text-sm font-medium text-sky-700 hover:text-sky-800">
              Add row
            </button>
          </div>
        </div>

        <button type="submit" className="w-full py-2.5 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700">Publish listing</button>
      </form>
    </div>
  );
}


function SealRow({
  label, on, setOn, href, setHref, fileName, setFileName,
}: {
  label: string;
  on: boolean;
  setOn: (v: boolean) => void;
  href: string;
  setHref: (v: string) => void;
  fileName: string;
  setFileName: (v: string) => void;
}) {
  return (
    <div className="rounded-md border border-slate-200 p-3 space-y-2">
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} />
        {label}
      </label>
      {on && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input value={href} onChange={(e) => setHref(e.target.value)} placeholder="URL" className="w-full rounded-md border border-slate-200 text-sm py-2 px-3" />
          <label className="block text-xs text-slate-500">
            File
            <input type="file" className="block w-full text-xs mt-1" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")} />
            {fileName ? <span className="block mt-1 text-slate-600">On file: {fileName}</span> : null}
          </label>
        </div>
      )}
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
