import React, { useState } from 'react';
import { PLATFORM_CONSTITUTION } from '../data/constitutionData';
import { 
  X, 
  ScrollText, 
  CheckCircle2, 
  Compass, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Layers,
  FileCheck2,
  Users
} from 'lucide-react';

interface ConstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConstitutionModal: React.FC<ConstitutionModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'adoption' | 'principles' | 'mvp'>('adoption');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-950/80 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400">
              <ScrollText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-100 tracking-tight">
                  The Constitution of Digital Evolution
                </h2>
                <span className="bg-sky-500/20 text-sky-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-sky-500/30">
                  v1.0 MVP
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                The governing decision filter for product architecture, adoption principles, and feature trade-offs.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-800 bg-slate-950/40 flex items-center gap-4">
          <button
            onClick={() => setActiveTab('adoption')}
            className={`py-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'adoption'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            Principles of Adoption
          </button>

          <button
            onClick={() => setActiveTab('principles')}
            className={`py-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'principles'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Core Architectural Principles
          </button>

          <button
            onClick={() => setActiveTab('mvp')}
            className={`py-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'mvp'
                ? 'border-purple-400 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            MVP 1.0 Product Wedge
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Mission Callout */}
          <div className="p-4 bg-gradient-to-r from-sky-950/50 via-slate-900 to-purple-950/50 border border-slate-800 rounded-xl">
            <h4 className="text-xs uppercase font-mono tracking-wider text-sky-400 font-bold mb-1">
              One-Sentence Mandate
            </h4>
            <p className="text-slate-200 font-medium italic text-sm leading-relaxed">
              "{PLATFORM_CONSTITUTION.oneSentenceMission}"
            </p>
          </div>

          {activeTab === 'adoption' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-200 text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                Principles of Real-World Academic Adoption
              </h3>
              <p className="text-xs text-slate-400">
                To win against entrenched legacy publishers, we never force behavior changes on day one. We meet researchers in their existing habits and eliminate friction.
              </p>

              <div className="grid gap-3">
                {PLATFORM_CONSTITUTION.principlesOfAdoption.map((item, idx) => (
                  <div key={idx} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sky-300 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                        {item.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium">{item.rule}</p>
                    <p className="text-xs text-slate-400">{item.rationale}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'principles' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-200 text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Immutable Platform Principles & Trade-Off Matrix
              </h3>

              <div className="space-y-4">
                {PLATFORM_CONSTITUTION.principles.map((p) => (
                  <div key={p.id} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
                        Principle #{p.id}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-100 text-sm">{p.title}</h4>
                    <p className="text-xs text-slate-300 italic">{p.tagline}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>
                    
                    <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg">
                      <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded shrink-0">
                        Trade-Off
                      </span>
                      <p className="text-xs text-slate-300">{p.tradeOff}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'mvp' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-950/30 border border-purple-800/40 rounded-xl space-y-2">
                <h3 className="font-bold text-purple-300 text-sm flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-purple-400" />
                  Primary MVP 1.0 Wedge: Modern Journal + Reviewer Reputation
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Target Audience: {PLATFORM_CONSTITUTION.mvpScope.targetAudience}
                </p>
              </div>

              <h4 className="font-semibold text-slate-200 text-xs uppercase font-mono tracking-wider">
                Core Capabilities Delivered in MVP 1.0:
              </h4>

              <div className="grid gap-2">
                {PLATFORM_CONSTITUTION.mvpScope.coreCapabilities.map((cap, i) => (
                  <div key={i} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-xs text-slate-200 font-medium">{cap}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-300">Ready to test the live MVP 1.0 workflow?</span>
                  <p className="text-[11px] text-slate-400">Explore multi-format reading, submit DOCX/LaTeX, or evaluate reviews in Reviewer Studio.</p>
                </div>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <span>Launch Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5" />
            <span>Digital Evolution Founding Steering Committee</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
