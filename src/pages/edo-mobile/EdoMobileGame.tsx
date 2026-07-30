import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toKatakana } from 'wanakana';
import { useSoundscape } from '../../hooks/useSoundscape';
import { MagneticCursor } from '../../components/MagneticCursor';
import { ScrambleText } from '../../components/ScrambleText';

import '../edo/Edo.css';

const SVGS = {
    shuriken: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/></svg>,
    enso: <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="10"/></svg>,
    heal: <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M12 4v16m-8-8h16"/></svg>,
    eye: <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    slash: <><div className="ink-slash !bg-red-600"></div><div className="blood-splatter !bg-red-600" style={{top: '20%', left: '30%'}}></div><div className="blood-splatter !bg-red-600" style={{top: '60%', left: '50%', width: '20px', height: '20px'}}></div></>
};

export default function EdoMobileGame({ gameStateData }: { gameStateData: any }) {
  const navigate = useNavigate();
  const { 
    room, playerId, privateReveal, setPrivateReveal, 
    startGame, handleStampAction: doStampAction, continueReport, returnToLobby, skipDiscussion
  } = gameStateData;

  const [selectedTarget, setSelectedTarget] = useState<string | number | null>(null);
  const [isMobileScrollOpen, setIsMobileScrollOpen] = useState(false);
  const [lastGameState, setLastGameState] = useState<string | null>(null);
  const notesEndRef = useRef<HTMLDivElement>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  
  const { playHover, playThud, playSlash, playWhoosh, startHeartbeat, stopHeartbeat, initAudio } = useSoundscape();

  // Mouse tracking removed for performance

  useEffect(() => {
    if (notesEndRef.current) {
      const container = notesEndRef.current.parentElement;
      if (container) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [room?.notes]);

  useEffect(() => {
    setSelectedTarget(null);
    if (room?.state && room.state !== lastGameState) {
       playWhoosh();
       setLastGameState(room.state);
    }
  }, [room?.state, lastGameState, playWhoosh]);

  const [timeLeftStr, setTimeLeftStr] = useState<string | null>(null);

  useEffect(() => {
    if (!room?.phaseEndTime) {
      setTimeLeftStr(null);
      return;
    }
    
    const updateTimer = () => {
      const remaining = Math.max(0, room.phaseEndTime - Date.now());
      if (remaining === 0) {
        setTimeLeftStr("0:00");
      } else {
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        setTimeLeftStr(`${mins}:${secs.toString().padStart(2, '0')}`);
        
        if (remaining > 0 && remaining <= 10000) {
            startHeartbeat();
        } else {
            stopHeartbeat();
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [room?.phaseEndTime]);

  useEffect(() => {
    if (room?.state === 'lobby') {
      navigate(`/lobby/${room.id}`);
    }
  }, [room?.state, room?.id, navigate]);

  if (!room) return <div className="min-h-screen edo-bg-night flex items-center justify-center text-gray-200 font-serif">Awaiting connection...</div>;

  const { state: gameState, players, notes, revealData, winner, transitionText, votes, nightActions } = room;
  const activePlayer = players.find((p: any) => String(p.id) === String(playerId)) || players[0];
  const isHost = players.length > 0 && String(players[0].id) === String(playerId);
  const isNight = gameState === 'night' || gameState === 'dossier' || gameState === 'game_over' || (gameState === 'transition' && room.nextState === 'night');
  const roleId = activePlayer?.role?.id;

  const handleStampAction = () => {
    if (!selectedTarget) return;
    
    if (actionColor === 'red') playSlash();
    else if (actionColor === 'green' || actionColor === 'blue') playWhoosh();
    else playThud();

    doStampAction(selectedTarget);
    setSelectedTarget(null);
  };



  const renderDossier = () => (
    <div className="flex-1 w-full flex items-center justify-center relative z-10 animate-in fade-in duration-1000 p-4">
      <div className="cinematic-glass-panel max-w-2xl w-full p-8 md:p-12 text-center animate-in zoom-in-95 duration-1000 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--blood)]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="border-b border-[var(--glass-border)] pb-6 mb-8 mt-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-[0.2em] mb-2 uppercase drop-shadow-md cinzel text-flicker">
              <ScrambleText text="The First Dawn" />
          </h1>
          <p className="text-gray-400 font-bold text-[10px] tracking-widest uppercase">Secret Role Assignment</p>
        </div>

        <div className="space-y-6">
          <div className="bg-black/40 p-8 border border-[var(--glass-border)] text-center rounded-lg relative overflow-hidden shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 pointer-events-none"></div>
            <h2 className="font-bold text-[10px] mb-3 text-gray-500 uppercase tracking-widest relative z-10">Your Fate</h2>
            <div className="text-5xl md:text-6xl font-black uppercase tracking-[0.1em] mb-4 cinzel relative z-10 drop-shadow-lg" style={{ color: activePlayer?.role?.ink || 'var(--blood)' }}>
              {activePlayer?.role?.name === 'Mafia' ? 'Yakuza' : 
               activePlayer?.role?.name === 'Villager' ? 'Heimin' :
               activePlayer?.role?.name === 'Doctor' ? 'Sohei' :
               activePlayer?.role?.name === 'Detective' ? 'Samurai' :
               activePlayer?.role?.name === 'Jester' ? 'Kitsune' : activePlayer?.role?.name}
            </div>
            <p className="text-gray-300 text-lg md:text-xl italic max-w-sm mx-auto leading-relaxed relative z-10">
               "{activePlayer?.role?.description || "Your destiny is unwritten."}"
            </p>
          </div>
        </div>

        <button 
          onClick={() => { playThud(); if (isHost) startGame(); }}
          onMouseEnter={playHover}
          disabled={!isHost}
          className={`mt-10 w-full py-4 rounded-md font-bold text-sm uppercase tracking-[0.2em] transition-all relative z-10 ${isHost ? 'cinematic-button' : 'bg-black/50 border border-[var(--glass-border)] text-gray-500 cursor-not-allowed'}`}
        >
          {isHost ? 'Embrace Destiny' : 'Awaiting Commander...'}
        </button>
      </div>
    </div>
  );

  const renderTransition = () => {
    const isNightTransition = room.nextState === 'night';
    return (
      <div className="flex-1 w-full flex items-center justify-center relative z-10 animate-in fade-in duration-1000 p-4">
        <div className="katana-overlay"><div className="katana-blade"></div></div>
        <div className="max-w-3xl text-center animate-in zoom-in-95 duration-1000 delay-500">
          <h1 className={`text-5xl md:text-7xl font-bold tracking-[0.3em] cinzel uppercase mb-8 ${isNightTransition ? 'text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] text-flicker' : 'text-[var(--blood)] drop-shadow-md'}`}>
              <ScrambleText text={room.nextState === 'night' ? 'Night Falls' : room.nextState === 'day_voting' ? 'The Verdict' : 'Dawn Breaks'} />
          </h1>
          <p className={`text-xl md:text-2xl italic max-w-xl mx-auto leading-relaxed ${isNightTransition ? 'text-gray-300' : 'text-gray-400'}`}>
              "{transitionText}"
          </p>
        </div>
      </div>
    );
  };

    const renderReveal = (rData: any, isPrivate: boolean) => (
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80  transition-all duration-1000 ${!isPrivate ? 'violent-shake' : ''}`}>
        {!isPrivate && <div className="absolute inset-0 ink-reveal bg-[var(--blood)]/20 pointer-events-none mix-blend-color-burn"></div>}
        <div className="cinematic-glass-panel max-w-md w-full p-8 text-center shadow-[0_40px_80px_rgba(0,0,0,0.9)] animate-in zoom-in-90 duration-500 rounded-xl relative z-10">
        
        <h2 className="text-xl font-bold text-[var(--blood)] tracking-[0.2em] uppercase mb-6 pb-4 border-b border-[var(--glass-border)] cinzel drop-shadow-sm">
            {isPrivate ? 'Investigation Results' : 'A Body is Found'}
        </h2>
        
        {isPrivate ? (
            <div className="space-y-4">
                <p className="text-gray-400 text-sm tracking-widest uppercase">Your samurai instincts reveal:</p>
                <div className="text-2xl md:text-3xl font-bold text-white uppercase tracking-[0.2em] mt-2 cinzel">{rData.text}</div>
            </div>
        ) : (
            <div className="space-y-4">
               <div className="w-16 h-16 mx-auto text-[var(--blood)] mb-4">{SVGS.slash}</div>
               <p className="text-gray-400 text-sm tracking-widest uppercase">The clan mourns the loss of</p>
               <h3 className="text-4xl font-bold text-white cinzel tracking-widest">{rData.victim?.name || 'No One'}</h3>
               {rData.victim && rData.victim.role && (
                   <div className="mt-4 text-[var(--blood)] font-bold text-xs uppercase tracking-[0.2em] border border-[var(--blood)]/30 bg-[var(--blood)]/10 px-4 py-2 inline-block rounded-sm">
                       {rData.victim.role.name === 'Mafia' ? 'Yakuza' : 
                        rData.victim.role.name === 'Villager' ? 'Heimin' :
                        rData.victim.role.name === 'Doctor' ? 'Sohei' :
                        rData.victim.role.name === 'Detective' ? 'Samurai' :
                        rData.victim.role.name === 'Jester' ? 'Kitsune' : rData.victim.role.name}
                   </div>
               )}
            </div>
        )}
        
        <div className="mt-8 pt-6 border-t border-[var(--glass-border)]">
            {isPrivate ? (
                <button 
                  onClick={() => setPrivateReveal(null)}
                  className="w-full bg-black/40 border border-[var(--glass-border)] text-gray-300 py-3.5 rounded-md font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95"
                >
                  Understood
                </button>
            ) : (
                isHost && (
                  <button 
                    onClick={continueReport}
                    className="w-full cinematic-button rounded-md py-3.5 font-bold text-xs uppercase tracking-[0.2em]"
                  >
                    Continue
                  </button>
                )
            )}
        </div>
      </div>
    </div>
  );



  let actionLabel = "";
  let actionIcon: any = null;
  let actionPrompt = "";
  let actionColor = "";
  
  if (gameState === 'night' && activePlayer && !activePlayer.isDead) {
    if (roleId === 'mafia') {
        actionLabel = "Strike"; 
        actionIcon = SVGS.enso; 
        actionPrompt = "Mark for assassination";
        actionColor = "red";
    }
    else if (roleId === 'doctor') {
        actionLabel = "Protect"; 
        actionIcon = SVGS.heal; 
        actionPrompt = "Offer spiritual protection to";
        actionColor = "green";
    }
    else if (roleId === 'detective') {
        actionLabel = "Investigate"; 
        actionIcon = SVGS.eye; 
        actionPrompt = "Investigate alignment of";
        actionColor = "blue";
    }
  } else if (gameState === 'day_voting') {
    actionLabel = selectedTarget === 'skip' ? "Skip" : "Throw Shuriken";
    actionIcon = SVGS.shuriken;
    actionPrompt = selectedTarget === 'skip' ? "Abstain from voting" : "Cast suspicion on";
    actionColor = "gray";
  }

  const phaseTitle = gameState === 'night' ? `Night ${room.day || 1}` : `Day ${room.day || 1}`;
  const phaseSub = gameState === 'night' 
    ? (roleId === 'mafia' ? "The strike approaches. Choose your victim." : roleId === 'doctor' ? "Spirits are restless. Choose who to protect." : roleId === 'detective' ? "Deception hides in the dark. Uncover the truth." : "The shadows deepen. Sleep and pray for morning.")
    : (gameState === 'day_voting' ? "The tribunal convenes. Cast your vote." : "The Emperor's peace holds. Discuss the traitors among you.");

  return (
    <div 
      ref={gameContainerRef}
      
      onClick={initAudio}
      className={`h-[100dvh] w-[100dvw] flex flex-col overflow-hidden edo-theme ${isNight ? 'edo-bg-night text-gray-200 cursor-none' : 'edo-bg-day text-[#2c1b18] cursor-none'} transition-colors duration-[2000ms] relative`}
    >
      <MagneticCursor />
      
      {/* Background & Particles */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none z-0"></div>
      
      {/* EXTREME REVENGE: BLOOD MOON */}
      {isNight && <div className="blood-moon" style={{transform: 'scale(0.6)'}}></div>}
      
      <div id="particles" className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {!isNight && [...Array(20)].map((_, i) => (
             <div key={`sakura-${i}`} className="particle sakura" style={{ width: `${Math.random() * 10 + 8}px`, height: `${Math.random() * 10 + 8}px`, left: `${Math.random() * 120 - 10}vw`, animationDuration: `${Math.random() * 5 + 5}s`, animationDelay: `${Math.random() * -10}s` }} />
          ))}
          {[...Array(isNight ? 20 : 10)].map((_, i) => (
             <div key={`firefly-${i}`} className="particle firefly" style={{ width: `${Math.random() * 4 + 2}px`, height: `${Math.random() * 4 + 2}px`, left: `${Math.random() * 100}vw`, top: `${Math.random() * 100}vh`, animationDelay: `${Math.random() * -5}s, ${Math.random() * -2}s` }} />
          ))}
      </div>

      <div className="flex-1 flex flex-col md:flex-row relative z-10 overflow-hidden">
        
        {/* State Content */}
        {gameState === 'dossier' && renderDossier()}
        {gameState === 'transition' && renderTransition()}
        
        {/* Game Board */}
        {gameState !== 'dossier' && gameState !== 'transition' && (
        <>
        <div className="flex-1 flex flex-col p-4 md:p-8 relative h-full animate-in fade-in duration-1000">
            
            {/* Header */}
            <div className={`text-center mb-10 pb-6 border-b border-[var(--glass-border)] transition-colors duration-1000 mt-4`}>
                <h1 className={`text-4xl md:text-5xl font-bold tracking-[0.2em] uppercase cinzel transition-colors duration-[2000ms] ${isNight ? 'text-[var(--blood)] drop-shadow-[0_0_20px_rgba(220,38,38,0.4)] text-flicker' : 'text-[var(--gold)] drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]'}`}>
                    <ScrambleText text={phaseTitle} />
                </h1>
                <p className={`text-[10px] md:text-xs font-bold tracking-widest uppercase mt-4 transition-colors duration-[2000ms] ${isNight ? 'text-gray-400' : 'text-gray-500'}`}>{phaseSub}</p>
                {timeLeftStr && <div className={`text-2xl font-bold mt-4 tracking-[0.1em] cinzel transition-colors duration-[2000ms] slot-machine-timer ${isNight ? 'text-white' : 'text-gray-300'}`}>{timeLeftStr}</div>}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pb-32 md:pb-0">
                


                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 max-w-7xl mx-auto" id="players-grid">
                    {players.filter(Boolean).map((p: any) => {
                        const isMe = p.id === playerId;
                        const isDead = p.isDead;
                        const isTargeted = selectedTarget === p.id;
                        let cardStateClass = 'border-[var(--glass-border)] hover:border-gray-500';
                        
                        if (isDead) {
                            cardStateClass = 'opacity-50 grayscale border-gray-900 glitch-dead';
                        } else if (isTargeted) {
                            if (!isNight) cardStateClass = 'border-[var(--gold)] shadow-[0_0_20px_rgba(212,175,55,0.3)] transform -translate-y-2';
                            else if (roleId === 'mafia') cardStateClass = 'border-[var(--blood)] shadow-[0_0_20px_rgba(220,38,38,0.4)] transform -translate-y-2';
                            else if (roleId === 'doctor') cardStateClass = 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] transform -translate-y-2';
                            else if (roleId === 'detective') cardStateClass = 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] transform -translate-y-2';
                        } else if (!isDead && (isNight ? roleId !== 'villager' : gameState === 'day_voting')) {
                            cardStateClass += ' hover:bg-white/5 hover-slash hover:-translate-y-1';
                        }

                        const pRoleName = p.role?.name === 'Mafia' ? 'Yakuza' : 
                                          p.role?.name === 'Villager' ? 'Heimin' :
                                          p.role?.name === 'Doctor' ? 'Sohei' :
                                          p.role?.name === 'Detective' ? 'Samurai' :
                                          p.role?.name === 'Jester' ? 'Kitsune' : p.role?.name;

                        return (
                            <div key={p.id} 
                                 onClick={() => { if (!isDead && (isNight ? roleId !== 'villager' : gameState === 'day_voting')) { playThud(); setSelectedTarget(p.id); } }} 
                                 onMouseEnter={playHover}
                                 className={`spotlight-card relative aspect-[3/4] cinematic-glass-panel rounded-xl flex flex-col items-center justify-center transition-all duration-500 ease-out group ${isDead ? 'opacity-50 grayscale border-gray-900 shatter-dead cursor-none' : (isNight && roleId==='villager') || gameState !== 'day_voting' && !isNight ? 'cursor-none' : 'cursor-none'} ${cardStateClass}`}>
                                
                                <div className="absolute inset-0 z-10 pointer-events-none">{isDead && SVGS.slash}</div>
                                
                                {gameState !== 'game_over' && (
                                    <div 
                                      className={`absolute right-3 top-0 bottom-0 py-4 flex items-center justify-center pointer-events-none z-10 text-3xl md:text-5xl font-black tracking-[0.2em] opacity-[0.1] text-white cinzel`}
                                      style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
                                    >
                                        {toKatakana(p.name)}
                                    </div>
                                )}
                                
                                {isNight && roleId === 'mafia' && p.role?.id === 'mafia' && !isDead && (
                                    <div className="absolute top-3 right-3 text-[8px] uppercase tracking-widest font-bold text-[var(--blood)] border border-[var(--blood)]/50 bg-[var(--blood)]/20 px-1.5 py-0.5 rounded-sm z-20">Ally</div>
                                )}

                                <div className="relative z-20 flex-1 flex flex-col items-center justify-center w-full group-hover:-translate-y-2 transition-transform duration-500">
                                    <div className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-4 shadow-2xl transition-all duration-1000 bg-black/60  border border-[var(--glass-border)] text-gray-300 rounded-full group-hover:text-white group-hover:border-gray-500`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                                    </div>
                                    
                                    <h3 className={`font-bold text-sm md:text-base tracking-[0.15em] uppercase truncate w-full text-center transition-colors duration-1000 drop-shadow-md text-white`}>
                                        {p.name}
                                    </h3>
                                    
                                    {(isMe || (p.isDead && room.settings?.revealOnDeath) || (roleId === 'mafia' && p.role?.id === 'mafia') || gameState === 'game_over') && p.role && (
                                      <div className="mt-2 text-[9px] font-bold uppercase tracking-widest" style={{ color: p.role.ink || 'var(--blood)' }}>
                                         {pRoleName}
                                      </div>
                                    )}

                                    {gameState === 'day_voting' && !room.settings.anonVoting && Object.values(votes).filter(v => v === p.id).length > 0 && (
                                        <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/80 px-2 py-1 rounded-sm border border-[var(--glass-border)] text-[var(--gold)] text-[10px] font-bold z-30">
                                            <span className="w-3 h-3">{SVGS.shuriken}</span>
                                            <span>{Object.values(votes).filter(v => v === p.id).length}</span>
                                        </div>
                                    )}
                                    {gameState === 'day_voting' && votes[playerId] === p.id && (
                                        <div className="hanko-stamp">VOTED</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>

        {/* Action Modal (Square Box) */}
        {/* Action Modal (Square Box) */}
        {selectedTarget !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-auto">
            <div className="w-[90vw] max-w-[400px] aspect-square cinematic-glass-panel p-8 shadow-[0_30px_60px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center gap-6 rounded-xl animate-in zoom-in-95 duration-200">
              
              <div className={`w-24 h-24 flex flex-shrink-0 items-center justify-center ${actionColor === 'green' ? 'text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]' : actionColor === 'blue' ? 'text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]' : actionColor === 'red' ? 'text-[var(--blood)] drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'text-gray-300 drop-shadow-md'}`}>
                  {actionIcon}
              </div>
              
              <div className="flex flex-col text-center w-full">
                  <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest leading-none mb-3">{actionPrompt}</p>
                  <p className="text-2xl md:text-3xl font-bold uppercase tracking-[0.2em] truncate w-full leading-none text-white cinzel">{selectedTarget === 'skip' ? 'Skip' : players.find((p:any)=>String(p.id)===String(selectedTarget))?.name}</p>
              </div>
              
              <div className="flex w-full mt-2 gap-4">
                  <button onClick={() => { playThud(); setSelectedTarget(null); }} className="flex-1 py-3.5 border border-[var(--glass-border)] bg-black/40 hover:bg-white/10 text-gray-300 transition-colors uppercase tracking-[0.2em] text-xs font-bold rounded-md active:scale-95">
                      Cancel
                  </button>
                  <button onClick={handleStampAction} className={`flex-1 py-3.5 font-bold transition-all uppercase tracking-[0.2em] text-xs rounded-md active:scale-95 ${actionColor === 'green' ? 'bg-green-900/40 border border-green-500 text-green-400 hover:bg-green-900 hover:text-white' : actionColor === 'blue' ? 'bg-blue-900/40 border border-blue-500 text-blue-400 hover:bg-blue-900 hover:text-white' : actionColor === 'red' ? 'bg-[var(--blood)]/40 border border-[var(--blood)] text-[var(--blood)] hover:bg-[var(--blood)] hover:text-white' : 'bg-gray-800 border border-gray-400 text-white hover:bg-gray-700'}`}>
                      {actionLabel}
                  </button>
              </div>
            </div>
        </div>
        )}

        {/* Sidebar Chat Container */}
        <div className={`fixed md:relative bottom-0 right-0 w-full md:w-80 lg:w-96 h-[50vh] md:h-full transform ${isMobileScrollOpen ? 'translate-y-0' : 'translate-y-[calc(100%-3rem)]'} md:translate-y-0 transition-transform duration-500 z-40 flex flex-col cinematic-glass md:border-l border-t md:border-t-0 border-[var(--glass-border)] shadow-2xl`}>
            
            <div className="md:hidden h-12 w-full flex bg-black/60 border-b border-[var(--glass-border)] z-50">
                {gameState === 'day_discussion' && !activePlayer?.isDead && (
                   <button 
                     disabled={room.skipDiscussionVotes?.includes(playerId)}
                     onClick={skipDiscussion}
                     className="flex-1 flex items-center justify-center border-r border-[var(--glass-border)] text-gray-300 bg-black/40 uppercase tracking-widest font-bold text-[10px] disabled:opacity-50 hover:bg-white/5"
                   >
                     {room.skipDiscussionVotes?.includes(playerId) ? 'Waiting...' : 'Skip Discussion'} ({room.skipDiscussionVotes?.length || 0}/{players.filter((p: any) => !p.isDead && !p.isBot).length})
                   </button>
                )}
                {gameState === 'day_voting' && !activePlayer?.isDead && (
                   <button 
                     onClick={() => setSelectedTarget('skip')}
                     className="flex-1 flex items-center justify-center border-r border-[var(--glass-border)] text-gray-300 bg-black/40 uppercase tracking-widest font-bold text-[10px] hover:bg-white/5"
                   >
                     Skip Vote {room.votes && Object.values(room.votes).filter(v => v === 'skip').length > 0 && !room.settings.anonVoting && `(${Object.values(room.votes).filter(v => v === 'skip').length})`}
                   </button>
                )}
                <button onClick={() => setIsMobileScrollOpen(!isMobileScrollOpen)} className="flex-1 flex items-center justify-center text-gray-400 uppercase tracking-widest font-bold text-[10px]">
                    <span>{isMobileScrollOpen ? '▼ Hide Chronicle ▼' : '▲ Clan Chronicle ▲'}</span>
                </button>
            </div>
            
            <div className="flex-1 w-full flex flex-col overflow-hidden relative">
                <div className="p-4 bg-black/80 text-white text-center font-bold tracking-[0.2em] text-[10px] uppercase border-b border-[var(--glass-border)] hidden md:block">
                    Clan Chronicle
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-gray-300 text-xs custom-scrollbar">
                    {notes.map((note: any, idx: number) => (
                        <div key={idx} className={`mb-2 ${note.isSystem ? 'text-[var(--blood)] text-center italic font-bold my-4 border-y border-[var(--glass-border)]/50 py-3 text-[10px] uppercase tracking-widest' : 'flex bg-black/40 p-3 rounded-md border border-[var(--glass-border)]/50'}`}>
                            {!note.isSystem && <span className="font-bold text-[var(--gold)] mr-2 flex-shrink-0 uppercase text-[9px] tracking-widest mt-0.5">{note.sender}</span>}
                            <span className={!note.isSystem ? 'leading-relaxed text-gray-200' : ''}>{note.text}</span>
                        </div>
                    ))}
                    {nightActions && nightActions[playerId] && (
                        <div className="text-gray-400 text-center italic font-bold my-4 border-y border-[var(--glass-border)]/50 py-3 text-[10px] uppercase tracking-widest">
                            {roleId === 'mafia' ? `Marked ${players.find((p:any)=>p.id===nightActions[playerId])?.name || 'no one'} for assassination.` :
                             roleId === 'doctor' ? `Protected ${players.find((p:any)=>p.id===nightActions[playerId])?.name || 'no one'}.` :
                             roleId === 'detective' ? `Investigated ${players.find((p:any)=>p.id===nightActions[playerId])?.name || 'no one'}.` : ''}
                        </div>
                    )}
                    {gameState === 'day_voting' && votes[playerId] && (
                        <div className="text-gray-400 text-center italic font-bold my-4 border-y border-[var(--glass-border)]/50 py-3 text-[10px] uppercase tracking-widest">
                            Voted for {votes[playerId] === 'skip' ? 'Skip' : players.find((p:any)=>p.id===votes[playerId])?.name}.
                        </div>
                    )}
                    <div ref={notesEndRef} />
                </div>
            </div>
        </div>
        </>
        )}
      </div>

      {revealData && renderReveal(revealData, false)}
      {privateReveal && renderReveal(privateReveal, true)}

      {gameState === 'game_over' && (
         <div className="fixed inset-0 z-[100] bg-black/95  flex flex-col items-center justify-center p-4 animate-in fade-in duration-1000">
            <h1 className="text-5xl md:text-7xl font-bold text-[var(--gold)] tracking-[0.3em] mb-4 uppercase text-center drop-shadow-[0_0_30px_rgba(212,175,55,0.4)] cinzel">
               {winner?.team === 'MAFIA' ? 'Yakuza Victory' : winner?.team === 'TOWN' ? 'Heimin Victory' : 'Kitsune Victory'}
            </h1>
            <p className="text-gray-300 uppercase tracking-[0.2em] mb-12 text-sm font-bold">{winner?.text || "The conflict has ended."}</p>
            <button onClick={returnToLobby} className="cinematic-button px-10 py-4 rounded-md font-bold uppercase tracking-[0.2em] text-xs transition-all active:scale-95">
               Return to Clan Gathering
            </button>
         </div>
      )}

    </div>
  );
}
