import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { X, Play, Users, Bot, Key } from 'lucide-react';

export default function ModernMobileHome() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  const [modalMode, setModalMode] = useState<'host' | 'join' | 'bots' | null>(null);
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('mafia_playerName') || '');
  const [joinCode, setJoinCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    
    localStorage.setItem('mafia_playerName', playerName.trim());

    if (modalMode === 'host') {
      const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      navigate(`/lobby/${roomId}`);
    } else if (modalMode === 'bots') {
      const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      navigate(`/lobby/${roomId}?mode=bots`);
    } else if (modalMode === 'join' && joinCode.trim()) {
      navigate(`/lobby/${joinCode.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0a] text-zinc-200 flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden selection:bg-blue-500/30">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-blue-600/10 blur-[100px] pointer-events-none" />
      
      <div className="z-10 w-full max-w-sm flex flex-col items-center">
        <h1 className="text-6xl font-black mb-1 tracking-tighter bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent drop-shadow-sm">MAFIA</h1>
        <p className="text-zinc-500 mb-12 tracking-[0.2em] uppercase text-[10px] font-semibold">Undercover Operations</p>
        
        <div className="w-full space-y-3">
          <button 
            onClick={() => setModalMode('host')}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <Play size={18} className="opacity-80" />
            Create Lobby
          </button>
          
          <button 
            onClick={() => setModalMode('join')}
            className="w-full bg-white/[0.05] hover:bg-white/[0.1] text-white font-bold py-4 rounded-xl transition-all border border-white/[0.1] active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <Users size={18} className="opacity-80" />
            Join Game
          </button>

          <button 
            onClick={() => setModalMode('bots')}
            className="w-full bg-transparent text-zinc-400 font-bold py-3 transition-all flex items-center justify-center gap-2 text-sm mt-2"
          >
            <Bot size={16} />
            Practice vs Bots
          </button>
        </div>
      </div>

      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-[#111] border border-white/[0.1] w-full p-6 rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {modalMode === 'host' ? <Play className="text-blue-500 w-5 h-5" /> : modalMode === 'bots' ? <Bot className="text-blue-500 w-5 h-5" /> : <Key className="text-blue-500 w-5 h-5" />}
                {modalMode === 'host' ? 'Host New Game' : modalMode === 'bots' ? 'Bot Match' : 'Join Room'}
              </h2>
              <button 
                className="text-zinc-500 hover:text-white transition-colors bg-white/[0.05] rounded-full p-2"
                onClick={() => setModalMode(null)}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 overflow-y-auto pb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider pl-1">Your Alias</label>
                <input 
                  type="text" 
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  maxLength={12}
                  autoFocus={!playerName}
                  className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-4 py-3.5 text-white placeholder-zinc-700 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-medium text-lg"
                  placeholder="Enter name..."
                />
              </div>

              {modalMode === 'join' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider pl-1">Room Code</label>
                  <input 
                    type="text" 
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    maxLength={6}
                    autoFocus={!!playerName}
                    className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-4 py-3.5 text-white placeholder-zinc-700 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-medium text-lg uppercase tracking-[0.2em]"
                    placeholder="XYZ123"
                  />
                </div>
              )}

              <button 
                type="submit" 
                disabled={!playerName.trim() || (modalMode === 'join' && !joinCode.trim())}
                className="mt-2 w-full bg-white text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50 active:scale-[0.98] text-lg"
              >
                Proceed
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="absolute bottom-6 flex flex-row gap-2 z-20">
        <button onClick={() => setTheme('1930s')} className="px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.05] text-zinc-400 text-xs font-semibold tracking-wide">
          1930s
        </button>
        <button className="px-4 py-2 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wide cursor-default">
          Modern
        </button>
      </div>
    </div>
  );
}
