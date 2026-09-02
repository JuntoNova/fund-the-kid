import type { Listing, TrustBadge } from "./listings";
import { hasOutcomeProof, MONEY_KIND_LABELS } from "./listings";

export function listingCardBadges(listing: Listing): TrustBadge[] {
  const badges: TrustBadge[] = [];
  const creds = listing.credentials ?? [];
  if (listing.entityType === "nonprofit") {
    badges.push({ label: "501(c)(3)", style: "entity" });
  } else if (listing.entityType === "for-profit") {
    const sos = creds.some((c) => c.kind === "sos_filing");
    const state = listing.state && listing.state !== "Multi" ? listing.state : "";
    badges.push({ label: sos && state ? `${state} SOS` : "For-profit", style: "entity" });
  }
  if (creds.some((c) => c.kind === "candid_gold")) badges.push({ label: "Candid Gold", style: "candid" });
  else if (creds.some((c) => c.kind === "bbb_wise_giving")) badges.push({ label: "BBB Wise Giving", style: "bbb" });
  else if (creds.some((c) => c.kind === "bbb_business")) badges.push({ label: "BBB Business", style: "ein" });
  if (hasOutcomeProof(listing)) badges.push({ label: "Proof", style: "proof" });
  const money = listing.moneyKind ?? "gift";
  badges.push({ label: MONEY_KIND_LABELS[money], style: "money" });
  badges.push({ label: "Example", style: "example" });
  return badges;
}
