import React, { useState } from 'react';
import { Manuscript, ReviewerProfile } from '../types';
import { 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  Send, 
  Sparkles, 
  FileCheck2, 
  Search, 
  ShieldCheck, 
  RefreshCw,
  XCircle,
  Clock
} from 'lucide-react';

interface EditorialDashboardProps {
  manuscripts: Manuscript[];
  reviewers: ReviewerProfile[];
  onUpdateStatus: (manuscriptId: string, newStatus: any) => void;
}

export const EditorialDashboard: React.FC<EditorialDashboardProps> = ({
  manuscripts,
  reviewers,
  onUpdateStatus
}) => {
  const [selectedManuscriptId, setSelectedManuscriptId] = useState<string>(
    manuscripts[0]?.id || ''
  );
  const [decisionNote, setDecisionNote] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const selectedManuscript = manuscripts.find(m => m.id === selectedManuscriptId);

  const handleDecision = (newStatus: 'accepted' | 'revision_requested' | 'rejected') => {
    if (!selectedManuscript) return;
    onUpdateStatus(selectedManuscript.id, newStatus);
    setActionSuccess(`Decision (${newStatus.replace('_', ' ')}) logged for ${selectedManuscript.id}. Decision letter dispatched to corresponding author.`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      
      {/* Title Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">Editorial Triage & Match Control Center</h1>
            <p className="text-xs text-slate-400">
              Automated pre-checks, smart reviewer matching based on expertise embeddings, and 1-click decision dispatching.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Manuscript Triage Queue (1 col) */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase text-slate-400 font-bold">Manuscripts in Triage Queue</h3>

          <div className="space-y-3">
            {manuscripts.map((m, index) => (
              <button
                key={m.id ? `ed-${m.id}` : `ed-${index}`}
                onClick={() => setSelectedManuscriptId(m.id)}
                className={`w-full p-4 rounded-2xl border text-left space-y-2 transition-all cursor-pointer ${
                  selectedManuscriptId === m.id
                    ? 'bg-amber-950/40 border-amber-500 shadow-lg text-slate-100'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-amber-400">{m.id}</span>
                  <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 uppercase">
                    {m.status.replace('_', ' ')}
                  </span>
                </div>

                <h4 className="font-bold text-xs leading-snug line-clamp-2">{m.title}</h4>
                <p className="text-[11px] text-slate-400">{m.authors[0]?.name} et al.</p>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Triage & AI Audit Panel (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {selectedManuscript ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
              
              {/* Header */}
              <div className="border-b border-slate-800 pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400">Track: {selectedManuscript.discipline}</span>
                  <span className="text-xs text-slate-400">Submitted: {selectedManuscript.submittedDate}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-100">{selectedManuscript.title}</h2>
                <p className="text-xs text-slate-300 font-serif leading-relaxed">{selectedManuscript.abstract}</p>
              </div>

              {/* Automated AI Audit Panel */}
              {selectedManuscript.aiPreCheckScore && (
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                  <h4 className="text-xs font-mono uppercase text-sky-400 font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    Automated Ingestion Pre-Check Audit
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                      <div className="text-base font-bold text-emerald-400">{selectedManuscript.aiPreCheckScore.plagiarismIndex}%</div>
                      <div className="text-[10px] text-slate-400 font-mono">Similarity</div>
                    </div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                      <div className="text-base font-bold text-sky-400">{selectedManuscript.aiPreCheckScore.referenceIntegrity}%</div>
                      <div className="text-[10px] text-slate-400 font-mono">Ref Audit</div>
                    </div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                      <div className="text-base font-bold text-purple-400">{selectedManuscript.aiPreCheckScore.methodologyCompleteness}%</div>
                      <div className="text-[10px] text-slate-400 font-mono">Rigor Score</div>
                    </div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                      <div className="text-base font-bold text-amber-400">{selectedManuscript.aiPreCheckScore.reproducibilityScore}%</div>
                      <div className="text-[10px] text-slate-400 font-mono">Reproducible</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Smart Reviewer Matcher */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase text-purple-400 font-bold flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-purple-400" />
                  Smart Reviewer Recommendations (Vector Expertise Match)
                </h4>

                <div className="space-y-3">
                  {reviewers.map((rev, index) => (
                    <div key={rev.id ? `ed-rev-${rev.id}` : `ed-rev-${index}`} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <img src={rev.avatarUrl} alt={rev.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-100">{rev.name}</span>
                            <span className="bg-purple-500/20 text-purple-300 font-mono text-[10px] px-2 py-0.5 rounded border border-purple-500/30">
                              RRI: {rev.rriScore}
                            </span>
                          </div>
                          <p className="text-slate-400 text-[11px]">{rev.institution}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                          96% Match
                        </span>
                        <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer">
                          Assign Invitation
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Single-Click Decision Dispatcher */}
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                <h4 className="text-xs font-mono uppercase text-amber-400 font-bold">Issue Editorial Decision</h4>

                <textarea
                  rows={2}
                  value={decisionNote}
                  onChange={(e) => setDecisionNote(e.target.value)}
                  placeholder="Add editorial summary note to author decision letter..."
                  className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none"
                />

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleDecision('accepted')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accept Manuscript</span>
                  </button>

                  <button
                    onClick={() => handleDecision('revision_requested')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Request Revisions</span>
                  </button>

                  <button
                    onClick={() => handleDecision('rejected')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-slate-100 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>

                {actionSuccess && (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{actionSuccess}</span>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs bg-slate-900 rounded-2xl border border-slate-800">
              Select a manuscript from the queue to open editorial triage.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
