import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, Shield, Key } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface SupabaseStatusBadgeProps {
  onOpenModal: () => void;
}

export const SupabaseStatusBadge: React.FC<SupabaseStatusBadgeProps> = ({ onOpenModal }) => {
  const [configured, setConfigured] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const isConfig = isSupabaseConfigured();
    setConfigured(isConfig);

    if (isConfig && supabase) {
      async function checkConnection() {
        try {
          const { error } = await supabase!.from('manuscripts').select('id', { count: 'exact', head: true });
          setConnected(!error);
        } catch {
          setConnected(false);
        }
      }
      checkConnection();
    }
  }, []);

  return (
    <button
      onClick={onOpenModal}
      className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${
        configured && connected
          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
          : configured
          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
          : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
      }`}
      title="Supabase Database & Auth Settings"
    >
      <Database className="w-3.5 h-3.5 text-emerald-400" />
      <span>{configured && connected ? 'Supabase Connected' : 'Supabase Backend'}</span>
      <span className={`w-2 h-2 rounded-full ${
        configured && connected ? 'bg-emerald-400 animate-pulse' : configured ? 'bg-amber-400' : 'bg-slate-500'
      }`} />
    </button>
  );
};
