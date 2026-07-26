import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, Flame, Search, VenetianMask, Heart, Skull } from 'lucide-react';
import './Edo.css';

const SVGS = {
    shuriken: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/></svg>,
    enso: <svg viewBox="0 0 24 24" fill="none" stroke="#8b0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="10"/></svg>,
    heal: <svg viewBox="0 0 24 24" fill="none" stroke="#276749" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M12 4v16m-8-8h16"/></svg>,
    eye: <svg viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    slash: <><div className="ink-slash"></div><div className="blood-splatter" style={{top: '20%', left: '30%'}}></div><div className="blood-splatter" style={{top: '60%', left: '50%', width: '20px', height: '20px'}}></div></>
};

export default function EdoGame({ gameStateData }: { gameStateData: any }) {
  const navigate = useNavigate();
  const { 
    room, playerId, privateReveal, setPrivateReveal, 
    addNote, startGame, handleStampAction: doStampAction, advancePhase, continueReport, returnToLobby, skipDiscussion
  } = gameStateData;

  const [selectedTarget, setSelectedTarget] = useState<string | number | null>(null);
  const [noteInput, setNoteInput] = useState('');
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

  if (!room) return <div className="min-h-screen edo-bg-day flex items-center justify-center text-[#2c1b18] font-serif">Awaiting connection...</div>;

  const { state: gameState, players, notes, revealData, winner, transitionText, votes, nightActions } = room;
  const activePlayer = players.find((p: any) => p.id === playerId) || players[0];
  const isHost = players[0]?.id === playerId;
  const isNight = gameState === 'night';
  const roleId = activePlayer?.role?.id;

  const handleStampAction = () => {
    if (!selectedTarget) return;
    doStampAction(selectedTarget);
    setSelectedTarget(null);
  };

  const submitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim() || activePlayer?.isDead) return;
    if (gameState !== 'day_discussion') return;
    
    addNote(room, noteInput.trim());
    setNoteInput('');
  };

  const renderDossier = () => (
    <div className="min-h-[100dvh] edo-bg-day flex items-center justify-center p-4 text-[#2c1b18]">
      <div className="makimono-paper shoji-frame max-w-2xl w-full p-6 md:p-12 relative animate-in zoom-in-95 duration-1000 shadow-2xl">
        
        <div className="border-b-[2px] border-[#4e342e] pb-6 mb-8 mt-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#8b0000] tracking-widest mb-2 uppercase">The First Dawn</h1>
          <p className="font-serif text-[#3e2723] font-bold text-sm tracking-widest uppercase">Secret Role Assignment</p>
        </div>

        <div className="space-y-6 font-serif">
          <div className="bg-[#fdfbf7]/50 p-6 border-2 border-[#4e342e]/30 shadow-inner text-center">
            <h2 className="font-bold text-lg mb-2 opacity-60 text-[#4e342e]">YOUR KARMA</h2>
            <div className="text-4xl md:text-5xl font-black uppercase tracking-widest mb-4" style={{ color: activePlayer?.role?.ink || '#8b0000' }}>
              {activePlayer?.role?.name === 'Mafia' ? 'Shinobi' : 
               activePlayer?.role?.name === 'Villager' ? 'Heimin' :
               activePlayer?.role?.name === 'Doctor' ? 'Sohei' :
               activePlayer?.role?.name === 'Detective' ? 'Samurai' :
               activePlayer?.role?.name === 'Jester' ? 'Kitsune' :
               activePlayer?.role?.name || 'UNKNOWN'}
            </div>
            <p className="font-serif font-bold text-lg max-w-lg mx-auto leading-relaxed text-[#3e2723]">
              {activePlayer?.role?.desc || 'Await further instructions.'}
            </p>
          </div>
        </div>
        
        {isHost ? (
            <button 
              onClick={startGame}
              className="mt-8 w-full bg-[#8b0000] text-[#ebdcb5] border-2 border-[#4e342e] py-4 font-bold text-xl uppercase tracking-widest hover:bg-red-900 transition-colors shadow-md active:translate-y-1"
            >
              Begin The Tale
            </button>
        ) : (
            <div className="mt-8 w-full bg-[#fdfbf7] border-2 border-[#4e342e]/50 py-4 font-bold text-xl uppercase tracking-widest text-center shadow-sm text-[#4e342e]">
               Awaiting Host...
            </div>
        )}
      </div>
    </div>
  );

  const renderTransition = () => {
    const lines = transitionText.split('\n');
    return (
      <div className="fixed inset-0 z-50 bg-[#0f111a] flex flex-col items-center justify-center overflow-hidden w-full text-white">
        <div className="w-fit max-w-[95vw] flex flex-col items-start gap-4">
          {lines.map((line: string, idx: number) => (
            <h2 
              key={idx} 
              className="font-serif text-[#ebdcb5] text-[5vw] md:text-4xl typing-text text-left drop-shadow-md"
              style={{ animationDelay: `${idx * 2}s` }}
            >
              {line}
            </h2>
          ))}
        </div>
      </div>
    );
  };

  const renderReveal = (rData: any, isPrivate = false) => (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="makimono-paper shoji-frame max-w-md w-full p-8 shadow-2xl relative">
        <h2 className="text-3xl font-bold text-center mb-6 uppercase border-b-2 border-[#8b0000] pb-4 text-[#8b0000] tracking-widest">
          {rData.title}
        </h2>
        
        <div className="flex flex-col items-center justify-center bg-[#fdfbf7]/50 p-6 border border-[#4e342e]/30 shadow-inner mb-8">
           <div className="w-20 h-20 rounded-full border-[3px] border-[#4e342e] flex flex-shrink-0 items-center justify-center text-4xl font-serif font-bold shadow-inner bg-[#ebdcb5] text-[#2c1b18] mb-4">
               {rData.victim?.name?.charAt(0).toUpperCase() || '?'}
           </div>
           <h3 className="font-serif text-3xl font-bold text-[#2c1b18]">{rData.victim?.name || 'No One'}</h3>
           {rData.victim && rData.victim.role && (
               <div className="mt-2 text-[#8b0000] font-bold text-xl uppercase tracking-widest border border-[#8b0000] px-4 py-1">
                   {rData.victim.role.name === 'Mafia' ? 'Shinobi' : 
                    rData.victim.role.name === 'Villager' ? 'Heimin' :
                    rData.victim.role.name === 'Doctor' ? 'Sohei' :
                    rData.victim.role.name === 'Detective' ? 'Samurai' :
                    rData.victim.role.name === 'Jester' ? 'Kitsune' :
                    rData.victim.role.name}
               </div>
           )}
        </div>
        
        <p className="font-serif text-center text-lg mb-8 font-bold text-[#3e2723] leading-relaxed">
          {rData.description}
        </p>

        {isPrivate ? (
            <button 
              onClick={() => setPrivateReveal(null)}
              className="w-full border-2 border-[#4e342e] bg-[#2c1b18] text-[#ebdcb5] py-3 font-bold text-xl uppercase tracking-widest hover:bg-black transition-all shadow-md active:translate-y-1"
            >
              Understood
            </button>
        ) : (
            isHost && (
              <button 
                onClick={continueReport}
                className="w-full border-2 border-[#4e342e] bg-[#8b0000] text-[#ebdcb5] py-3 font-bold text-xl uppercase tracking-widest hover:bg-red-900 transition-all shadow-md active:translate-y-1"
              >
                Continue
              </button>
            )
        )}
      </div>
    </div>
  );

  if (gameState === 'dossier') return renderDossier();
  if (gameState === 'transition') return renderTransition();

  let actionLabel = "";
  let actionIcon: any = null;
  let actionPrompt = "";
  
  if (gameState === 'night' && activePlayer && !activePlayer.isDead) {
    if (roleId === 'mafia') {
        actionLabel = "Strike"; 
        actionIcon = SVGS.enso; 
        actionPrompt = "Mark for assassination";
    }
    else if (roleId === 'doctor') {
        actionLabel = "Protect"; 
        actionIcon = SVGS.heal; 
        actionPrompt = "Offer spiritual protection to";
    }
    else if (roleId === 'detective') {
        actionLabel = "Investigate"; 
        actionIcon = SVGS.eye; 
        actionPrompt = "Investigate alignment of";
    }
  } else if (gameState === 'day_voting') {
    actionLabel = selectedTarget === 'skip' ? "Skip" : "Throw Shuriken";
    actionIcon = SVGS.shuriken;
    actionPrompt = selectedTarget === 'skip' ? "Abstain from voting" : "Cast suspicion on";
  }

  const phaseTitle = gameState === 'night' ? `Night ${room.dayCount}` : `Day ${room.dayCount}`;
  const phaseSub = gameState === 'night' 
    ? (roleId === 'mafia' ? "The strike approaches. Choose your victim." : roleId === 'doctor' ? "Spirits are restless. Choose who to protect." : roleId === 'detective' ? "Deception hides in the dark. Uncover the truth." : "The shadows deepen. Sleep and pray for morning.")
    : (gameState === 'day_voting' ? "The tribunal convenes. Cast your vote." : "The Emperor's peace holds. Discuss the traitors among you.");

  return (
    <div className={`h-[100dvh] w-[100dvw] flex flex-col overflow-hidden transition-colors duration-1000 edo-theme ${isNight ? 'bg-[#0f111a] text-gray-200 edo-bg-night' : 'bg-[#eaddd3] text-gray-900 edo-bg-day'}`} id="game-body">
      
      {/* Particles */}
      <div id="particles" className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {!isNight && [...Array(30)].map((_, i) => (
             <div key={`sakura-${i}`} className="particle sakura" style={{ width: `${Math.random() * 10 + 8}px`, height: `${Math.random() * 10 + 8}px`, left: `${Math.random() * 120 - 10}vw`, animationDuration: `${Math.random() * 5 + 5}s`, animationDelay: `${Math.random() * -10}s` }} />
          ))}
          {isNight && [...Array(15)].map((_, i) => (
             <div key={`firefly-${i}`} className="particle firefly" style={{ width: `${Math.random() * 4 + 2}px`, height: `${Math.random() * 4 + 2}px`, left: `${Math.random() * 100}vw`, top: `${Math.random() * 100}vh`, animationDelay: `${Math.random() * -5}s, ${Math.random() * -2}s` }} />
          ))}
      </div>

      <div className="flex-1 flex flex-col md:flex-row relative z-10 overflow-hidden">
        
        {/* Game Board */}
        <div className="flex-1 flex flex-col p-4 md:p-8 relative h-full">
            
            <div className={`text-center mb-6 transition-colors duration-1000 ${isNight ? 'drop-shadow-[0_0_10px_rgba(139,0,0,0.5)]' : 'drop-shadow-md'}`}>
                <h1 className={`text-4xl md:text-5xl font-bold tracking-widest uppercase ${isNight ? 'text-[#8b0000]' : 'text-[#2c1b18]'}`}>{phaseTitle}</h1>
                <p className="text-lg md:text-xl mt-2 italic font-serif">{phaseSub}</p>
                {timeLeftStr && <div className="text-2xl font-bold mt-2 font-mono">{timeLeftStr}</div>}
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-24 md:pb-0">
                
                {gameState === 'day_voting' && !activePlayer?.isDead && (
                   <div className="flex justify-center w-full mb-6">
                     <button 
                       onClick={() => setSelectedTarget('skip')}
                       className="px-8 py-3 bg-[#fdfbf7] border-2 border-[#8b0000] text-[#8b0000] font-bold shadow-md active:translate-y-1 active:shadow-none uppercase flex items-center justify-center gap-2 tracking-widest"
                     >
                       Skip Vote {room.votes && Object.values(room.votes).filter(v => v === 'skip').length > 0 && !room.settings.anonVoting && `(${Object.values(room.votes).filter(v => v === 'skip').length})`}
                     </button>
                   </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto" id="players-grid">
                    {players.map((p: any) => {
                        const isMe = p.id === playerId;
                        const isDead = p.isDead;
                        const isTargeted = selectedTarget === p.id;
                        let cardStateClass = '';
                        
                        if (isDead) {
                            cardStateClass = 'opacity-60 grayscale';
                        } else if (isTargeted) {
                            if (!isNight) cardStateClass = 'target-aura-day transform -translate-y-2';
                            else if (roleId === 'mafia') cardStateClass = 'target-aura-night transform -translate-y-2';
                            else if (roleId === 'doctor') cardStateClass = 'target-aura-heal transform -translate-y-2';
                            else if (roleId === 'detective') cardStateClass = 'target-aura-investigate transform -translate-y-2';
                        }

                        const pRoleName = p.role?.name === 'Mafia' ? 'Shinobi' : 
                                          p.role?.name === 'Villager' ? 'Heimin' :
                                          p.role?.name === 'Doctor' ? 'Sohei' :
                                          p.role?.name === 'Detective' ? 'Samurai' :
                                          p.role?.name === 'Jester' ? 'Kitsune' : p.role?.name;

                        return (
                            <div key={p.id} onClick={() => !isDead && (isNight ? roleId !== 'villager' : gameState === 'day_voting') && setSelectedTarget(p.id)} 
                                 className={`relative aspect-[3/4] ${isDead || (isNight && roleId==='villager') || gameState !== 'day_voting' && !isNight ? 'cursor-default' : 'cursor-pointer'} shoji-frame shoji-card ${cardStateClass} flex flex-col group`}>
                                
                                <div className="absolute inset-0 shoji-paper z-0"></div>
                                <div className="absolute inset-0 z-10 pointer-events-none">{isDead && SVGS.slash}</div>
                                
                                {isNight && roleId === 'mafia' && p.role?.id === 'mafia' && !isDead && (
                                    <div className="absolute top-2 right-2 text-xs font-bold text-red-600 bg-black/50 px-1 rounded z-20">Ally</div>
                                )}

                                <div className="relative z-20 flex-1 flex flex-col items-center justify-center p-2 text-center">
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[rgba(62,39,35,0.8)] border-2 border-[#2c1b18] mb-4 flex items-center justify-center text-[#ebdcb5] drop-shadow-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                                    </div>
                                    
                                    <h3 className="font-bold text-sm md:text-lg text-[#2c1b18] bg-[rgba(253,251,247,0.7)] px-2 py-1 rounded shadow-sm" style={{writingMode: 'vertical-rl', textOrientation: 'upright'}}>
                                        {p.name}
                                    </h3>
                                    
                                    {(isMe || (p.isDead && room.settings?.revealOnDeath) || (roleId === 'mafia' && p.role?.id === 'mafia') || gameState === 'game_over') && p.role && (
                                      <div className="absolute top-2 left-2 text-[10px] font-serif font-bold uppercase" style={{ color: p.role.ink || '#8b0000' }}>
                                         [{pRoleName}]
                                      </div>
                                    )}

                                    {gameState === 'day_voting' && !room.settings.anonVoting && Object.values(votes).filter(v => v === p.id).length > 0 && (
                                        <div className="absolute bottom-2 right-2 w-6 h-6 text-gray-800 animate-pulse">
                                            {SVGS.shuriken}
                                            <span className="absolute -top-2 -right-2 bg-red-800 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                                {Object.values(votes).filter(v => v === p.id).length}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {gameState === 'day_discussion' && !activePlayer?.isDead && (
                   <div className="flex justify-center w-full mt-8">
                     <button 
                       disabled={room.skipDiscussionVotes?.includes(playerId)}
                       onClick={skipDiscussion}
                       className="px-6 py-2 bg-[#2c1b18] text-[#ebdcb5] font-serif uppercase tracking-widest text-sm md:text-base shadow-md hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed border-2 border-[#1a0f0d] transition-colors"
                     >
                       {room.skipDiscussionVotes?.includes(playerId) ? 'Waiting...' : 'Skip Discussion'}
                       {' '}
                       ({room.skipDiscussionVotes?.length || 0}/{players.filter((p: any) => !p.isDead && !p.isBot).length})
                     </button>
                   </div>
                )}
            </div>
        </div>

        {/* Scroll Chat Container */}
        <div className={`fixed md:relative bottom-0 left-0 w-full md:w-80 lg:w-96 h-[60vh] md:h-full transform ${isMobileScrollOpen ? 'translate-y-0' : 'translate-y-[calc(100%-3rem)]'} md:translate-y-0 transition-transform duration-500 z-40 flex flex-col`}>
            
            <button onClick={() => setIsMobileScrollOpen(!isMobileScrollOpen)} className="md:hidden makimono-roller h-12 w-full flex items-center justify-center text-[#ebdcb5] uppercase tracking-widest font-bold z-50 rounded-t-lg">
                <span>{isMobileScrollOpen ? '▼ Roll Up Scroll ▼' : '▲ Unroll Scroll ▲'}</span>
            </button>

            <div className="hidden md:block makimono-roller h-6 w-full rounded-t-md z-10"></div>
            
            <div className="makimono-paper flex-1 w-full flex flex-col overflow-hidden relative shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-[rgba(139,69,19,0.2)] to-transparent pointer-events-none"></div>
                
                <div className="p-3 bg-[#4e342e] text-[#ebdcb5] text-center font-bold tracking-widest text-sm border-b border-[#2c1b18]">
                    VILLAGE CHRONICLE
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3 font-serif text-[#2c1b18] text-sm md:text-base custom-scrollbar">
                    {notes.map((note: any, idx: number) => (
                        <div key={idx} className={`mb-2 ${note.isSystem ? 'text-[#8b0000] text-center italic font-bold my-4 border-y border-[#8b0000]/20 py-1' : ''}`}>
                            {!note.isSystem && <span className="font-bold mr-1">[{note.sender}]:</span>}
                            <span>{note.text}</span>
                        </div>
                    ))}
                    {nightActions && Object.values(nightActions).filter((a:any) => a.playerId === playerId).map((a:any, idx:number) => (
                        <div key={`na-${idx}`} className="text-[#8b0000] text-center italic font-bold my-4 border-y border-[#8b0000]/20 py-1">
                            {a.action === 'kill' ? `You marked ${players.find((p:any)=>p.id===a.targetId)?.name || 'no one'} for assassination.` :
                             a.action === 'heal' ? `You offered protection to ${players.find((p:any)=>p.id===a.targetId)?.name || 'no one'}.` :
                             `You investigated ${players.find((p:any)=>p.id===a.targetId)?.name || 'no one'}.`}
                        </div>
                    ))}
                    {gameState === 'day_voting' && votes[playerId] && (
                        <div className="text-[#8b0000] text-center italic font-bold my-4 border-y border-[#8b0000]/20 py-1">
                            You voted for {votes[playerId] === 'skip' ? 'Skip' : players.find((p:any)=>p.id===votes[playerId])?.name}.
                        </div>
                    )}
                    <div ref={notesEndRef} />
                </div>

                <div className={`p-3 border-t border-[rgba(139,69,19,0.2)] bg-[rgba(255,255,255,0.3)] ${(gameState !== 'day_discussion' || activePlayer?.isDead) ? 'opacity-50' : ''}`}>
                    <form onSubmit={submitNote} className="flex">
                        <input 
                            type="text" 
                            value={noteInput}
                            onChange={(e) => setNoteInput(e.target.value)}
                            disabled={gameState !== 'day_discussion' || activePlayer?.isDead}
                            className="flex-1 bg-transparent border-b-2 border-[#4e342e] px-2 py-1 outline-none text-[#2c1b18] placeholder-[#8b6b61] italic" 
                            placeholder={gameState !== 'day_discussion' ? "Silence falls over the village..." : activePlayer?.isDead ? "The dead cannot speak..." : "Speak your mind..."}
                        />
                        <button type="submit" disabled={gameState !== 'day_discussion' || activePlayer?.isDead} className="ml-2 text-[#4e342e] hover:text-[#8b0000] transition-colors disabled:opacity-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.04z"/></svg>
                        </button>
                    </form>
                </div>
            </div>

            <div className="makimono-roller h-6 w-full rounded-b-md z-10 hidden md:block"></div>
        </div>
      </div>

      {/* Action Bar */}
      <div className={`fixed bottom-0 left-0 w-full md:w-[calc(100%-20rem)] lg:w-[calc(100%-24rem)] bg-[#1a1a1a] border-t-[4px] border-[#8b0000] text-white p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-30 flex justify-between items-center transition-transform duration-400 ${selectedTarget ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 flex items-center justify-center ${actionLabel === 'Protect' ? 'text-green-500' : actionLabel === 'Investigate' ? 'text-blue-500' : actionLabel === 'Strike' ? 'text-red-500' : 'text-gray-400'}`}>
                {actionIcon}
            </div>
            <div>
                <p className="text-sm text-gray-400 uppercase tracking-widest">{actionPrompt}</p>
                <p className="text-xl font-bold font-serif">{selectedTarget === 'skip' ? 'Skip' : players.find((p:any)=>p.id===selectedTarget)?.name}</p>
            </div>
        </div>
        <div className="flex space-x-4">
            <button onClick={() => setSelectedTarget(null)} className="px-4 py-2 text-gray-400 hover:text-white transition font-serif uppercase tracking-widest text-sm">Cancel</button>
            <button onClick={handleStampAction} className={`px-6 py-2 font-bold rounded shadow-lg transition font-serif uppercase tracking-widest ${actionLabel === 'Protect' ? 'bg-green-700 hover:bg-green-600' : actionLabel === 'Investigate' ? 'bg-blue-700 hover:bg-blue-600' : 'bg-[#8b0000] hover:bg-red-600'}`}>
                {actionLabel}
            </button>
        </div>
      </div>

      {revealData && renderReveal(revealData, false)}
      {privateReveal && renderReveal(privateReveal, true)}

      {gameState === 'game_over' && (
         <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
            <h1 className="text-5xl md:text-7xl font-bold text-[#8b0000] tracking-widest mb-4 uppercase text-center drop-shadow-[0_0_15px_rgba(139,0,0,0.8)]">
               {winner === 'mafia' ? 'Shinobi Victory' : winner === 'villager' ? 'Heimin Victory' : 'Kitsune Victory'}
            </h1>
            <button onClick={returnToLobby} className="mt-8 px-8 py-4 bg-[#8b0000] text-[#ebdcb5] border-2 border-[#ebdcb5] font-serif uppercase font-bold tracking-widest hover:bg-red-900 transition-colors">
               Return to Village
            </button>
         </div>
      )}

    </div>
  );
}
