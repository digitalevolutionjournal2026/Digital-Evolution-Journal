import React from 'react';
import { UserRole } from '../types';
import { SupabaseStatusBadge } from './SupabaseStatusBadge';
import { 
  BookOpen, 
  UploadCloud, 
  Award, 
  Sliders, 
  ScrollText, 
  Search, 
  Sparkles,
  ChevronDown,
  Globe
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  onOpenConstitution: () => void;
  onOpenSupabaseModal?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  activeRole,
  setActiveRole,
  onOpenConstitution,
  onOpenSupabaseModal,
  searchQuery,
  setSearchQuery
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 transition-all">
      {/* Top Banner announcing MVP 1.0 & Constitution */}
      <div className="bg-gradient-to-r from-emerald-600/20 via-sky-600/20 to-purple-600/20 px-4 py-1.5 text-xs border-b border-slate-800/80 flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold tracking-wide">
            MVP 1.0 ACTIVE
          </span>
          <span className="hidden sm:inline text-slate-300">
            Publish once. Read everywhere. Zero-Friction Ingestion & Verified Reviewer Recognition (RRI).
          </span>
        </div>
        <div className="flex items-center gap-3">
          {onOpenSupabaseModal && <SupabaseStatusBadge onOpenModal={onOpenSupabaseModal} />}
          <button
            onClick={onOpenConstitution}
            className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors font-medium cursor-pointer"
          >
            <ScrollText className="w-3.5 h-3.5" />
            <span>Our Principles & Policies</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setCurrentTab('discovery')} 
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              DE
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-100 tracking-tight group-hover:text-sky-400 transition-colors">
                  Digital Evolution
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                  Journal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wide font-sans">
                The Future of Scholarly Publishing
              </p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 ml-4">
            <button
              onClick={() => setCurrentTab('discovery')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                currentTab === 'discovery' || currentTab === 'reader'
                  ? 'bg-slate-800 text-sky-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Research</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('submit');
                setActiveRole('author');
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                currentTab === 'submit'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Submit Research</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('reviewer');
                setActiveRole('reviewer');
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                currentTab === 'reviewer'
                  ? 'bg-slate-800 text-purple-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Reviewer Portal</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('editor');
                setActiveRole('editor');
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                currentTab === 'editor'
                  ? 'bg-slate-800 text-amber-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Editorial Workspace</span>
            </button>
          </nav>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-sm relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search papers, DOIs, authors, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-sky-500 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder:text-slate-500 transition-all"
          />
        </div>

        {/* Role Switcher & Controls */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 cursor-pointer hover:border-slate-700">
              <span className="text-slate-400">View Mode:</span>
              <span className="font-semibold capitalize text-sky-400 flex items-center gap-1">
                {activeRole}
                <ChevronDown className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Dropdown menu */}
            <div className="absolute right-0 top-full mt-1 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1 hidden group-hover:block z-50">
              <div className="px-3 py-1.5 text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                Switch Perspective
              </div>
              <button
                onClick={() => {
                  setActiveRole('reader');
                  setCurrentTab('discovery');
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-800 ${activeRole === 'reader' ? 'text-sky-400 font-semibold bg-slate-800/50' : 'text-slate-300'}`}
              >
                <Globe className="w-3.5 h-3.5" /> Reader View
              </button>
              <button
                onClick={() => {
                  setActiveRole('author');
                  setCurrentTab('submit');
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-800 ${activeRole === 'author' ? 'text-emerald-400 font-semibold bg-slate-800/50' : 'text-slate-300'}`}
              >
                <UploadCloud className="w-3.5 h-3.5" /> Author Submission
              </button>
              <button
                onClick={() => {
                  setActiveRole('reviewer');
                  setCurrentTab('reviewer');
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-800 ${activeRole === 'reviewer' ? 'text-purple-400 font-semibold bg-slate-800/50' : 'text-slate-300'}`}
              >
                <Award className="w-3.5 h-3.5" /> Reviewer Portfolio
              </button>
              <button
                onClick={() => {
                  setActiveRole('editor');
                  setCurrentTab('editor');
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-800 ${activeRole === 'editor' ? 'text-amber-400 font-semibold bg-slate-800/50' : 'text-slate-300'}`}
              >
                <Sliders className="w-3.5 h-3.5" /> Editor Triage Hub
              </button>
            </div>
          </div>

          <button
            onClick={onOpenConstitution}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Open Constitution & Core Principles"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
