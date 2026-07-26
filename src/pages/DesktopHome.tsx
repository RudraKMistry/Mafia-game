import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, X, Flame, Eye, Heart, Search, VenetianMask, Bot, Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Home() {
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
    <div className="min-h-[100dvh] desk-day flex flex-col items-center justify-center p-3 sm:p-6 selection:bg-black selection:text-white animate-in fade-in duration-1000">
      
      <div className="manila-folder max-w-4xl w-full p-6 sm:p-12 md:p-16 relative animate-in zoom-in-95 duration-1000 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] flex flex-col items-center text-center my-4">
        
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8 stamp stamp-red text-xl sm:text-2xl md:text-3xl -rotate-12 opacity-80 shadow-sm bg-transparent pointer-events-none">
          TOP SECRET
        </div>

        <div className="border-b-[3px] border-black/30 pb-6 mb-8 mt-12 sm:mt-14 w-full">
          <h1 className="font-heading text-5xl sm:text-7xl md:text-9xl text-black tracking-tighter mb-2 sm:mb-4 font-black drop-shadow-md">MAFIA</h1>
          <p className="font-typewriter text-black/80 font-bold text-xs sm:text-sm md:text-lg tracking-widest sm:tracking-[0.2em] md:tracking-[0.4em] uppercase break-words px-2">A Game of Deception & Deduction</p>
        </div>

        <div className="space-y-8 font-typewriter text-black/90 font-medium text-base sm:text-lg md:text-xl leading-relaxed w-full">
          <p className="px-2 sm:px-8 md:px-12 text-black/80">
            Welcome to the digital edition of Mafia. Can the Town deduce who the culprits are before it's too late? 
            Or will the Mafia, the Jester, or the shadows consume everyone?
          </p>

          <div className="paper-texture p-5 sm:p-8 md:p-12 border-2 border-black/20 shadow-inner my-8 w-full text-left rounded-sm relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 sm:w-12 h-4 bg-black/10 rounded-full blur-sm"></div>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 sm:w-12 h-6 border-2 border-zinc-500/50 rounded-full border-b-0" style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' }} />
            
            <h3 className="font-bold text-lg sm:text-2xl mb-4 sm:mb-6 uppercase border-b-[3px] border-black/20 pb-3 sm:pb-4 text-black flex items-center gap-2 sm:gap-3">
              <Search className="text-red-900 w-6 h-6 sm:w-8 sm:h-8" />
              Known Associates
            </h3>
            
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-sm sm:text-base md:text-lg mt-6">
              <li className="flex items-center gap-4 sm:gap-5">
                 <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 border-[3px] border-red-900 text-red-900 rounded-full flex items-center justify-center shadow-md bg-white/40">
                   <Flame className="w-5 h-5 sm:w-6 sm:h-6" />
                 </div>
                 <div className="flex-1">
                   <strong className="text-black uppercase block text-lg sm:text-xl mb-0.5 sm:mb-1">Mafia</strong>
                   <span className="text-black/70">Eliminate the Town.</span>
                 </div>
              </li>
              <li className="flex items-center gap-4 sm:gap-5">
                 <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 border-[3px] border-zinc-800 text-zinc-800 rounded-full flex items-center justify-center shadow-md bg-white/40">
                   <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                 </div>
                 <div className="flex-1">
                   <strong className="text-black uppercase block text-lg sm:text-xl mb-0.5 sm:mb-1">Villager</strong>
                   <span className="text-black/70">Find the Mafia.</span>
                 </div>
              </li>
              <li className="flex items-center gap-4 sm:gap-5">
                 <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 border-[3px] border-blue-900 text-blue-900 rounded-full flex items-center justify-center shadow-md bg-white/40">
                   <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                 </div>
                 <div className="flex-1">
                   <strong className="text-black uppercase block text-lg sm:text-xl mb-0.5 sm:mb-1">Doctor</strong>
                   <span className="text-black/70">Save a player each night.</span>
                 </div>
              </li>
              <li className="flex items-center gap-4 sm:gap-5">
                 <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 border-[3px] border-zinc-700 text-zinc-700 rounded-full flex items-center justify-center shadow-md bg-white/40">
                   <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                 </div>
                 <div className="flex-1">
                   <strong className="text-black uppercase block text-lg sm:text-xl mb-0.5 sm:mb-1">Detective</strong>
                   <span className="text-black/70">Investigate alignments.</span>
                 </div>
              </li>
              <li className="flex items-center gap-4 sm:gap-5 md:col-span-2 md:justify-center">
                 <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 border-[3px] border-purple-900 text-purple-900 rounded-full flex items-center justify-center shadow-md bg-white/40">
                   <VenetianMask className="w-5 h-5 sm:w-6 sm:h-6" />
                 </div>
                 <div className="flex-1 md:flex-none">
                   <strong className="text-black uppercase block text-lg sm:text-xl mb-0.5 sm:mb-1">Jester</strong>
                   <span className="text-black/70">Get voted out during the day.</span>
                 </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-4 sm:gap-6 w-full pt-4 sm:pt-6">
          <button 
            onClick={() => setModalMode('host')}
            className="flex-1 border-4 border-black bg-transparent text-black py-4 sm:py-5 px-2 font-heading font-black text-lg sm:text-xl md:text-2xl uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 flex items-center justify-center gap-2 sm:gap-3 group"
          >
            <Users className="w-5 h-5 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" />
            Host Game
          </button>
          
          <button 
            onClick={() => setModalMode('join')}
            className="flex-1 bg-[#8b0000] border-4 border-[#8b0000] text-white py-4 sm:py-5 px-2 font-heading font-black text-lg sm:text-xl md:text-2xl uppercase tracking-widest hover:bg-red-950 hover:border-red-950 transition-all shadow-[4px_4px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 flex items-center justify-center gap-2 sm:gap-3 group"
          >
            <UserPlus className="w-5 h-5 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" />
            Join Game
          </button>

          <button 
            onClick={() => setModalMode('bots')}
            className="flex-1 bg-zinc-800 border-4 border-zinc-800 text-white py-4 sm:py-5 px-2 font-heading font-black text-lg sm:text-xl md:text-2xl uppercase tracking-widest hover:bg-zinc-950 hover:border-zinc-950 transition-all shadow-[4px_4px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 flex items-center justify-center gap-2 sm:gap-3 group"
          >
            <Bot className="w-5 h-5 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" />
            Play Bots
          </button>
        </div>
      </div>

      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
          <div className="paper-texture max-w-lg w-full p-8 sm:p-12 shadow-2xl rotate-1 relative border-2 border-black/20">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-red-800 shadow-[inset_1px_1px_4px_rgba(0,0,0,0.8)]" />
            
            <button className="absolute top-4 sm:top-6 right-4 sm:right-6 text-black/50 hover:text-black transition-transform hover:rotate-90 duration-300" onClick={() => setModalMode(null)}>
              <X className="w-8 h-8 sm:w-10 sm:h-10" />
            </button>
            
            <h2 className="font-heading text-4xl sm:text-5xl font-black text-center mb-6 sm:mb-8 uppercase border-b-[4px] border-black/20 pb-4 sm:pb-6 text-black">
              {getModalTitle()}
            </h2>
            
            <p className="font-typewriter text-center text-sm sm:text-lg mb-8 sm:mb-10 font-bold bg-white/50 p-3 sm:p-4 border-2 border-black/10 text-black shadow-inner leading-relaxed">
              {getModalDescription()}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 sm:gap-8">
              
              <div className="flex flex-col gap-2">
                <label className="font-typewriter font-black uppercase text-sm tracking-widest text-black/70">Operative Alias</label>
                <input 
                  type="text" 
                  placeholder="ENTER NAME" 
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  maxLength={15}
                  autoFocus={!playerName}
                  className="w-full bg-white/50 border-4 border-black/20 focus:border-black focus:bg-white outline-none font-handwriting text-center text-4xl text-blue-900 placeholder-black/30 py-3 sm:py-4 transition-all shadow-inner"
                />
              </div>

              {modalMode === 'join' && (
                <div className="flex flex-col gap-2">
                  <label className="font-typewriter font-black uppercase text-sm tracking-widest text-black/70">Room Code</label>
                  <input 
                    type="text" 
                    placeholder="ENTER CODE" 
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    maxLength={6}
                    autoFocus={!!playerName}
                    className="w-full bg-white/50 border-4 border-black/20 focus:border-black focus:bg-white outline-none font-typewriter text-center text-4xl sm:text-5xl uppercase text-black placeholder-black/30 py-3 sm:py-4 transition-all shadow-inner tracking-widest"
                  />
                </div>
              )}

              <button 
                type="submit" 
                disabled={!playerName.trim() || (modalMode === 'join' && !joinCode.trim())}
                className="mt-2 w-full border-4 border-black bg-black text-white py-4 sm:py-5 font-heading font-black text-2xl sm:text-3xl uppercase tracking-widest hover:bg-[#8b0000] hover:border-[#8b0000] transition-all shadow-[6px_6px_0px_rgba(255,255,255,0.2)] active:shadow-[2px_2px_0px_rgba(255,255,255,0.2)] active:translate-y-1 active:translate-x-1 disabled:opacity-30 disabled:hover:bg-black disabled:hover:border-black disabled:shadow-none disabled:active:translate-y-0 disabled:active:translate-x-0"
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
          onClick={() => setTheme('1930s')}
          className={`px-8 py-4 font-heading font-black text-xl sm:text-2xl uppercase tracking-widest border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all active:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 ${theme === '1930s' ? 'bg-[#8b0000] text-white cursor-default' : 'bg-zinc-800 text-zinc-300 hover:bg-black hover:text-white'}`}
        >
          1930's Theme
        </button>
        <button 
          onClick={() => setTheme('modern')}
          className={`px-8 py-4 font-heading font-black text-xl sm:text-2xl uppercase tracking-widest border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all active:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 ${theme === 'modern' ? 'bg-[#8b0000] text-white cursor-default' : 'bg-zinc-800 text-zinc-300 hover:bg-black hover:text-white'}`}
        >
          Modern Theme
        </button>
      </div>
    </div>
  );
}

