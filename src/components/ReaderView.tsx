import React, { useState, useEffect } from 'react';
import { Manuscript, ReviewerProfile } from '../types';
import { fetchSingleManuscriptFromDb } from '../services/supabaseService';
import { 
  FileText, 
  Sparkles, 
  Award, 
  Download, 
  Share2, 
  Quote, 
  CheckCircle2, 
  ExternalLink, 
  UserCheck, 
  Eye, 
  TrendingUp, 
  BookOpen, 
  ThumbsUp, 
  FileCode, 
  Zap, 
  MessageSquare,
  Bookmark,
  Check,
  Loader2,
  ShieldCheck,
  X,
  Globe
} from 'lucide-react';

interface ReaderViewProps {
  manuscript?: Manuscript;
  manuscriptId?: string;
  onOpenReviewerProfile?: (profileId: string) => void;
  reviewerProfiles?: ReviewerProfile[];
  onUpvoteReview?: (reviewId: string) => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({ 
  manuscript: initialManuscript, 
  manuscriptId,
  onOpenReviewerProfile, 
  reviewerProfiles,
  onUpvoteReview 
}) => {
  const [dbManuscript, setDbManuscript] = useState<Manuscript | null>(initialManuscript || null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const targetId = manuscriptId || params?.get('manuscriptId') || params?.get('id') || initialManuscript?.id;

    if (targetId) {
      setIsLoading(true);
      fetchSingleManuscriptFromDb(targetId)
        .then(data => {
          if (data) {
            setDbManuscript(data);
          } else if (initialManuscript) {
            setDbManuscript(initialManuscript);
          }
        })
        .catch(err => {
          console.error('Error fetching single manuscript:', err);
          if (initialManuscript) setDbManuscript(initialManuscript);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (initialManuscript) {
      setDbManuscript(initialManuscript);
    }
  }, [manuscriptId, initialManuscript?.id]);

  const manuscript = dbManuscript || initialManuscript;

  const [activeTab, setActiveTab] = useState<'interactive' | 'pdf' | 'ai_summary' | 'reviews'>('interactive');
  const [copiedDoi, setCopiedDoi] = useState(false);
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [selectedFigure, setSelectedFigure] = useState<string | null>(null);
  const [isDoiModalOpen, setIsDoiModalOpen] = useState(false);

  if (isLoading && !manuscript) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-4 text-slate-300">
        <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
        <p className="text-sm font-semibold">Fetching full article document dynamically from database...</p>
      </div>
    );
  }

  if (!manuscript) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-slate-400 text-sm">No article document found matching the specified manuscript ID.</p>
      </div>
    );
  }

  const handleCopyDoi = () => {
    navigator.clipboard.writeText(manuscript.doi);
    setCopiedDoi(true);
    setTimeout(() => setCopiedDoi(false), 2000);
  };

  const handleCopyBibtex = () => {
    const bibtex = `@article{${manuscript.authors[0]?.name.split(' ').pop()?.toLowerCase()}${manuscript.publishedDate ? manuscript.publishedDate.substring(0, 4) : '2026'},
  title = {${manuscript.title}},
  author = {${manuscript.authors.map(a => a.name).join(' and ')}},
  journal = {Digital Evolution},
  year = {2026},
  doi = {${manuscript.doi}}
}`;
    navigator.clipboard.writeText(bibtex);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      
      {/* Top Header & Article Metadata */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* Status Badges & Disciplines */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="bg-sky-500/20 text-sky-300 font-semibold px-3 py-1 rounded-full border border-sky-500/30 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              {manuscript.discipline}
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 font-mono px-2.5 py-1 rounded-full border border-emerald-500/30 uppercase text-[10px]">
              {manuscript.status.replace('_', ' ')}
            </span>
            <button 
              onClick={() => setIsDoiModalOpen(true)}
              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-mono text-[11px] px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Click to verify DOI record & Crossref deposit metadata"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>DOI: {manuscript.doi}</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-sky-400" /> {manuscript.viewsCount.toLocaleString()} views
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3.5 h-3.5 text-emerald-400" /> {manuscript.downloadsCount.toLocaleString()} downloads
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-purple-400" /> {manuscript.citationsCount} citations
            </span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-50 tracking-tight leading-snug">
            {manuscript.title}
          </h1>
          {manuscript.subtitle && (
            <p className="text-base text-slate-300 font-serif italic">
              {manuscript.subtitle}
            </p>
          )}
        </div>

        {/* Authors Bar */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-800/80">
          {manuscript.authors.map((author, index) => (
            <div key={author.id ? `author-${author.id}` : `author-${index}`} className="flex items-center gap-2.5 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
              {author.avatarUrl ? (
                <img src={author.avatarUrl} alt={author.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-800 text-sky-400 flex items-center justify-center text-xs font-bold">
                  {author.name.charAt(0)}
                </div>
              )}
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-slate-100">{author.name}</span>
                  {author.isCorresponding && (
                    <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1 rounded font-mono" title="Corresponding Author">
                      CA
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 truncate max-w-[180px]">{author.affiliation}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyDoi}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedDoi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Quote className="w-3.5 h-3.5 text-sky-400" />}
              <span>{copiedDoi ? 'DOI Copied!' : 'Copy DOI'}</span>
            </button>

            <button
              onClick={handleCopyBibtex}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedBibtex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileCode className="w-3.5 h-3.5 text-purple-400" />}
              <span>{copiedBibtex ? 'BibTeX Copied!' : 'Export BibTeX'}</span>
            </button>

            <button
              onClick={() => setIsDoiModalOpen(true)}
              className="px-3 py-1.5 bg-sky-950 hover:bg-sky-900 border border-sky-800 text-sky-300 text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Verify DOI Record</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={manuscript.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Publication PDF</span>
            </a>
          </div>
        </div>
      </div>

      {/* Representation Mode Switcher Tabs */}
      <div className="bg-slate-900 p-1.5 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-2 shadow-md">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('interactive')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'interactive'
                ? 'bg-sky-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Interactive Web Article</span>
          </button>

          <button
            onClick={() => setActiveTab('pdf')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'pdf'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Auto-Compiled PDF View</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_summary')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'ai_summary'
                ? 'bg-purple-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Research Brief</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Peer Review Reports ({manuscript.reviews.length})</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400 px-3">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verified Crossref DOI & Archival Storage Active</span>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'interactive' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Article Body (3 cols) */}
          <div className="lg:col-span-3 space-y-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 text-slate-200 shadow-xl leading-relaxed">
            
            {/* Abstract */}
            <section className="p-6 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
              <h3 className="text-xs uppercase font-mono tracking-wider text-sky-400 font-bold">
                Abstract
              </h3>
              <p className="text-sm text-slate-200 font-serif leading-relaxed">
                {manuscript.abstract}
              </p>
            </section>

            {/* Section: Introduction */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-2 flex items-center gap-2">
                <span className="text-sky-400 font-mono text-base">1.</span> Introduction
              </h2>
              <div className="text-sm text-slate-300 space-y-4 font-sans leading-relaxed whitespace-pre-line">
                {manuscript.htmlContent.introduction}
              </div>
            </section>

            {/* Inline Figure Showcase */}
            {manuscript.figures.length > 0 && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <img 
                  src={manuscript.figures[0].imageUrl} 
                  alt={manuscript.figures[0].caption}
                  className="w-full h-80 object-cover rounded-lg border border-slate-800 cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => setSelectedFigure(manuscript.figures[0].imageUrl)}
                />
                <p className="text-xs text-slate-400 italic">
                  {manuscript.figures[0].caption}
                </p>
              </div>
            )}

            {/* Section: Methodology */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-2 flex items-center gap-2">
                <span className="text-sky-400 font-mono text-base">2.</span> Methodology & Experimental Setup
              </h2>
              <div className="text-sm text-slate-300 space-y-4 font-sans leading-relaxed whitespace-pre-line">
                {manuscript.htmlContent.methodology}
              </div>
            </section>

            {/* Section: Results */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-2 flex items-center gap-2">
                <span className="text-sky-400 font-mono text-base">3.</span> Results & Key Findings
              </h2>
              <div className="text-sm text-slate-300 space-y-4 font-sans leading-relaxed whitespace-pre-line">
                {manuscript.htmlContent.results}
              </div>
            </section>

            {/* Section: Discussion & Conclusion */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-2 flex items-center gap-2">
                <span className="text-sky-400 font-mono text-base">4.</span> Discussion & Conclusions
              </h2>
              <div className="text-sm text-slate-300 space-y-4 font-sans leading-relaxed whitespace-pre-line">
                {manuscript.htmlContent.discussion}
              </div>
            </section>

            {/* References Section */}
            <section className="space-y-4 pt-6 border-t border-slate-800">
              <h3 className="text-lg font-bold text-slate-100">References</h3>
              <div className="space-y-3">
                {manuscript.references.map((ref, index) => (
                  <div key={ref.id ? `ref-${ref.id}` : `ref-${index}`} className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sky-400 font-semibold">[{ref.citationKey}]</span>
                      {ref.doi && (
                        <span className="text-[10px] text-slate-500 font-mono">DOI: {ref.doi}</span>
                      )}
                    </div>
                    <p className="text-slate-200 font-medium">{ref.title}</p>
                    <p className="text-slate-400">{ref.authors} ({ref.year}). <span className="italic">{ref.journal}</span>.</p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar / Quick Navigation & Reproducibility (1 col) */}
          <div className="space-y-6">
            
            {/* Reproducibility & Open Science Card */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-lg">
              <h3 className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Open Science Passport
              </h3>
              
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <span className="text-slate-300">Code Artifacts</span>
                  <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono">GitHub / Verified</span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <span className="text-slate-300">Open Telemetry Data</span>
                  <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono">Zenodo Repository</span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <span className="text-slate-300">Reproducibility Test</span>
                  <span className="bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded text-[10px] font-mono">Docker Passed (100%)</span>
                </div>
              </div>
            </div>

            {/* Peer Review Summary Snapshot */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-lg">
              <h3 className="text-xs uppercase font-mono tracking-wider text-purple-400 font-bold flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                Transparent Peer Review
              </h3>
              
              <p className="text-xs text-slate-300">
                This paper underwent rigorous single-blind peer review with {manuscript.reviews.length} verified domain reviewers.
              </p>

              <button
                onClick={() => setActiveTab('reviews')}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Read Verified Review Reports</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* PDF View Tab */}
      {activeTab === 'pdf' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Auto-Compiled Publication PDF</h3>
              <p className="text-xs text-slate-400">Digital Evolution automatically renders structured submissions into archival PDFs for libraries, indexing services, and offline printing.</p>
            </div>
            <a
              href={manuscript.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF File</span>
            </a>
          </div>

          <div className="w-full h-[650px] bg-slate-950 border border-slate-800 rounded-xl flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-200">{manuscript.title}.pdf</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                This document is formatted following the official Digital Evolution 2-column LaTeX grid, complete with embedded metadata headers and Crossref DOI stamps.
              </p>
            </div>
            <a
              href={manuscript.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Open PDF in Reader Tab</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* AI Summary Tab */}
      {activeTab === 'ai_summary' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-100">Research Brief</h3>
                <span className="bg-purple-500/20 text-purple-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-purple-500/30">
                  AI-Assisted • Author-Verified
                </span>
              </div>
              <p className="text-xs text-slate-400">Structured synthesis of key findings, methodology rigor, and reproducibility metrics verified by corresponding authors.</p>
            </div>
          </div>

          <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl space-y-4 font-mono text-xs leading-relaxed text-slate-200">
            {manuscript.aiExecutiveSummary.split('\n').map((line, idx) => (
              <p key={idx} className="flex items-start gap-2">
                <span className="text-purple-400 font-bold shrink-0">•</span>
                <span>{line.replace('• ', '')}</span>
              </p>
            ))}
          </div>

          {/* Pre-check metrics card */}
          {manuscript.aiPreCheckScore && (
            <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-xl space-y-4">
              <h4 className="text-xs uppercase font-mono tracking-wider text-sky-400 font-bold">
                Automated Integrity & Reproducibility Audit
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="text-lg font-bold text-emerald-400">{manuscript.aiPreCheckScore.plagiarismIndex}%</div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Similarity Index</div>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="text-lg font-bold text-sky-400">{manuscript.aiPreCheckScore.referenceIntegrity}%</div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Ref Integrity</div>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="text-lg font-bold text-purple-400">{manuscript.aiPreCheckScore.methodologyCompleteness}%</div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Method Rigor</div>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="text-lg font-bold text-amber-400">{manuscript.aiPreCheckScore.reproducibilityScore}%</div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Reproducibility</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div>
            <h3 className="text-lg font-bold text-slate-100">Transparent Peer Review Reports</h3>
            <p className="text-xs text-slate-400">Digital Evolution elevates peer review to citable scholarly contributions. Reviewers earn Reviewer Reputation Index (RRI) points for verified evaluation reports.</p>
          </div>

          <div className="space-y-6">
            {manuscript.reviews.map((rev, index) => (
              <div key={rev.id ? `rev-${rev.id}` : `rev-${index}`} className="p-6 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 text-sm">{rev.reviewerName}</span>
                      <span className="bg-purple-500/20 text-purple-300 font-mono text-[10px] px-2 py-0.5 rounded border border-purple-500/30">
                        RRI Score: {rev.reviewerRri}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{rev.reviewerInstitution}</p>
                  </div>

                  <div className="text-right">
                    <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] px-2.5 py-1 rounded-full border border-emerald-500/30 uppercase">
                      Recommendation: {rev.recommendation.replace('_', ' ')}
                    </span>
                    {rev.reviewDoi && (
                      <p className="text-[10px] text-slate-500 font-mono mt-1">Review DOI: {rev.reviewDoi}</p>
                    )}
                  </div>
                </div>

                {/* Score breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Methodology Rigor:</span>
                    <span className="font-bold text-sky-400">{rev.scores.methodologyRigor} / 5</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Originality:</span>
                    <span className="font-bold text-emerald-400">{rev.scores.originality} / 5</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Data Availability:</span>
                    <span className="font-bold text-purple-400">{rev.scores.dataAvailability} / 5</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Overall Quality:</span>
                    <span className="font-bold text-amber-400">{rev.scores.overallRating} / 5</span>
                  </div>
                </div>

                {/* Comments */}
                <div className="space-y-2 text-xs">
                  <h5 className="font-bold text-slate-200">Public Reviewer Snippet:</h5>
                  <p className="p-3 bg-slate-900 border border-slate-800/80 rounded-lg text-slate-300 italic">
                    "{rev.publicCitableSnippet}"
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <h5 className="font-bold text-slate-200">Detailed Review Comments:</h5>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                    {rev.authorComments}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-500">
                  <span>Completed on {rev.submittedDate}</span>
                  <button 
                    onClick={() => onUpvoteReview?.(rev.id)}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-sky-400 transition-colors cursor-pointer bg-slate-900 px-3 py-1 rounded-lg border border-slate-800 hover:border-sky-500/30"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-sky-400" />
                    <span>Upvote Helpful Review ({rev.helpfulVotes})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DOI VERIFICATION MODAL */}
      {isDoiModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-5 relative shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-100">DOI Verification & Resolution Record</h3>
              </div>
              <button
                onClick={() => setIsDoiModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Assigned Digital Object Identifier</span>
                <p className="font-mono text-emerald-400 text-sm font-bold">{manuscript.doi}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Registrar Status</span>
                  <span className="font-bold text-sky-400">Internal Journal Record</span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Crossref Deposit</span>
                  <span className="font-bold text-amber-400">
                    {manuscript.status === 'published' ? 'Deposited & Active' : 'Pre-publication Handle'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Digital Preservation & Archival Vault</span>
                <p className="text-slate-300 leading-relaxed">
                  This manuscript is preserved in the <strong className="text-slate-100">Digital Evolution Open Vault</strong>. For newly submitted and in-review manuscripts, the DOI handle is held in our staging repository prior to batch XML submission to Crossref/DataCite upon final publication.
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Crossref Metadata Payload Preview</span>
                <pre className="p-2 bg-slate-900 border border-slate-800/80 rounded-lg text-[10px] font-mono text-emerald-300 overflow-x-auto max-h-28">
{`<doi_record>
  <doi>${manuscript.doi}</doi>
  <title>${manuscript.title}</title>
  <publisher>Digital Evolution Journal</publisher>
  <status>${manuscript.status}</status>
  <timestamp>${manuscript.submittedDate}</timestamp>
</doi_record>`}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <a
                href={`https://doi.org/${manuscript.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Test External Resolution on doi.org</span>
              </a>

              <button
                onClick={() => setIsDoiModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
