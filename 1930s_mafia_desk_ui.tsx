// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Skull, Shield, CheckCircle, 
  Settings, PenTool, Coffee, Clock,
  Eye, Flame, Heart, FileSignature
} from 'lucide-react';

// Custom CSS for 1930s tactile, paper, and desk effects
const vintageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,500;0,700;0,900;1,500&family=Shadows+Into+Light&display=swap');

  .font-typewriter { font-family: 'Courier Prime', monospace; }
  .font-heading { font-family: 'Playfair Display', serif; }
  .font-handwriting { font-family: 'Shadows Into Light', cursive; }

  /* Desk Backgrounds */
  .desk-day {
    background-color: #2c1e16;
    background-image: 
      radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.15) 0%, rgba(20, 10, 5, 0.95) 80%),
      url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E");
    transition: background 2s ease-in-out;
  }
  
  .desk-night {
    background-color: #0a0e17;
    background-image: 
      radial-gradient(circle at 50% 50%, rgba(70, 90, 120, 0.15) 0%, rgba(5, 5, 10, 0.98) 70%),
      url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
    transition: background 2s ease-in-out;
  }

  /* Paper Textures */
  .paper-texture {
    background-color: #f4ebd8;
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.05' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
    box-shadow: 2px 3px 10px rgba(0,0,0,0.3), inset 0 0 40px rgba(150, 120, 90, 0.1);
    color: #2b2b2b;
  }
  
  .manila-folder {
    background-color: #d1bfae;
    background-image: linear-gradient(to right, rgba(255,255,255,0.1), rgba(0,0,0,0.05));
    border-radius: 4px 24px 4px 4px;
    box-shadow: 5px 5px 15px rgba(0,0,0,0.5), inset -2px -2px 10px rgba(0,0,0,0.1);
  }

  /* Polaroids / Mugshots */
  .polaroid {
    background: #fdfbf7;
    padding: 10px 10px 30px 10px;
    box-shadow: 2px 4px 12px rgba(0,0,0,0.4);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    position: relative;
  }
  .polaroid:hover:not(:disabled) {
    transform: scale(1.05) translateY(-10px) rotate(0deg) !important;
    box-shadow: 5px 15px 25px rgba(0,0,0,0.5);
    z-index: 50 !important;
  }
  .polaroid.selected {
    transform: scale(1.1) translateY(-15px) rotate(0deg) !important;
    box-shadow: 0 0 0 3px #8b0000, 10px 20px 30px rgba(0,0,0,0.6);
    z-index: 60 !important;
  }
  .polaroid.dead {
    filter: grayscale(100%) brightness(70%) sepia(30%);
    pointer-events: none;
  }
  
  /* Photo filter */
  .mugshot-img {
    filter: sepia(0.6) contrast(1.2) brightness(0.9) noise(2);
    border: 1px solid #ccc;
  }

  /* Stamps */
  .stamp {
    border: 4px solid;
    border-radius: 8px;
    padding: 4px 12px;
    font-weight: 900;
    text-transform: uppercase;
    font-family: 'Courier Prime', monospace;
    transform: rotate(-15deg);
    opacity: 0.8;
    mask-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)'/%3E%3C/svg%3E");
    mask-mode: luminance;
  }
  .stamp-red { color: #b30000; border-color: #b30000; }
  .stamp-black { color: #1a1a1a; border-color: #1a1a1a; }

  /* Blood Splatter */
  .blood-splatter {
    background-image: radial-gradient(circle at center, #8b0000 0%, transparent 60%);
    opacity: 0.7;
    mix-blend-mode: multiply;
  }

  /* Typewriter Animation */
  @keyframes type {
    from { width: 0; }
    to { width: 100%; }
  }
  .typing-text {
    overflow: hidden;
    white-space: nowrap;
    border-right: 2px solid #fff;
    animation: type 2s steps(40, end), blink-caret .75s step-end infinite;
  }
  @keyframes blink-caret {
    from, to { border-color: transparent }
    50% { border-color: #fff; }
  }

  /* Hide scrollbar for immersive feel */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.3); border-radius: 4px; }
`;

const ROLES = {
  MAFIA: { id: 'mafia', name: 'Mafia', ink: '#8b0000', icon: Flame, desc: "Eliminate the town." },
  VILLAGER: { id: 'villager', name: 'Civilian', ink: '#2b2b2b', icon: Eye, desc: "Find the guilty." },
  DOCTOR: { id: 'doctor', name: 'Physician', ink: '#005b96', icon: Heart, desc: "Protect the innocent." },
  DETECTIVE: { id: 'detective', name: 'Detective', ink: '#4a4a4a', icon: Search, desc: "Investigate suspects." },
  JESTER: { id: 'jester', name: 'Con Artist', ink: '#5e3a8c', icon: PenTool, desc: "Get yourself arrested." }
};

const INITIAL_PLAYERS = [
  { id: 1, name: 'Don Vito', role: ROLES.MAFIA, isDead: false, rot: -4 },
  { id: 2, name: 'Arthur', role: ROLES.VILLAGER, isDead: false, rot: 2 },
  { id: 3, name: 'Dr. Evans', role: ROLES.DOCTOR, isDead: false, rot: -2 },
  { id: 4, name: 'Insp. Cole', role: ROLES.DETECTIVE, isDead: false, rot: 5 },
  { id: 5, name: 'Tommy', role: ROLES.VILLAGER, isDead: false, rot: -6 },
  { id: 6, name: 'Slick Rick', role: ROLES.JESTER, isDead: false, rot: 3 },
];

export default function MafiaDeskUI() {
  // Game State: 'dossier' (lobby), 'transition', 'night', 'day_discussion', 'day_voting', 'game_over'
  const [gameState, setGameState] = useState('dossier'); 
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  
  // Interactivity
  const [activePlayerId, setActivePlayerId] = useState(1);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [nightActions, setNightActions] = useState({});
  const [votes, setVotes] = useState({});
  
  // Logs & Story
  const [notes, setNotes] = useState([{ id: 1, text: "CASE OPENED. Suspects gathered.", time: "12:00 AM" }]);
  const [noteInput, setNoteInput] = useState('');
  const [transitionText, setTransitionText] = useState('');
  const [revealData, setRevealData] = useState(null); // Used for both deaths and investigations
  const [winner, setWinner] = useState(null);

  const activePlayer = players.find(p => p.id === activePlayerId);
  const notesEndRef = useRef(null);

  useEffect(() => {
    // Inject styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = vintageStyles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  useEffect(() => {
    notesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [notes]);

  const addNote = (text, isSystem = false) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setNotes(prev => [...prev, { id: Date.now(), text, time, isSystem, author: isSystem ? 'SYS' : activePlayer.name }]);
  };

  const triggerTransition = (text, nextState, delay = 3000) => {
    setTransitionText(text);
    setGameState('transition');
    setTimeout(() => {
      setGameState(nextState);
      setTransitionText('');
    }, delay);
  };

  const startGame = () => {
    addNote("The lights go out. The city sleeps.", true);
    triggerTransition("NIGHT FALLS ON THE CITY...", "night");
  };

  const handleStampAction = () => {
    if (!selectedTarget) return;

    if (gameState === 'night') {
      setNightActions(prev => ({ ...prev, [activePlayer.id]: selectedTarget }));
      
      // Detective Investigation logic (Immediate reveal in this mock)
      if (activePlayer.role.id === 'detective') {
        const target = players.find(p => p.id === selectedTarget);
        const isMafia = target.role.id === 'mafia';
        setRevealData({
          type: 'investigation',
          title: "INVESTIGATION FILED",
          text: `${target.name} is ${isMafia ? 'GUILTY (Mafia)' : 'CLEARED (Not Mafia)'}`
        });
      }
    } else if (gameState === 'day_voting') {
      setVotes(prev => ({ ...prev, [activePlayer.id]: selectedTarget }));
    }
    
    setSelectedTarget(null);
  };

  const advancePhase = () => {
    setSelectedTarget(null);

    if (gameState === 'night') {
      const killedId = nightActions[1]; // Mock Mafia (Player 1) target
      const savedId = nightActions[3]; // Mock Doctor (Player 3) target
      
      let newPlayers = [...players];
      let victim = null;

      if (killedId && killedId !== savedId) {
        victim = newPlayers.find(p => p.id === killedId);
        victim.isDead = true;
        
        // Mock win check
        if (victim.role.id === 'mafia') {
            setWinner({ team: 'TOWN', text: "The last mafioso sleeps with the fishes." });
            setGameState('game_over');
            return;
        }
      }

      setPlayers(newPlayers);
      setNightActions({});

      if (victim) {
        setRevealData({
          type: 'death',
          title: "CORONER'S REPORT",
          victim: victim,
          text: `Found dead in an alleyway. Cause: Lead poisoning.`
        });
        addNote(`${victim.name} was murdered.`, true);
      } else {
        triggerTransition("MORNING BREAKS. NO CASUALTIES.", "day_discussion");
        addNote("A quiet night in the city.", true);
      }
    } 
    else if (gameState === 'day_discussion') {
      triggerTransition("THE DELIBERATION ENDS. TIME TO VOTE.", "day_voting", 2000);
    }
    else if (gameState === 'day_voting') {
      const voteCounts = Object.values(votes).reduce((acc, targetId) => {
        acc[targetId] = (acc[targetId] || 0) + 1;
        return acc;
      }, {});
      
      let lynchedId = null;
      let maxVotes = 0;
      for (const [targetId, count] of Object.entries(voteCounts)) {
        if (count > maxVotes) { maxVotes = count; lynchedId = parseInt(targetId); }
      }

      if (lynchedId) {
        const victim = players.find(p => p.id === lynchedId);
        const newPlayers = players.map(p => p.id === lynchedId ? { ...p, isDead: true } : p);
        setPlayers(newPlayers);
        
        addNote(`The precinct locked up ${victim.name}.`, true);
        
        // Mock Jester Win
        if (victim.role.id === 'jester') {
            setWinner({ team: 'JESTER', text: "The Con Artist fooled everyone. Absolute chaos." });
            setGameState('game_over');
            return;
        }

        setRevealData({
          type: 'lynch',
          title: "CASE CLOSED (ARREST)",
          victim: victim,
          text: `The town voted to lock them away.`
        });
      } else {
        addNote("Hung jury. No one was arrested.", true);
        triggerTransition("NIGHT FALLS...", "night");
      }
      setVotes({});
    }
  };

  const renderDossier = () => (
    <div className="min-h-screen desk-day flex items-center justify-center p-4">
      <div className="manila-folder max-w-2xl w-full p-8 md:p-12 relative animate-in zoom-in-95 duration-1000">
        
        {/* 'Top Secret' stamp */}
        <div className="absolute top-8 right-8 stamp stamp-red text-2xl rotate-12 opacity-60">
          CLASSIFIED
        </div>

        <div className="border-b-2 border-zinc-800/20 pb-6 mb-8 mt-4">
          <h1 className="font-heading text-6xl text-[#2b2b2b] tracking-tighter mb-2">Operation: Omertà</h1>
          <p className="font-typewriter text-zinc-600 text-sm tracking-widest">FILE REF: M-1932-B // STRICTLY CONFIDENTIAL</p>
        </div>

        <div className="space-y-6 font-typewriter text-[#3a3a3a]">
          <p>
            Listen up, Detective. We got a rat problem. The local family is trying to take over the district, wiping out civilians one by one in the dead of night.
          </p>
          <p>
            By day, they walk among us like normal citizens. Your job is to weed them out, interrogate the suspects, and throw the guilty in the slammer before they outnumber us.
          </p>

          <div className="bg-black/5 p-4 border border-black/10 rounded my-8">
            <h3 className="font-bold mb-3 uppercase border-b border-black/10 pb-2">Suspect Roster (6)</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
               {INITIAL_PLAYERS.map(p => (
                 <div key={p.id} className="flex justify-between items-center">
                   <span>{p.name}</span>
                   <span className="text-zinc-500 text-xs">[{p.role.name}]</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        <button 
          onClick={startGame}
          className="mt-8 w-full paper-texture border border-zinc-400 py-4 font-heading font-bold text-xl uppercase tracking-widest hover:bg-[#e8dec0] transition-colors shadow-lg active:translate-y-1"
        >
          Open The Case
        </button>
      </div>
    </div>
  );

  const renderTransition = () => (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full px-8">
        <h2 className="font-typewriter text-white text-3xl md:text-5xl typing-text text-center shadow-lg">
          {transitionText}
        </h2>
      </div>
    </div>
  );

  const renderReveal = () => (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="paper-texture max-w-md w-full p-8 shadow-2xl relative rotate-1">
        
        {/* Paperclip top */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-8 border-4 border-zinc-400 rounded-full border-b-0" style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)', top: '-16px'}} />
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-8 border-4 border-zinc-400 rounded-full border-t-0" />

        {revealData.type === 'death' && (
           <div className="absolute inset-0 blood-splatter pointer-events-none" />
        )}
        
        <h2 className="font-heading text-4xl font-black text-center mb-6 uppercase border-b-2 border-zinc-300 pb-4">
          {revealData.title}
        </h2>

        {revealData.victim && (
          <div className="flex flex-col items-center mb-8 relative z-10">
             <div className="w-32 h-32 bg-zinc-200 border-4 border-white shadow-md rotate-[-3deg] flex items-center justify-center mb-4 overflow-hidden">
                <Skull size={48} className="text-zinc-600 opacity-50" />
             </div>
             <h3 className="font-typewriter text-2xl font-bold">{revealData.victim.name}</h3>
             <div className="stamp stamp-red text-xl mt-4">
               {revealData.type === 'death' ? 'DECEASED' : 'ARRESTED'}
             </div>
          </div>
        )}

        <p className="font-typewriter text-center text-lg mb-8 relative z-10 font-bold bg-white/50 p-2">
          {revealData.text}
        </p>

        {revealData.victim && (
          <div className="bg-black/5 p-4 border border-black/10 text-center font-typewriter relative z-10">
            <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">True Identity</div>
            <div className="font-bold text-xl">{revealData.victim.role.name}</div>
          </div>
        )}

        <button 
          onClick={() => {
            const nextState = gameState === 'night' ? 'day_discussion' : 'night';
            triggerTransition(nextState === 'night' ? "NIGHT FALLS..." : "MORNING BREAKS...", nextState);
            setRevealData(null);
          }}
          className="mt-8 w-full border-2 border-black py-3 font-typewriter font-bold hover:bg-black hover:text-white transition-colors relative z-10"
        >
          File Report (Continue)
        </button>
      </div>
    </div>
  );

  const renderGameDesk = () => {
    const isNight = gameState === 'night';
    const isVoting = gameState === 'day_voting';
    const bgClass = isNight ? 'desk-night' : 'desk-day';
    
    let instruction = "Observe the suspects.";
    if (!activePlayer.isDead) {
      if (isNight && activePlayer.role.id === 'mafia') instruction = "Mark a target for elimination.";
      if (isNight && activePlayer.role.id === 'doctor') instruction = "Select a civilian to protect.";
      if (isNight && activePlayer.role.id === 'detective') instruction = "Select a suspect to investigate.";
      if (gameState === 'day_discussion') instruction = "Discuss findings in the notebook.";
      if (gameState === 'day_voting') instruction = "Stamp a suspect for arrest.";
    }

    return (
      <div className={`min-h-screen ${bgClass} flex flex-col relative overflow-hidden text-zinc-200 transition-colors duration-1000`}>
        
        {/* HUD / Settings Bar (Overlaying the desk) */}
        <div className="absolute top-0 w-full p-4 flex justify-between items-start z-40 pointer-events-none">
           <div className="flex flex-col gap-1 pointer-events-auto bg-black/40 p-3 rounded backdrop-blur-sm border border-white/10">
             <div className="flex items-center gap-2 text-white">
                <Clock size={16} />
                <span className="font-typewriter uppercase font-bold tracking-widest">{gameState.replace('_', ' ')}</span>
             </div>
             <span className="text-xs font-typewriter text-zinc-400">
                {gameState === 'day_discussion' || gameState === 'day_voting' ? 'Time Left: 2:34' : `Time: ${isNight ? '02:41 AM' : '10:15 AM'}`}
             </span>
           </div>

           {/* Perspective Swapper for Demo */}
           <div className="pointer-events-auto bg-black/60 p-2 rounded border border-white/10 text-xs font-typewriter flex gap-3 items-center backdrop-blur-sm">
             <span className="text-zinc-400">Perspective:</span>
             <select 
                value={activePlayerId} 
                onChange={(e) => { setActivePlayerId(parseInt(e.target.value)); setSelectedTarget(null); }}
                className="bg-transparent text-white outline-none cursor-pointer"
             >
               {players.map(p => <option key={p.id} value={p.id} className="bg-black">{p.name}</option>)}
             </select>
           </div>
        </div>

        {/* The Desk Surface */}
        <div className="flex-1 flex flex-col md:flex-row relative z-10 pt-20 pb-8 px-4 max-w-7xl mx-auto w-full gap-8">
          
          {/* Left Side: The Notepad (Chat / Logs) */}
          <div className="w-full md:w-80 flex-shrink-0 flex flex-col transition-transform duration-700 transform origin-left relative z-20">
             
             {/* Notepad Binding */}
             <div className="absolute -top-3 left-0 w-full h-6 bg-zinc-800 rounded-t-lg z-10 flex justify-around px-4">
                {[...Array(12)].map((_, i) => <div key={i} className="w-2 h-8 bg-zinc-300 rounded-full shadow-sm -mt-1 border-2 border-zinc-600" />)}
             </div>

             <div className="paper-texture flex-1 rounded-b-sm shadow-xl flex flex-col overflow-hidden pt-6">
                
                <div className="text-center font-typewriter font-bold border-b border-blue-200/50 pb-2 mx-4 mt-2">
                  LOGS
                </div>

                {/* Ruled lines background for notes */}
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

                {/* Input area */}
                <form 
                  onSubmit={(e) => { e.preventDefault(); if (noteInput.trim()) { addNote(noteInput); setNoteInput(''); } }}
                  className="p-3 border-t-2 border-zinc-300/50 bg-black/5"
                >
                  <input
                    type="text"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    disabled={gameState !== 'day_discussion' || activePlayer.isDead}
                    placeholder={activePlayer.isDead ? "(Deceased cannot write)" : isNight ? "(Too dark to write)" : "Jot down a thought..."}
                    className="w-full bg-transparent border-b-2 border-zinc-400 focus:border-black outline-none font-handwriting text-xl text-blue-900 placeholder-zinc-500 py-1"
                  />
                </form>
             </div>
          </div>

          {/* Right Side: The Mugshots (Player Cards) */}
          <div className="flex-1 relative flex flex-col items-center">
             
             {/* Instruction Tag */}
             <div className="paper-texture px-6 py-2 mb-8 rotate-[-1deg] shadow-md border border-zinc-300 relative z-30">
               <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-800 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]" /> {/* Push pin */}
               <span className="font-typewriter font-bold text-lg uppercase tracking-widest">{instruction}</span>
             </div>

             <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12 max-w-3xl relative z-20">
                {players.map(p => {
                  const isMe = p.id === activePlayer.id;
                  const isSelected = selectedTarget === p.id;
                  const isTargeted = (isNight && nightActions[activePlayer.id] === p.id) || (isVoting && votes[activePlayer.id] === p.id);
                  const isDead = p.isDead;
                  
                  const canInteract = !activePlayer.isDead && !isDead && (
                    isVoting || (isNight && ['mafia', 'doctor', 'detective'].includes(activePlayer.role.id))
                  );

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
                      {/* Photo Area */}
                      <div className="w-28 h-32 bg-zinc-300 mugshot-img mb-3 relative overflow-hidden flex items-end justify-center">
                         {/* Mugshot lines */}
                         <div className="absolute inset-0 bg-[repeating-linear-gradient(transparent,transparent_19px,#000_20px)] opacity-20 pointer-events-none" />
                         
                         {/* Silhouette */}
                         <div className="w-20 h-24 bg-zinc-800 rounded-t-3xl opacity-80" />
                         
                         {isMe && <div className="absolute top-1 left-1 bg-black/60 text-white font-typewriter text-[10px] px-1 font-bold">YOU</div>}
                      </div>

                      {/* Name plate */}
                      <div className="font-typewriter font-bold text-lg text-center w-full border-b border-zinc-400 pb-1 mb-1">
                        {p.name}
                      </div>
                      
                      {/* Role Reveal (Visible to self, dead, or mafia to mafia) */}
                      {(isMe || p.isDead || (activePlayer.role.id === 'mafia' && p.role.id === 'mafia')) && (
                        <div className="text-xs font-typewriter tracking-wider" style={{ color: p.role.ink }}>
                           [{p.role.name}]
                        </div>
                      )}

                      {/* Action Stamps / Markers overlay */}
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

                      {/* Vote Tally marks (Day Voting) */}
                      {isVoting && !isDead && (
                        <div className="absolute -right-4 top-1/2 font-handwriting font-bold text-2xl text-red-800 rotate-12">
                           {Object.values(votes).filter(vId => vId === p.id).map((_, i) => '|').join('')}
                        </div>
                      )}
                    </button>
                  )
                })}
             </div>
          </div>
        </div>

        {/* Action Confirmation Drawer (The "Action Folder") */}
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md manila-folder transition-transform duration-500 z-50 p-6 flex flex-col items-center
          ${selectedTarget ? 'translate-y-0' : 'translate-y-[120%]'}
        `}>
           <div className="font-typewriter font-bold text-xl mb-4 text-[#2b2b2b] uppercase tracking-widest border-b border-black/20 pb-2 w-full text-center">
             Official Action
           </div>
           
           <div className="flex gap-4 w-full">
             <button onClick={() => setSelectedTarget(null)} className="flex-1 py-3 border-2 border-zinc-500 font-typewriter font-bold text-zinc-700 hover:bg-zinc-200 transition-colors">
               Cancel
             </button>
             <button 
               onClick={handleStampAction}
               className="flex-1 py-3 bg-[#8b0000] text-white font-typewriter font-bold uppercase tracking-widest hover:bg-red-900 transition-colors shadow-lg flex items-center justify-center gap-2"
             >
               <FileSignature size={18} />
               Stamp File
             </button>
           </div>
        </div>

        {/* Personal Identity Card (Always visible bottom left corner of desk) */}
        <div className="absolute bottom-6 left-6 paper-texture p-4 shadow-xl rotate-2 z-30 border border-zinc-300 pointer-events-none">
           <div className="absolute -top-2 left-4 w-12 h-4 bg-yellow-500/30 -rotate-6" /> {/* Tape */}
           <div className="text-xs font-typewriter text-zinc-500 uppercase tracking-widest mb-2 border-b border-zinc-300 pb-1">Your Identity</div>
           <div className="flex items-center gap-3">
             <div className="p-2 border-2 rounded-full" style={{ borderColor: activePlayer.role.ink, color: activePlayer.role.ink }}>
                {React.createElement(activePlayer.role.icon, { size: 24 })}
             </div>
             <div>
               <div className="font-heading font-black text-2xl" style={{ color: activePlayer.role.ink }}>{activePlayer.role.name}</div>
               <div className="font-typewriter text-xs text-zinc-600">{activePlayer.role.desc}</div>
             </div>
           </div>
        </div>

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
          onClick={() => window.location.reload()}
          className="border-2 border-black py-4 px-12 font-typewriter font-bold text-xl uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
         >
           Start New Investigation
         </button>
      </div>
    </div>
  );

  return (
    <div className="font-sans selection:bg-black selection:text-white">
      {gameState === 'dossier' && renderDossier()}
      {gameState === 'transition' && renderTransition()}
      {revealData && renderReveal()}
      {gameState !== 'dossier' && gameState !== 'transition' && !revealData && gameState !== 'game_over' && renderGameDesk()}
      {gameState === 'game_over' && renderGameOver()}
    </div>
  );
}