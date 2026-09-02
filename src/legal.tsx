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
        Fund the Kid shows example listings so donors can browse education projects. Listings are mock. This site does
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
      <p>Fund the Kid helps people give money straight to work that helps kids learn. No gatekeeper in the middle.</p>
      <p>Browse on your own. Compare cost per child. Give to the project.</p>
      <p>
        Schools and programs list without waiting for a foundation to pick winners. Public, private, charter, micro,
        extra help, for-profit, nonprofit. If it helps kids learn, it belongs here.
      </p>
      <p>More of every dollar reaches the kid. Listings on this site are examples.</p>
    </LegalShell>
  );
}
