import React, { useState } from 'react';
import { ReviewerProfile, Manuscript } from '../types';
import { 
  Award, 
  CheckCircle2, 
  Zap, 
  Star, 
  FileCheck2, 
  Quote, 
  ExternalLink, 
  ThumbsUp, 
  Sliders, 
  ShieldCheck, 
  Code2, 
  Clock, 
  MessageSquare,
  Send,
  Sparkles
} from 'lucide-react';

interface ReviewerStudioProps {
  profile: ReviewerProfile;
  manuscriptsNeedingReview: Manuscript[];
  onSubmitReview: (reviewData: any) => void;
}

export const ReviewerStudio: React.FC<ReviewerStudioProps> = ({
  profile,
  manuscriptsNeedingReview,
  onSubmitReview
}) => {
  const [activeTab, setActiveTab] = useState<'passport' | 'assignments'>('passport');
  const [selectedManuscriptId, setSelectedManuscriptId] = useState<string | null>(
    manuscriptsNeedingReview[0]?.id || null
  );

  // Form State for Active Review Submission
  const [methodologyRigor, setMethodologyRigor] = useState(5);
  const [originality, setOriginality] = useState(4);
  const [dataAvailability, setDataAvailability] = useState(5);
  const [overallRating, setOverallRating] = useState(5);
  const [recommendation, setRecommendation] = useState<'accept' | 'minor_revision' | 'major_revision' | 'reject'>('accept');
  const [authorComments, setAuthorComments] = useState('');
  const [editorComments, setEditorComments] = useState('');
  const [publicCitableSnippet, setPublicCitableSnippet] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const selectedManuscript = manuscriptsNeedingReview.find(m => m.id === selectedManuscriptId);

  const handleSubmitReviewForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedManuscript) return;

    const reviewPayload = {
      manuscriptId: selectedManuscript.id,
      reviewerId: profile.id,
      reviewerName: profile.name,
      reviewerInstitution: profile.institution,
      reviewerRri: profile.rriScore,
      recommendation,
      scores: {
        methodologyRigor,
        originality,
        dataAvailability,
        clarity: 4,
        overallRating
      },
      authorComments,
      editorComments,
      publicCitableSnippet,
      reviewDoi: `10.5555/de.review.2026.${selectedManuscript.id.split('-').pop()}.rev${Math.floor(Math.random() * 90 + 10)}`
    };

    onSubmitReview(reviewPayload);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setActiveTab('passport');
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      
      {/* Reviewer Passport Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img 
              src={profile.avatarUrl} 
              alt={profile.name} 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-purple-500/40 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-50">{profile.name}</h1>
                <span className="bg-purple-500/20 text-purple-300 font-mono text-xs px-2.5 py-0.5 rounded-full border border-purple-500/30 font-semibold">
                  RRI: {profile.rriScore}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{profile.title} • {profile.institution}</p>
              <p className="text-[11px] text-slate-400 font-mono mt-1">ORCID: {profile.orcid}</p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-center">
            <div>
              <div className="text-lg font-bold text-purple-400">{profile.rriScore} / 100</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">RRI Index</div>
            </div>
            <div>
              <div className="text-lg font-bold text-emerald-400">{profile.verifiedDOIsCompleted}</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Citable Reviews</div>
            </div>
            <div>
              <div className="text-lg font-bold text-sky-400">{profile.avgTurnaroundDays} days</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Avg Speed</div>
            </div>
            <div>
              <div className="text-lg font-bold text-amber-400">{profile.upvotesCount}</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Editor Upvotes</div>
            </div>
          </div>
        </div>

        {/* Badges Carousel */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800/80">
          <span className="text-xs font-mono uppercase text-slate-400 font-semibold">Earned Distinction Badges:</span>
          {profile.badges.map((badge, idx) => (
            <div key={`badge-${idx}-${badge.title}`} className="bg-purple-950/40 border border-purple-500/30 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs text-purple-300">
              <Award className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="font-semibold">{badge.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="bg-slate-900 p-1.5 border border-slate-800 rounded-xl flex items-center gap-2 shadow-md">
        <button
          onClick={() => setActiveTab('passport')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'passport'
              ? 'bg-purple-500 text-slate-950 font-bold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Reviewer Portfolio & Citable Reviews</span>
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'assignments'
              ? 'bg-purple-500 text-slate-950 font-bold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Active Review Assignments ({manuscriptsNeedingReview.length})</span>
        </button>
      </div>

      {/* TAB 1: REVIEWER PORTFOLIO PASSPORT */}
      {activeTab === 'passport' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100">Verified Citable Review Portfolio</h3>
                <p className="text-xs text-slate-400">Every peer review on Digital Evolution earns a persistent Crossref DOI, allowing you to showcase peer-review rigor on grant proposals and tenure files.</p>
              </div>
              <span className="bg-purple-500/20 text-purple-300 text-[10px] font-mono px-2.5 py-1 rounded-full border border-purple-500/30">
                Verifiable Academic Record
              </span>
            </div>

            <div className="space-y-4">
              {profile.reviewHistory.map((rev, idx) => (
                <div key={rev.reviewDoi ? `rev-hist-${rev.reviewDoi}` : `rev-hist-${idx}`} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <div>
                      <h4 className="font-bold text-slate-100 text-sm">{rev.manuscriptTitle}</h4>
                      <p className="text-xs text-purple-400 font-mono mt-0.5">{rev.journalName} • Completed {rev.completedDate}</p>
                    </div>

                    <div className="text-right">
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30 uppercase">
                        {rev.decisionRecommendation.replace('_', ' ')}
                      </span>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">DOI: {rev.reviewDoi}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 italic p-3 bg-slate-900/60 rounded-lg border border-slate-800/80">
                    "{rev.publicSummary}"
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <ThumbsUp className="w-3.5 h-3.5" /> Upvoted by {rev.helpfulnessScore} researchers & editors
                    </span>
                    <a
                      href={`https://doi.org/${rev.reviewDoi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      <span>Verify DOI Record</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE REVIEW ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Manuscript List (1 col) */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase text-slate-400 font-bold">Assigned Manuscripts</h3>
            
            {manuscriptsNeedingReview.map((m, idx) => (
              <button
                key={m.id ? `rev-assign-${m.id}` : `rev-assign-${idx}`}
                onClick={() => setSelectedManuscriptId(m.id)}
                className={`w-full p-4 rounded-2xl border text-left space-y-2 transition-all cursor-pointer ${
                  selectedManuscriptId === m.id
                    ? 'bg-purple-950/40 border-purple-500 shadow-lg text-slate-100'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                  {m.discipline}
                </span>
                <h4 className="font-bold text-xs leading-snug line-clamp-2">{m.title}</h4>
                <p className="text-[11px] text-slate-400">Submitted: {m.submittedDate}</p>
              </button>
            ))}
          </div>

          {/* Evaluation Form (2 cols) */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            {selectedManuscript ? (
              <form onSubmit={handleSubmitReviewForm} className="space-y-6">
                
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-slate-100">{selectedManuscript.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 font-serif">{selectedManuscript.abstract}</p>
                </div>

                {/* Rubric Rating Sliders */}
                <div className="space-y-4 bg-slate-950 p-5 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-mono uppercase text-purple-400 font-bold">Structured Evaluation Rubric (1-5)</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Methodology Rigor ({methodologyRigor}/5)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={methodologyRigor}
                        onChange={(e) => setMethodologyRigor(Number(e.target.value))}
                        className="w-full accent-purple-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Originality & Advance ({originality}/5)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={originality}
                        onChange={(e) => setOriginality(Number(e.target.value))}
                        className="w-full accent-purple-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Open Data & Reproducibility ({dataAvailability}/5)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={dataAvailability}
                        onChange={(e) => setDataAvailability(Number(e.target.value))}
                        className="w-full accent-purple-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Overall Recommendation ({overallRating}/5)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={overallRating}
                        onChange={(e) => setOverallRating(Number(e.target.value))}
                        className="w-full accent-purple-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Recommendation Choice */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-2">Editorial Decision Recommendation</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {(['accept', 'minor_revision', 'major_revision', 'reject'] as const).map((rec) => (
                      <button
                        key={rec}
                        type="button"
                        onClick={() => setRecommendation(rec)}
                        className={`p-2.5 rounded-xl border text-center font-semibold capitalize transition-all cursor-pointer ${
                          recommendation === rec
                            ? 'bg-purple-500 text-slate-950 font-bold border-purple-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {rec.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback Fields */}
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Comments for Authors</label>
                    <textarea
                      rows={4}
                      value={authorComments}
                      onChange={(e) => setAuthorComments(e.target.value)}
                      placeholder="Detail methodological strengths, suggested clarifications, or additional experiments needed..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Confidential Comments for Editor</label>
                    <textarea
                      rows={2}
                      value={editorComments}
                      onChange={(e) => setEditorComments(e.target.value)}
                      placeholder="Private feedback regarding paper novelty or potential ethical considerations..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Public Citable Review Snippet (DOI Published)</label>
                    <textarea
                      rows={2}
                      value={publicCitableSnippet}
                      onChange={(e) => setPublicCitableSnippet(e.target.value)}
                      placeholder="A 1-2 sentence high-level summary that will be assigned a DOI and credited on your Reviewer Portfolio..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-slate-100 focus:outline-none italic"
                    />
                  </div>
                </div>

                {submittedSuccess && (
                  <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Peer review report published! Crossref DOI generated & +15 RRI points credited to your passport.</span>
                  </div>
                )}

                <div className="flex items-center justify-end pt-4 border-t border-slate-800">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-xl flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Report & Claim DOI Credit</span>
                  </button>
                </div>

              </form>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                Select a manuscript from the list to begin peer review evaluation.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
