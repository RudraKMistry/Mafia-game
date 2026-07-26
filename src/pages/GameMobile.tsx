// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Skull, Shield, 
  VenetianMask, Clock,
  Eye, Flame, Heart, FileSignature
} from 'lucide-react';



const ICON_MAP = { Flame, Eye, Heart, Search, VenetianMask, Skull, Shield };

export default function GameMobile({ gameStateData }: { gameStateData: any }) {
  const navigate = useNavigate();
  const { 
    room, playerId, privateReveal, setPrivateReveal, 
    addNote, startGame, handleStampAction: doStampAction, continueReport, returnToLobby 
  } = gameStateData;

  const [selectedTarget, setSelectedTarget] = useState(null);
  const [noteInput, setNoteInput] = useState('');
  const notesEndRef = useRef(null);

  useEffect(() => {
    notesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [room?.notes]);

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

  if (!room) return <div className="min-h-screen desk-day flex-center text-white">Loading...</div>;

  const { state: gameState, players, notes, revealData, winner, transitionText, votes, nightActions } = room;
  const activePlayer = players.find((p: any) => p.id === playerId) || players[0];
  const isHost = players[0]?.id === playerId;

  const { skipDiscussion } = gameStateData;

  const handleStampAction = () => {
    if (!selectedTarget) return;
    doStampAction(selectedTarget);
    setSelectedTarget(null);
  };

  const renderDossier = () => (
    <div className="min-h-screen desk-day flex items-center justify-center p-4">
      <div className="manila-folder max-w-2xl w-full p-6 md:p-12 relative animate-in zoom-in-95 duration-1000">
        
        <div className="absolute top-4 right-4 md:top-8 md:right-8 stamp stamp-red text-lg md:text-2xl rotate-12 opacity-60">
          CLASSIFIED
        </div>

        <div className="border-b-2 border-zinc-800/20 pb-6 mb-8 mt-4">
          <h1 className="font-heading text-4xl md:text-6xl text-[#2b2b2b] tracking-tighter mb-2">Operation: Omertà</h1>
          <p className="font-typewriter text-zinc-600 text-sm tracking-widest">FILE REF: M-1932-B // STRICTLY CONFIDENTIAL</p>
        </div>

        <div className="space-y-6 font-typewriter text-[#3a3a3a]">
          <p>Listen up, Detective. We got a rat problem. The local family is trying to take over the district.</p>
          <p>By day, they walk among us like normal citizens. Your job is to weed them out.</p>

          <div className="bg-black/5 p-4 border border-black/10 rounded my-8">
            <h3 className="font-bold mb-3 uppercase border-b border-black/10 pb-2">Suspect Roster ({players.length})</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
               {players.map(p => (
                 <div key={p.id} className="flex justify-between items-center">
                   <span>{p.name} {p.id === playerId ? '(You)' : ''}</span>
                   <span className="text-zinc-500 text-xs">[{p.role?.name || '?'}]</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
        
        {isHost ? (
            <button 
              onClick={startGame}
              className="mt-8 w-full paper-texture border border-zinc-400 py-4 font-heading font-bold text-xl uppercase tracking-widest hover:bg-[#e8dec0] transition-colors shadow-lg active:translate-y-1"
            >
              Open The Case
            </button>
        ) : (
            <div className="mt-8 w-full paper-texture border border-zinc-400 py-4 font-heading font-bold text-xl uppercase tracking-widest text-center shadow-lg">
               Waiting for Host...
            </div>
        )}
      </div>
    </div>
  );

  const renderTransition = () => {
    const lines = transitionText.split('\n');
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden w-full">
        <div className="w-fit max-w-[95vw] flex flex-col items-start gap-4">
          {lines.map((line, idx) => (
            <h2 
              key={idx} 
              className="font-typewriter text-white text-[5vw] md:text-4xl typing-text text-left shadow-lg"
              style={{ animationDelay: `${idx * 2}s` }}
            >
              {line}
            </h2>
          ))}
        </div>
      </div>
    );
  };

  const renderReveal = (rData, isPrivate = false) => (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="paper-texture max-w-md w-full p-8 shadow-2xl relative rotate-1">
        
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-8 border-4 border-zinc-400 rounded-full border-b-0" style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)', top: '-16px'}} />
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-8 border-4 border-zinc-400 rounded-full border-t-0" />

        {rData.type === 'death' && <div className="absolute inset-0 blood-splatter pointer-events-none" />}
        
        <h2 className="font-heading text-4xl font-black text-center mb-6 uppercase border-b-2 border-zinc-300 pb-4">
          {rData.title}
        </h2>

        {rData.victim && (
          <div className="flex flex-col items-center mb-8 relative z-10">
             <div className="w-32 h-32 bg-zinc-200 border-4 border-white shadow-md rotate-[-3deg] flex items-center justify-center mb-4 overflow-hidden">
                <Skull size={48} className="text-zinc-600 opacity-50" />
             </div>
             <h3 className="font-typewriter text-2xl font-bold">{rData.victim.name}</h3>
             <div className="stamp stamp-red text-xl mt-4">
               {rData.type === 'death' ? 'DECEASED' : 'ARRESTED'}
             </div>
          </div>
        )}

        <p className="font-typewriter text-center text-lg mb-8 relative z-10 font-bold bg-white/50 p-2">
          {rData.text}
        </p>

        {rData.victim && (
          <div className="bg-black/5 p-4 border border-black/10 text-center font-typewriter relative z-10">
            <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">True Identity</div>
            <div className="font-bold text-xl">{rData.victim.role.name}</div>
          </div>
        )}

        {isHost && !isPrivate && (
            <button 
              onClick={continueReport}
              className="mt-8 w-full border-2 border-black py-3 font-typewriter font-bold hover:bg-black hover:text-white transition-colors relative z-10"
            >
              File Report (Continue)
            </button>
        )}
        
        {isPrivate && (
            <button 
              onClick={() => setPrivateReveal(null)}
              className="mt-8 w-full border-2 border-black py-3 font-typewriter font-bold hover:bg-black hover:text-white transition-colors relative z-10"
            >
              Close Folder
            </button>
        )}
        
        {!isHost && !isPrivate && (
            <div className="mt-8 text-center text-zinc-500 font-typewriter">Waiting for host...</div>
        )}
      </div>
    </div>
  );

  const renderGameDesk = () => {
    const isNight = gameState === 'night';
    const isVoting = gameState === 'day_voting';
    const bgClass = isNight ? 'desk-night' : 'desk-day';
    
    let instruction = "Observe the suspects.";
    if (!activePlayer?.isDead) {
      if (isNight && activePlayer?.role.id === 'mafia') instruction = "Mark a target for elimination.";
      if (isNight && activePlayer?.role.id === 'doctor') instruction = "Select a civilian to protect.";
      if (isNight && activePlayer?.role.id === 'detective') instruction = "Select a suspect to investigate.";
      if (gameState === 'day_discussion') instruction = "Discuss findings in the notebook.";
      if (gameState === 'day_voting') instruction = "Stamp a suspect for arrest.";
    }

    let actionLabel = "Stamp File";
    if (gameState === 'night' && activePlayer?.role) {
      if (activePlayer.role.id === 'mafia') actionLabel = "Kill";
      else if (activePlayer.role.id === 'doctor') actionLabel = "Save";
      else if (activePlayer.role.id === 'detective') actionLabel = "Reveal Role";
    } else if (gameState === 'day_voting') {
      actionLabel = "Vote";
    }

    return (
      <div className={`h-screen max-h-screen ${bgClass} flex flex-col relative overflow-hidden text-zinc-200 transition-colors duration-1000`}>
        
        {/* HUD */}
        <div className="absolute top-2 right-2 md:top-4 md:right-4 flex gap-4 items-start z-50 pointer-events-none scale-90 md:scale-100 origin-top-right">
           <div className="flex flex-col gap-1 pointer-events-auto bg-black/80 p-3 border-2 border-zinc-600 shadow-md">
             <div className="flex items-center gap-2 text-white">
                <Clock size={16} />
                <span className="font-typewriter uppercase font-bold tracking-widest">{gameState.replace('_', ' ')}</span>
             </div>
             <span className="text-xs font-typewriter text-zinc-400">
                {timeLeftStr ? `Time Left: ${timeLeftStr}` : `Time: ${isNight ? '02:41 AM' : '10:15 AM'}`}
             </span>
           </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row relative z-10 pt-20 pb-4 px-4 max-w-7xl mx-auto w-full gap-8 h-full overflow-hidden">
          
          <div className="w-full md:w-80 flex-shrink-0 flex flex-col transition-transform duration-700 transform origin-left relative z-20 h-[35vh] md:h-full pb-4 md:pb-20">
             <div className="absolute -top-3 left-0 w-full h-6 bg-zinc-800 rounded-t-lg z-10 flex justify-around px-4 border-t-2 border-zinc-900">
                {[...Array(12)].map((_, i) => <div key={i} className="w-2 h-8 bg-zinc-300 rounded-full shadow-md -mt-1 border-2 border-zinc-700" />)}
             </div>

             <div className="paper-texture flex-1 rounded-b-sm shadow-2xl flex flex-col overflow-hidden pt-6 border-r-2 border-b-2 border-black/20">
                <div className="text-center font-typewriter font-bold border-b border-blue-200/50 pb-2 mx-4 mt-2">
                  LOGS
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col relative"
                     style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 18px, #93c5fd 18px, #93c5fd 19px, transparent 19px, transparent 24px)' }}>
                  
                  {notes.map(note => (
                    <div key={note.id} className="leading-[24px] text-[15px] mb-[24px] block">
                       <span className="font-typewriter text-[11px] text-zinc-500 mr-2">[{note.time}]</span>
                       {note.isSystem ? (
                         <span className="font-typewriter text-[13px] font-bold uppercase tracking-widest text-red-800">{note.text}</span>
                       ) : (
                         <span>
                           <span className="font-handwriting font-bold text-blue-900 mr-2 text-lg">{note.author}:</span>
                           <span className="font-handwriting text-zinc-800 text-lg">{note.text}</span>
                         </span>
                       )}
                    </div>
                  ))}
                  <div ref={notesEndRef} />
                </div>

                <form 
                  onSubmit={(e) => { e.preventDefault(); if (noteInput.trim()) { addNote(noteInput); setNoteInput(''); } }}
                  className="p-3 border-t-2 border-zinc-300/50 bg-black/5"
                >
                  <input
                    type="text"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    disabled={gameState !== 'day_discussion' || activePlayer?.isDead}
                    placeholder={activePlayer?.isDead ? "(Deceased cannot write)" : isNight ? "(Too dark to write)" : "Jot down a thought..."}
                    className="w-full bg-transparent border-b-2 border-zinc-400 focus:border-black outline-none font-handwriting text-xl text-blue-900 placeholder-zinc-500 py-1"
                  />
                </form>
             </div>
          </div>

           <div className="flex-1 relative flex flex-col items-center justify-start pt-4 overflow-y-auto pb-40">
             <div className="paper-texture px-8 py-3 mb-12 rotate-[-1deg] shadow-[4px_4px_0px_rgba(0,0,0,0.8)] border-2 border-black relative z-30">
               <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-red-800 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.8)]" />
               <span className="font-typewriter font-black text-xl text-black uppercase tracking-widest drop-shadow-sm">{instruction}</span>
             </div>

             <div className="flex flex-wrap justify-center gap-4 gap-y-12 md:gap-10 md:gap-y-16 max-w-5xl w-full relative z-20">
                {players.map(p => {
                  const isMe = p.id === playerId;
                  const isSelected = selectedTarget === p.id;
                  const isTargeted = (isNight && nightActions[playerId] === p.id) || (isVoting && votes[playerId] === p.id);
                  const isDead = p.isDead;
                  
                  let canInteract = !activePlayer?.isDead && !isDead && (
                    isVoting || (isNight && ['mafia', 'doctor', 'detective'].includes(activePlayer?.role.id))
                  );

                  if (isNight && activePlayer?.role.id === 'mafia' && p.role?.id === 'mafia') {
                     canInteract = false;
                  }

                  return (
                    <button
                      key={p.id}
                      disabled={!canInteract && !isSelected}
                      onClick={() => setSelectedTarget(isSelected ? null : p.id)}
                      className={`polaroid flex flex-col items-center group
                        ${isDead ? 'dead' : ''} 
                        ${isSelected ? 'selected' : ''}
                      `}
                      style={{ 
                        transform: isSelected ? 'scale(1.1) translateY(-15px) rotate(0deg)' : `rotate(${p.rot}deg)`,
                        zIndex: isSelected ? 50 : 10
                      }}
                    >
                      <div className="w-24 h-28 md:w-28 md:h-32 bg-zinc-300 mugshot-img mb-3 relative overflow-hidden flex items-end justify-center">
                         <div className="absolute inset-0 bg-[repeating-linear-gradient(transparent,transparent_19px,#000_20px)] opacity-20 pointer-events-none" />
                         <div className="w-16 h-20 md:w-20 md:h-24 bg-zinc-800 rounded-t-3xl opacity-80" />
                         {isMe && <div className="absolute top-1 left-1 bg-black/60 text-white font-typewriter text-[10px] px-1 font-bold">YOU</div>}
                      </div>

                      <div className="font-typewriter font-bold text-lg text-center w-full border-b border-zinc-400 pb-1 mb-1">
                        {p.name}
                      </div>
                      
                      {(isMe || p.isDead || (activePlayer?.role.id === 'mafia' && p.role?.id === 'mafia') || gameState === 'game_over') && p.role && (
                        <div className="text-xs font-typewriter tracking-wider" style={{ color: p.role.ink }}>
                           [{p.role.name}]
                        </div>
                      )}

                      {isDead && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 stamp stamp-red text-xl w-[120%] text-center">
                          DECEASED
                        </div>
                      )}

                      {isTargeted && !isSelected && !isDead && (
                         <div className="absolute top-4 right-2 text-red-800 bg-white/80 rounded-full p-1 shadow">
                           <FileSignature size={20} />
                         </div>
                      )}

                      {isVoting && !isDead && !room.settings.anonVoting && (
                        <div className="absolute -right-4 top-1/2 font-handwriting font-bold text-2xl text-red-800 rotate-12">
                           {Object.values(votes).filter(vId => vId === p.id).map(() => '|').join('')}
                        </div>
                      )}
                    </button>
                  )
                })}
             </div>
          </div>
        </div>

        {gameState === 'day_discussion' && !activePlayer?.isDead && (
           <div className="flex justify-center w-full mt-4 md:mt-8 mb-4 relative z-40">
             <button 
               disabled={room.skipDiscussionVotes?.includes(playerId)}
               onClick={skipDiscussion}
               className="px-6 py-2 bg-zinc-800 text-white font-typewriter uppercase tracking-widest text-sm shadow-[4px_4px_0px_rgba(0,0,0,0.5)] hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed border-2 border-zinc-600 transition-colors active:translate-y-1 active:translate-x-1 active:shadow-[1px_1px_0px_rgba(0,0,0,0.5)]"
             >
               {room.skipDiscussionVotes?.includes(playerId) ? 'Waiting...' : 'Skip Discussion'}
               {' '}
               ({room.skipDiscussionVotes?.length || 0}/{players.filter((p: any) => !p.isDead && !p.isBot).length})
             </button>
           </div>
        )}

        <div className={`absolute bottom-0 md:bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md manila-folder transition-transform duration-500 z-50 p-4 md:p-6 flex flex-col items-center shadow-[0px_-10px_30px_rgba(0,0,0,0.5)] border-t-2 border-x-2 border-black/20
          ${selectedTarget ? 'translate-y-0' : 'translate-y-[120%]'}
        `}>
           <div className="font-typewriter font-black text-2xl mb-6 text-black uppercase tracking-widest border-b-[3px] border-black/30 pb-3 w-full text-center">
             Official Action
           </div>
           
           <div className="flex gap-4 w-full">
             <button onClick={() => setSelectedTarget(null)} className="flex-1 py-4 border-[3px] border-black font-typewriter font-black text-black bg-transparent hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-[1px_1px_0px_rgba(0,0,0,1)] uppercase">
               Cancel
             </button>
             <button 
               onClick={handleStampAction}
               className="flex-1 py-4 bg-[#8b0000] text-white border-[3px] border-[#8b0000] font-typewriter font-black uppercase tracking-widest hover:bg-red-950 hover:border-red-950 transition-all shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-[1px_1px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2"
             >
               <FileSignature size={24} />
               {actionLabel}
             </button>
           </div>
        </div>

        {activePlayer && activePlayer.role && (
            <div className="absolute top-4 left-2 md:top-auto md:left-auto md:bottom-8 md:right-8 paper-texture p-3 md:p-5 shadow-[4px_4px_0px_rgba(0,0,0,0.8)] rotate-2 z-40 border-2 border-black pointer-events-none scale-[0.8] md:scale-100 origin-top-left md:origin-bottom-right">
               <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-yellow-500/40 -rotate-3 border border-yellow-700/20" />
               <div className="text-sm font-typewriter text-black font-black uppercase tracking-widest mb-3 border-b-2 border-black/20 pb-2">Your Identity</div>
               <div className="flex items-center gap-4">
                 <div className="p-3 border-[3px] rounded-full shadow-sm bg-white/50" style={{ borderColor: activePlayer.role.ink, color: activePlayer.role.ink }}>
                    {ICON_MAP[activePlayer.role.iconName] && React.createElement(ICON_MAP[activePlayer.role.iconName], { size: 28 })}
                 </div>
                 <div>
                   <div className="font-heading font-black text-3xl" style={{ color: activePlayer.role.ink }}>{activePlayer.role.name}</div>
                   <div className="font-typewriter text-sm text-black/70 font-bold">{activePlayer.role.desc}</div>
                 </div>
               </div>
            </div>
        )}
      </div>
    );
  };

  const renderGameOver = () => (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4">
      <div className="desk-day absolute inset-0 opacity-30" />
      
      <div className="manila-folder max-w-2xl w-full p-12 text-center relative z-10 shadow-2xl">
         <div className="absolute top-8 right-8 stamp stamp-black text-3xl rotate-12 opacity-80">
          CASE CLOSED
         </div>

         <h1 className="font-heading text-6xl text-[#2b2b2b] tracking-tighter mb-4 mt-8 uppercase">
           {winner.team} WINS
         </h1>
         
         <p className="font-typewriter text-xl text-zinc-700 font-bold mb-12">
           {winner.text}
         </p>

         <button 
          onClick={() => { returnToLobby(); navigate(`/lobby/${room.id}`); }}
          className="border-2 border-black text-black py-4 px-12 font-typewriter font-bold text-xl uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
         >
           Return to Lobby
         </button>
      </div>
    </div>
  );

  return (
    <div className="font-sans selection:bg-black selection:text-white">
      {gameState === 'dossier' && renderDossier()}
      {gameState === 'transition' && renderTransition()}
      
      {/* Popups */}
      {revealData && renderReveal(revealData, false)}
      {privateReveal && renderReveal(privateReveal, true)}
      
      {gameState !== 'dossier' && gameState !== 'transition' && !revealData && gameState !== 'game_over' && renderGameDesk()}
      {gameState === 'game_over' && renderGameOver()}
    </div>
  );
}