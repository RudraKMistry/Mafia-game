import React, { useState, useEffect, useRef } from 'react';
import { FolderOpen, Skull, Eye, History, Check, Search, Shield, VenetianMask, Clock, Flame, Heart, Fingerprint } from "lucide-react";

import MobileReveal from './MobileReveal';

const ICON_MAP: Record<string, any> = { Flame, Eye, Heart, Search, VenetianMask, Skull, Shield, Fingerprint };

export default function MobileGame({ gameStateData }: { gameStateData: any }) {
  
  const { 
    room, playerId, privateReveal, setPrivateReveal,
    startGame, handleStampAction: doStampAction, continueReport, returnToLobby, skipDiscussion 
  } = gameStateData;

  const [selectedTarget, setSelectedTarget] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'evidence' | 'log'>('evidence');
  const [timeLeftStr, setTimeLeftStr] = useState<string | null>(null);
  const notesEndRef = useRef<HTMLDivElement>(null);

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

  if (!room) return <div className="min-h-screen bg-[#2c2524] flex items-center justify-center text-white">Loading...</div>;

  const { state: gameState, players, notes, revealData, transitionText } = room;
  const activePlayer = players.find((p: any) => p.id === playerId) || players[0];
  const isHost = players[0]?.id === playerId;

  const handleStampAction = () => {
    if (!selectedTarget) return;
    doStampAction(selectedTarget);
    setSelectedTarget(null);
  };

  const getActionColor = () => {
    if (gameState === 'night' && activePlayer?.role) {
      if (activePlayer.role.id === 'mafia') return '#8B0000'; // Mafia red
      if (activePlayer.role.id === 'doctor') return '#1E40AF'; // Doctor blue
      if (activePlayer.role.id === 'detective') return '#3F3F46'; // Detective gray
    }
    return '#991B1B'; // Default stamp red
  };

  const renderDossier = () => (
    <div className="min-h-[100dvh] flex items-center justify-center p-2">
      <div className="bg-[#E8D9C5] m-paper-texture max-w-2xl w-full p-2 md:p-12 relative shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] border-[3px] border-black">
        
        <div className="absolute top-2 right-4 stamp-effect text-lg md:text-lg opacity-60">
          CLASSIFIED
        </div>

        <div className="border-b-4 border-black pb-6 mb-4 mt-4">
          <h1 className="font-display-xl text-lg md:text-lg text-[#261816] tracking-tighter mb-2 uppercase">Operation: Omertà</h1>
          <p className="font-typewriter-md text-[#5a403c] text-sm tracking-widest uppercase font-bold">FILE REF: M-1932-B // STRICTLY CONFIDENTIAL</p>
        </div>

        <div className="space-y-6 font-typewriter-md text-[#261816]">
          <p>Listen up, Detective. We got a rat problem. The local family is trying to take over the district.</p>
          <p>By day, they walk among us like normal citizens. Your job is to weed them out.</p>

          <div className="bg-[#fff8f6] p-2 border-[3px] border-black neo-brutalist-shadow my-8">
            <h3 className="font-bold mb-3 uppercase border-b-2 border-black pb-2">Suspect Roster ({players.length})</h3>
            <div className="grid grid-cols-1 gap-2 text-sm font-typewriter-md">
               {players.filter(Boolean).map((p: any) => (
                 <div key={p.id} className="flex justify-between items-center">
                   <span className="font-bold">{p.name} {p.id === playerId ? '(You)' : ''}</span>
                   <span className="text-[10px] uppercase font-bold" style={{ color: (p.id === playerId || (activePlayer?.role?.id === 'mafia' && p.role?.id === 'mafia')) ? p.role?.ink : '#5a403c' }}>
                     {p.id === playerId || (activePlayer?.role?.id === 'mafia' && p.role?.id === 'mafia') ? `[${p.role?.name}]` : '[REDACTED]'}
                   </span>
                 </div>
               ))}
            </div>
          </div>
        </div>
        
        {isHost ? (
            <button 
              onClick={startGame}
              className="mt-8 w-full bg-[#E8D9C5] border-[3px] border-black py-3 font-headline-lg font-black text-xl uppercase tracking-widest hover:bg-[#d8c5b0] transition-colors neo-brutalist-shadow active:translate-y-1 active:translate-x-1"
            >
              Distribute Identities
            </button>
        ) : (
            <div className="mt-8 w-full text-center font-typewriter-md text-[#5a403c] p-2 border-[3px] border-dashed border-[#5a403c]">
               Waiting for the host to distribute files...
            </div>
        )}
      </div>
    </div>
  );

  const renderTransition = () => (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-2">
      <div className="text-center animate-in fade-in zoom-in duration-1000">
         <h2 className="font-display-xl text-xl text-white tracking-widest uppercase mb-4 drop-shadow-md">
            {room.nextState === 'night' ? 'NIGHT FALLS' : room.nextState === 'day_voting' ? 'THE VERDICT' : 'DAWN BREAKS'}
         </h2>
         <p className="font-typewriter-md text-xl text-zinc-400 font-bold whitespace-pre-wrap">{transitionText}</p>
         
         <div className="mt-8 flex justify-center">
            <div className="w-16 h-1 bg-white/20 overflow-hidden">
               <div className="w-full h-full bg-white animate-[pulse_1.5s_ease-in-out_infinite]" />
            </div>
         </div>
      </div>
    </div>
  );

  const renderReveal = (data: any, isPrivate: boolean) => (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-2 backdrop-blur-sm">
      <div className="bg-[#E8D9C5] m-paper-texture max-w-sm w-full p-2 border-[3px] border-black relative neo-brutalist-shadow rotate-1 animate-in zoom-in-95">
        
        <div className="absolute -top-2 -right-4 stamp-effect text-xl opacity-90 px-2 py-1 rotate-12 bg-transparent">
          {isPrivate ? 'EYES ONLY' : 'PUBLIC RECORD'}
        </div>

        <h2 className="font-display-xl text-lg text-[#261816] tracking-tighter mb-4 uppercase border-b-4 border-black pb-2 mt-4">{data.title}</h2>
        <p className="font-typewriter-md text-lg text-[#261816] font-bold mb-3 whitespace-pre-line leading-relaxed">
          {data.text}
        </p>
        
        <button 
          onClick={isPrivate ? () => setPrivateReveal(null) : continueReport}
          className="w-full bg-[#1a0f0a] border-[3px] border-black text-white py-3 font-headline-lg font-black uppercase tracking-widest text-xl neo-brutalist-shadow active:translate-y-1 active:translate-x-1 hover:bg-[#2b1911]"
        >
          {isPrivate ? "Acknowledge" : "Continue"}
        </button>
      </div>
    </div>
  );

  const renderGameDesk = () => {
    let actionLabel = "Stamp File";
    if (gameState === 'night' && activePlayer?.role) {
      if (activePlayer.role.id === 'mafia') actionLabel = "Kill";
      else if (activePlayer.role.id === 'doctor') actionLabel = "Protect";
      else if (activePlayer.role.id === 'detective') actionLabel = "Investigate";
    } else if (gameState === 'day_voting') {
      actionLabel = "Vote";
    }

    const phaseStr = gameState === 'night' ? 'NIGHT' : 'DAY';

    return (
      <div className="flex flex-col min-h-screen">
        {/* TopAppBar */}
        <header className="w-full top-0 sticky bg-[#E8D9C5] border-b-4 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] z-30">
          <div className="flex justify-between items-center px-3 py-2 w-full max-w-md mx-auto h-16">
            <div className="flex items-center gap-2">
              <FolderOpen className="text-[#261816]" />
              <h1 className="font-display-xl text-[#261816] uppercase tracking-tighter" >
                CASE #{room.id}
              </h1>
            </div>
            <div className="font-typewriter-md text-[#261816] flex items-center gap-2 font-bold">
               {timeLeftStr && <><Clock size={16} /> {timeLeftStr}</>}
            </div>
          </div>
        </header>

        {/* Main Content Canvas */}
        <main className="flex-1 overflow-y-auto pt-4 pb-32 relative px-2">
          <div className="max-w-md mx-auto space-y-6">
            
            {/* Section Header */}
            <div className="border-b-4 border-black pb-2 mb-4 flex justify-between items-end">
               <h2 className="font-headline-lg text-white uppercase">{activeTab === 'evidence' ? 'SUSPECTS' : 'DETECTIVE LOG'}</h2>
               <span className="font-typewriter-sm text-[#a08885] font-bold">{phaseStr}</span>
            </div>

            {activeTab === 'evidence' && (
              <>
                {/* Skip Discussion Button */}
                {gameState === 'day_discussion' && !activePlayer?.isDead && (
                   <div className="flex justify-center w-full mb-4">
                     <button 
                       onClick={skipDiscussion}
                       className="w-full font-typewriter-md py-3 bg-[#E8D9C5] border-[3px] border-black text-[#991B1B] font-bold shadow-[4px_4px_0px_#000000] active:translate-y-1 active:translate-x-1 active:shadow-none uppercase"
                     >
                       Skip Discussion ({room.skipDiscussionVotes?.length || 0}/{players.filter((p: any) => !p.isDead && !p.isBot).length})
                     </button>
                   </div>
                )}

                {/* Skip Vote Button */}
                {gameState === 'day_voting' && !activePlayer?.isDead && (
                   <div className="flex justify-center w-full mb-4">
                     <button 
                       onClick={() => setSelectedTarget('skip')}
                       className="w-full font-typewriter-md py-3 bg-[#E8D9C5] border-[3px] border-black text-[#991B1B] font-bold shadow-[4px_4px_0px_#000000] active:translate-y-1 active:translate-x-1 active:shadow-none uppercase flex items-center justify-center gap-2"
                     >
                       Skip Vote {room.votes && Object.values(room.votes).filter(v => v === 'skip').length > 0 && !room.settings.anonVoting && `(${Object.values(room.votes).filter(v => v === 'skip').length})`}
                     </button>
                   </div>
                )}

                {/* Suspect Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {players.filter(Boolean).map((p: any, index: number) => {
                    const isSelf = p.id === playerId;
                    const isDead = p.isDead;
                    const isMafiaColleague = activePlayer?.role?.id === 'mafia' && p.role?.id === 'mafia';
                    const rotClass = index % 3 === 0 ? 'rotate-[-1deg]' : index % 2 === 0 ? 'rotate-[2deg]' : 'rotate-[-2deg]';
                    
                    let bgClass = "bg-[#fff8f6]";
                    if (isSelf) bgClass = "bg-[#E8D9C5]";
                    if (isDead) bgClass = "bg-[#d8c5b0]";

                    return (
                      <button 
                        key={p.id}
                        disabled={isDead || activePlayer?.isDead || (gameState !== 'night' && gameState !== 'day_voting')}
                        onClick={() => setSelectedTarget(p.id)}
                        className={`bg-paper-texture border-[3px] border-black shadow-[4px_4px_0px_#000000] ${rotClass} transition-all text-left relative overflow-hidden group p-2 ${bgClass} ${isDead ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        <div className="aspect-square bg-[#e3beb8] border-2 border-black mb-2 relative overflow-hidden flex items-center justify-center">
                          <div className="text-black opacity-80">
                             {isDead ? <Skull size={48} /> : <Fingerprint size={48} />}
                          </div>
                          {isDead && <div className="absolute inset-0 bg-[#8B0000] mix-blend-color opacity-30"></div>}
                          {isSelf && !isDead && <div className="absolute inset-0 bg-[#1E40AF] mix-blend-color opacity-20"></div>}
                          <div className="absolute top-1 left-1 bg-black text-white px-1 font-typewriter-sm text-[10px]">#{index+1}</div>
                          
                          {/* Deceased Stamp */}
                          {isDead && (
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-[3px] border-[#991B1B] text-[#991B1B] font-display-xl text-xl px-2 py-1 rotate-[15deg] opacity-90 pointer-events-none">
                                DECEASED
                             </div>
                          )}
                        </div>
                        <div className={`font-handwritten-lg text-black truncate text-xl leading-none pt-1 ${isDead ? 'line-through decoration-[#991B1B] decoration-2' : ''}`}>
                          {p.name}
                        </div>
                        {(isSelf || isMafiaColleague || (isDead && room.settings?.revealOnDeath) || gameState === 'game_over') && p.role && (
                          <div className="font-typewriter-sm text-[10px] font-bold mt-1" style={{ color: p.role.ink }}>
                            ({p.role.name})
                          </div>
                        )}
                        <div className={`font-typewriter-sm flex items-center gap-1 mt-1 ${isDead ? 'text-[#991B1B]' : 'text-[#5a403c]'}`}>
                           {!isDead ? (
                             <><span className={`w-2 h-2 rounded-full ${isSelf ? 'bg-[#1E40AF]' : 'bg-[#5a403c]'}`}></span> {isSelf ? 'YOU' : 'ALIVE'}</>
                           ) : (
                             <><Skull className="text-sm" /> ELIMINATED</>
                           )}
                        </div>
                        {/* Status Stamp (Select) */}
                        {!isDead && !activePlayer?.isDead && (gameState === 'night' || gameState === 'day_voting') && (
                           <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 border-[3px] border-[#991B1B] text-[#991B1B] font-display-xl text-lg px-2 py-1 rotate-[-25deg] opacity-0 group-hover:opacity-80 pointer-events-none transition-opacity bg-white/50">
                               SELECT
                           </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {/* Active Player Role Card */}
                {activePlayer && activePlayer.role && (
                   <div className="mt-8 bg-[#fff8f6] m-paper-texture border-[3px] border-black shadow-[4px_4px_0px_#000000] rotate-[1deg] p-2 relative overflow-hidden">
                      <div className="tape-strip absolute -top-2 left-1/2 -translate-x-1/2 w-24 h-6"></div>
                      <h3 className="font-typewriter-md font-bold uppercase border-b-2 border-black pb-2 mb-3">Your Identity</h3>
                      <div className="flex items-center gap-2">
                         <div className="w-10 h-10 border-[3px] border-black rounded-full flex items-center justify-center bg-white" style={{ borderColor: activePlayer.role.ink }}>
                            {ICON_MAP[activePlayer.role.iconName] && React.createElement(ICON_MAP[activePlayer.role.iconName], { size: 32, color: activePlayer.role.ink })}
                         </div>
                         <div>
                            <div className="font-headline-lg uppercase text-lg" style={{ color: activePlayer.role.ink }}>{activePlayer.role.name}</div>
                            <div className="font-typewriter-sm text-[#5a403c] font-bold">{activePlayer.role.desc}</div>
                         </div>
                      </div>
                   </div>
                )}
              </>
            )}

            {activeTab === 'log' && (
               <div className="bg-[#fff8f6] border-[3px] border-black shadow-[4px_4px_0px_#000000] rotate-[-1deg] relative p-2 min-h-[300px]" style={{
                  backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #1E3A8A 31px, #1E3A8A 32px)',
                  backgroundAttachment: 'local',
                  backgroundPosition: '0 4px'
               }}>
                  <div className="absolute -top-2 left-4 bg-[#E8D9C5] border-2 border-black px-2 py-1 transform -rotate-2">
                     <span className="font-typewriter-md text-black font-bold">DETECTIVE'S LOG</span>
                  </div>
                  
                  <div className="pt-14 space-y-4 font-handwritten-lg text-[#1E3A8A] text-xl leading-[32px]">
                     {notes?.map((n: any, idx: number) => (
                        <div key={idx} className="flex gap-2">
                           <span className="text-[#991B1B] shrink-0">{n.timestamp}:</span>
                           <span>{n.text}</span>
                        </div>
                     ))}
                     <div ref={notesEndRef} />
                  </div>
               </div>
            )}
            
          </div>
        </main>

        {/* BottomNavBar */}
        <nav className="fixed bottom-0 w-full z-20 bg-[#E8D9C5] border-t-4 border-black shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
          <div className="flex justify-around items-center px-3 pb-6 pt-2 max-w-md mx-auto">
            <button 
              onClick={() => setActiveTab('evidence')}
              className={`flex flex-col items-center justify-center p-2 transition-all ${
                activeTab === 'evidence' ? 'bg-[#991B1B] text-white rotate-[-2deg] shadow-[2px_2px_0px_#000000] border-2 border-black' : 'text-[#5a403c] hover:bg-[#fff8f6]'
              }`}
            >
              <Eye className="mb-1" />
              <span className="font-label-caps font-bold">EVIDENCE</span>
            </button>
            <button 
              onClick={() => setActiveTab('log')}
              className={`flex flex-col items-center justify-center p-2 transition-all ${
                activeTab === 'log' ? 'bg-[#991B1B] text-white rotate-[2deg] shadow-[2px_2px_0px_#000000] border-2 border-black' : 'text-[#5a403c] hover:bg-[#fff8f6]'
              }`}
            >
              <History className="mb-1" />
              <span className="font-label-caps font-bold">LOG</span>
            </button>
          </div>
        </nav>

        {/* Official Action Panel Modal */}
        {selectedTarget && (
           <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-in fade-in">
             <div className="bg-[#E8D9C5] w-full max-w-md mx-auto border-t-8 border-black p-2 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom">
               <div className="flex justify-between items-start mb-3 border-b-4 border-black pb-4">
                 <div>
                   <p className="font-typewriter-sm text-[#991B1B] font-bold mb-1 tracking-widest">OFFICIAL ACTION REQUIRED</p>
                   <h3 className="font-display-xl text-xl leading-tight text-black uppercase">
                      {selectedTarget === 'skip' ? 'SKIP VOTE' : (players.find((p: any) => p.id === selectedTarget)?.name || 'UNKNOWN')}
                   </h3>
                 </div>
                 <div className="w-5 h-5 bg-[#fff8f6] border-2 border-black flex items-center justify-center rotate-[5deg]">
                   <div className="text-black">
                      {gameState === 'night' && activePlayer?.role?.id === 'mafia' ? <Flame size={16} /> : 
                       gameState === 'night' && activePlayer?.role?.id === 'doctor' ? <Heart size={16} /> :
                       gameState === 'night' && activePlayer?.role?.id === 'detective' ? <Search size={16} /> : <Check size={16} />}
                   </div>
                 </div>
               </div>
               
               <div className="bg-[#fff8f6] border-2 border-black shadow-inner p-2 mb-3 font-typewriter-md text-[#5a403c] font-bold">
                 {gameState === 'night' ? (
                   <>Select action for tonight's phase. As the <span style={{ color: getActionColor() }} className="font-black uppercase">{activePlayer?.role?.name}</span>, this will affect the target.</>
                 ) : (
                   <>{selectedTarget === 'skip' ? 'Choose to abstain from voting. If the majority skips, no one will be eliminated.' : 'Cast your vote to eliminate this suspect. Majority vote rules.'}</>
                 )}
               </div>
               
               <div className="flex gap-2">
                 <button 
                   onClick={() => setSelectedTarget(null)}
                   className="flex-1 bg-white border-[3px] border-black p-2 font-typewriter-md text-black font-bold shadow-[4px_4px_0px_#000000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all text-center uppercase"
                 >
                   CANCEL
                 </button>
                 <button 
                   onClick={handleStampAction}
                   className="flex-1 border-[3px] border-black p-2 font-typewriter-md text-white font-bold shadow-[4px_4px_0px_#000000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center justify-center gap-2 uppercase"
                   style={{ backgroundColor: getActionColor() }}
                 >
                   <Check className="w-4 h-4" />
                   {actionLabel}
                 </button>
               </div>
             </div>
           </div>
        )}

      </div>
    );
  };

  return (
    <div className={`font-sans selection:bg-[#991B1B] selection:text-white min-h-[100dvh] transition-colors duration-1000 ${gameState === 'night' ? 'desk-night' : 'desk-day'}`}>
      {gameState === 'dossier' && renderDossier()}
      {gameState === 'transition' && renderTransition()}
      
      {gameState !== 'dossier' && gameState !== 'transition' && !revealData && !privateReveal && gameState !== 'game_over' && renderGameDesk()}
      {revealData && gameState !== 'game_over' && renderReveal(revealData, false)}
      {privateReveal && gameState !== 'game_over' && renderReveal(privateReveal, true)}
      {gameState === 'game_over' && <MobileReveal room={room} returnToLobby={returnToLobby} />}
    </div>
  );
}

