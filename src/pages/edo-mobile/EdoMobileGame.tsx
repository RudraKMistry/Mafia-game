import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toKatakana } from 'wanakana';

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
  const notesEndRef = useRef<HTMLDivElement>(null);

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
  }, [room?.state]);

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
    doStampAction(selectedTarget);
    setSelectedTarget(null);
  };



  const renderDossier = () => (
    <div className="flex-1 w-full flex items-center justify-center relative z-10 animate-in fade-in duration-1000 p-4">
      <div className="bg-black/60 backdrop-blur-md border border-gray-800 shadow-2xl max-w-2xl w-full p-8 md:p-12 text-center animate-in zoom-in-95 duration-1000">
        <div className="border-b border-gray-800 pb-6 mb-8 mt-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-widest mb-2 uppercase drop-shadow-md">The First Dawn</h1>
          <p className="font-serif text-gray-400 font-bold text-xs tracking-widest uppercase">Secret Role Assignment</p>
        </div>

        <div className="space-y-6 font-serif">
          <div className="bg-[#111] p-6 border border-gray-800 text-center">
            <h2 className="font-bold text-xs mb-2 text-gray-500 uppercase tracking-widest">YOUR KARMA</h2>
            <div className="text-5xl md:text-6xl font-black uppercase tracking-widest mb-4" style={{ color: activePlayer?.role?.ink || '#ef4444' }}>
              {activePlayer?.role?.name === 'Mafia' ? 'Yakuza' : 
               activePlayer?.role?.name === 'Villager' ? 'Heimin' :
               activePlayer?.role?.name === 'Doctor' ? 'Sohei' :
               activePlayer?.role?.name === 'Detective' ? 'Samurai' :
               activePlayer?.role?.name === 'Jester' ? 'Kitsune' : activePlayer?.role?.name}
            </div>
            <p className="text-gray-300 text-lg md:text-xl italic max-w-sm mx-auto leading-relaxed">
               "{activePlayer?.role?.description || "Your destiny is unwritten."}"
            </p>
          </div>
        </div>

        <button 
          onClick={() => isHost ? startGame() : null}
          disabled={!isHost}
          className={`mt-10 w-full py-4 border font-bold text-lg uppercase tracking-widest transition-all ${isHost ? 'bg-red-900/80 border-red-500 text-white hover:bg-red-800 shadow-[0_0_15px_rgba(139,0,0,0.3)]' : 'bg-white/5 border-gray-800 text-gray-500 cursor-not-allowed'}`}
        >
          {isHost ? 'Embrace Destiny' : 'Awaiting Clan Leader...'}
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
          <h1 className={`text-5xl md:text-7xl font-bold tracking-[0.2em] uppercase mb-8 ${isNightTransition ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'text-[#8b0000] drop-shadow-md'}`}>
              {room.nextState === 'night' ? 'Night Falls' : room.nextState === 'day_voting' ? 'The Verdict' : 'Dawn Breaks'}
          </h1>
          <p className={`font-serif text-xl md:text-2xl italic max-w-xl mx-auto leading-relaxed ${isNightTransition ? 'text-gray-300' : 'text-[#4e342e]'}`}>
              {transitionText}
          </p>
        </div>
      </div>
    );
  };

    const renderReveal = (rData: any, isPrivate: boolean) => (
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl transition-all duration-1000 ${!isPrivate ? 'violent-shake' : ''}`}>
        {!isPrivate && <div className="absolute inset-0 ink-reveal bg-red-900/40 pointer-events-none mix-blend-color-burn"></div>}
        <div className="bg-[#111]/90 backdrop-blur-2xl border border-gray-700 max-w-md w-full p-8 text-center shadow-[0_30px_60px_rgba(0,0,0,0.8)] animate-in zoom-in-90 duration-500 rounded-sm relative z-10">
        
        <h2 className="text-xl font-bold text-red-500 tracking-widest uppercase mb-6 pb-4 border-b border-gray-800">
            {isPrivate ? 'Investigation Results' : 'A Body is Found'}
        </h2>
        
        {isPrivate ? (
            <div className="space-y-4">
                <p className="text-gray-400 font-serif text-lg">Your samurai instincts reveal:</p>
                <div className="text-xl md:text-2xl font-bold text-white uppercase tracking-widest mt-2">{rData.text}</div>
            </div>
        ) : (
            <div className="space-y-4">
               <div className="w-16 h-16 mx-auto text-red-600 mb-4">{SVGS.slash}</div>
               <p className="text-gray-400 font-serif text-lg">The village mourns the loss of</p>
               <h3 className="font-serif text-4xl font-bold text-white">{rData.victim?.name || 'No One'}</h3>
               {rData.victim && rData.victim.role && (
                   <div className="mt-4 text-red-500 font-bold text-xl uppercase tracking-widest border border-red-900/50 bg-red-900/10 px-4 py-2 inline-block">
                       {rData.victim.role.name === 'Mafia' ? 'Yakuza' : 
                        rData.victim.role.name === 'Villager' ? 'Heimin' :
                        rData.victim.role.name === 'Doctor' ? 'Sohei' :
                        rData.victim.role.name === 'Detective' ? 'Samurai' :
                        rData.victim.role.name === 'Jester' ? 'Kitsune' : rData.victim.role.name}
                   </div>
               )}
            </div>
        )}
        
        <div className="mt-8 pt-6 border-t border-gray-800">
            {isPrivate ? (
                <button 
                  onClick={() => setPrivateReveal(null)}
                  className="w-full border border-gray-600 bg-white/5 text-gray-300 py-3 font-bold text-lg uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Understood
                </button>
            ) : (
                isHost && (
                  <button 
                    onClick={continueReport}
                    className="w-full bg-red-900/80 border border-red-500 text-white py-3 font-bold text-lg uppercase tracking-widest hover:bg-red-800 transition-all"
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
    <div className={`h-[100dvh] w-[100dvw] flex flex-col overflow-hidden edo-theme ${isNight ? 'bg-[#0a0a0c] text-gray-200' : 'bg-[#eaddd3] text-[#2c1b18]'} transition-colors duration-[2000ms] relative`}>
      
      {/* Background & Particles */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-overlay z-0"></div>
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
            <div className={`text-center mb-8 pb-6 border-b border-gray-800 transition-colors duration-1000`}>
                <h1 className={`text-4xl md:text-5xl font-bold tracking-[0.15em] uppercase transition-colors duration-[2000ms] ${isNight ? 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'text-[#8b0000]'}`}>{phaseTitle}</h1>
                <p className={`text-sm md:text-base tracking-wider uppercase mt-3 transition-colors duration-[2000ms] ${isNight ? 'text-gray-400' : 'text-[#4e342e]'}`}>{phaseSub}</p>
                {timeLeftStr && <div className={`text-2xl font-bold mt-3 font-serif transition-colors duration-[2000ms] ${isNight ? 'text-white' : 'text-[#2c1b18]'}`}>{timeLeftStr}</div>}
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-32 md:pb-0">
                


                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto" id="players-grid">
                    {players.filter(Boolean).map((p: any) => {
                        const isMe = p.id === playerId;
                        const isDead = p.isDead;
                        const isTargeted = selectedTarget === p.id;
                        let cardStateClass = 'border-gray-800';
                        
                        if (isDead) {
                            cardStateClass = 'opacity-40 grayscale border-gray-900';
                        } else if (isTargeted) {
                            if (!isNight) cardStateClass = 'border-gray-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] transform -translate-y-1';
                            else if (roleId === 'mafia') cardStateClass = 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] transform -translate-y-1';
                            else if (roleId === 'doctor') cardStateClass = 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] transform -translate-y-1';
                            else if (roleId === 'detective') cardStateClass = 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] transform -translate-y-1';
                        } else if (!isDead && (isNight ? roleId !== 'villager' : gameState === 'day_voting')) {
                            cardStateClass += ' hover:border-gray-500 hover:bg-white/5';
                        }

                        const pRoleName = p.role?.name === 'Mafia' ? 'Yakuza' : 
                                          p.role?.name === 'Villager' ? 'Heimin' :
                                          p.role?.name === 'Doctor' ? 'Sohei' :
                                          p.role?.name === 'Detective' ? 'Samurai' :
                                          p.role?.name === 'Jester' ? 'Kitsune' : p.role?.name;

                        return (
                            <div key={p.id} onClick={() => !isDead && (isNight ? roleId !== 'villager' : gameState === 'day_voting') && setSelectedTarget(p.id)} 
                                 className={`relative aspect-[3/4] shoji-card shoji-frame shoji-paper flex flex-col items-center justify-center transition-all duration-500 ease-out group ${isDead || (isNight && roleId==='villager') || gameState !== 'day_voting' && !isNight ? 'cursor-default' : 'cursor-pointer'} ${cardStateClass}`}>
                                
                                <div className="absolute inset-0 z-10 pointer-events-none">{isDead && SVGS.slash}</div>
                                
                                {gameState !== 'game_over' && (
                                    <div 
                                      className={`absolute right-2 md:right-3 top-0 bottom-0 py-4 flex items-center justify-center pointer-events-none z-10 text-2xl md:text-4xl font-black tracking-[0.2em] opacity-[0.25] ${isNight ? 'text-white mix-blend-overlay' : 'text-[#8b0000] mix-blend-color-burn'}`}
                                      style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
                                    >
                                        {toKatakana(p.name)}
                                    </div>
                                )}
                                
                                {isNight && roleId === 'mafia' && p.role?.id === 'mafia' && !isDead && (
                                    <div className="absolute top-2 right-2 text-[9px] uppercase tracking-wider font-bold text-red-500 border border-red-900/50 bg-red-900/20 px-1.5 py-0.5 z-20">Ally</div>
                                )}

                                <div className="relative z-20 flex-1 flex flex-col items-center justify-center w-full group-hover:-translate-y-1 transition-transform duration-500">
                                    <div className={`w-12 h-12 md:w-16 md:h-16 border flex items-center justify-center mb-3 drop-shadow-xl transition-all duration-1000 ${isNight ? 'bg-[#0a0a0c]/80 backdrop-blur-sm border-gray-600/50 text-gray-300 group-hover:bg-[#1a1a1c]/90' : 'bg-white/80 backdrop-blur-sm border-white text-[#2c1b18] group-hover:bg-white'} rounded-sm`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                                    </div>
                                    
                                    <h3 className={`font-bold text-base md:text-lg tracking-widest uppercase truncate w-full text-center transition-colors duration-1000 drop-shadow-md ${isNight ? 'text-white' : 'text-[#2c1b18]'}`}>
                                        {p.name}
                                    </h3>
                                    
                                    {(isMe || (p.isDead && room.settings?.revealOnDeath) || (roleId === 'mafia' && p.role?.id === 'mafia') || gameState === 'game_over') && p.role && (
                                      <div className="mt-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: p.role.ink || '#ef4444' }}>
                                         {pRoleName}
                                      </div>
                                    )}

                                    {gameState === 'day_voting' && !room.settings.anonVoting && Object.values(votes).filter(v => v === p.id).length > 0 && (
                                        <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/10 px-1.5 py-0.5 border border-white/20 text-white text-[10px] font-bold z-30">
                                            <span className="w-3 h-3 text-white">{SVGS.shuriken}</span>
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
        <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 md:w-96 aspect-square bg-[#0a0a0c]/95 backdrop-blur-xl border border-gray-700 text-white p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] z-50 flex flex-col items-center justify-center gap-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${selectedTarget ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          
          <div className={`w-20 h-20 md:w-24 md:h-24 flex flex-shrink-0 items-center justify-center ${actionColor === 'green' ? 'text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]' : actionColor === 'blue' ? 'text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]' : actionColor === 'red' ? 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'text-gray-300 drop-shadow-md'}`}>
              {actionIcon}
          </div>
          
          <div className="flex flex-col text-center w-full">
              <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest leading-none mb-2 md:mb-3">{actionPrompt}</p>
              <p className="text-xl md:text-3xl font-bold uppercase tracking-widest truncate w-full leading-none text-white">{selectedTarget === 'skip' ? 'Skip' : players.find((p:any)=>p.id===selectedTarget)?.name}</p>
          </div>
          
          <div className="flex w-full mt-2 gap-3 md:gap-4">
              <button onClick={() => setSelectedTarget(null)} className="flex-1 py-2 md:py-3 border border-gray-700 hover:bg-white/5 text-gray-300 transition-colors uppercase tracking-widest text-xs md:text-sm font-bold">
                  Cancel
              </button>
              <button onClick={handleStampAction} className={`flex-1 py-2 md:py-3 font-bold transition-all uppercase tracking-widest text-xs md:text-sm border ${actionColor === 'green' ? 'bg-green-900/40 border-green-500 text-green-400 hover:bg-green-900 hover:text-white' : actionColor === 'blue' ? 'bg-blue-900/40 border-blue-500 text-blue-400 hover:bg-blue-900 hover:text-white' : actionColor === 'red' ? 'bg-red-900/40 border-red-500 text-red-400 hover:bg-red-900 hover:text-white' : 'bg-gray-800 border-gray-400 text-white hover:bg-gray-700'}`}>
                  {actionLabel}
              </button>
          </div>
        </div>

        {/* Sidebar Chat Container */}
        <div className={`fixed md:relative bottom-0 right-0 w-full md:w-80 lg:w-96 h-[50vh] md:h-full transform ${isMobileScrollOpen ? 'translate-y-0' : 'translate-y-[calc(100%-3rem)]'} md:translate-y-0 transition-transform duration-500 z-40 flex flex-col bg-black/60 backdrop-blur-md md:border-l border-t md:border-t-0 border-gray-800 shadow-2xl`}>
            
            <div className="md:hidden h-12 w-full flex bg-[#111] border-b border-gray-800 z-50">
                {gameState === 'day_discussion' && !activePlayer?.isDead && (
                   <button 
                     disabled={room.skipDiscussionVotes?.includes(playerId)}
                     onClick={skipDiscussion}
                     className="flex-1 flex items-center justify-center border-r border-gray-800 text-[#fdfbf7] bg-[#5a403c] uppercase tracking-widest font-bold text-[10px] disabled:opacity-50 disabled:bg-[#3e2723]"
                   >
                     {room.skipDiscussionVotes?.includes(playerId) ? 'Waiting...' : 'Skip Discussion'} ({room.skipDiscussionVotes?.length || 0}/{players.filter((p: any) => !p.isDead && !p.isBot).length})
                   </button>
                )}
                {gameState === 'day_voting' && !activePlayer?.isDead && (
                   <button 
                     onClick={() => setSelectedTarget('skip')}
                     className="flex-1 flex items-center justify-center border-r border-gray-800 text-[#fdfbf7] bg-[#5a403c] uppercase tracking-widest font-bold text-[10px]"
                   >
                     Skip Vote {room.votes && Object.values(room.votes).filter(v => v === 'skip').length > 0 && !room.settings.anonVoting && `(${Object.values(room.votes).filter(v => v === 'skip').length})`}
                   </button>
                )}
                <button onClick={() => setIsMobileScrollOpen(!isMobileScrollOpen)} className="flex-1 flex items-center justify-center text-gray-400 uppercase tracking-widest font-bold text-[10px]">
                    <span>{isMobileScrollOpen ? '▼ Hide Chronicle ▼' : '▲ Village Chronicle ▲'}</span>
                </button>
            </div>
            
            <div className="flex-1 w-full flex flex-col overflow-hidden relative">
                <div className="p-4 bg-[#111]/80 text-white text-center font-bold tracking-widest text-xs uppercase border-b border-gray-800 hidden md:block">
                    Village Chronicle
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3 font-serif text-gray-300 text-sm custom-scrollbar">
                    {notes.map((note: any, idx: number) => (
                        <div key={idx} className={`mb-2 ${note.isSystem ? 'text-red-400 text-center italic font-sans font-bold my-4 border-y border-red-900/30 py-2 text-xs uppercase tracking-wider' : 'flex'}`}>
                            {!note.isSystem && <span className="font-bold text-white mr-2 flex-shrink-0 uppercase font-sans text-[10px] tracking-wider mt-1">{note.sender}</span>}
                            <span className={!note.isSystem ? 'leading-relaxed' : ''}>{note.text}</span>
                        </div>
                    ))}
                    {nightActions && Object.values(nightActions).filter((a:any) => a.playerId === playerId).map((a:any, idx:number) => (
                        <div key={`na-${idx}`} className="text-gray-400 text-center italic font-sans font-bold my-4 border-y border-gray-800 py-2 text-xs uppercase tracking-wider">
                            {a.action === 'kill' ? `Marked ${players.find((p:any)=>p.id===a.targetId)?.name || 'no one'} for assassination.` :
                             a.action === 'heal' ? `Protected ${players.find((p:any)=>p.id===a.targetId)?.name || 'no one'}.` :
                             `Investigated ${players.find((p:any)=>p.id===a.targetId)?.name || 'no one'}.`}
                        </div>
                    ))}
                    {gameState === 'day_voting' && votes[playerId] && (
                        <div className="text-gray-400 text-center italic font-sans font-bold my-4 border-y border-gray-800 py-2 text-xs uppercase tracking-wider">
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
         <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-in fade-in duration-1000">
            <h1 className="text-5xl md:text-7xl font-bold text-red-500 tracking-[0.2em] mb-4 uppercase text-center drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">
               {winner?.team === 'MAFIA' ? 'Yakuza Victory' : winner?.team === 'TOWN' ? 'Heimin Victory' : 'Kitsune Victory'}
            </h1>
            <p className="text-gray-400 uppercase tracking-widest mb-10 text-sm">{winner?.text || "The conflict has ended."}</p>
            <button onClick={returnToLobby} className="px-10 py-4 bg-transparent border-2 border-red-900 text-red-500 font-bold uppercase tracking-widest hover:bg-red-900/20 transition-all">
               Return to Clan Gathering
            </button>
         </div>
      )}

    </div>
  );
}
