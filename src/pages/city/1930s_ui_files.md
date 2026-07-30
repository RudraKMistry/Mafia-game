## DesktopHome.tsx

``tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, X, Flame, Eye, Heart, Search, VenetianMask, Bot } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [modalMode, setModalMode] = useState<'host' | 'join' | 'bots' | null>(null);
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('mafia_playerName') || '');
  const [joinCode, setJoinCode] = useState('');
  const [showWipError, setShowWipError] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
        <button className="px-8 py-4 bg-[#8b0000] text-white font-heading font-black text-xl sm:text-2xl uppercase tracking-widest border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:bg-red-950 transition-all active:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 cursor-default">
          1930's Theme
        </button>
        <button 
          onClick={() => {
            const audio = new Audio('/sounds/slash.mp3');
            audio.onloadedmetadata = () => {
                audio.playbackRate = audio.duration / 2.5;
                audio.play().catch(console.error);
            };
            setIsTransitioning(true);
            setTimeout(() => {
                localStorage.setItem('mafia_theme', 'edo');
                window.location.reload();
            }, 3500);
          }}
          className="px-8 py-4 bg-zinc-800 text-zinc-300 font-heading font-black text-xl sm:text-2xl uppercase tracking-widest border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-all active:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1"
        >
          Yakuza
        </button>
      </div>

      {showWipError && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
          <div className="paper-texture max-w-md w-full p-8 shadow-[12px_12px_0px_rgba(0,0,0,1)] relative border-4 border-black -rotate-1">
            <h2 className="font-heading text-3xl font-black text-center mb-6 uppercase border-b-[4px] border-black/20 pb-4 text-[#8b0000]">
              ACCESS DENIED
            </h2>
            <p className="font-typewriter text-center text-lg mb-8 font-bold text-black bg-white/50 p-4 border-2 border-black/10 shadow-inner leading-relaxed">
              work in progress atle khabar nai pade? it means Aju banyu nathi, kaam chaltu che.
            </p>
            <button 
              onClick={() => setShowWipError(false)}
              className="w-full border-4 border-black bg-black text-white py-3 font-heading font-black text-2xl uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-[4px_4px_0px_rgba(255,255,255,0.2)] active:shadow-[1px_1px_0px_rgba(255,255,255,0.2)] active:translate-y-1 active:translate-x-1"
            >
              UNDERSTOOD
            </button>
          </div>
        </div>
      )}

      {isTransitioning && (
        <div className="fixed inset-0 z-[200] animate-fade-black pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-0 w-[200vw] h-[4px] bg-red-600 shadow-[0_0_40px_20px_rgba(220,38,38,0.8)] animate-slash origin-top-left delay-500"></div>
        </div>
      )}
    </div>
  );
}


``

## DesktopLobby.tsx

``tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Settings, Play, Users, Copy, Paperclip, CheckSquare, Square, ArrowLeft, UserPlus, X } from 'lucide-react';
import { socket } from '../socket';

export default function Lobby() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isBotMode = searchParams.get('mode') === 'bots';

  const [players, setPlayers] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    mafia: 1, villager: 2, doctor: 1, detective: 1, jester: 1,
    discussionTime: '3m', nightTime: '30s', revealOnDeath: false,
    nightOrder: 'doc-det-maf', doctorSelfHeal: true,
    jesterWin: 'end', detectiveSees: 'alignment',
    anonVoting: false, tieVote: 'nothing', skipVote: true
  });
  
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let playerName = localStorage.getItem('mafia_playerName');
    if (!playerName) {
        playerName = prompt('Enter your name:') || 'Anonymous';
        localStorage.setItem('mafia_playerName', playerName);
    }
    
    const theme = localStorage.getItem('mafia_theme') || '1930s';
    const playerIdFromStorage = localStorage.getItem('mafia_playerId');
    
    let deviceId = localStorage.getItem('mafia_deviceId');
    if (!deviceId) {
        deviceId = Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem('mafia_deviceId', deviceId);
    }
    
    socket.emit('join_room', { roomId: id, playerName, isBotMode, theme, playerId: playerIdFromStorage, deviceId });

    const onPlayerId = (id: number) => {
      setPlayerId(id);
      localStorage.setItem('mafia_playerId', id.toString());
    };

    const onRoomUpdate = (room: any) => {
      setPlayers(room.players);
      setSettings(room.settings);
      
      // Sync theme from host — if the room has a different theme, adopt it
      if (room.theme && room.theme !== (localStorage.getItem('mafia_theme') || '1930s')) {
        localStorage.setItem('mafia_theme', room.theme);
        window.location.reload();
        return;
      }
      
      if (room.state !== 'lobby') {
         navigate(`/game/${id}`);
      }
    };

    const onError = (msg: string) => {
        setErrorMsg(msg);
        if (msg.includes('IDENTITY THEFT') || msg.includes('already registered')) {
            localStorage.removeItem('mafia_playerName');
            setTimeout(() => navigate('/'), 3000);
        }
    };

    socket.on('player_id', onPlayerId);
    socket.on('room_update', onRoomUpdate);
    socket.on('error', onError);

    return () => {
      socket.off('player_id', onPlayerId);
      socket.off('room_update', onRoomUpdate);
      socket.off('error', onError);
    };
  }, [id, navigate, isBotMode]);

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    socket.emit('update_settings', { roomId: id, settings: newSettings });
  };

  const totalSpecifiedRoles = (settings.mafia||0) + (settings.doctor||0) + (settings.detective||0) + (settings.jester||0);

  const handleStartGame = () => {
    if (players.length < 4) {
      setErrorMsg("A minimum of 4 players is required to commence operation.");
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }
    if (totalSpecifiedRoles > players.length) {
      setErrorMsg("Insufficient players for this role configuration.");
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }
    socket.emit('start_game', { roomId: id });
  };

  const handleAddBot = () => {
    socket.emit('add_bot', { roomId: id });
  };

  const handleToggleReady = () => {
    socket.emit('toggle_ready', { roomId: id, playerId });
  };

  const isHost = players.length > 0 && players[0].id === playerId;
  const currentPlayer = players.find(p => p.id === playerId);
  const allReady = players.length > 0 && players.every(p => p.isReady);

  const CustomSelect = ({ label, value, onChange, options, disabled }: any) => (
    <div className="flex flex-col gap-1 mb-4">
      <label className="text-black/60 uppercase tracking-widest font-bold text-[10px] font-typewriter">{label}</label>
      <div className="relative">
        <select 
          value={value} 
          onChange={onChange} 
          disabled={disabled}
          className="appearance-none w-full bg-transparent border-b-2 border-black/30 hover:border-black py-1 pr-6 outline-none font-typewriter font-bold text-sm md:text-base text-black cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-none"
        >
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value} className="text-black bg-[#f4ebd8] font-typewriter">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-black/40 text-xs">
          ▼
        </div>
      </div>
    </div>
  );

  const CustomCheckbox = ({ label, checked, onChange, disabled }: any) => (
    <label className={`flex items-center cursor-pointer gap-3 group mb-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <input type="checkbox" className="hidden" checked={checked} onChange={onChange} disabled={disabled} />
      <div className="text-black/70 group-hover:text-black transition-colors">
         {checked ? <CheckSquare size={20} className="text-red-800" /> : <Square size={20} />}
      </div>
      <span className="text-black/80 uppercase tracking-wider font-bold text-xs font-typewriter group-hover:text-black transition-colors leading-tight">
        {label}
      </span>
    </label>
  );

  const RoleCounter = ({ role, label, min = 0, max = 99 }: { role: string, label: string, min?: number, max?: number }) => {
    const handleAdd = () => {
       if (totalSpecifiedRoles >= players.length) {
          setErrorMsg("Insufficient players for this role configuration.");
          setTimeout(() => setErrorMsg(null), 3000);
          return;
       }
       updateSetting(role, Math.min(max, settings[role] + 1));
    };

    return (
      <div className="flex items-center justify-between py-1 border-b border-black/10">
        <span className="font-typewriter uppercase text-xs md:text-sm font-bold text-black/80">{label}</span>
        <div className="flex items-center gap-2 text-black">
           <button onClick={() => updateSetting(role, Math.max(min, settings[role] - 1))} disabled={!isHost || settings[role] <= min} className="w-5 h-5 border border-black/50 hover:bg-black/10 flex items-center justify-center font-bold bg-white/50 disabled:opacity-40">-</button>
           <span className="font-typewriter font-black text-sm w-4 text-center">{settings[role]}</span>
           <button onClick={handleAdd} disabled={!isHost || settings[role] >= max} className="w-5 h-5 border border-black/50 hover:bg-black/10 flex items-center justify-center font-bold bg-white/50 disabled:opacity-40">+</button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen desk-day flex items-center justify-center p-2 sm:p-4 lg:p-8 selection:bg-black selection:text-white overflow-x-hidden relative">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 sm:top-8 sm:left-8 z-50 flex items-center gap-2 text-white/60 hover:text-white font-typewriter font-bold uppercase tracking-widest transition-all hover:-translate-x-1 drop-shadow-md"
      >
        <ArrowLeft size={24} />
        <span className="hidden sm:inline">Abort Mission</span>
      </button>

      {/* Background Decor */}
      <div className="fixed top-20 right-20 w-64 h-64 border-[12px] border-[#3e2515] rounded-full opacity-[0.15] mix-blend-multiply pointer-events-none filter blur-[2px]" style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }} />

      {/* Main Folder Container (Single Block) */}
      <div className="max-w-7xl w-full bg-[#d1bfae] shadow-[10px_10px_30px_rgba(0,0,0,0.8)] rounded-xl flex flex-col xl:flex-row relative z-10 border border-[#a89683] mt-12 sm:mt-8 xl:mt-0" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05), rgba(0,0,0,0.05))' }}>
        
        {/* Error Message Toast */}
        {errorMsg && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-900 text-white font-typewriter font-bold uppercase tracking-widest px-6 py-3 border-2 border-black shadow-lg animate-in fade-in slide-in-from-top-4">
            {errorMsg}
          </div>
        )}
        {/* ================= LEFT FLAP ================= */}
        <div className="flex-1 p-6 md:p-10 relative flex flex-col xl:border-r-2 xl:border-black/10 xl:shadow-[inset_-10px_0_20px_rgba(0,0,0,0.05)] min-h-[500px]">
          
          <div className="absolute top-6 left-6 stamp stamp-red text-xl opacity-60 pointer-events-none z-10">
            PRE-OP PLANNING
          </div>
          {isBotMode && (
             <div className="absolute top-20 left-6 stamp stamp-black text-lg -rotate-6 opacity-50 pointer-events-none z-10">
               BOTS ENABLED
             </div>
          )}

          <div className="mt-8 md:mt-12 border-b-2 border-black/20 pb-4 mb-6">
            <h1 className="font-heading text-5xl md:text-6xl font-black text-[#2b2b2b] tracking-tighter mb-1 drop-shadow-sm leading-none">Briefing Room</h1>
            <p className="font-typewriter text-black/60 font-bold text-xs tracking-widest uppercase mt-2">Gathering Intelligence // Awaiting Operatives</p>
          </div>

          {/* Suspects Paper */}
          <div className="bg-[#f4ebd8] p-5 md:p-8 shadow-md border border-black/10 relative flex-1 flex flex-col rounded-sm min-h-[500px] lg:h-[750px]" style={{ boxShadow: '2px 3px 10px rgba(0,0,0,0.2), inset 0 0 20px rgba(150, 120, 90, 0.05)' }}>
            <div className="absolute -top-3 left-8 text-zinc-500/80 rotate-12 drop-shadow-sm">
              <Paperclip size={32} />
            </div>

            <h2 className="font-typewriter font-black text-xl text-black uppercase border-b-2 border-black/10 pb-3 mb-4 flex items-center gap-2">
              <Users size={24} className="text-black/60" /> Suspect List ({players.length})
            </h2>

            <div className="flex-1 relative overflow-y-auto pr-2 custom-scrollbar">
              {players.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center font-typewriter font-bold text-black/40 text-sm uppercase tracking-widest animate-pulse">
                  Loading operatives...
                </div>
              ) : (
                <ul className="grid grid-cols-1 gap-3">
                  {players.filter(Boolean).map((p) => (
                    <li key={p.id} className="flex items-center gap-4 p-2 bg-white/40 border border-black/5 shadow-sm rounded-sm">
                      <div className="w-10 h-10 rounded-full border-[2px] border-black flex flex-shrink-0 items-center justify-center text-lg font-typewriter font-bold shadow-inner bg-white/70 text-black">
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-handwriting text-2xl text-black truncate leading-none pt-1">{p.name}</span>
                        <div className="flex gap-2 mt-1">
                          {p.id === playerId && <span className="font-typewriter text-[10px] font-bold uppercase text-white bg-red-800 px-1 rounded shadow-sm">You</span>}
                          {players[0]?.id === p.id && <span className="font-typewriter text-[10px] font-bold uppercase text-white bg-black px-1 rounded shadow-sm">Host</span>}
                          {p.isReady ? (
                            <span className="font-typewriter text-[10px] font-bold uppercase text-green-900 bg-green-200 px-1 rounded shadow-sm">Ready</span>
                          ) : (
                            <span className="font-typewriter text-[10px] font-bold uppercase text-red-900 bg-red-200 px-1 rounded shadow-sm">Not Ready</span>
                          )}
                        </div>
                      </div>
                      {isHost && p.id !== playerId && (
                          <button onClick={() => socket?.emit('remove_player', { roomId: id, targetId: p.id })} className="ml-auto p-1.5 text-black/40 hover:text-red-700 hover:bg-red-100/50 rounded-sm transition-colors" title="Remove Operative">
                              <X size={20} />
                          </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              
              {isBotMode && isHost && (
                 <button onClick={handleAddBot} className="w-full mt-4 border-2 border-dashed border-black/30 text-black/60 font-typewriter font-bold py-2 hover:border-black hover:text-black hover:bg-black/5 transition-all flex items-center justify-center gap-2 rounded-sm cursor-pointer active:scale-[0.98]">
                    <UserPlus size={18} /> Requisition Bot Operative
                 </button>
              )}
            </div>
          </div>
        </div>
        
        {/* ================= FOLDER SPINE ================= */}
        <div className="hidden xl:block w-12 bg-[#b3a190] shadow-[inset_0_0_15px_rgba(0,0,0,0.4)] relative z-0 border-x border-black/20">
           <div className="absolute inset-y-0 left-1/2 w-px bg-black/10" />
        </div>

        {/* ================= RIGHT FLAP ================= */}
        <div className="flex-1 p-6 md:p-10 relative flex flex-col xl:border-l-2 xl:border-white/20 xl:shadow-[inset_10px_0_20px_rgba(0,0,0,0.02)] min-h-[500px]">
          
          {/* Room Code Tag */}
          <div className="absolute top-4 right-4 md:top-8 md:right-8 z-30 transform rotate-2">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3 bg-yellow-500/50 rotate-[-3deg] shadow-sm mix-blend-multiply" />
            <div className="bg-[#f4ebd8] p-3 shadow-md border border-black/10 flex flex-col items-center">
              <span className="font-typewriter text-[9px] font-black uppercase tracking-widest text-black/60 mb-1">Room Code</span>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-3xl tracking-widest text-black leading-none">{id}</span>
                <button 
                  className="p-1 border border-black bg-transparent text-black hover:bg-black hover:text-white transition-colors"
                  onClick={() => navigator.clipboard.writeText(id || '')}
                  title="Copy Code"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="h-24 md:h-20" /> {/* Spacer for Room Code Tag */}

          {/* Settings Paper */}
          <div className="bg-[#f4ebd8] p-5 md:p-8 relative flex-1 flex flex-col mb-6 rounded-sm min-h-[500px] lg:h-[750px]" style={{ boxShadow: '2px 3px 10px rgba(0,0,0,0.2), inset 0 0 20px rgba(150, 120, 90, 0.05)' }}>
            <div className="absolute -top-3 right-8 text-zinc-500/80 -rotate-[30deg] drop-shadow-sm">
              <Paperclip size={32} />
            </div>

            <h2 className="font-typewriter font-black text-xl text-black uppercase border-b-2 border-black/10 pb-3 mb-4 flex items-center gap-2">
              <Settings size={24} className="text-black/60" /> Operation Parameters
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 overflow-y-auto pr-2 custom-scrollbar">
              
              {/* Role Distribution Section */}
              <div className="flex flex-col gap-1 col-span-1 md:col-span-2 mb-2 bg-black/5 p-3 border border-black/10">
                <div className="text-black/70 font-black uppercase tracking-widest text-[10px] font-typewriter border-b border-black/10 pb-1 mb-2">Role Distribution</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                   <RoleCounter role="mafia" label="Mafia" min={1} />
                   <div className="flex items-center justify-between py-1 border-b border-black/10">
                      <span className="font-typewriter uppercase text-xs md:text-sm font-bold text-black/80">Villager</span>
                      <div className="flex items-center gap-2 text-black">
                         <span className="font-typewriter font-black text-sm w-4 text-center">
                            {Math.max(0, players.length - ((settings.mafia||0) + (settings.doctor||0) + (settings.detective||0) + (settings.jester||0)))}
                         </span>
                      </div>
                   </div>
                   <RoleCounter role="doctor" label="Doctor" />
                   <RoleCounter role="detective" label="Detective" />
                   <RoleCounter role="jester" label="Jester" max={1} />
                </div>
              </div>

              {/* Time & Flow Settings */}
              <div className="flex flex-col">
                <CustomSelect 
                  label="Discussion Time" 
                  value={settings.discussionTime} 
                  onChange={(e: any) => updateSetting('discussionTime', e.target.value)} 
                  disabled={!isHost}
                  options={[
                    { value: '1m', label: '1 Minute' },
                    { value: '2m', label: '2 Minutes' },
                    { value: '3m', label: '3 Minutes' },
                    { value: '5m', label: '5 Minutes' }
                  ]}
                />
                <CustomSelect 
                  label="Night Phase Time" 
                  value={settings.nightTime} 
                  onChange={(e: any) => updateSetting('nightTime', e.target.value)} 
                  disabled={!isHost}
                  options={[
                    { value: '15s', label: '15 Seconds' },
                    { value: '30s', label: '30 Seconds' },
                    { value: '45s', label: '45 Seconds' },
                    { value: '60s', label: '60 Seconds' }
                  ]}
                />
                <CustomSelect 
                  label="Night Phase Order" 
                  value={settings.nightOrder} 
                  onChange={(e: any) => updateSetting('nightOrder', e.target.value)} 
                  disabled={!isHost}
                  options={[
                    { value: 'doc-det-maf', label: 'Doc → Det → Mafia' },
                    { value: 'det-doc-maf', label: 'Det → Doc → Mafia' }
                  ]}
                />
                <CustomSelect 
                  label="Jester Win Rule" 
                  value={settings.jesterWin} 
                  onChange={(e: any) => updateSetting('jesterWin', e.target.value)} 
                  disabled={!isHost}
                  options={[
                    { value: 'end', label: 'Game Ends Immediately' },
                    { value: 'continue', label: 'Solo Win (Continues)' }
                  ]}
                />
              </div>

              {/* Rules & Toggles */}
              <div className="flex flex-col">
                <CustomSelect 
                  label="Tie Vote Resolution" 
                  value={settings.tieVote} 
                  onChange={(e: any) => updateSetting('tieVote', e.target.value)} 
                  disabled={!isHost}
                  options={[
                    { value: 'nothing', label: 'Nothing Happens' },
                    { value: 'random', label: 'Random Death' },
                    { value: 'coin', label: 'Coin Flip' }
                  ]}
                />
                <CustomSelect 
                  label="Detective Sees" 
                  value={settings.detectiveSees} 
                  onChange={(e: any) => updateSetting('detectiveSees', e.target.value)} 
                  disabled={!isHost}
                  options={[
                    { value: 'alignment', label: 'Alignment (Mafia/Town)' },
                    { value: 'exact', label: 'Exact Role' }
                  ]}
                />
                
                <div className="mt-2 flex flex-col gap-1">
                  <CustomCheckbox label="Reveal on Death" checked={settings.revealOnDeath} onChange={(e: any) => updateSetting('revealOnDeath', e.target.checked)} disabled={!isHost} />
                  <CustomCheckbox label="Doctor Self-Heal" checked={settings.doctorSelfHeal} onChange={(e: any) => updateSetting('doctorSelfHeal', e.target.checked)} disabled={!isHost} />
                  <CustomCheckbox label="Anonymous Voting" checked={settings.anonVoting} onChange={(e: any) => updateSetting('anonVoting', e.target.checked)} disabled={!isHost} />
                  <CustomCheckbox label="Allow Skip Vote" checked={settings.skipVote} onChange={(e: any) => updateSetting('skipVote', e.target.checked)} disabled={!isHost} />
                </div>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex flex-col sm:flex-row justify-center shrink-0 gap-4 w-full">
            <button 
              onClick={handleToggleReady}
              className={`border-2 border-black py-3 px-8 font-typewriter font-black text-lg uppercase tracking-widest transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.8)] active:shadow-[1px_1px_0px_rgba(0,0,0,0.8)] active:translate-y-1 active:translate-x-1 flex-1 ${currentPlayer?.isReady ? 'bg-green-700 text-white hover:bg-green-800' : 'bg-[#e5d5c5] text-black hover:bg-[#d4c3b3]'}`}
            >
              {currentPlayer?.isReady ? 'Ready for Operation' : 'Mark as Ready'}
            </button>

            {isHost ? (
                <button 
                  onClick={handleStartGame}
                  disabled={!allReady}
                  className={`border-2 border-black py-3 px-8 font-typewriter font-black text-lg uppercase tracking-widest transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.8)] active:shadow-[1px_1px_0px_rgba(0,0,0,0.8)] active:translate-y-1 active:translate-x-1 flex-1 flex items-center justify-center gap-3 ${allReady ? 'bg-[#8b0000] text-white hover:bg-red-900' : 'bg-gray-400 text-gray-700 cursor-not-allowed opacity-70'}`}
                >
                  <Play size={20} />
                  Commence Operation
                </button>
            ) : (
                <div className="text-center font-typewriter text-black/70 font-black text-sm uppercase tracking-widest bg-white/40 py-3 px-6 border border-black/20 shadow-inner flex-1 flex items-center justify-center">
                   Awaiting Commander...
                </div>
            )}
          </div>

        </div>

      </div>
      
      {/* Scrollbar styles for the paper */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.3); }
      `}</style>
    </div>
  );
}


``

## Game.css

``css
.game-wrapper {
  min-height: 100vh;
  transition: background-color 1s ease;
}

.game-wrapper.night-phase {
  background: #07051a; /* Very dark */
}

.game-wrapper.day-phase {
  background: var(--bg-gradient); /* Normal dark */
}

.game-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
}

.phase-indicator {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-night { color: #8c9eff; }
.icon-day { color: #ffd700; }
.icon-success { color: var(--success-color); }

.timer {
  font-family: monospace;
  font-size: 1.25rem;
  color: var(--primary-color);
  font-weight: bold;
}

.role-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.1);
}
.role-badge.doctor { color: var(--success-color); border: 1px solid var(--success-color); }

.game-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.action-panel, .discussion-panel {
  width: 100%;
  max-width: 600px;
  text-align: center;
}

.action-icon {
  margin-bottom: 1rem;
}

.action-panel h2, .discussion-panel h2 {
  margin-bottom: 0.5rem;
}

.action-panel p, .discussion-panel p {
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.player-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.player-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.player-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--success-color);
  transform: translateY(-2px);
}

.voting-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
}

.vote-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 8px;
}

.vote-row.dead {
  opacity: 0.5;
  filter: grayscale(100%);
}

.player-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.line-through {
  text-decoration: line-through;
}

.vote-btn {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.game-footer {
  padding: 1rem 0;
  display: flex;
  justify-content: center;
}

``

## Game.tsx

``tsx
import { useParams } from 'react-router-dom';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useGameState } from '../hooks/useGameState';
import GameDesktop from './GameDesktop';
import MobileGame from './mobile/MobileGame';
import EdoGame from './edo/EdoGame';
import EdoMobileGame from './edo-mobile/EdoMobileGame';

export default function Game() {
  const { id } = useParams();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const gameStateData = useGameState(id);

  const theme = localStorage.getItem('mafia_theme') || 'edo';

  if (isMobile) {
    if (theme === 'edo') return <EdoMobileGame gameStateData={gameStateData} />;
    return <MobileGame gameStateData={gameStateData} />;
  }

  if (theme === 'edo') {
    return <EdoGame gameStateData={gameStateData} />;
  }

  return <GameDesktop gameStateData={gameStateData} />;
}

``

## GameDesktop.tsx

``tsx
// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Skull, Shield, CheckCircle, 
  Settings, VenetianMask, Coffee, Clock,
  Eye, Flame, Heart, FileSignature
} from 'lucide-react';



const ICON_MAP = { Flame, Eye, Heart, Search, VenetianMask, Skull, Shield };

export default function GameDesktop({ gameStateData }: { gameStateData: any }) {
  const navigate = useNavigate();
  const { 
    room, playerId, privateReveal, setPrivateReveal, 
    startGame, handleStampAction: doStampAction, continueReport, returnToLobby
  } = gameStateData;

  const [selectedTarget, setSelectedTarget] = useState<string | number | null>(null);
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

  if (!room) return <div className="min-h-screen desk-day flex-center text-white">Loading...</div>;

  const { state: gameState, players, notes, revealData, winner, transitionText, votes, nightActions } = room;
  const activePlayer = players.find((p: any) => String(p.id) === String(playerId)) || players[0];
  const isHost = players.length > 0 && String(players[0].id) === String(playerId);

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
          <div className="bg-white/50 p-6 border-2 border-black/20 rounded shadow-inner text-center">
            <h2 className="font-bold text-lg mb-2 opacity-60">YOUR ASSIGNED IDENTITY</h2>
            <div className="font-heading text-4xl md:text-5xl font-black uppercase tracking-widest mb-4" style={{ color: activePlayer?.role?.ink || '#000' }}>
              {activePlayer?.role?.name || 'CLASSIFIED'}
            </div>
            <p className="font-typewriter font-bold text-lg max-w-lg mx-auto leading-relaxed">
              {activePlayer?.role?.desc || 'Await further instructions.'}
            </p>
          </div>

          <div className="bg-black/5 p-4 border border-black/10 rounded my-8">
            <h3 className="font-bold mb-3 uppercase border-b border-black/10 pb-2">Suspect Roster ({players.length})</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
               {players.filter(Boolean).map(p => (
                 <div key={p.id} className="flex justify-between items-center border-b border-black/5 pb-1">
                   <span className={p.id === playerId ? 'font-bold' : ''}>{p.name} {p.id === playerId ? '(You)' : ''}</span>
                   <span className="text-zinc-500 text-xs font-bold" style={{ color: (p.id === playerId || (activePlayer?.role?.id === 'mafia' && p.role?.id === 'mafia')) ? p.role?.ink : '' }}>
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

        {rData.victim && isPrivate && (
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
      actionLabel = selectedTarget === 'skip' ? "Skip" : "Vote";
    }

    return (
      <div className={`h-screen max-h-screen ${bgClass} flex flex-col relative overflow-hidden text-zinc-200 transition-colors duration-1000`}>
        
        {/* HUD */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 flex gap-4 items-start z-50 pointer-events-none scale-90 md:scale-100 origin-top-right">
           <div className="flex flex-col gap-1 pointer-events-auto bg-black/80 p-3 border-2 border-zinc-600 shadow-md">
             <div className="flex items-center gap-2 text-white">
                <Clock size={16} />
                <span className="font-typewriter uppercase font-bold tracking-widest">{gameState.replace('_', ' ')}</span>
             </div>
             <span className="text-xs font-typewriter text-zinc-400">
                {timeLeftStr ? `Time Left: ${timeLeftStr}` : `Time: ${isNight ? '02:41 AM' : '10:15 AM'} [DEBUG: ${room?.phaseEndTime}]`}
             </span>
           </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row relative z-10 pt-24 pb-12 px-6 md:px-16 max-w-[1600px] mx-auto w-full gap-8 md:gap-12 h-full overflow-hidden">
          
          <div className="w-full md:w-80 flex-shrink-0 flex flex-col transition-transform duration-700 transform origin-left relative z-20 h-[35vh] md:h-[65vh] md:my-auto md:ml-12 pb-4">
             <div className="absolute -top-3 left-0 w-full h-6 bg-zinc-800 rounded-t-lg z-10 flex justify-around px-4 border-t-2 border-zinc-900">
                {[...Array(12)].map((_, i) => <div key={i} className="w-2 h-8 bg-zinc-300 rounded-full shadow-md -mt-1 border-2 border-zinc-700" />)}
             </div>

             <div className="paper-texture flex-1 rounded-b-sm shadow-2xl flex flex-col overflow-hidden pt-6 border-r-2 border-b-2 border-black/20">
                <div className="text-center font-typewriter font-bold border-b border-blue-200/50 pb-2 mx-4 mt-2">
                  LOGS
                </div>

                <div className="flex-1 overflow-y-auto px-6 pt-[24px] pb-6 flex flex-col relative"
                     style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 18px, #93c5fd 18px, #93c5fd 19px, transparent 19px, transparent 24px)', backgroundAttachment: 'local' }}>
                  
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
             </div>
          </div>

           <div className="flex-1 relative overflow-y-auto pb-10 flex flex-col items-center">
             <div className="paper-texture px-8 py-3 mt-8 mb-4 rotate-[-1deg] shadow-[4px_4px_0px_rgba(0,0,0,0.8)] border-2 border-black relative z-30 flex-shrink-0">
               <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-red-800 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.8)]" />
               <span className="font-typewriter font-black text-xl text-black uppercase tracking-widest drop-shadow-sm">{instruction}</span>
             </div>
             <div className="flex-grow flex-shrink min-h-[4vh] md:min-h-[10vh]"></div>
             <div className="w-full flex flex-col items-center flex-shrink-0 pt-8 pb-8">

               <div className="flex flex-wrap justify-center gap-4 gap-y-12 md:gap-10 md:gap-y-16 max-w-5xl w-full relative z-20 flex-shrink-0 mt-8">
                {players.filter(Boolean).map(p => {
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
                      className={`polaroid flex flex-col items-center group text-black
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
                      
                      {(isMe || (p.isDead && room.settings?.revealOnDeath) || (activePlayer?.role.id === 'mafia' && p.role?.id === 'mafia') || gameState === 'game_over') && p.role && (
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
                  );
                })}
             </div>
             </div>

             <div className="flex-grow flex-shrink min-h-[4vh] md:min-h-[10vh]"></div>
             
             <div className="w-full flex flex-col items-center flex-shrink-0 mt-auto pb-4 relative z-40 min-h-[80px]">
              {gameState === 'day_discussion' && !activePlayer?.isDead && (
                 <div className="flex justify-center w-full absolute bottom-0 left-1/2 -translate-x-1/2">
                   <button 
                     disabled={room.skipDiscussionVotes?.includes(playerId)}
                     onClick={skipDiscussion}
                     className="px-6 py-2 bg-zinc-800 text-white font-typewriter uppercase tracking-widest text-sm md:text-base shadow-[4px_4px_0px_rgba(0,0,0,0.5)] hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed border-2 border-zinc-600 transition-colors active:translate-y-1 active:translate-x-1 active:shadow-[1px_1px_0px_rgba(0,0,0,0.5)]"
                   >
                     {room.skipDiscussionVotes?.includes(playerId) ? 'Waiting...' : 'Skip Discussion'}
                     {' '}
                     ({room.skipDiscussionVotes?.length || 0}/{players.filter((p: any) => !p.isDead && !p.isBot).length})
                   </button>
                 </div>
              )}

              {gameState === 'day_voting' && !activePlayer?.isDead && (
                 <div className="flex justify-center w-full absolute bottom-0 left-1/2 -translate-x-1/2">
                   <button 
                     onClick={() => setSelectedTarget('skip')}
                     className="px-6 py-2 bg-[#8b0000] text-white font-typewriter uppercase tracking-widest text-sm md:text-base shadow-[4px_4px_0px_rgba(0,0,0,0.5)] hover:bg-red-950 border-2 border-black transition-colors active:translate-y-1 active:translate-x-1 active:shadow-[1px_1px_0px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2"
                   >
                     Skip Vote {room.votes && Object.values(room.votes).filter(v => v === 'skip').length > 0 && !room.settings.anonVoting && `(${Object.values(room.votes).filter(v => v === 'skip').length})`}
                   </button>
                 </div>
              )}

               <div className={`transition-all duration-300 w-full max-w-md flex-shrink-0 absolute bottom-0 left-1/2 -translate-x-1/2 ${selectedTarget ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                 <div className="flex gap-4 w-full">
                   <button onClick={() => setSelectedTarget(null)} className="flex-1 py-3 border-[3px] border-black font-typewriter font-black text-black bg-white hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-[1px_1px_0px_rgba(0,0,0,1)] uppercase">
                     Cancel
                   </button>
                   <button 
                     onClick={handleStampAction}
                     className="flex-1 py-3 bg-[#8b0000] text-white border-[3px] border-[#8b0000] font-typewriter font-black uppercase tracking-widest hover:bg-red-950 hover:border-red-950 transition-all shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-[1px_1px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2"
                   >
                     <FileSignature size={20} />
                     {actionLabel}
                   </button>
                 </div>
               </div>
             </div>
          </div>
        </div>


        {activePlayer && activePlayer.role && (
            <div className="absolute top-4 left-2 md:top-auto md:left-auto md:bottom-12 md:right-12 paper-texture p-3 md:p-5 shadow-[4px_4px_0px_rgba(0,0,0,0.8)] rotate-2 z-40 border-2 border-black pointer-events-none scale-[0.8] md:scale-100 origin-top-left md:origin-bottom-right">
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

``

## GameMobile.tsx

``tsx
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
  const activePlayer = players.find((p: any) => String(p.id) === String(playerId)) || players[0];
  const isHost = players.length > 0 && String(players[0].id) === String(playerId);

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
               {players.filter(Boolean).map(p => (
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
                {players.filter(Boolean).map(p => {
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

``

## Home.tsx

``tsx

import { useMediaQuery } from '../hooks/useMediaQuery';
import DesktopHome from './DesktopHome';
import MobileHome from './mobile/MobileHome';
import EdoHome from './edo/EdoHome';
import EdoMobileHome from './edo-mobile/EdoMobileHome';

export default function Home() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const theme = localStorage.getItem('mafia_theme') || 'edo';

  if (isMobile) {
    if (theme === 'edo') return <EdoMobileHome />;
    return <MobileHome />;
  }

  if (theme === 'edo') {
    return <EdoHome />;
  }

  return <DesktopHome />;
}

``

## Lobby.tsx

``tsx

import { useMediaQuery } from '../hooks/useMediaQuery';
import DesktopLobby from './DesktopLobby';
import MobileLobby from './mobile/MobileLobby';
import EdoLobby from './edo/EdoLobby';
import EdoMobileLobby from './edo-mobile/EdoMobileLobby';

export default function Lobby() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const theme = localStorage.getItem('mafia_theme') || 'edo';

  if (isMobile) {
    if (theme === 'edo') return <EdoMobileLobby />;
    return <MobileLobby />;
  }

  if (theme === 'edo') {
    return <EdoLobby />;
  }

  return <DesktopLobby />;
}

``

## Reveal.css

``css
.reveal-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
}

.reveal-header {
  margin-bottom: 3rem;
}

.winner-icon {
  margin-bottom: 1rem;
  animation: bounce 2s infinite;
}

.winner-icon.town { color: var(--secondary-color); }
.winner-icon.mafia { color: var(--primary-color); }
.winner-icon.jester { color: var(--accent-color); }

.winner-title {
  font-size: 3.5rem;
  margin-bottom: 0.5rem;
}

.winner-title.town { color: var(--secondary-color); }
.winner-title.mafia { color: var(--primary-color); }
.winner-title.jester { color: var(--accent-color); }

.reveal-card {
  width: 100%;
  max-width: 800px;
  text-align: left;
}

.reveal-card h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.reveal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.reveal-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 12px;
  border-left: 4px solid transparent;
}

.reveal-item.dead {
  opacity: 0.5;
  filter: grayscale(80%);
}

.player-details {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.player-details .name {
  font-weight: bold;
  font-size: 1.1rem;
}

.player-details .role {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.player-details .role.mafia { color: var(--primary-color); }
.player-details .role.villager { color: var(--text-main); }
.player-details .role.doctor { color: var(--success-color); }
.player-details .role.detective { color: var(--secondary-color); }
.player-details .role.jester { color: var(--accent-color); }

.status {
  font-family: monospace;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.reveal-footer {
  margin-top: 3rem;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-20px); }
  60% { transform: translateY(-10px); }
}

``

## Reveal.tsx

``tsx
import { useNavigate } from 'react-router-dom';
import { Trophy, ArrowLeft } from 'lucide-react';
import './Reveal.css';

export default function Reveal() {
  const navigate = useNavigate();

  // Mock end game data
  const winnerTeam: string = 'Town'; // 'Mafia', 'Town', 'Jester'
  const players = [
    { id: 1, name: 'You (Host)', role: 'Doctor', team: 'Town', status: 'Alive' },
    { id: 2, name: 'Alice', role: 'Mafia', team: 'Mafia', status: 'Dead' },
    { id: 3, name: 'Bob', role: 'Villager', team: 'Town', status: 'Alive' },
    { id: 4, name: 'Charlie', role: 'Jester', team: 'Solo', status: 'Dead' },
    { id: 5, name: 'Diana', role: 'Detective', team: 'Town', status: 'Alive' },
  ];

  const handleReturn = () => {
    navigate('/');
  };

  return (
    <div className="container reveal-container animate-fade-in">
      <div className="reveal-header">
        <Trophy size={64} className={`winner-icon ${winnerTeam.toLowerCase()}`} />
        <h1 className={`winner-title ${winnerTeam.toLowerCase()}`}>
          {winnerTeam === 'Town' && 'The Town Survived!'}
          {winnerTeam === 'Mafia' && 'The Mafia Took Over!'}
          {winnerTeam === 'Jester' && 'The Jester Fooled Everyone!'}
        </h1>
        <p>The truth has finally come to light.</p>
      </div>

      <div className="glass-card reveal-card">
        <h2>Final Roles</h2>
        <div className="reveal-grid">
          {players.filter(Boolean).map(p => (
            <div key={p.id} className={`reveal-item ${p.status === 'Dead' ? 'dead' : ''}`}>
              <div className="avatar">{p.name.charAt(0)}</div>
              <div className="player-details">
                <span className="name">{p.name}</span>
                <span className={`role ${p.role.toLowerCase()}`}>{p.role}</span>
              </div>
              <div className="status">{p.status}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="reveal-footer">
        <button className="btn btn-secondary" onClick={handleReturn}>
          <ArrowLeft size={20} />
          Return to Home
        </button>
      </div>
    </div>
  );
}


``

