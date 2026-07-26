import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, X, Flame, Heart, Search, VenetianMask, Bot } from "lucide-react";
import { useTheme } from '../contexts/ThemeContext';

export default function MobileHome() {
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

  const getModalTitle = () => {
    if (modalMode === 'host') return 'Host Game';
    if (modalMode === 'join') return 'Join Game';
    if (modalMode === 'bots') return 'Play With Bots';
    return '';
  };

  const getModalDescription = () => {
    if (modalMode === 'host') return 'Enter your alias to establish a new command center.';
    if (modalMode === 'join') return 'Enter your alias and the 6-character room code from the host.';
    if (modalMode === 'bots') return 'Enter your alias to practice your interrogation skills against AI operatives.';
    return '';
  };

  return (
    <div className="m-desk-texture min-h-[100dvh] w-full flex flex-col items-center justify-center py-4 px-3 overflow-x-hidden text-white animate-in fade-in duration-700">
      {/* Main Folder Container */}
      <main className="m-paper-texture w-full max-w-md rounded border-[3px] border-black relative px-3 flex flex-col shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] z-10 my-8 pb-4 pt-4 gap-2 animate-in slide-in-from-bottom-8 duration-700">
        {/* Folder Tab */}
        <div className="absolute -top-10 left-4 bg-manila-paper border-t-4 border-l-2 border-r-4 border-black px-3 py-2 rounded-t-lg z-[-1] flex items-center gap-2 neo-brutalist-shadow">
          <Search className="w-5 h-5 text-black" />
          <span className="font-typewriter-md text-black font-bold">FILE: MAFIA-001</span>
        </div>

        {/* Top Secret Stamp */}
        <div className="absolute top-2 right-4 stamp-effect p-2 rounded -rotate-12 pointer-events-none z-20">
          <span className="font-display-xl text-[#991B1B] font-black tracking-tighter uppercase block leading-none">TOP</span>
          <span className="font-display-xl text-[#991B1B] font-black tracking-tighter uppercase block leading-none">SECRET</span>
        </div>

        {/* Header Section */}
        <header className="flex flex-col items-start border-b-4 border-black pb-4 relative z-10 mt-8">
          <h1 className="font-display-xl text-[#610000] font-black tracking-tighter uppercase drop-shadow-[2px_2px_0_#000] text-xl">MAFIA</h1>
          <p className="font-typewriter-sm text-[#5a403c] uppercase mt-1 tracking-widest text-xs font-bold">A Game of Deception & Deduction</p>
        </header>

        {/* Primary Actions */}
        <section className="grid grid-cols-1 z-10 mt-4 gap-2">
          {/* Host Game Button */}
          <button 
            onClick={() => setModalMode('host')}
            className="neo-brutalist-button bg-[#991B1B] border-[3px] border-black text-white py-3 px-3 rounded flex items-center justify-between transition-transform duration-75 -rotate-1 w-full neo-brutalist-shadow group"
          >
            <div className="flex flex-col items-start text-left">
              <span className="font-label-caps text-[#fee2dd] font-bold opacity-80 mb-1 text-xs tracking-widest">NEW PROTOCOL</span>
              <span className="font-headline-lg font-black uppercase text-lg">Host Game</span>
            </div>
            <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          {/* Join Game Button */}
          <button 
            onClick={() => setModalMode('join')}
            className="neo-brutalist-button bg-[#E8D9C5] border-[3px] border-black text-[#261816] py-3 px-3 rounded flex items-center justify-between transition-transform duration-75 rotate-1 w-full neo-brutalist-shadow shadow-inner group mt-2"
          >
            <div className="flex flex-col items-start text-left">
              <span className="font-label-caps text-[#5a403c] font-bold opacity-80 mb-1 text-xs tracking-widest">EXISTING PROTOCOL</span>
              <span className="font-headline-lg font-black uppercase text-lg">Join Game</span>
            </div>
            <Users className="w-5 h-5 group-hover:scale-110 transition-transform text-[#8e706b]" />
          </button>

          {/* Bots Game Button */}
          <button 
            onClick={() => setModalMode('bots')}
            className="neo-brutalist-button bg-[#1E3A8A] border-[3px] border-black text-white py-3 px-3 rounded flex items-center justify-between transition-transform duration-75 -rotate-1 w-full neo-brutalist-shadow group mt-2"
          >
            <div className="flex flex-col items-start text-left">
              <span className="font-label-caps text-[#9ea9ff] font-bold opacity-80 mb-1 text-xs tracking-widest">SIMULATION</span>
              <span className="font-headline-lg font-black uppercase text-lg">Play Bots</span>
            </div>
            <Bot className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </section>

        {/* Known Associates (Roles Overview) */}
        <section className="relative z-10 border-[3px] border-black bg-[#fff0ee] rounded neo-brutalist-shadow -rotate-1 mt-6 p-2">
          <div className="tape-corner"></div>
          <h2 className="font-typewriter-md text-black font-bold border-b-2 border-black pb-2 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5" />
            KNOWN ASSOCIATES
          </h2>
          <ul className="flex flex-col gap-0 font-body-standard text-[#261816]">
            <li className="flex items-center gap-2 notebook-line py-2">
              <div className="w-4 h-4 rounded-full bg-[#8B0000] border-2 border-black flex-shrink-0 flex items-center justify-center">
                <Flame className="text-white w-3 h-3" />
              </div>
              <span className="font-bold flex-shrink-0">Mafia</span>
              <span className="text-[#5a403c] truncate text-sm">Eliminate the town</span>
            </li>
            <li className="flex items-center gap-2 notebook-line py-2">
              <div className="w-4 h-4 rounded-full bg-[#27272A] border-2 border-black flex-shrink-0 flex items-center justify-center">
                <Users className="text-white w-3 h-3" />
              </div>
              <span className="font-bold flex-shrink-0">Villager</span>
              <span className="text-[#5a403c] truncate text-sm">Survive and vote</span>
            </li>
            <li className="flex items-center gap-2 notebook-line py-2">
              <div className="w-4 h-4 rounded-full bg-[#1E40AF] border-2 border-black flex-shrink-0 flex items-center justify-center">
                <Heart className="text-white w-3 h-3" />
              </div>
              <span className="font-bold flex-shrink-0">Doctor</span>
              <span className="text-[#5a403c] truncate text-sm">Protect the innocent</span>
            </li>
            <li className="flex items-center gap-2 notebook-line py-2">
              <div className="w-4 h-4 rounded-full bg-[#3F3F46] border-2 border-black flex-shrink-0 flex items-center justify-center">
                <Search className="text-white w-3 h-3" />
              </div>
              <span className="font-bold flex-shrink-0">Detective</span>
              <span className="text-[#5a403c] truncate text-sm">Investigate suspects</span>
            </li>
            <li className="flex items-center gap-2 py-2">
              <div className="w-4 h-4 rounded-full bg-[#581C87] border-2 border-black flex-shrink-0 flex items-center justify-center">
                <VenetianMask className="text-white w-3 h-3" />
              </div>
              <span className="font-bold flex-shrink-0">Jester</span>
              <span className="text-[#5a403c] truncate text-sm">Get voted out</span>
            </li>
          </ul>
        </section>
      </main>

      {/* Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-2 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300">
          <div className="m-paper-texture max-w-sm w-full p-2 border-[3px] border-black relative rotate-1 neo-brutalist-shadow">
            <button 
              onClick={() => setModalMode(null)}
              className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center bg-black text-white hover:bg-[#991B1B] border-2 border-black neo-brutalist-shadow"
            >
              <X size={20} />
            </button>

            <h2 className="font-headline-lg text-xl font-black uppercase mb-2 mt-4 text-black border-b-4 border-black pb-2">{getModalTitle()}</h2>
            <p className="font-typewriter-md mb-3 font-bold text-sm text-[#261816]">{getModalDescription()}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-label-caps font-bold mb-1 uppercase tracking-widest text-[#5a403c]">Alias (Name)</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  maxLength={12}
                  className="w-full bg-white/50 border-[3px] border-black p-2 font-handwritten-lg text-xl outline-none focus:bg-white transition-colors text-[#1E3A8A]"
                  placeholder="Detective..."
                  required
                />
              </div>

              {modalMode === 'join' && (
                <div>
                  <label className="block text-xs font-label-caps font-bold mb-1 uppercase tracking-widest text-[#5a403c]">Room Code</label>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    maxLength={6}
                    className="w-full bg-white/50 border-[3px] border-black p-2 font-typewriter-md text-xl uppercase outline-none focus:bg-white transition-colors"
                    placeholder="e.g. XY9Z"
                    required
                  />
                </div>
              )}

              <button 
                type="submit"
                className="neo-brutalist-button w-full bg-[#1a0f0a] border-[3px] border-black text-white py-3 mt-4 font-headline-lg font-black uppercase tracking-widest text-xl neo-brutalist-shadow active:translate-y-1 active:translate-x-1"
              >
                Proceed
              </button>
            </form>
          </div>
        </div>
      )}

      {/* UI Theme Switcher */}
      <div className="mt-2 flex flex-row gap-2 z-40 pb-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
        <button 
          onClick={() => setTheme('1930s')}
          className={`px-3 py-2 font-headline-lg font-black text-xs uppercase tracking-widest border-[3px] border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all active:shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 ${theme === '1930s' ? 'bg-[#8b0000] text-white cursor-default' : 'bg-[#1a0f0a] text-[#8e706b] hover:bg-black hover:text-white'}`}
        >
          1930's Theme
        </button>
        <button 
          onClick={() => setTheme('modern')}
          className={`px-3 py-2 font-headline-lg font-black text-xs uppercase tracking-widest border-[3px] border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all active:shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 ${theme === 'modern' ? 'bg-[#8b0000] text-white cursor-default' : 'bg-[#1a0f0a] text-[#8e706b] hover:bg-black hover:text-white'}`}
        >
          Modern Theme
        </button>
      </div>
    </div>
  );
}
