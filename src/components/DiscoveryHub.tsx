import React, { useState } from 'react';
import { Manuscript } from '../types';
import { 
  BookOpen, 
  Sparkles, 
  Eye, 
  Download, 
  TrendingUp, 
  Search, 
  ArrowRight, 
  FileText, 
  Award,
  Filter
} from 'lucide-react';

interface DiscoveryHubProps {
  manuscripts: Manuscript[];
  onSelectManuscript: (m: Manuscript) => void;
  searchQuery: string;
}

export const DiscoveryHub: React.FC<DiscoveryHubProps> = ({
  manuscripts,
  onSelectManuscript,
  searchQuery
}) => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('All');

  const filteredManuscripts = manuscripts.filter((m) => {
    const matchesSearch = 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.authors.some(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDiscipline = selectedDiscipline === 'All' || m.discipline.includes(selectedDiscipline);

    return matchesSearch && matchesDiscipline;
  });

  const featuredManuscript = manuscripts[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 text-slate-100">
      
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-sky-950 border border-slate-800 p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 blur-3xl rounded-full pointer-events-none" />
        
        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/30 px-3 py-1 rounded-full text-sky-300 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Evolution Ecosystem v1.0</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-50 leading-tight">
            Publish once. <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-emerald-300 to-purple-400">Read everywhere.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            A modernized academic publishing platform designed for outcomes: zero-friction 5-minute author submissions, verified peer review recognition (RRI), and interactive multi-format research articles.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>100% Open Access & Crossref Registered</span>
            </div>
            <div className="text-slate-500">•</div>
            <div className="text-purple-300">Reviewer Reputation Index (RRI) Active</div>
            <div className="text-slate-500">•</div>
            <div className="text-sky-300">COPE Ethics Compliant</div>
          </div>
        </div>
      </div>

      {/* Outcome Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 shadow-md">
          <div className="text-xs font-mono uppercase text-sky-400 font-bold">Fast Submission</div>
          <h3 className="font-bold text-slate-100 text-sm">Submit a paper in under 5 minutes</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Drag and drop DOCX or LaTeX files. Automatic parsing extracts titles, abstracts, authors, and reference graphs without tedious 20-page forms.
          </p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 shadow-md">
          <div className="text-xs font-mono uppercase text-purple-400 font-bold">Reviewer Credit</div>
          <h3 className="font-bold text-slate-100 text-sm">Peer reviewers receive visible credit</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Transparent peer review reports minted with citable Crossref DOIs and RRI scores directly enhance institutional recognition and tenure portfolios.
          </p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 shadow-md">
          <div className="text-xs font-mono uppercase text-emerald-400 font-bold">Editorial Matching</div>
          <h3 className="font-bold text-slate-100 text-sm">Match reviewers in minutes, not weeks</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Vector expertise embedding algorithms instantly surface conflict-free reviewers with matching domain mastery to dramatically speed up turnaround.
          </p>
        </div>
      </div>

      {/* Why Digital Evolution? Workflow Comparison */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="border-b border-slate-800 pb-4">
          <div className="text-xs font-mono uppercase text-amber-400 font-bold">The Paradigm Shift</div>
          <h2 className="text-xl font-bold text-slate-100 mt-1">Why Choose Digital Evolution Journal?</h2>
          <p className="text-xs text-slate-400 mt-1">Side-by-side contrast between traditional legacy publishing and our modern ecosystem.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional */}
          <div className="p-5 bg-slate-950/80 border border-rose-900/30 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-400 text-xs font-mono uppercase">Traditional Publishers</span>
              <span className="text-[10px] bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded border border-rose-500/20 font-mono">Slow & Opaque</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Manual 20-step form entry & file formatting rejections</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>4 to 9 months average wait for peer review turnaround</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Unpaid, uncredited peer review hidden behind closed doors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Static PDF output locked behind expensive institutional paywalls</span>
              </li>
            </ul>
          </div>

          {/* Digital Evolution */}
          <div className="p-5 bg-slate-950/80 border border-emerald-500/30 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 text-xs font-mono uppercase">Digital Evolution Ecosystem</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">Fast & Transparent</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-200">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Zero-friction 5-minute DOCX/LaTeX auto-parsing submission</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>AI vector reviewer matching speeds decisions to days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Transparent peer review reports with citable Crossref DOIs & RRI credit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>100% Open Access CC-BY 4.0 with interactive web reading & auto-PDF</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Featured Paper Hero Section */}
      {featuredManuscript && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase text-sky-400 font-bold tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              Featured Breakthrough Research
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl hover:border-slate-700 transition-all group cursor-pointer" onClick={() => onSelectManuscript(featuredManuscript)}>
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="bg-sky-500/20 text-sky-300 font-mono px-3 py-1 rounded-full border border-sky-500/30">
                {featuredManuscript.discipline}
              </span>
              <span className="text-slate-400 font-mono text-[11px]">DOI: {featuredManuscript.doi}</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-50 group-hover:text-sky-400 transition-colors">
                {featuredManuscript.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-serif leading-relaxed line-clamp-3">
                {featuredManuscript.abstract}
              </p>
            </div>

            {/* Author list */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-3 border-t border-slate-800">
              <span>By {featuredManuscript.authors.map(a => a.name).join(', ')}</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-sky-400" /> {featuredManuscript.viewsCount}
                </span>
                <span className="flex items-center gap-1">
                  <Download className="w-3.5 h-3.5 text-emerald-400" /> {featuredManuscript.downloadsCount}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-purple-400" /> {featuredManuscript.citationsCount} citations
                </span>
              </div>

              <button className="px-4 py-2 bg-sky-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-transform group-hover:translate-x-1">
                <span>Read Interactive Article</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Discipline Selector */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span>Latest Articles & Manuscripts ({filteredManuscripts.length})</span>
          </h3>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {['All', 'Neuroscience', 'Materials', 'Computer Science'].map((disc) => (
              <button
                key={disc}
                onClick={() => setSelectedDiscipline(disc)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  selectedDiscipline === disc
                    ? 'bg-slate-800 text-sky-400 border border-slate-700 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {disc}
              </button>
            ))}
          </div>
        </div>

        {/* Article Grid */}
        {filteredManuscripts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-sky-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-200 text-base">No Research Articles Found</h4>
              <p className="text-xs text-slate-400">
                No published or submitted manuscripts matched "{searchQuery}" {selectedDiscipline !== 'All' ? `in ${selectedDiscipline}` : ''}.
              </p>
            </div>
            <button
              onClick={() => setSelectedDiscipline('All')}
              className="px-4 py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Reset Discipline Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredManuscripts.map((m, index) => (
              <div
                key={m.id ? `disc-${m.id}` : `disc-${index}`}
                onClick={() => onSelectManuscript(m)}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 space-y-4 shadow-lg hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="bg-slate-800 text-sky-300 px-2.5 py-0.5 rounded border border-slate-700">
                      {m.discipline}
                    </span>
                    <span className="text-slate-400">{m.status.replace('_', ' ')}</span>
                  </div>

                  <h4 className="font-bold text-base text-slate-100 hover:text-sky-400 transition-colors line-clamp-2">
                    {m.title}
                  </h4>

                  <p className="text-xs text-slate-400 font-serif line-clamp-3 leading-relaxed">
                    {m.abstract}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 space-y-3 text-xs">
                  <p className="text-slate-400 truncate">
                    Authors: {m.authors.map(a => a.name).join(', ')}
                  </p>

                  <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
                    <span>{m.submittedDate}</span>
                    <span className="text-sky-400 hover:underline flex items-center gap-1 font-sans font-semibold">
                      <span>View Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
