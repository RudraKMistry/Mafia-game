import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { X, Play, Users, Bot, Key } from 'lucide-react';

export default function ModernDesktopHome() {
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
    <div className="min-h-[100dvh] bg-[#0a0a0a] text-zinc-200 flex flex-col items-center justify-center font-sans relative overflow-hidden selection:bg-blue-500/30">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="z-10 bg-white/[0.02] border border-white/[0.05] p-12 rounded-3xl backdrop-blur-3xl shadow-2xl max-w-lg w-full flex flex-col items-center relative">
        <h1 className="text-7xl font-black mb-2 tracking-tighter bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent drop-shadow-sm">MAFIA</h1>
        <p className="text-zinc-500 mb-10 tracking-[0.2em] uppercase text-xs font-semibold">Undercover Operations</p>
        
        <div className="w-full space-y-4">
          <button 
            onClick={() => setModalMode('host')}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3"
          >
            <Play size={20} className="opacity-80" />
            Create Lobby
          </button>
          
          <button 
            onClick={() => setModalMode('join')}
            className="w-full bg-white/[0.05] hover:bg-white/[0.1] text-white font-bold py-4 rounded-xl transition-all border border-white/[0.1] flex items-center justify-center gap-3"
          >
            <Users size={20} className="opacity-80" />
            Join Game
          </button>

          <button 
            onClick={() => setModalMode('bots')}
            className="w-full bg-transparent hover:bg-white/[0.02] text-zinc-400 hover:text-zinc-300 font-bold py-3 rounded-xl transition-all border border-transparent hover:border-white/[0.05] flex items-center justify-center gap-3 text-sm"
          >
            <Bot size={16} />
            Practice vs Bots
          </button>
        </div>
      </div>

      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-[#111] border border-white/[0.1] max-w-md w-full p-8 rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button 
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors bg-white/[0.05] hover:bg-white/[0.1] rounded-full p-1"
              onClick={() => setModalMode(null)}
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
              {modalMode === 'host' ? <Play className="text-blue-500" /> : modalMode === 'bots' ? <Bot className="text-blue-500" /> : <Key className="text-blue-500" />}
              {modalMode === 'host' ? 'Host New Game' : modalMode === 'bots' ? 'Bot Match' : 'Join Room'}
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">Your Alias</label>
                <input 
                  type="text" 
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  maxLength={15}
                  autoFocus={!playerName}
                  className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-4 py-4 text-white placeholder-zinc-700 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-medium"
                  placeholder="Enter your name..."
                />
              </div>

              {modalMode === 'join' && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">Room Code</label>
                  <input 
                    type="text" 
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    maxLength={6}
                    autoFocus={!!playerName}
                    className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-4 py-4 text-white placeholder-zinc-700 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-medium uppercase tracking-[0.2em]"
                    placeholder="XYZ123"
                  />
                </div>
              )}

              <button 
                type="submit" 
                disabled={!playerName.trim() || (modalMode === 'join' && !joinCode.trim())}
                className="mt-4 w-full bg-white text-black font-bold py-4 rounded-xl transition-all hover:bg-zinc-200 disabled:opacity-50 disabled:hover:bg-white active:scale-[0.98]"
              >
                Proceed
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="absolute bottom-8 flex gap-3 z-20">
        <button onClick={() => setTheme('1930s')} className="px-5 py-2.5 rounded-full bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] text-zinc-400 hover:text-white transition-colors text-xs font-semibold tracking-wide">
          1930s Theme
        </button>
        <button className="px-5 py-2.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wide cursor-default shadow-[0_0_15px_rgba(37,99,235,0.15)]">
          Modern Theme
        </button>
      </div>
    </div>
  );
}
