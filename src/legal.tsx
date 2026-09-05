import type { ReactNode } from "react";

type PageProps = { onBack: () => void };

function LegalShell({ title, children, onBack }: { title: string; children: ReactNode; onBack: () => void }) {
  return (
    <div className="max-w-2xl">
      <button type="button" onClick={onBack} className="text-sm font-medium text-[#4A94C8] hover:underline mb-4">
        Back to browse
      </button>
      <h1 className="text-2xl sm:text-3xl font-bold text-[#2A3D55] tracking-tight">{title}</h1>
      <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-[#3d4d5f]">{children}</div>
    </div>
  );
}

export function PrivacyView({ onBack }: PageProps) {
  return (
    <LegalShell title="Privacy" onBack={onBack}>
      <p>
        Fund the Kid shows example listings so donors can browse programs that help kids learn. Listings are mock. This site does
        not collect accounts or take payment. Search and filters run in the browser. If you use the filter helper, the
        question you type stays in the browser so filters can be set. We do not sell that text. Credentials and proof
        files on listings are examples, not real Candid, BBB, or IRS records.
      </p>
    </LegalShell>
  );
}

export function TermsView({ onBack }: PageProps) {
  return (
    <LegalShell title="Terms" onBack={onBack}>
      <p>
        Listings are examples. They are not an offer, a solicitation, or a live fundraise. Charity seals and state
        filings on example cards are mock. Operators may list without seals or proof. Fund the Kid does not guarantee
        outcomes. Texas for-profit is the intended entity. These pages are a working draft, not lawyered terms.
      </p>
    </LegalShell>
  );
}

export function AboutView({ onBack }: PageProps) {
  return (
    <LegalShell title="About" onBack={onBack}>
      <p>Fund the Kid is a place to fund work that helps kids learn. Anyone doing that work can list. You decide what to support.</p>
      <p>
        The site does not pick winners. That is the point. A foundation already has a staff and a rolodex. This is for
        seeing work those rooms often never see: microschools, tutoring, therapy, tuition, for-profit operators, and
        public programs on the same page, with what it costs to reach a student, in the open.
      </p>
      <p>
        Open listing is not the same as an open checkbook. Filters keep only what a program officer will look at:
        filings, third-party proof, a success measure, gift or ownership, state, category.
      </p>
      <p>
        Money moves the way that class of donor already moves it. Wire. Grant paper. Donor-advised fund. Foundation
        grant. Ownership documents. A call. The small-gift button is not the product.
      </p>
      <p>Listings on this site today are examples, so the product can be tested before live gifts sit on it.</p>
    </LegalShell>
  );
}
