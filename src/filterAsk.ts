import { SUCCESS_MEASURES } from "./data/listings";
import { NAME_TO_ABBR } from "./data/states";
import { SUBJECTS } from "./insights";

export type AskPatch = {
  stateFilter: string;
  subjectFilter: string;
  successFilter: string;
  trustFilters: string[];
  proofFilters: string[];
  cpkMin: number | null;
  cpkMax: number | null;
  note: string;
};

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9$]+/g, " ").trim();
}

export function parseAsk(raw: string): AskPatch {
  const q = norm(raw);
  const patch: AskPatch = {
    stateFilter: "",
    subjectFilter: "",
    successFilter: "",
    trustFilters: [],
    proofFilters: [],
    cpkMin: null,
    cpkMax: null,
    note: "No matching filters. Try a state, a category, cheap, proof, or a seal.",
  };
  if (!q) return patch;

  const hits: string[] = [];

  for (const [name, abbr] of Object.entries(NAME_TO_ABBR)) {
    const n = norm(name);
    if (q.includes(n) || q.split(" ").includes(abbr.toLowerCase())) {
      patch.stateFilter = abbr;
      hits.push(name);
      break;
    }
  }

  for (const sub of SUBJECTS) {
    const n = norm(sub);
    if (q.includes(n) || (n === "stem" && /\bstem\b/.test(q))) {
      patch.subjectFilter = sub;
      hits.push(sub);
      break;
    }
  }

  for (const m of SUCCESS_MEASURES) {
    const n = norm(m);
    if (n.length > 4 && q.includes(n)) {
      patch.successFilter = m;
      hits.push(m);
      break;
    }
  }
  if (!patch.successFilter && /\bstate scores?\b/.test(q)) {
    patch.successFilter = "State assessments";
    hits.push("State scores");
  }
  if (!patch.successFilter && /\b(independent assessment|nwea|map)\b/.test(q)) {
    patch.successFilter = "Independent assessments";
    hits.push("Independent assessment");
  }
  if (!patch.successFilter && /\b(job|credential)s?\b/.test(q)) {
    patch.successFilter = "Credentials";
    hits.push("Job / credential");
  }

  if (/\b(501|nonprofit|non profit|charity)\b/.test(q)) {
    patch.trustFilters.push("nonprofit");
    hits.push("501(c)(3)");
  }
  if (/\b(for profit|for-profit|sos|state filed|state filing)\b/.test(q)) {
    patch.trustFilters.push("for_profit_filed");
    hits.push("For-profit, state filed");
  }
  if (/\b(seal|candid|bbb|wise giving)\b/.test(q)) {
    patch.trustFilters.push("third_party_seal");
    hits.push("Has third-party seal");
  }
  if (/\bverified( entity)?\b/.test(q)) {
    patch.trustFilters.push("verified");
    hits.push("Verified entity");
  }

  if (/\b(claim only|no file)\b/.test(q)) {
    patch.proofFilters.push("claim_only");
    hits.push("Claim only");
  } else if (/\b(proof|outcome|third party file)\b/.test(q)) {
    patch.proofFilters.push("outcome");
    hits.push("Has outcome proof");
  }

  const under = q.match(/\bunder \$?(\d+)k?\b/);
  if (under) {
    let n = Number(under[1]);
    if (q.includes(under[1] + "k") || /\$?\d+k/.test(q)) n = n * (String(under[1]).length <= 2 ? 1000 : 1);
    if (n < 100) n *= 1000;
    patch.cpkMax = n;
    hits.push(`under $${n.toLocaleString()} per child`);
  } else if (/\b(cheap|low cost|inexpensive|affordable)\b/.test(q)) {
    patch.cpkMax = 3000;
    hits.push("cheap (under $3,000 per child)");
  }

  if (hits.length) patch.note = `Set ${hits.join(", ")}.`;
  return patch;
}
