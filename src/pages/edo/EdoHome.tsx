import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, X, Flame, Eye, Heart, Search, Bot } from 'lucide-react';
import { useSoundscape } from '../../hooks/useSoundscape';
import { MagneticCursor } from '../../components/MagneticCursor';
import { ScrambleText } from '../../components/ScrambleText';
import './Edo.css';

export default function EdoHome() {
  const navigate = useNavigate();
  const [modalMode, setModalMode] = useState<'host' | 'join' | 'bots' | 'intel' | null>(null);
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('mafia_playerName') || '');
  const [joinCode, setJoinCode] = useState('');
  
  const { playHover, playSlash, playWhoosh, initAudio } = useSoundscape();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    
    localStorage.setItem('mafia_playerName', playerName.trim());

    if (modalMode === 'host') {
      const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      playSlash();
      navigate(`/lobby/${roomId}`);
    } else if (modalMode === 'bots') {
      const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      playSlash();
      navigate(`/lobby/${roomId}?mode=bots`);
    } else if (modalMode === 'join' && joinCode.trim()) {
      playSlash();
      navigate(`/lobby/${joinCode.trim().toUpperCase()}`);
    }
  };

  const getModalTitle = () => {
    if (modalMode === 'host') return 'Host Game';
    if (modalMode === 'join') return 'Join Game';
    if (modalMode === 'bots') return 'Play With Bots';
    if (modalMode === 'intel') return 'Classified Intel';
    return '';
  };

  const getModalDescription = () => {
    if (modalMode === 'host') return 'Enter your alias to establish a new clan.';
    if (modalMode === 'join') return 'Enter your alias and the 6-character scroll code.';
    if (modalMode === 'bots') return 'Enter your alias to practice your skills against AI yakuza.';
    if (modalMode === 'intel') return 'Known roles operating in the shadows.';
    return '';
  };

  const switchTheme = () => {
    localStorage.setItem('mafia_theme', '1930s');
    window.location.reload();
  };

  return (
    <div onClick={initAudio} className="min-h-[100dvh] cursor-none edo-home-bg edo-theme flex flex-col items-center justify-center p-4 sm:p-8 text-gray-200 relative overflow-hidden">
      
      <MagneticCursor />
      
      {/* Giant Background Enso (Fallback) */}
      <div className="sun-enso opacity-30 mix-blend-screen"></div>
      
      {/* Cinematic Black Fade Out Overlay */}
      <div className="fixed inset-0 bg-black z-[999] pointer-events-none animate-fade-out-slow"></div>

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>

      <div id="particles" className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(25)].map((_, i) => (
             <div 
                key={i} 
                className="particle firefly" 
                style={{
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  left: `${Math.random() * 100}vw`,
                  top: `${Math.random() * 100}vh`,
                  animationDuration: `${Math.random() * 5 + 5}s`,
                  animationDelay: `${Math.random() * -10}s`
                }}
             />
          ))}
          {[...Array(15)].map((_, i) => (
             <div 
                key={`sakura-${i}`} 
                className="particle sakura" 
                style={{
                  width: `${Math.random() * 8 + 6}px`,
                  height: `${Math.random() * 8 + 6}px`,
                  left: `${Math.random() * 120 - 10}vw`,
                  animationDuration: `${Math.random() * 6 + 6}s`,
                  animationDelay: `${Math.random() * -10}s`,
                  backgroundColor: '#8b0000',
                  opacity: 0.6
                }}
             />
          ))}
      </div>
      
      <div className="max-w-5xl w-full relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
        
        {/* Left Column: Title and Intro */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
           <div className="flex items-center gap-4 mb-2 opacity-80">
              <div className="h-[1px] w-12 bg-red-800"></div>
              <p className="font-serif text-red-500 font-bold tracking-[0.3em] uppercase text-sm">A Game of Deception & Deduction</p>
              <div className="h-[1px] w-12 bg-red-800 hidden lg:block"></div>
           </div>
           
           <h1 className="text-7xl sm:text-8xl lg:text-[10rem] text-white tracking-[0.2em] mb-6 font-bold uppercase drop-shadow-[0_0_30px_rgba(139,0,0,0.8)] leading-none cinzel relative animate-in slide-in-from-left duration-1000 ease-out">
             <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[15rem] lg:text-[20rem] text-red-900/10 -z-10 tracking-tighter whitespace-nowrap overflow-hidden pointer-events-none">ヤクザ</div>
             <ScrambleText text="YAKUZA" />
           </h1>
           
           <p className="font-serif text-gray-400 text-lg sm:text-xl leading-relaxed max-w-lg mb-12 animate-in slide-in-from-left duration-1000 delay-300 ease-out fill-mode-both">
             Welcome to the digital edition of Mafia, reimagined in feudal Japan. Can the Villagers deduce who the Yakuza are before the blade falls?
           </p>

           <div className="flex flex-col gap-4 w-full max-w-lg animate-in slide-in-from-bottom duration-1000 delay-500 ease-out fill-mode-both">
             <button 
               onClick={() => { playWhoosh(); setModalMode('host'); }}
               onMouseEnter={playHover}
               className="w-full cinematic-slash-button py-5 px-8 font-bold text-xl uppercase tracking-widest flex items-center justify-between group cursor-none"
             >
               <span className="flex items-center gap-4 relative z-10">
                 <Users className="w-6 h-6 text-red-500 group-hover:text-white transition-colors" />
                 Host Game
               </span>
               <span className="text-red-900 opacity-50 text-2xl font-black group-hover:opacity-100 transition-opacity">/</span>
             </button>
             
             <button 
               onClick={() => { playWhoosh(); setModalMode('join'); }}
               onMouseEnter={playHover}
               className="w-full cinematic-slash-button py-5 px-8 font-bold text-xl uppercase tracking-widest flex items-center justify-between group cursor-none"
             >
               <span className="flex items-center gap-4 relative z-10">
                 <UserPlus className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
                 Join Game
               </span>
               <span className="text-red-900 opacity-50 text-2xl font-black group-hover:opacity-100 transition-opacity">/</span>
             </button>

             <button 
               onClick={() => { playWhoosh(); setModalMode('bots'); }}
               onMouseEnter={playHover}
               className="w-full cinematic-slash-button py-5 px-8 font-bold text-xl uppercase tracking-widest flex items-center justify-between group cursor-none opacity-80"
             >
               <span className="flex items-center gap-4 relative z-10 text-gray-400 group-hover:text-white">
                 <Bot className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" />
                 Practice vs AI
               </span>
               <span className="text-red-900 opacity-50 text-2xl font-black group-hover:opacity-100 transition-opacity">/</span>
             </button>

             <button 
               onClick={() => { playWhoosh(); setModalMode('intel'); }}
               onMouseEnter={playHover}
               className="w-full mt-4 py-3 border border-gray-800 text-gray-500 hover:text-white hover:border-gray-500 font-bold text-sm uppercase tracking-widest transition-all cursor-none animate-pulse"
             >
               Access Classified Intel
             </button>
           </div>
        </div>

      </div>

      {/* Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a]/90 flex items-center justify-center p-4  animate-in fade-in duration-300">
          <div className="bg-[#111] border border-gray-800 max-w-lg w-full p-8 sm:p-12 shadow-2xl relative">
            <button className="absolute top-4 sm:top-6 right-4 sm:right-6 text-gray-500 hover:text-red-500 transition-colors duration-300" onClick={() => { playWhoosh(); setModalMode(null); }}>
              <X className="w-8 h-8" />
            </button>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 uppercase text-white tracking-widest">
              {getModalTitle()}
            </h2>
            
            <p className="text-center text-sm sm:text-base mb-10 text-gray-400 tracking-wider">
              {getModalDescription()}
            </p>

            {modalMode === 'intel' ? (
               <ul className="flex flex-col gap-6 mt-6">
                 <li className="flex items-center gap-4 group">
                    <div className="w-12 h-12 shrink-0 border border-red-900 text-red-500 flex items-center justify-center bg-red-900/10 rotate-45">
                      <Flame className="w-5 h-5 -rotate-45" />
                    </div>
                    <div className="flex-1 ml-4">
                      <strong className="text-red-400 uppercase block text-lg tracking-wider">Yakuza (Mafia)</strong>
                      <span className="text-gray-400 text-sm">Eliminate the Heimin in the shadows.</span>
                    </div>
                 </li>
                 <li className="flex items-center gap-4 group">
                    <div className="w-12 h-12 shrink-0 border border-gray-600 text-gray-400 flex items-center justify-center bg-gray-800/30 rotate-45">
                      <Eye className="w-5 h-5 -rotate-45" />
                    </div>
                    <div className="flex-1 ml-4">
                      <strong className="text-gray-200 uppercase block text-lg tracking-wider">Heimin (Villager)</strong>
                      <span className="text-gray-400 text-sm">Find the Yakuza before it's too late.</span>
                    </div>
                 </li>
                 <li className="flex items-center gap-4 group">
                    <div className="w-12 h-12 shrink-0 border border-green-900 text-green-500 flex items-center justify-center bg-green-900/10 rotate-45">
                      <Heart className="w-5 h-5 -rotate-45" />
                    </div>
                    <div className="flex-1 ml-4">
                      <strong className="text-green-400 uppercase block text-lg tracking-wider">Sohei (Doctor)</strong>
                      <span className="text-gray-400 text-sm">Offer spiritual protection each night.</span>
                    </div>
                 </li>
                 <li className="flex items-center gap-4 group">
                    <div className="w-12 h-12 shrink-0 border border-blue-900 text-blue-500 flex items-center justify-center bg-blue-900/10 rotate-45">
                      <Search className="w-5 h-5 -rotate-45" />
                    </div>
                    <div className="flex-1 ml-4">
                      <strong className="text-blue-400 uppercase block text-lg tracking-wider">Samurai (Detective)</strong>
                      <span className="text-gray-400 text-sm">Investigate the alignment of players.</span>
                    </div>
                 </li>
               </ul>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 sm:gap-8">
                
                <div className="flex flex-col gap-2 relative">
                  <label className="font-bold uppercase text-xs tracking-widest text-red-500 absolute -top-2 left-4 bg-[#111] px-2 z-10">Alias</label>
                  <input 
                    type="text" 
                    placeholder="ENTER NAME" 
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    maxLength={15}
                    autoFocus={!playerName}
                    className="w-full bg-transparent border border-gray-700 focus:border-red-500 outline-none text-center text-2xl text-white placeholder-gray-800 py-4 transition-colors font-serif uppercase tracking-widest cursor-none"
                  />
                </div>

                {modalMode === 'join' && (
                  <div className="flex flex-col gap-2 relative mt-4">
                    <label className="font-bold uppercase text-xs tracking-widest text-red-500 absolute -top-2 left-4 bg-[#111] px-2 z-10">Scroll Code</label>
                    <input 
                      type="text" 
                      placeholder="ENTER CODE" 
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      maxLength={6}
                      autoFocus={!!playerName}
                      className="w-full bg-transparent border border-gray-700 focus:border-red-500 outline-none text-center text-3xl sm:text-4xl uppercase text-white placeholder-gray-800 py-4 transition-colors tracking-[0.3em] font-serif cursor-none"
                    />
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={!playerName.trim() || (modalMode === 'join' && !joinCode.trim())}
                  onMouseEnter={playHover}
                  className="mt-6 w-full bg-red-900/80 border border-red-500 text-white py-4 sm:py-5 font-bold text-xl uppercase tracking-widest hover:bg-red-800 transition-all shadow-[0_0_15px_rgba(139,0,0,0.3)] disabled:opacity-30 disabled:hover:bg-red-900/80 disabled:shadow-none cursor-none"
                >
                  PROCEED
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* UI Theme Switcher */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-40 opacity-50 hover:opacity-100 transition-opacity">
        <button 
          onClick={switchTheme}
          className="px-6 py-2 bg-transparent text-gray-400 font-bold text-xs uppercase tracking-widest border border-gray-700 hover:border-gray-400 hover:text-white transition-all cursor-pointer"
        >
          Revert to 1930s
        </button>
      </div>

    </div>
  );
}
