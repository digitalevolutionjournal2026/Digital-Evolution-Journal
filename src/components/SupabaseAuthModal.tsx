import React, { useState } from 'react';
import { Database, Key, Shield, CheckCircle2, Copy, X, Lock, Mail, Sparkles, Terminal } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface SupabaseAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseAuthModal: React.FC<SupabaseAuthModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'auth' | 'schema' | 'env'>('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authMessage, setAuthMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage(null);

    if (!isSupabaseConfigured() || !supabase) {
      setAuthMessage({
        type: 'error',
        text: 'Supabase credentials are not set in environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY). Using fallback local authenticated mode.'
      });
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setAuthMessage({ type: 'success', text: 'Account created! Please check your email for confirmation link.' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setAuthMessage({ type: 'success', text: 'Successfully authenticated with Supabase!' });
      }
    } catch (err: any) {
      setAuthMessage({ type: 'error', text: err.message || 'Authentication error' });
    }
  };

  const handleCopySql = () => {
    const sqlText = `-- Digital Evolution PostgreSQL Schema & RLS Policies
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE TYPE user_role AS ENUM ('reader', 'author', 'reviewer', 'editor', 'journal_admin', 'platform_admin');
CREATE TYPE manuscript_status AS ENUM ('draft', 'submitted', 'under_review', 'revision_requested', 'accepted', 'published', 'rejected');

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role DEFAULT 'reader',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.manuscripts (
  id TEXT PRIMARY KEY,
  doi TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  abstract TEXT NOT NULL,
  status manuscript_status DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.manuscripts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Manuscripts Read" ON public.manuscripts FOR SELECT USING (true);`;

    navigator.clipboard.writeText(sqlText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Supabase Backend & Authentication</h2>
            <p className="text-xs text-slate-400">Production-grade PostgreSQL database, Supabase Auth, Row Level Security, and audit logging.</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 font-mono text-xs">
          <button
            onClick={() => setActiveTab('auth')}
            className={`px-4 py-2.5 font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'auth' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Auth & Login
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-4 py-2.5 font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'schema' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            PostgreSQL Schema
          </button>
          <button
            onClick={() => setActiveTab('env')}
            className={`px-4 py-2.5 font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'env' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Environment Setup
          </button>
        </div>

        {/* Tab 1: Auth & Login */}
        {activeTab === 'auth' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Connection Status:</span>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                isSupabaseConfigured() ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {isSupabaseConfigured() ? 'Supabase Active' : 'Fallback State Mode'}
              </span>
            </div>

            <form onSubmit={handleAuth} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="researcher@university.edu"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                {isSignUp ? 'Create Supabase Account' : 'Sign In with Supabase'}
              </button>
            </form>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sky-400 hover:underline cursor-pointer"
              >
                {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
              </button>
            </div>

            {authMessage && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                authMessage.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                <span>{authMessage.text}</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: PostgreSQL Schema */}
        {activeTab === 'schema' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400">PostgreSQL Schema & RLS Policies Script:</span>
              <button
                onClick={handleCopySql}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer font-mono"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-60 leading-relaxed">
{`-- Digital Evolution PostgreSQL Database Schema
CREATE TABLE public.manuscripts (
  id TEXT PRIMARY KEY,
  doi TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  abstract TEXT NOT NULL,
  status manuscript_status DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.manuscripts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON public.manuscripts FOR SELECT USING (true);`}
            </pre>
          </div>
        )}

        {/* Tab 3: Env Config */}
        {activeTab === 'env' && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-300 leading-relaxed">
              To connect your live Supabase project, declare the following environment variables in your <code className="text-emerald-400 font-mono">.env.example</code> or AI Studio Secrets settings:
            </p>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-sky-300 space-y-1">
              <div>VITE_SUPABASE_URL="https://your-project.supabase.co"</div>
              <div>VITE_SUPABASE_ANON_KEY="your-anon-key"</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
