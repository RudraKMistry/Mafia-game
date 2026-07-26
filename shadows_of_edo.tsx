import React, { useState, useEffect, useRef } from 'react';
import { 
  Swords, Search, Shield, Eye, Flame, 
  Skull, Scroll, Send, ChevronUp, ChevronDown,
  Moon, Sun, Wind, Check, X, Star
} from 'lucide-react';

const edoStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;700;900&family=Shojumaru&display=swap');

  .font-title { font-family: 'Shojumaru', system-ui; letter-spacing: 2px; }
  .font-body { font-family: 'Noto Serif JP', serif; }

  /* Zen Garden Backgrounds */
  .edo-day {
    background-color: #e8dfd5;
    background-image: 
      radial-gradient(circle at 50% 0%, #f4f1ea 0%, #d4cbb8 100%),
      url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.05' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    transition: all 2s ease-in-out;
    position: relative;
    overflow: hidden;
  }

  .edo-night {
    background-color: #0b1121;
    background-image: 
      radial-gradient(circle at 50% 20%, #1a243f 0%, #050811 100%),
      url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.05' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E");
    transition: all 2s ease-in-out;
    position: relative;
    overflow: hidden;
  }

  /* Sakura (Cherry Blossom) Animation for Day */
  @keyframes fall {
    0% { transform: translate(0, -10%) rotate(0deg); opacity: 0; }
    20% { opacity: 1; }
    80% { opacity: 1; }
    100% { transform: translate(100px, 110vh) rotate(360deg); opacity: 0; }
  }
  .sakura-petal {
    position: absolute;
    background: #ffb7c5;
    border-radius: 15px 0 15px 0;
    box-shadow: inset 2px 2px 4px rgba(255, 255, 255, 0.4);
    opacity: 0;
    pointer-events: none;
    z-index: 5;
  }

  /* Firefly Animation for Night */
  @keyframes flicker-drift {
    0% { transform: translate(0, 0) scale(1); opacity: 0; }
    20% { opacity: 0.8; box-shadow: 0 0 10px #ccff00, 0 0 20px #ccff00; }
    50% { transform: translate(-30px, -50px) scale(1.2); opacity: 0.3; }
    80% { opacity: 0.9; box-shadow: 0 0 15px #ccff00, 0 0 25px #ccff00; }
    100% { transform: translate(20px, -100px) scale(0.8); opacity: 0; }
  }
  .firefly {
    position: absolute;
    width: 3px; height: 3px;
    background: #ccff00;
    border-radius: 50%;
    opacity: 0;
    pointer-events: none;
    z-index: 15;
  }

  /* Red Lantern Glow Overlay (Night) */
  .lantern-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, rgba(180, 20, 20, 0.15) 0%, transparent 70%);
    pointer-events: none;
    opacity: 0;
    transition: opacity 2s;
    z-index: 10;
  }
  .is-night .lantern-glow { opacity: 1; }

  /* Shoji Screen Player Card */
  .shoji-screen {
    position: relative;
    width: 100%;
    aspect-ratio: 2/3;
    background: #fdfbf7;
    border: 8px solid #3c2a1c;
    box-shadow: 
      inset 0 0 20px rgba(0,0,0,0.1),
      5px 10px 15px rgba(0,0,0,0.4);
    display: flex;
    flex-direction: column;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    z-index: 20;
    cursor: pointer;
  }
  
  /* The wooden lattice */
  .shoji-lattice {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(to right, transparent calc(33.3% - 2px), #3c2a1c calc(33.3% - 2px), #3c2a1c calc(33.3% + 2px), transparent calc(33.3% + 2px), transparent calc(66.6% - 2px), #3c2a1c calc(66.6% - 2px), #3c2a1c calc(66.6% + 2px), transparent calc(66.6% + 2px)),
      linear-gradient(to bottom, transparent calc(25% - 2px), #3c2a1c calc(25% - 2px), #3c2a1c calc(25% + 2px), transparent calc(25% + 2px), transparent calc(50% - 2px), #3c2a1c calc(50% - 2px), #3c2a1c calc(50% + 2px), transparent calc(50% + 2px), transparent calc(75% - 2px), #3c2a1c calc(75% - 2px), #3c2a1c calc(75% + 2px), transparent calc(75% + 2px));
    pointer-events: none;
    z-index: 2;
    opacity: 0.8;
  }

  /* Paper texture */
  .shoji-paper {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.1' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E");
    z-index: 1;
  }

  .shoji-screen:hover:not(.is-dead):not(:disabled) {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 10px 15px 25px rgba(0,0,0,0.5);
    z-index: 30;
  }
  
  .shoji-screen.selected {
    transform: translateY(-15px) scale(1.05);
    border-color: #8b0000;
    box-shadow: 
      0 0 20px rgba(139, 0, 0, 0.4),
      15px 20px 30px rgba(0,0,0,0.6);
    z-index: 35;
  }
  .shoji-screen.selected .shoji-lattice {
    opacity: 1;
    background-image: 
      linear-gradient(to right, transparent calc(33.3% - 2px), #8b0000 calc(33.3% - 2px), #8b0000 calc(33.3% + 2px), transparent calc(33.3% + 2px), transparent calc(66.6% - 2px), #8b0000 calc(66.6% - 2px), #8b0000 calc(66.6% + 2px), transparent calc(66.6% + 2px)),
      linear-gradient(to bottom, transparent calc(25% - 2px), #8b0000 calc(25% - 2px), #8b0000 calc(25% + 2px), transparent calc(25% + 2px), transparent calc(50% - 2px), #8b0000 calc(50% - 2px), #8b0000 calc(50% + 2px), transparent calc(50% + 2px), transparent calc(75% - 2px), #8b0000 calc(75% - 2px), #8b0000 calc(75% + 2px), transparent calc(75% + 2px));
  }

  /* Ink Brush Enso Circle (Targeting) */
  @keyframes draw-enso {
    0% { stroke-dasharray: 0 1000; }
    100% { stroke-dasharray: 1000 1000; }
  }
  .enso-circle {
    position: absolute;
    inset: 5%;
    z-index: 10;
    pointer-events: none;
    opacity: 0.8;
  }
  .enso-circle circle {
    fill: none;
    stroke: #8b0000;
    stroke-width: 8;
    stroke-linecap: round;
    stroke-dasharray: 1000 1000;
    animation: draw-enso 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    filter: drop-shadow(0 0 4px rgba(139,0,0,0.5));
  }

  /* Shuriken (Votes) */
  .shuriken {
    position: absolute;
    width: 24px;
    height: 24px;
    background: #555;
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    box-shadow: 2px 2px 5px rgba(0,0,0,0.8);
    z-index: 25;
  }
  .shuriken::after {
    content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 6px; height: 6px; background: #222; border-radius: 50%;
  }

  /* Death State (Slashed Paper) */
  .shoji-screen.is-dead {
    transform: rotate(2deg) translateY(10px);
    pointer-events: none;
    filter: sepia(0.3) brightness(0.8);
  }
  
  .ink-splatter {
    position: absolute;
    inset: 0;
    background-image: 
      radial-gradient(circle at 40% 60%, rgba(10,10,10,0.9) 0%, transparent 40%),
      radial-gradient(circle at 60% 30%, rgba(10,10,10,0.7) 0%, transparent 30%);
    mix-blend-mode: multiply;
    z-index: 5;
    pointer-events: none;
  }
  
  .slash-mark {
    position: absolute;
    top: 20%; left: 10%; right: 10%; height: 60%;
    background: linear-gradient(to bottom right, transparent 48%, #111 49%, #111 51%, transparent 52%);
    z-index: 6;
  }

  /* Makimono Scroll (Chat) */
  .makimono-scroll {
    background-color: #e8dfd5;
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.08' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E");
    border-left: 20px solid #8b0000;
    box-shadow: inset 10px 0 20px rgba(0,0,0,0.1), -5px 0 25px rgba(0,0,0,0.5);
    border-radius: 0 4px 4px 0;
    position: relative;
  }
  /* Scroll wooden roller ends */
  .makimono-scroll::before, .makimono-scroll::after {
    content: ''; position: absolute; left: -26px; width: 32px; height: 16px; background: #3c2a1c; border-radius: 4px; box-shadow: inset 0 2px 4px rgba(255,255,255,0.2), 2px 4px 6px rgba(0,0,0,0.5);
  }
  .makimono-scroll::before { top: -8px; }
  .makimono-scroll::after { bottom: -8px; }

  /* Custom Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(60, 42, 28, 0.4); border-radius: 4px; }

  .text-vertical {
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }
`;

const ROLES = {
  MAFIA: { id: 'mafia', name: 'Shinobi', icon: Swords, color: '#8b0000', jp: '忍' },
  VILLAGER: { id: 'villager', name: 'Heimin', icon: Eye, color: '#3c2a1c', jp: '民' },
  DOCTOR: { id: 'doctor', name: 'Sohei', icon: Shield, color: '#2e8b57', jp: '僧' },
  DETECTIVE: { id: 'detective', name: 'Samurai', icon: Search, color: '#1a237e', jp: '侍' },
  JESTER: { id: 'jester', name: 'Kitsune', icon: Flame, color: '#d2691e', jp: '狐' }
};

const INITIAL_PLAYERS = [
  { id: 1, name: 'Hanzo', role: ROLES.MAFIA, isDead: false },
  { id: 2, name: 'Akiko', role: ROLES.VILLAGER, isDead: false },
  { id: 3, name: 'Musashi', role: ROLES.DOCTOR, isDead: false },
  { id: 4, name: 'Kenshin', role: ROLES.DETECTIVE, isDead: false },
  { id: 5, name: 'Kenji', role: ROLES.VILLAGER, isDead: false },
  { id: 6, name: 'Ryu', role: ROLES.JESTER, isDead: false },
];

export default function EdoMafia() {
  const [gameState, setGameState] = useState('lobby'); 
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  
  // Interactive State
  const [activePlayerId, setActivePlayerId] = useState(1);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [nightActions, setNightActions] = useState({});
  const [votes, setVotes] = useState({});
  
  // Mobile UI States
  const [isScrollOpen, setIsScrollOpen] = useState(false);
  
  // Chat & Cinematic State
  const [logs, setLogs] = useState([{ id: 1, text: "The Shogun decrees a gathering.", time: "Dawn", isSystem: true }]);
  const [chatInput, setChatInput] = useState('');
  const [transitionText, setTransitionText] = useState('');
  const [revealData, setRevealData] = useState(null);
  const [winner, setWinner] = useState(null);

  const activePlayer = players.find(p => p.id === activePlayerId);
  const logsEndRef = useRef(null);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = edoStyles;
    document.head.appendChild(styleSheet);
    
    // Environment particle generator
    const generateParticles = () => {
      const container = document.getElementById('particle-layer');
      if (!container) return;
      container.innerHTML = ''; // clear existing
      
      const isNight = gameState === 'night';
      const particleCount = isNight ? 40 : 25;
      
      for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.className = isNight ? 'firefly' : 'sakura-petal';
        
        if (isNight) {
          p.style.left = `${Math.random() * 100}%`;
          p.style.top = `${Math.random() * 100}%`;
          p.style.animation = `flicker-drift ${4 + Math.random() * 6}s infinite linear`;
          p.style.animationDelay = `${Math.random() * 5}s`;
        } else {
          p.style.left = `${Math.random() * 100}%`;
          p.style.top = `-10%`;
          p.style.width = `${8 + Math.random() * 8}px`;
          p.style.height = `${8 + Math.random() * 8}px`;
          p.style.animation = `fall ${8 + Math.random() * 10}s infinite linear`;
          p.style.animationDelay = `${Math.random() * -10}s`;
        }
        container.appendChild(p);
      }
    };

    generateParticles();

    return () => styleSheet.remove();
  }, [gameState]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, isScrollOpen]);

  const addLog = (text, isSystem = false) => {
    const time = gameState === 'night' ? 'Midnight' : 'Midday';
    setLogs(prev => [...prev, { id: Date.now(), text, time, isSystem, author: isSystem ? 'The Shogun' : activePlayer.name }]);
  };

  const triggerTransition = (text, nextState, delay = 3500) => {
    setTransitionText(text);
    setGameState('transition');
    setTimeout(() => {
      setGameState(nextState);
      setTransitionText('');
    }, delay);
  };

  const startGame = () => {
    addLog("Shadows lengthen. Lock the courtyard.", true);
    triggerTransition("THE SUN SETS ON EDO...", "night");
  };

  const confirmAction = () => {
    if (!selectedTarget) return;

    if (gameState === 'night') {
      setNightActions(prev => ({ ...prev, [activePlayer.id]: selectedTarget }));
      
      if (activePlayer.role.id === 'detective') {
        const target = players.find(p => p.id === selectedTarget);
        const isMafia = target.role.id === 'mafia';
        setRevealData({
          title: "SAMURAI'S REPORT",
          text: `Your scouts confirm ${target.name} is ${isMafia ? 'a Shinobi Assassin (Guilty)' : 'an honorable citizen (Cleared)'}.`
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
      const killedId = nightActions[1]; 
      const savedId = nightActions[3]; 
      
      let newPlayers = [...players];
      let victim = null;

      if (killedId && killedId !== savedId) {
        victim = newPlayers.find(p => p.id === killedId);
        victim.isDead = true;
        
        if (victim.role.id === 'mafia') {
            setWinner({ team: 'THE SHOGUNATE', text: "All Shinobi have been eradicated from the province." });
            setGameState('game_over');
            return;
        }
      }

      setPlayers(newPlayers);
      setNightActions({});

      if (victim) {
        setRevealData({
          title: "A BLADE IN THE DARK",
          victim: victim,
          text: `Slain by a shadow in the night.`
        });
        addLog(`Blood was shed. ${victim.name} is dead.`, true);
      } else {
        triggerTransition("DAWN BREAKS. THE LOTUS BLOOMS.", "day_discussion");
        addLog("A peaceful night passes in the garden.", true);
      }
    } 
    else if (gameState === 'day_discussion') {
      triggerTransition("THE TRIBUNAL GATHERS TO JUDGE", "day_voting", 2000);
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
        
        addLog(`The tribunal sentenced ${victim.name} to exile.`, true);
        
        if (victim.role.id === 'jester') {
            setWinner({ team: 'THE KITSUNE', text: "The trickster spirit deceived the entire village. Chaos reigns." });
            setGameState('game_over');
            return;
        }

        setRevealData({
          title: "SENTENCED TO EXILE",
          victim: victim,
          text: `Driven from the village by the tribunal.`
        });
      } else {
        addLog("The tribunal remained divided. None were punished.", true);
        triggerTransition("THE SHADOWS RETURN...", "night");
      }
      setVotes({});
    }
  };

  const renderLobby = () => (
    <div className="min-h-screen edo-day flex items-center justify-center p-4">
      <div id="particle-layer" className="absolute inset-0 z-0" />
      
      <div className="bg-[#fdfbf7]/90 border-8 border-[#3c2a1c] p-8 md:p-12 max-w-xl w-full text-center relative z-20 shadow-2xl backdrop-blur-sm">
        
        {/* Japanese clan crest decoration */}
        <div className="mx-auto w-24 h-24 rounded-full border-4 border-[#8b0000] mb-6 flex items-center justify-center">
          <Wind size={40} className="text-[#8b0000]" />
        </div>
        
        <h1 className="font-title text-4xl md:text-6xl text-[#3c2a1c] mb-4 drop-shadow-sm">
          SHADOWS OF EDO
        </h1>
        <p className="font-body text-[#8b0000] text-xl italic mb-10 border-b-2 border-[#8b0000]/30 pb-4">
          Deceit blooms like the sakura.
        </p>

        <div className="grid grid-cols-2 gap-4 text-left font-body text-lg text-[#3c2a1c] bg-[#e8dfd5] p-6 mb-10 border border-[#3c2a1c]/20 shadow-inner">
           <div className="border-b border-[#3c2a1c]/10 pb-2">Citizens: <span className="float-right font-bold">6</span></div>
           <div className="border-b border-[#3c2a1c]/10 pb-2">Province: <span className="float-right font-bold">Kyoto</span></div>
           <div className="pt-2">Shinobi: <span className="float-right text-[#8b0000] font-bold">Hidden</span></div>
           <div className="pt-2">Status: <span className="float-right text-[#2e8b57] font-bold">Peaceful</span></div>
        </div>

        <button 
          onClick={startGame}
          className="font-title text-xl text-[#fdfbf7] bg-[#8b0000] px-10 py-4 w-full transition-all shadow-[0_5px_15px_rgba(139,0,0,0.4)] hover:bg-[#600000] border-2 border-[#3c2a1c]"
        >
          ENTER THE COURTYARD
        </button>
      </div>
    </div>
  );

  const renderTransition = () => (
    <div className="fixed inset-0 z-50 bg-[#0b1121] flex items-center justify-center">
      <div className="absolute inset-0 lantern-glow opacity-30" />
      <h2 className="font-title text-[#e8dfd5] text-3xl md:text-5xl text-center tracking-widest relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] px-4 leading-relaxed">
        {transitionText}
      </h2>
    </div>
  );

  const renderReveal = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      {/* Scroll Background */}
      <div className="bg-[#fdfbf7] border-y-[16px] border-[#3c2a1c] p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
         
         <div className="font-body text-sm text-[#8b0000] font-bold mb-2 tracking-widest">
           — IMPERIAL DECREE —
         </div>

         <h2 className="font-title text-2xl text-[#3c2a1c] border-b-2 border-[#3c2a1c] pb-4 mb-6">
           {revealData.title}
         </h2>

         {revealData.victim && (
           <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-28 bg-[#e8dfd5] border-4 border-[#3c2a1c] flex items-center justify-center mb-4 relative shadow-md">
                {/* Torn paper visual */}
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,#111_49%,#111_51%,transparent_52%)] opacity-20" />
                <div className="font-title text-4xl text-[#3c2a1c] opacity-50">{revealData.victim.role.jp}</div>
              </div>
              <h3 className="font-body text-2xl font-bold text-[#3c2a1c]">{revealData.victim.name}</h3>
           </div>
         )}

         <p className="font-body text-lg text-[#3c2a1c] bg-black/5 p-4 mb-6 border-l-4 border-[#8b0000]">
           {revealData.text}
         </p>

         {revealData.victim && (
           <div className="mb-8 border-t border-[#3c2a1c]/20 pt-4">
             <div className="text-xs uppercase font-body text-zinc-500 mb-1">True Path</div>
             <div className="font-title text-xl" style={{ color: revealData.victim.role.color }}>
                {revealData.victim.role.name}
             </div>
           </div>
         )}

         <button 
           onClick={() => {
             const nextState = gameState === 'night' ? 'day_discussion' : 'night';
             triggerTransition(nextState === 'night' ? "THE SUN SETS ON EDO..." : "DAWN BREAKS...", nextState);
             setRevealData(null);
           }}
           className="w-full font-title text-lg text-[#fdfbf7] bg-[#3c2a1c] py-3 hover:bg-black transition-colors shadow-lg"
         >
           ACKNOWLEDGE
         </button>
      </div>
    </div>
  );

  const renderGameBoard = () => {
    const isNight = gameState === 'night';
    const isVoting = gameState === 'day_voting';
    const bgClass = isNight ? 'edo-night is-night' : 'edo-day';
    
    let instruction = "Observe the courtyard.";
    let ActionIcon = Search;
    if (!activePlayer.isDead) {
      if (isNight && activePlayer.role.id === 'mafia') { instruction = "Select a target to assassinate."; ActionIcon = Swords; }
      if (isNight && activePlayer.role.id === 'doctor') { instruction = "Select a soul to protect."; ActionIcon = Shield; }
      if (isNight && activePlayer.role.id === 'detective') { instruction = "Investigate their true nature."; ActionIcon = Eye; }
      if (gameState === 'day_discussion') { instruction = "Discuss the night's events."; ActionIcon = Scroll; }
      if (gameState === 'day_voting') { instruction = "Cast your shuriken to vote."; ActionIcon = Star; }
    }

    return (
      <div className={`min-h-screen ${bgClass} flex flex-col md:flex-row relative font-sans text-[#3c2a1c]`}>
        
        {/* Environment Particles */}
        <div id="particle-layer" className="absolute inset-0 pointer-events-none z-10" />
        <div className="lantern-glow" />

        {/* TOP HUD */}
        <div className="absolute top-0 w-full z-40 p-4 flex justify-between items-start pointer-events-none">
           <div className="bg-[#fdfbf7]/90 border-2 border-[#3c2a1c] p-2 md:p-3 pointer-events-auto shadow-lg backdrop-blur-sm flex items-center gap-3">
             <div className={`p-2 rounded-full border border-current ${isNight ? 'text-indigo-800 bg-indigo-100' : 'text-[#8b0000] bg-red-100'}`}>
                {isNight ? <Moon size={20} /> : <Sun size={20} />}
             </div>
             <div className="flex flex-col">
                <span className="font-title text-sm md:text-lg tracking-widest">{gameState.replace('_', ' ')}</span>
                <span className="text-[10px] font-body font-bold text-zinc-500 uppercase tracking-wider">{instruction}</span>
             </div>
           </div>

           {/* Perspective Swapper for Demo */}
           <div className="bg-[#fdfbf7]/90 border-2 border-[#3c2a1c] p-2 md:p-3 pointer-events-auto flex items-center gap-2 md:gap-4 shadow-lg backdrop-blur-sm">
             <div className="flex flex-col">
               <span className="text-[8px] md:text-[10px] font-body font-bold text-zinc-500 uppercase">Assume Form:</span>
               <select 
                  value={activePlayerId} 
                  onChange={(e) => { setActivePlayerId(parseInt(e.target.value)); setSelectedTarget(null); }}
                  className="bg-transparent text-[#8b0000] font-title text-xs md:text-sm outline-none cursor-pointer"
               >
                 {players.map(p => <option key={p.id} value={p.id} className="bg-white">{p.name}</option>)}
               </select>
             </div>
             <div className="w-px h-6 bg-[#3c2a1c]/30" />
             <button onClick={advancePhase} className="text-[#3c2a1c] hover:text-[#8b0000] font-title text-[8px] md:text-[10px] uppercase">
               Pass<br/>Time
             </button>
           </div>
        </div>

        {/* Left Side: The Courtyard (Shoji Screens) */}
        <div className="flex-1 w-full pt-24 pb-32 md:pb-8 px-4 md:px-12 relative z-20 flex items-center justify-center overflow-y-auto">
           
           <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 max-w-4xl w-full">
              {players.map(p => {
                const isMe = p.id === activePlayer.id;
                const isSelected = selectedTarget === p.id;
                const isDead = p.isDead;
                const isTargeted = (isNight && nightActions[activePlayer.id] === p.id) || (isVoting && votes[activePlayer.id] === p.id);
                
                const canInteract = !activePlayer.isDead && !isDead && !isMe && (
                  isVoting || (isNight && ['mafia', 'doctor', 'detective'].includes(activePlayer.role.id))
                );

                const voteCount = isVoting ? Object.values(votes).filter(vId => vId === p.id).length : 0;
                const showRole = isMe || isDead || (activePlayer.role.id === 'mafia' && p.role.id === 'mafia');

                return (
                  <button
                    key={p.id}
                    disabled={!canInteract && !isSelected}
                    onClick={() => setSelectedTarget(isSelected ? null : p.id)}
                    className={`shoji-screen ${isDead ? 'is-dead' : ''} ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="shoji-paper" />
                    <div className="shoji-lattice" />

                    {/* Death State Overlays */}
                    {isDead && (
                      <>
                        <div className="slash-mark" />
                        <div className="ink-splatter" />
                      </>
                    )}

                    {/* Content inside the screen (Silhouettes/Names) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
                       
                       {/* Character Kanji/Icon */}
                       <div className={`text-4xl md:text-6xl font-title mb-4 ${isDead ? 'text-[#111] opacity-50' : 'text-[#3c2a1c] opacity-80'}`}>
                         {showRole ? p.role.jp : '人'}
                       </div>

                       {/* Banner name */}
                       <div className="bg-[#fdfbf7] border border-[#3c2a1c] px-3 py-1 font-body font-bold text-sm md:text-base text-[#3c2a1c] shadow-sm">
                         {p.name}
                       </div>

                       {/* Role text reveal */}
                       {showRole && (
                         <div className="mt-2 text-[10px] font-body font-bold tracking-widest uppercase bg-[#fdfbf7]/80 px-2 rounded" style={{ color: p.isDead ? '#333' : p.role.color }}>
                           {p.role.name}
                         </div>
                       )}
                    </div>

                    {isMe && <div className="absolute top-0 right-0 bg-[#8b0000] text-white font-title text-[8px] px-2 py-1 z-30">YOU</div>}

                    {/* Night Target - Ensō Circle */}
                    {isTargeted && !isSelected && isNight && !isDead && (
                      <svg className="enso-circle" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" />
                      </svg>
                    )}

                    {/* Day Votes - Shuriken */}
                    {isVoting && voteCount > 0 && (
                      <div className="absolute top-2 left-2 flex flex-col gap-2 z-40">
                        {[...Array(voteCount)].map((_, i) => (
                          <div key={i} className="shuriken" style={{ transform: `rotate(${Math.random() * 360}deg)` }} />
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
           </div>
        </div>

        {/* Right Side (Desktop) / Bottom Drawer (Mobile): Makimono Scroll (Chat) */}
        <div className={`
          fixed md:relative bottom-0 right-0 w-full md:w-80 h-[50vh] md:h-screen 
          z-40 transition-transform duration-500 ease-in-out flex flex-col
          ${!isScrollOpen && 'translate-y-[calc(100%-48px)] md:translate-y-0'}
        `}>
           
           <button 
             onClick={() => setIsScrollOpen(!isScrollOpen)}
             className="md:hidden w-full bg-[#3c2a1c] text-[#e8dfd5] py-3 flex justify-center items-center gap-2 border-t-2 border-[#8b0000] shadow-[0_-5px_15px_rgba(0,0,0,0.5)]"
           >
             <Scroll size={16} />
             <span className="font-title text-sm tracking-widest">OPEN SCROLL</span>
             {isScrollOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
           </button>

           <div className="flex-1 makimono-scroll flex flex-col md:my-10 md:mr-8 mb-0 relative shadow-2xl">
             
             <div className="text-center font-title text-xl text-[#3c2a1c] mt-6 border-b-2 border-[#3c2a1c]/20 pb-2 mx-6">
               Village Records
             </div>

             <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 font-body">
               {logs.map(log => (
                 <div key={log.id} className="text-sm leading-snug flex flex-col">
                   {log.isSystem ? (
                     <div className="text-[#8b0000] font-bold text-center border-y border-[#8b0000]/20 py-1 my-1 italic">
                       {log.text}
                     </div>
                   ) : (
                     <div className="flex flex-col border-l-2 border-[#3c2a1c]/30 pl-2">
                       <span className="text-zinc-500 text-[10px] font-bold uppercase mb-0.5">
                         {log.author} <span className="font-normal italic">({log.time})</span>
                       </span>
                       <span className="text-[#1a1a1a] font-bold">{log.text}</span>
                     </div>
                   )}
                 </div>
               ))}
               <div ref={logsEndRef} />
             </div>

             <form 
               onSubmit={(e) => { e.preventDefault(); if (chatInput.trim()) { addLog(chatInput); setChatInput(''); } }}
               className="p-3 border-t-2 border-[#3c2a1c]/20 bg-black/5 flex gap-2 items-center"
             >
               <input
                 type="text"
                 value={chatInput}
                 onChange={(e) => setChatInput(e.target.value)}
                 disabled={gameState !== 'day_discussion' || activePlayer.isDead}
                 placeholder={activePlayer.isDead ? "Silent as the grave..." : isNight ? "The night is quiet..." : "Write thy message..."}
                 className="flex-1 bg-transparent border-b border-[#3c2a1c]/50 outline-none font-body text-sm text-[#3c2a1c] placeholder-zinc-500 py-1 disabled:opacity-50"
               />
               <button type="submit" disabled={!chatInput.trim()} className="text-[#3c2a1c] hover:text-[#8b0000] disabled:opacity-30 p-1">
                 <Send size={18} />
               </button>
             </form>
           </div>
        </div>

        {/* Action Confirmation Drawer */}
        <div className={`absolute bottom-0 md:bottom-8 left-0 md:left-1/2 md:-translate-x-1/2 w-full md:max-w-sm transition-transform duration-500 z-50 p-4 md:p-0
          ${selectedTarget ? 'translate-y-0 opacity-100' : 'translate-y-[150%] opacity-0'}
        `}>
           <div className="bg-[#fdfbf7] border-4 border-[#3c2a1c] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex flex-col items-center">
             <div className="font-title text-sm mb-4 text-[#8b0000] tracking-widest border-b border-[#3c2a1c]/20 pb-2 w-full text-center">
               SEAL THY DECISION
             </div>
             
             <div className="flex gap-3 w-full">
               <button onClick={() => setSelectedTarget(null)} className="flex-1 py-2 border border-zinc-400 font-body font-bold text-zinc-600 hover:text-black transition-colors">
                 HESITATE
               </button>
               <button 
                 onClick={confirmAction}
                 className="flex-1 py-2 bg-[#8b0000] text-[#fdfbf7] font-title text-sm hover:bg-[#600000] transition-colors shadow-md flex items-center justify-center gap-2"
               >
                 <ActionIcon size={16} />
                 STRIKE
               </button>
             </div>
           </div>
        </div>

        {/* Personal Identity Badge */}
        <div className={`absolute bottom-4 md:bottom-8 left-4 z-30 transition-opacity ${isScrollOpen ? 'opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto' : 'opacity-100'}`}>
           <div className="bg-[#fdfbf7] border-2 border-[#3c2a1c] p-3 shadow-xl flex items-center gap-3">
             <div className="w-10 h-10 flex items-center justify-center border border-[#3c2a1c]/30 bg-black/5" style={{ color: activePlayer.role.color }}>
               {React.createElement(activePlayer.role.icon, { size: 20 })}
             </div>
             <div className="pr-2">
               <div className="font-body text-[9px] text-zinc-500 uppercase font-bold tracking-widest">Thy True Path</div>
               <div className="font-title text-sm md:text-base leading-none mt-1" style={{ color: activePlayer.role.color }}>
                 {activePlayer.role.name}
               </div>
             </div>
           </div>
        </div>

      </div>
    );
  };

  const renderGameOver = () => (
    <div className="fixed inset-0 z-50 bg-[#0b1121] flex items-center justify-center p-4">
      <div className="absolute inset-0 edo-night opacity-30 pointer-events-none" />
      
      <div className="bg-[#fdfbf7] border-[12px] border-[#3c2a1c] max-w-2xl w-full p-10 md:p-14 text-center relative z-10 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
         
         {/* Mon (Crest) */}
         <div className="mx-auto w-20 h-20 rounded-full border-4 border-[#3c2a1c] mb-6 flex items-center justify-center bg-black/5">
           <Wind size={32} className="text-[#3c2a1c]" />
         </div>

         <h1 className="font-title text-3xl md:text-5xl text-[#8b0000] mb-4 drop-shadow-sm border-b-2 border-[#3c2a1c]/20 pb-4 leading-relaxed">
           {winner.team} WINS
         </h1>
         
         <p className="font-body text-xl text-[#3c2a1c] font-bold mb-10">
           {winner.text}
         </p>

         <button 
          onClick={() => window.location.reload()}
          className="bg-[#3c2a1c] text-[#fdfbf7] py-3 px-10 font-title text-sm tracking-widest hover:bg-black transition-all shadow-lg border-2 border-[#3c2a1c]"
         >
           BEGIN ANEW
         </button>
      </div>
    </div>
  );

  return (
    <div className="font-sans selection:bg-[#8b0000]/30 selection:text-[#3c2a1c] bg-[#0b1121]">
      {gameState === 'lobby' && renderLobby()}
      {gameState === 'transition' && renderTransition()}
      {revealData && renderReveal()}
      {gameState !== 'lobby' && gameState !== 'transition' && !revealData && gameState !== 'game_over' && renderGameBoard()}
      {gameState === 'game_over' && renderGameOver()}
    </div>
  );
}