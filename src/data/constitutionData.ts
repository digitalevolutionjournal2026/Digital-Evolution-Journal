export interface Principle {
  id: number;
  title: string;
  tagline: string;
  description: string;
  tradeOff: string;
}

export interface AdoptionPrinciple {
  title: string;
  rule: string;
  rationale: string;
}

export const PLATFORM_CONSTITUTION = {
  oneSentenceMission: "Digital Evolution is the modern infrastructure for scholarly publishing, enabling transparent peer review, beautiful multi-format publishing, and trusted knowledge dissemination.",
  coreDirectives: [
    "Never force researchers to change how they write (Support DOCX, LaTeX, and Markdown natively).",
    "Treat PDF as one representation, not the only format (Auto-generate Interactive Web HTML, PDF, Executive AI Snapshots, and Mobile Views).",
    "Transform Peer Review from an unpaid chore into a citable, prestigious career asset through the Reviewer Reputation Index (RRI).",
    "Fit seamlessly into existing academic workflows first before attempting radical behavioral shifts."
  ],
  principlesOfAdoption: [
    {
      title: "Zero-Friction Ingestion",
      rule: "Never ask authors to re-type metadata into 20 form fields.",
      rationale: "Upload DOCX or LaTeX -> AI automatically parses title, authors, abstract, affiliations, and references in under 5 seconds."
    },
    {
      title: "Coexistence Over Replacement",
      rule: "Enhance PDFs rather than declaring war on them.",
      rationale: "Universities, archives, and courts require static PDFs for permanent records. Generate publication-ready PDFs alongside interactive Web HTML."
    },
    {
      title: "Modularity First",
      rule: "Allow institutions and journals to adopt individual modules.",
      rationale: "Journals can adopt just the Reviewer Studio, or just the Publishing Portal, or the full end-to-end stack without forced migration."
    },
    {
      title: "Configurable Transparency",
      rule: "Support single-blind, double-blind, and fully open peer review.",
      rationale: "Different academic disciplines have distinct trust models. Flexibility accelerates adoption across medical, engineering, and humanities domains."
    },
    {
      title: "Reviewer Equity",
      rule: "Every peer review contributes to a citable Reviewer Portfolio with a DOI.",
      rationale: "When reviewing builds public scholarly reputation and institutional recognition, reviewer response rates increase by 4x."
    }
  ] as AdoptionPrinciple[],
  principles: [
    {
      id: 1,
      title: "We Optimize for Knowledge, Not PDFs",
      tagline: "PDFs are a delivery format; knowledge is structured content.",
      description: "Static pages limit accessibility, searchability, and data interactivity. We store rich semantic content and render it dynamically everywhere.",
      tradeOff: "We invest extra effort into intelligent parsing so authors never have to manually structure JSON or markdown."
    },
    {
      id: 2,
      title: "Review Quality Equals Research Quality",
      tagline: "Peer review is first-class scholarly work.",
      description: "An exceptional peer review saves science from bad data and gives constructive feedback. Reviewers deserve verifiable credit and institutional recognition.",
      tradeOff: "We spend platform resources evaluating and badge-verifying review quality, not just paper counts."
    },
    {
      id: 3,
      title: "Beauty & Speed Reduce Cognitive Load",
      tagline: "Academic tools should feel as polished as top-tier consumer apps.",
      description: "Clunky 1990s journal portals slow down discovery and frustrate researchers. Clean typography and instant load times honor the reader's focus.",
      tradeOff: "We prioritize interface simplicity over cluttering the screen with unused legacy dropdowns."
    },
    {
      id: 4,
      title: "Transparency Builds Unshakable Trust",
      tagline: "Openness creates accountability.",
      description: "Verifiable review histories, transparent decision logs, and open data availability checklists prevent retractions and restore scientific trust.",
      tradeOff: "We enforce rigorous pre-checks for data availability and methodology disclosure."
    },
    {
      id: 5,
      title: "AI Assists, Human Judgment Decides",
      tagline: "AI accelerates triage and formatting; humans make editorial decisions.",
      description: "AI handles reference checking, plagiarism scans, and reviewer matching suggestions, but final desk decisions and scientific critique remain strictly human.",
      tradeOff: "We explicitly flag AI automated checks so authors know exactly when an human editor is reviewing."
    }
  ] as Principle[],
  mvpScope: {
    targetAudience: "Academic Journals, Independent Society Publishers, Conference Chairs, and Research Labs looking for a 10x modern alternative to OJS and Editorial Manager.",
    primaryWedge: "Modern Journal Management Platform + The Reviewer Reputation Engine.",
    coreCapabilities: [
      "1-Click DOCX / LaTeX Ingestion with Automated Semantic Metadata Parsing",
      "Multi-Format Reader Studio (Interactive HTML, Downloadable Auto-PDF, AI Executive Snapshot)",
      "Peer Review Studio featuring Reviewer Reputation Index (RRI) and Citable Review Snippets",
      "Editorial Control Center with Automated Methodology & Plagiarism Pre-Checks",
      "Journal Discovery Portal with Instant Semantic Search and Altmetric Indicators"
    ]
  }
};
