export const LISTING_TRUST: Record<string, {
  entityType: "nonprofit" | "for-profit" | "other";
  credentials: { kind: "candid_gold" | "bbb_wise_giving" | "irs_determination" | "form_990" | "sos_filing" | "ein_verified" | "bbb_business"; label: string; checkedAt?: string; href?: string }[];
  proofs: { title: string; thirdParty: boolean; href?: string; measure?: string }[];
}> = {
  "1": {
    entityType: "nonprofit",
    credentials: [
      { kind: "candid_gold", label: "Candid Gold", checkedAt: "2026-07", href: "#" },
      { kind: "irs_determination", label: "IRS determination letter", href: "#" },
    ],
    proofs: [
      { title: "Independent math and science assessments, 2025", thirdParty: true, href: "#", measure: "Independent assessments" },
    ],
  },
  "2": {
    entityType: "nonprofit",
    credentials: [
      { kind: "irs_determination", label: "IRS determination letter", href: "#" },
      { kind: "form_990", label: "Form 990", href: "#" },
    ],
    proofs: [
      { title: "College and employment outcomes, operator report", thirdParty: false, measure: "College enrollment" },
    ],
  },
  "3": {
    entityType: "nonprofit",
    credentials: [
      { kind: "irs_determination", label: "IRS determination letter", href: "#" },
      { kind: "candid_gold", label: "Candid Gold", checkedAt: "2026-08", href: "#" },
      { kind: "bbb_wise_giving", label: "BBB Wise Giving", href: "#" },
    ],
    proofs: [
      { title: "NWEA MAP, fall 2024 to spring 2025 · independent", thirdParty: true, href: "#", measure: "Independent assessments" },
    ],
  },
  "4": {
    entityType: "for-profit",
    credentials: [
      { kind: "sos_filing", label: "Texas SOS certificate of formation", href: "#" },
      { kind: "ein_verified", label: "EIN verified" },
    ],
    proofs: [
      { title: "Parent NPS · operator survey, n=41", thirdParty: false, measure: "Parent satisfaction" },
    ],
  },
  "5": {
    entityType: "nonprofit",
    credentials: [
      { kind: "bbb_wise_giving", label: "BBB Wise Giving", href: "#" },
      { kind: "irs_determination", label: "IRS determination letter", href: "#" },
    ],
    proofs: [
      { title: "Industry credential completions, 2025 cohort", thirdParty: true, href: "#", measure: "Credentials" },
    ],
  },
  "6": {
    entityType: "other",
    credentials: [],
    proofs: [
      { title: "Grade-level math gains, co-op records", thirdParty: false, measure: "Grade-level growth" },
    ],
  },
  "7": {
    entityType: "for-profit",
    credentials: [
      { kind: "sos_filing", label: "Tennessee SOS certificate of formation", href: "#" },
      { kind: "ein_verified", label: "EIN verified" },
    ],
    proofs: [
      { title: "Tennessee state assessment results, 2025", thirdParty: true, href: "#", measure: "State assessments" },
    ],
  },
  "8": {
    entityType: "nonprofit",
    credentials: [
      { kind: "candid_gold", label: "Candid Gold", checkedAt: "2026-06", href: "#" },
      { kind: "irs_determination", label: "IRS determination letter", href: "#" },
    ],
    proofs: [
      { title: "Civics knowledge assessment, independent", thirdParty: true, href: "#", measure: "Independent assessments" },
    ],
  },
  "9": {
    entityType: "for-profit",
    credentials: [
      { kind: "sos_filing", label: "Ohio SOS certificate of formation", href: "#" },
    ],
    proofs: [
      { title: "Parent satisfaction, operator survey", thirdParty: false, measure: "Parent satisfaction" },
    ],
  },
  "10": {
    entityType: "nonprofit",
    credentials: [
      { kind: "irs_determination", label: "IRS determination letter", href: "#" },
      { kind: "form_990", label: "Form 990", href: "#" },
    ],
    proofs: [
      { title: "Paid apprenticeship placements, 2025", thirdParty: true, href: "#", measure: "Credentials" },
    ],
  },
  "11": {
    entityType: "nonprofit",
    credentials: [],
    proofs: [
      { title: "One-year reading gain, operator report", thirdParty: false, measure: "Grade-level growth" },
    ],
  },
  "12": {
    entityType: "for-profit",
    credentials: [
      { kind: "sos_filing", label: "California SOS certificate of formation", href: "#" },
      { kind: "ein_verified", label: "EIN verified" },
      { kind: "bbb_business", label: "BBB Business" },
    ],
    proofs: [
      { title: "California state assessment growth, 2025", thirdParty: true, href: "#", measure: "State assessments" },
    ],
  },
};
