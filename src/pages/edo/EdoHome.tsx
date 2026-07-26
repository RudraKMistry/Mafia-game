import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, X, Flame, Eye, Heart, Search, VenetianMask, Bot } from 'lucide-react';
import './Edo.css';

export default function EdoHome() {
  const navigate = useNavigate();
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
    if (modalMode === 'host') return 'Enter your alias to establish a new clan.';
    if (modalMode === 'join') return 'Enter your alias and the 6-character room code from the host.';
    if (modalMode === 'bots') return 'Enter your alias to practice your skills against AI shinobi.';
    return '';
  };

  const switchTheme = () => {
    localStorage.setItem('mafia_theme', '1930s');
    window.location.reload();
  };

  return (
    <div className="min-h-[100dvh] edo-bg-day edo-theme flex flex-col items-center justify-center p-3 sm:p-6 text-[#2c1b18] animate-in fade-in duration-1000 relative">
      <div id="particles" className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(20)].map((_, i) => (
             <div 
                key={i} 
                className="particle sakura" 
                style={{
                  width: `${Math.random() * 10 + 8}px`,
                  height: `${Math.random() * 10 + 8}px`,
                  left: `${Math.random() * 120 - 10}vw`,
                  animationDuration: `${Math.random() * 5 + 5}s`,
                  animationDelay: `${Math.random() * -10}s`
                }}
             />
          ))}
      </div>
      
      <div className="makimono-paper shoji-frame max-w-4xl w-full p-6 sm:p-12 md:p-16 relative animate-in zoom-in-95 duration-1000 flex flex-col items-center text-center my-4 z-10">
        
        <div className="border-b-[2px] border-[#4e342e] pb-6 mb-8 mt-4 w-full">
          <h1 className="text-5xl sm:text-7xl md:text-9xl text-[#8b0000] tracking-widest mb-2 sm:mb-4 font-bold drop-shadow-md uppercase">SHADOWS OF EDO</h1>
          <p className="font-serif text-[#2c1b18] font-bold text-xs sm:text-sm md:text-lg tracking-widest sm:tracking-[0.2em] md:tracking-[0.4em] uppercase break-words px-2">A Game of Deception & Deduction</p>
        </div>

        <div className="space-y-8 font-serif text-[#3e2723] font-medium text-base sm:text-lg md:text-xl leading-relaxed w-full">
          <p className="px-2 sm:px-8 md:px-12">
            Welcome to the digital edition of Mafia, reimagined in feudal Japan. Can the Villagers deduce who the Shinobi are before it's too late?
          </p>

          <div className="shoji-paper p-5 sm:p-8 md:p-12 border-2 border-[#4e342e] shadow-inner my-8 w-full text-left rounded-sm relative">
            
            <h3 className="font-bold text-lg sm:text-2xl mb-4 sm:mb-6 uppercase border-b-[2px] border-[#4e342e] pb-3 sm:pb-4 text-[#8b0000] flex items-center gap-2 sm:gap-3 tracking-widest">
              Known Roles
            </h3>
            
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-sm sm:text-base md:text-lg mt-6">
              <li className="flex items-center gap-4 sm:gap-5">
                 <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 border-[2px] border-[#8b0000] text-[#8b0000] rounded-full flex items-center justify-center shadow-md bg-white/40">
                   <Flame className="w-5 h-5 sm:w-6 sm:h-6" />
                 </div>
                 <div className="flex-1">
                   <strong className="text-[#8b0000] uppercase block text-lg sm:text-xl mb-0.5 sm:mb-1">Shinobi (Mafia)</strong>
                   <span className="text-[#3e2723]">Eliminate the Heimin.</span>
                 </div>
              </li>
              <li className="flex items-center gap-4 sm:gap-5">
                 <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 border-[2px] border-[#4e342e] text-[#4e342e] rounded-full flex items-center justify-center shadow-md bg-white/40">
                   <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                 </div>
                 <div className="flex-1">
                   <strong className="text-[#4e342e] uppercase block text-lg sm:text-xl mb-0.5 sm:mb-1">Heimin (Villager)</strong>
                   <span className="text-[#3e2723]">Find the Shinobi.</span>
                 </div>
              </li>
              <li className="flex items-center gap-4 sm:gap-5">
                 <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 border-[2px] border-[#276749] text-[#276749] rounded-full flex items-center justify-center shadow-md bg-white/40">
                   <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                 </div>
                 <div className="flex-1">
                   <strong className="text-[#276749] uppercase block text-lg sm:text-xl mb-0.5 sm:mb-1">Sohei (Doctor)</strong>
                   <span className="text-[#3e2723]">Save a player each night.</span>
                 </div>
              </li>
              <li className="flex items-center gap-4 sm:gap-5">
                 <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 border-[2px] border-[#2b6cb0] text-[#2b6cb0] rounded-full flex items-center justify-center shadow-md bg-white/40">
                   <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                 </div>
                 <div className="flex-1">
                   <strong className="text-[#2b6cb0] uppercase block text-lg sm:text-xl mb-0.5 sm:mb-1">Samurai (Detective)</strong>
                   <span className="text-[#3e2723]">Investigate alignments.</span>
                 </div>
              </li>
              <li className="flex items-center gap-4 sm:gap-5 md:col-span-2 md:justify-center">
                 <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 border-[2px] border-[#6b46c1] text-[#6b46c1] rounded-full flex items-center justify-center shadow-md bg-white/40">
                   <VenetianMask className="w-5 h-5 sm:w-6 sm:h-6" />
                 </div>
                 <div className="flex-1 md:flex-none">
                   <strong className="text-[#6b46c1] uppercase block text-lg sm:text-xl mb-0.5 sm:mb-1">Kitsune (Jester)</strong>
                   <span className="text-[#3e2723]">Get voted out during the day.</span>
                 </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-4 sm:gap-6 w-full pt-4 sm:pt-6 relative z-20">
          <button 
            onClick={() => setModalMode('host')}
            className="flex-1 border-2 border-[#4e342e] bg-[rgba(253,251,247,0.8)] text-[#4e342e] py-4 sm:py-5 px-2 font-bold text-lg sm:text-xl md:text-2xl uppercase tracking-widest hover:bg-[#4e342e] hover:text-[#ebdcb5] transition-all shadow-md active:translate-y-1 active:shadow-sm flex items-center justify-center gap-2 sm:gap-3"
          >
            <Users className="w-5 h-5 sm:w-7 sm:h-7" />
            Host Game
          </button>
          
          <button 
            onClick={() => setModalMode('join')}
            className="flex-1 bg-[#8b0000] border-2 border-[#8b0000] text-[#ebdcb5] py-4 sm:py-5 px-2 font-bold text-lg sm:text-xl md:text-2xl uppercase tracking-widest hover:bg-red-900 transition-all shadow-md active:translate-y-1 active:shadow-sm flex items-center justify-center gap-2 sm:gap-3"
          >
            <UserPlus className="w-5 h-5 sm:w-7 sm:h-7" />
            Join Game
          </button>

          <button 
            onClick={() => setModalMode('bots')}
            className="flex-1 bg-[#2c1b18] border-2 border-[#2c1b18] text-[#ebdcb5] py-4 sm:py-5 px-2 font-bold text-lg sm:text-xl md:text-2xl uppercase tracking-widest hover:bg-black transition-all shadow-md active:translate-y-1 active:shadow-sm flex items-center justify-center gap-2 sm:gap-3"
          >
            <Bot className="w-5 h-5 sm:w-7 sm:h-7" />
            Play Bots
          </button>
        </div>
      </div>

      {modalMode && (
        <div className="fixed inset-0 z-50 bg-[#0f111a]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="makimono-paper shoji-frame max-w-lg w-full p-8 sm:p-12 shadow-2xl relative">
            <button className="absolute top-4 sm:top-6 right-4 sm:right-6 text-[#8b0000] hover:text-red-600 transition-colors duration-300" onClick={() => setModalMode(null)}>
              <X className="w-8 h-8 sm:w-10 sm:h-10" />
            </button>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 uppercase border-b-2 border-[#8b0000] pb-4 sm:pb-6 text-[#2c1b18] tracking-widest">
              {getModalTitle()}
            </h2>
            
            <p className="text-center text-sm sm:text-lg mb-8 sm:mb-10 font-bold bg-[#fdfbf7]/50 p-3 sm:p-4 border border-[#4e342e]/30 text-[#4e342e] shadow-inner">
              {getModalDescription()}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 sm:gap-8">
              
              <div className="flex flex-col gap-2">
                <label className="font-bold uppercase text-sm tracking-widest text-[#8b0000]">Alias</label>
                <input 
                  type="text" 
                  placeholder="ENTER NAME" 
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  maxLength={15}
                  autoFocus={!playerName}
                  className="w-full bg-[#fdfbf7] border-2 border-[#4e342e]/50 focus:border-[#4e342e] outline-none text-center text-3xl text-[#2c1b18] placeholder-[#4e342e]/30 py-3 sm:py-4 transition-all shadow-inner font-serif"
                />
              </div>

              {modalMode === 'join' && (
                <div className="flex flex-col gap-2">
                  <label className="font-bold uppercase text-sm tracking-widest text-[#8b0000]">Room Code</label>
                  <input 
                    type="text" 
                    placeholder="ENTER CODE" 
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    maxLength={6}
                    autoFocus={!!playerName}
                    className="w-full bg-[#fdfbf7] border-2 border-[#4e342e]/50 focus:border-[#4e342e] outline-none text-center text-4xl sm:text-5xl uppercase text-[#2c1b18] placeholder-[#4e342e]/30 py-3 sm:py-4 transition-all shadow-inner tracking-widest font-serif"
                  />
                </div>
              )}

              <button 
                type="submit" 
                disabled={!playerName.trim() || (modalMode === 'join' && !joinCode.trim())}
                className="mt-2 w-full bg-[#8b0000] text-[#ebdcb5] py-4 sm:py-5 font-bold text-xl sm:text-2xl uppercase tracking-widest hover:bg-red-900 transition-all shadow-md active:translate-y-1 active:shadow-sm disabled:opacity-30 disabled:hover:bg-[#8b0000] disabled:shadow-none disabled:active:translate-y-0"
              >
                PROCEED
              </button>
            </form>
          </div>
        </div>
      )}

      {/* UI Theme Switcher */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-6 z-40">
        <button 
          onClick={switchTheme}
          className="px-8 py-4 bg-[#8b0000] text-white font-bold text-xl sm:text-2xl uppercase tracking-widest border-2 border-black shadow-md hover:bg-red-950 transition-all active:shadow-sm active:translate-y-1 cursor-pointer"
        >
          1930's Theme
        </button>
        <button className="px-8 py-4 bg-[#2c1b18] text-[#ebdcb5] font-bold text-xl sm:text-2xl uppercase tracking-widest border-2 border-[#1a0f0d] shadow-md hover:bg-black transition-all active:shadow-sm active:translate-y-1 cursor-default">
          Shadows of Edo
        </button>
      </div>

    </div>
  );
}
