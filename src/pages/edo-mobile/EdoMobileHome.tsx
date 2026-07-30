import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from "lucide-react";
import '../edo/Edo.css';
import { useSoundscape } from '../../hooks/useSoundscape';
import { MagneticCursor } from '../../components/MagneticCursor';
import { ScrambleText } from '../../components/ScrambleText';

export default function EdoMobileHome() {
  const navigate = useNavigate();
  const [modalMode, setModalMode] = useState<'host' | 'join' | 'bots' | null>(null);
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('mafia_playerName') || '');
  const [joinCode, setJoinCode] = useState('');
  
  const { playHover, playThud, playSlash, playWhoosh, initAudio } = useSoundscape();

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

  const switchTheme = () => {
    localStorage.setItem('mafia_theme', '1930s');
    window.location.reload();
  };

  return (
    <div onClick={initAudio} className="min-h-[100dvh] edo-home-bg edo-theme flex flex-col items-center justify-center p-4 text-gray-200 relative overflow-hidden">
      
      <MagneticCursor />
      
      {/* Giant Background Enso */}
      <div className="sun-enso opacity-30 mix-blend-screen !left-[50%] !top-[40%] !w-[150vw] !h-[150vw]"></div>

      {/* Cinematic Black Fade Out Overlay */}
      <div className="fixed inset-0 bg-black z-[999] pointer-events-none animate-fade-out-slow"></div>

      {/* Vignette */}
      <div className="fixed inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none z-0"></div>

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

      {/* Main Content Container */}
      <main className="relative z-20 flex flex-col items-center justify-center w-full max-w-sm px-4 gap-8 pb-12 pt-12 h-full flex-grow">
        
        {/* Game Title */}
        <header className="text-center mb-8 flex flex-col items-center drop-shadow-md animate-in slide-in-from-top duration-1000 ease-out">
          <h1 className="text-6xl font-bold tracking-[0.2em] text-[#fdfbf7] text-glow leading-tight uppercase cinzel relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] text-red-900/20 -z-10 tracking-tighter whitespace-nowrap overflow-hidden pointer-events-none">ヤクザ</div>
            <ScrambleText text="SHADOWS" />
            <br/>
            <span className="text-[#ffb4a8] text-opacity-90 text-3xl tracking-[0.3em] mt-2 block">
               <ScrambleText text="OF EDO" />
            </span>
          </h1>
        </header>

         {/* Navigation / Actions */}
        {!modalMode ? (
          <nav className="flex flex-col gap-4 w-full mt-4 z-30 animate-in slide-in-from-bottom duration-1000 delay-300 ease-out fill-mode-both">
             <button 
               onClick={() => { playWhoosh(); setModalMode('host'); }}
               onMouseEnter={playHover}
               className="w-full cinematic-slash-button py-4 px-6 font-bold text-lg uppercase tracking-widest flex items-center justify-between group cursor-none"
             >
               <span className="flex items-center gap-4 relative z-10">Host Game</span>
               <span className="text-red-900 opacity-50 text-xl font-black group-hover:opacity-100 transition-opacity">/</span>
             </button>
             
             <button 
               onClick={() => { playWhoosh(); setModalMode('join'); }}
               onMouseEnter={playHover}
               className="w-full cinematic-slash-button py-4 px-6 font-bold text-lg uppercase tracking-widest flex items-center justify-between group cursor-none"
             >
               <span className="flex items-center gap-4 relative z-10 text-gray-300 group-hover:text-white">Join Game</span>
               <span className="text-red-900 opacity-50 text-xl font-black group-hover:opacity-100 transition-opacity">/</span>
             </button>

             <button 
               onClick={() => { playWhoosh(); setModalMode('bots'); }}
               onMouseEnter={playHover}
               className="w-full cinematic-slash-button py-4 px-6 font-bold text-lg uppercase tracking-widest flex items-center justify-between group cursor-none opacity-80"
             >
               <span className="flex items-center gap-4 relative z-10 text-gray-400 group-hover:text-white">Practice vs AI</span>
               <span className="text-red-900 opacity-50 text-xl font-black group-hover:opacity-100 transition-opacity">/</span>
             </button>
          </nav>
        ) : (
          <div className="w-full bg-[#111]/90  border-2 border-[#3e2723] p-6 relative z-30 shadow-2xl animate-in fade-in zoom-in-95 duration-300 rounded-sm">
            <button onClick={() => { playWhoosh(); setModalMode(null); }} className="absolute top-2 right-2 text-gray-400 hover:text-white p-2">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-center tracking-widest uppercase mb-2 text-[#8b0000]">
              {modalMode === 'host' ? 'Host Game' : modalMode === 'join' ? 'Join Game' : 'Play With Bots'}
            </h2>
            <p className="text-center text-sm text-gray-400 italic mb-6">
              {modalMode === 'host' ? 'Establish a new village.' : 
               modalMode === 'join' ? 'Enter the code of the existing village.' : 
               'Practice against AI shinobi.'}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Your Alias</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter name..."
                  className="w-full bg-[#1a1a1a] border border-[#3e2723] text-white px-4 py-3 outline-none focus:border-[#8b0000] transition-colors font-serif text-lg text-center"
                  required
                />
              </div>

              {modalMode === 'join' && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Village Code</label>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Enter 6-letter code"
                    className="w-full bg-[#1a1a1a] border border-[#3e2723] text-white px-4 py-3 outline-none focus:border-[#8b0000] transition-colors font-serif text-lg text-center uppercase tracking-widest"
                    required
                    maxLength={6}
                  />
                </div>
              )}

              <button type="submit" className="mt-4 w-full bg-[#8b0000] text-white font-bold tracking-widest uppercase py-4 hover:bg-red-900 transition-colors border border-red-950 shadow-[0_0_15px_rgba(139,0,0,0.3)]">
                {modalMode === 'join' ? 'Enter Village' : 'Initialize'}
              </button>
            </form>
          </div>
        )}

        {/* UI Theme Switcher */}
        {!modalMode && (
          <div className="mt-auto flex flex-row gap-4 z-40 pt-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both w-full justify-center">
            <button 
              onClick={switchTheme}
              className="px-4 py-2 bg-transparent text-gray-500 hover:text-white border border-gray-700 font-bold text-xs uppercase tracking-widest transition-colors shadow-lg active:scale-95"
            >
              1930's Theme
            </button>
            <button 
              className="px-4 py-2 bg-[#8b0000]/40 text-[#ffb4a8] border border-[#8b0000] font-bold text-xs uppercase tracking-widest cursor-default shadow-lg"
            >
              Shadows of Edo
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
