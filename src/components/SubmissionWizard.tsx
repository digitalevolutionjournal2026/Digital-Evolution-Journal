import React, { useState } from 'react';
import { Manuscript, Author } from '../types';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  User, 
  Plus, 
  Trash2, 
  ArrowRight, 
  ShieldAlert, 
  Loader2, 
  Check, 
  FileCode, 
  BookOpen, 
  FileCheck2
} from 'lucide-react';

interface SubmissionWizardProps {
  onManuscriptSubmitted: (manuscript: Manuscript) => void;
}

export const SubmissionWizard: React.FC<SubmissionWizardProps> = ({ onManuscriptSubmitted }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isParsing, setIsParsing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  
  // Parsed Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [discipline, setDiscipline] = useState('Computer Science & AI');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('Machine Learning, Neural Networks, Open Science');
  const [reviewPreference, setReviewPreference] = useState<'single_blind' | 'double_blind' | 'open_review'>('single_blind');
  
  const [authors, setAuthors] = useState<Author[]>([
    {
      id: 'auth-current',
      name: 'Dr. Sarah Lin',
      affiliation: 'Department of Computer Science, MIT',
      orcid: '0000-0002-9912-3341',
      email: 'slin@mit.edu',
      isCorresponding: true
    }
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setIsParsing(true);
      
      // Simulate fast 2.5s parsing
      setTimeout(() => {
        setIsParsing(false);
        setTitle('Autonomous Agent Orchestration for Heterogeneous Distributed Systems');
        setSubtitle('A Zero-Friction Formal Verification Framework with Sub-Second Consensus');
        setAbstract('Distributed autonomous multi-agent systems require formal verification models to prevent state deadlock and catastrophic cascade failures under partial network partitioning. In this paper, we propose AgentConsensus—a lightweight distributed state-checking engine built on asynchronous token-bucket primitives.');
        setStep(2);
      }, 2000);
    }
  };

  const handleAddAuthor = () => {
    setAuthors([
      ...authors,
      {
        id: `auth-${Date.now()}`,
        name: '',
        affiliation: '',
        email: '',
        isCorresponding: false
      }
    ]);
  };

  const handleRemoveAuthor = (id: string) => {
    if (authors.length > 1) {
      setAuthors(authors.filter(a => a.id !== id));
    }
  };

  const handleFinalSubmit = () => {
    const newManuscript: Manuscript = {
      id: `de-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      doi: `10.5555/de.2026.${Math.floor(1000 + Math.random() * 9000)}`,
      title: title || 'Untitled Research Manuscript',
      subtitle: subtitle,
      abstract: abstract || 'No abstract provided.',
      aiExecutiveSummary: `• Parsed Ingestion: Uploaded via ${fileName || 'DOCX'}.\n• Automated Audit: Reference check passed. Zero plagiarism flags detected.\n• Status: Assigned to Editorial Queue for Reviewer Matching.`,
      authors: authors.filter(a => a.name.trim() !== ''),
      discipline: discipline,
      keywords: keywords.split(',').map(k => k.trim()),
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'submitted',
      formatSource: 'docx',
      viewsCount: 1,
      downloadsCount: 0,
      citationsCount: 0,
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      htmlContent: {
        introduction: 'The rapid proliferation of distributed autonomous agents demands rigorous safety verification mechanisms.',
        methodology: 'We formally verify multi-agent transitions using temporal logic model checkers.',
        results: 'Experimental benchmarks demonstrate zero deadlock events across 100,000 synthetic partition simulations.',
        discussion: 'These results pave the way for scalable edge intelligence deployments.',
        conclusion: 'AgentConsensus provides an empirical foundation for trustworthy multi-agent systems.'
      },
      figures: [],
      references: [
        {
          id: 'ref-parsed-1',
          citationKey: 'Lamport2019',
          title: 'Formal verification of distributed consensus',
          authors: 'Lamport, L.',
          journal: 'ACM Computing Surveys',
          year: 2019,
          doi: '10.1145/331201'
        }
      ],
      reviews: [],
      aiPreCheckScore: {
        plagiarismIndex: 1,
        referenceIntegrity: 99,
        methodologyCompleteness: 95,
        reproducibilityScore: 94,
        flaggedIssues: []
      }
    };

    onManuscriptSubmitted(newManuscript);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 text-slate-100">
      
      {/* Title Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">Zero-Friction Author Ingestion Engine</h1>
            <p className="text-xs text-slate-400">
              Drop your manuscript (.docx, .tex, or .md). Our semantic parser extracts metadata in under 5 seconds so you never re-type metadata fields.
            </p>
          </div>
        </div>

        {/* Wizard Steps indicator */}
        <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-800 text-xs">
          <div className={`p-2.5 rounded-xl border text-center font-medium ${step >= 1 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
            1. Document Upload
          </div>
          <div className={`p-2.5 rounded-xl border text-center font-medium ${step >= 2 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
            2. Metadata Audit
          </div>
          <div className={`p-2.5 rounded-xl border text-center font-medium ${step >= 3 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
            3. Authors & ORCID
          </div>
          <div className={`p-2.5 rounded-xl border text-center font-medium ${step >= 4 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
            4. Review Options
          </div>
        </div>
      </div>

      {/* STEP 1: FILE UPLOAD */}
      {step === 1 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-xl">
          <div className="max-w-md mx-auto border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-8 space-y-4 transition-colors bg-slate-950/60 group">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-200">
                Drag and drop your manuscript here
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports Microsoft Word (.docx), LaTeX (.tex), or Markdown (.md)
              </p>
            </div>

            <label className="inline-block px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-lg shadow-emerald-600/20">
              Browse Files
              <input
                type="file"
                accept=".docx,.tex,.md,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {isParsing && (
            <div className="p-4 bg-slate-950 border border-emerald-500/30 rounded-xl max-w-md mx-auto flex items-center gap-3 text-xs text-emerald-300 animate-pulse">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-400 shrink-0" />
              <span>Parsing document structure, figures, and reference list...</span>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800/80 max-w-lg mx-auto text-left space-y-2 text-xs text-slate-400">
            <p className="font-semibold text-slate-300">Or test with one of our sample drafts:</p>
            <button
              onClick={() => {
                setFileName('NeuroVec_Draft_v2.docx');
                setTitle('Neural Decoding Architecture for Bionic Motors');
                setSubtitle('Sub-10ms Inference via Micro-electrode Spatial Attention');
                setAbstract('Restoring natural motor control in neuroprosthetics requires neural decoding algorithms capable of handling high-dimensional signals in real time.');
                setStep(2);
              }}
              className="w-full p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left text-slate-300 hover:text-sky-400 transition-colors cursor-pointer flex items-center justify-between"
            >
              <span>Load Sample Draft: NeuroVec_Draft_v2.docx</span>
              <FileText className="w-4 h-4 text-sky-400" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: METADATA AUDIT & REFINEMENT */}
      {step === 2 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Parsed Manuscript Metadata
              </h3>
              <p className="text-xs text-slate-400">Extracted from {fileName}. Please review or edit if necessary.</p>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2.5 py-1 rounded-full border border-emerald-500/30">
              100% Parsed
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Manuscript Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Subtitle (Optional)</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Discipline / Track</label>
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
              >
                <option value="Computer Science & AI">Computer Science & Artificial Intelligence</option>
                <option value="Neuroscience & BCI">Neuroscience & Bionic Systems</option>
                <option value="Clean Energy & Materials">Clean Energy & Materials Science</option>
                <option value="Quantum Computing">Quantum Computing & Physics</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Abstract</label>
              <textarea
                rows={4}
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-100 focus:outline-none font-serif text-xs leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Keywords (Comma separated)</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl hover:bg-slate-700 cursor-pointer"
            >
              Back
            </button>

            <button
              onClick={() => setStep(3)}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/20"
            >
              <span>Next: Authors & ORCID</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: AUTHORS */}
      {step === 3 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                Author Contributions & ORCID Tags
              </h3>
              <p className="text-xs text-slate-400">Ensure all contributing authors are credited and tagged with valid ORCIDs.</p>
            </div>

            <button
              onClick={handleAddAuthor}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Author</span>
            </button>
          </div>

          <div className="space-y-4">
            {authors.map((auth, idx) => (
              <div key={auth.id ? `auth-${auth.id}` : `auth-${idx}`} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 relative text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-emerald-400 font-bold">Author #{idx + 1}</span>
                  {authors.length > 1 && (
                    <button
                      onClick={() => handleRemoveAuthor(auth.id)}
                      className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Full Name</label>
                    <input
                      type="text"
                      value={auth.name}
                      onChange={(e) => {
                        const updated = [...authors];
                        updated[idx].name = e.target.value;
                        setAuthors(updated);
                      }}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Affiliation & Institution</label>
                    <input
                      type="text"
                      value={auth.affiliation}
                      onChange={(e) => {
                        const updated = [...authors];
                        updated[idx].affiliation = e.target.value;
                        setAuthors(updated);
                      }}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Email Address</label>
                    <input
                      type="email"
                      value={auth.email}
                      onChange={(e) => {
                        const updated = [...authors];
                        updated[idx].email = e.target.value;
                        setAuthors(updated);
                      }}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">ORCID iD</label>
                    <input
                      type="text"
                      value={auth.orcid || ''}
                      onChange={(e) => {
                        const updated = [...authors];
                        updated[idx].orcid = e.target.value;
                        setAuthors(updated);
                      }}
                      placeholder="0000-0000-0000-0000"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl hover:bg-slate-700 cursor-pointer"
            >
              Back
            </button>

            <button
              onClick={() => setStep(4)}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/20"
            >
              <span>Next: Peer Review Options</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW OPTIONS & SUBMIT */}
      {step === 4 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-slate-100">Review Preferences & Open Science Choice</h3>
            <p className="text-xs text-slate-400 mt-1">
              Select your journal peer review policy. Digital Evolution supports single-blind, double-blind, or fully open transparent review.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setReviewPreference('single_blind')}
              className={`p-4 rounded-xl border text-left space-y-2 transition-all cursor-pointer ${
                reviewPreference === 'single_blind'
                  ? 'bg-emerald-500/10 border-emerald-500 text-slate-100 shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-400">Single-Blind Review</span>
                {reviewPreference === 'single_blind' && <Check className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-[11px] text-slate-300">
                Reviewers remain anonymous; author identities are visible. Standard in physical sciences.
              </p>
            </button>

            <button
              onClick={() => setReviewPreference('double_blind')}
              className={`p-4 rounded-xl border text-left space-y-2 transition-all cursor-pointer ${
                reviewPreference === 'double_blind'
                  ? 'bg-emerald-500/10 border-emerald-500 text-slate-100 shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-400">Double-Blind Review</span>
                {reviewPreference === 'double_blind' && <Check className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-[11px] text-slate-300">
                Both author and reviewer identities are hidden during evaluation.
              </p>
            </button>

            <button
              onClick={() => setReviewPreference('open_review')}
              className={`p-4 rounded-xl border text-left space-y-2 transition-all cursor-pointer ${
                reviewPreference === 'open_review'
                  ? 'bg-emerald-500/10 border-emerald-500 text-slate-100 shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-400">Open Transparent Review</span>
                {reviewPreference === 'open_review' && <Check className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-[11px] text-slate-300">
                Reviewer reports and reviewer profiles are published alongside accepted manuscripts with DOIs.
              </p>
            </button>
          </div>

          {/* Submission summary box */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
            <h4 className="font-bold text-slate-200">Pre-Submission Auto-Check Summary:</h4>
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Reference list verified against Crossref database (28/28 DOIs resolved)</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Plagiarism pre-scan complete: 1% similarity index (Passed)</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl hover:bg-slate-700 cursor-pointer"
            >
              Back
            </button>

            <button
              onClick={handleFinalSubmit}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-xl flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Complete Ingestion & Submit to Editorial Queue</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
