import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Settings, Play, Users, Copy, CheckSquare, Square, ArrowLeft, UserPlus, X } from 'lucide-react';
import { socket } from '../../socket';
import './Edo.css';

export default function EdoLobby() {
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
    
    socket.emit('join_room', { roomId: id, playerName, isBotMode });

    const onPlayerId = (id: number) => {
      setPlayerId(id);
      localStorage.setItem('mafia_playerId', id.toString());
    };

    const onRoomUpdate = (room: any) => {
      setPlayers(room.players);
      setSettings(room.settings);
      
      if (room.state !== 'lobby') {
         navigate(`/game/${id}`);
      }
    };

    socket.on('player_id', onPlayerId);
    socket.on('room_update', onRoomUpdate);

    return () => {
      socket.off('player_id', onPlayerId);
      socket.off('room_update', onRoomUpdate);
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
      <label className="text-gray-400 uppercase tracking-widest font-bold text-xs">{label}</label>
      <div className="relative">
        <select 
          value={value} 
          onChange={onChange} 
          disabled={disabled}
          className="appearance-none w-full bg-[#111] border border-gray-700 py-2 pl-3 pr-8 outline-none font-serif text-sm text-gray-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:border-red-500"
        >
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value} className="bg-[#111] text-gray-200">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">
          ▼
        </div>
      </div>
    </div>
  );

  const CustomCheckbox = ({ label, checked, onChange, disabled }: any) => (
    <label className={`flex items-center cursor-pointer gap-3 group mb-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <input type="checkbox" className="hidden" checked={checked} onChange={onChange} disabled={disabled} />
      <div className="text-gray-600 group-hover:text-red-500 transition-colors">
         {checked ? <CheckSquare size={20} className="text-red-500" /> : <Square size={20} />}
      </div>
      <span className="text-gray-300 uppercase tracking-wider text-xs font-bold group-hover:text-white transition-colors leading-tight">
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
      <div className="flex items-center justify-between py-2 border-b border-gray-800">
        <span className="uppercase text-xs font-bold text-gray-300 tracking-widest">{label}</span>
        <div className="flex items-center gap-3 text-gray-200">
           <button onClick={() => updateSetting(role, Math.max(min, settings[role] - 1))} disabled={!isHost || settings[role] <= min} className="w-6 h-6 border border-gray-600 hover:border-red-500 flex items-center justify-center font-bold bg-[#111] disabled:opacity-40 transition-colors">-</button>
           <span className="font-serif font-bold text-base w-4 text-center">{settings[role]}</span>
           <button onClick={handleAdd} disabled={!isHost || settings[role] >= max} className="w-6 h-6 border border-gray-600 hover:border-red-500 flex items-center justify-center font-bold bg-[#111] disabled:opacity-40 transition-colors">+</button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[100dvh] edo-bg-night edo-theme flex items-center justify-center p-4 lg:p-8 overflow-x-hidden relative text-gray-200">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      
      {/* Particles */}
      <div id="particles" className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(20)].map((_, i) => (
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
      </div>

      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 sm:top-8 sm:left-8 z-50 flex items-center gap-2 text-gray-500 hover:text-red-500 font-bold text-xs uppercase tracking-widest transition-all hover:-translate-x-1"
      >
        <ArrowLeft size={18} />
        <span className="hidden sm:inline">Leave Clan</span>
      </button>

      {/* Main Container */}
      <div className="max-w-7xl w-full flex flex-col xl:flex-row relative z-10 mt-12 xl:mt-0 gap-6 lg:gap-10">
        
        {/* Error Message Toast */}
        {errorMsg && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 bg-red-900/90 text-white font-bold uppercase tracking-widest px-6 py-3 border border-red-500 shadow-[0_0_15px_rgba(139,0,0,0.5)] animate-in fade-in slide-in-from-top-4 backdrop-blur-sm text-sm">
            {errorMsg}
          </div>
        )}

        {/* ================= LEFT FLAP (PLAYERS) ================= */}
        <div className="flex-1 p-6 lg:p-10 relative flex flex-col bg-black/40 backdrop-blur-md border border-gray-800 shadow-2xl min-h-[500px]">
          
          <div className="border-b border-gray-800 pb-4 mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-widest mb-1 drop-shadow-sm uppercase">Clan Gathering</h1>
            <p className="text-gray-500 font-bold text-xs tracking-widest uppercase mt-2">Awaiting Members...</p>
          </div>

          <div className="relative flex-1 flex flex-col">

            <h2 className="font-bold text-lg text-red-500 uppercase border-b border-gray-800 pb-3 mb-4 flex items-center gap-2 tracking-widest">
              <Users size={20} className="text-red-500" /> Members ({players.length})
            </h2>

            <div className="flex-1 relative overflow-y-auto pr-2">
              {players.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center font-bold text-gray-600 text-xs uppercase tracking-widest animate-pulse">
                  Waiting for arrivals...
                </div>
              ) : (
                <ul className="grid grid-cols-1 gap-3">
                  {players.map((p) => (
                    <li key={p.id} className="flex items-center gap-4 p-3 bg-gray-900/50 border border-gray-800 shadow-sm transition-colors hover:border-gray-600">
                      <div className="w-10 h-10 flex flex-shrink-0 items-center justify-center text-lg font-serif font-bold bg-[#111] border border-gray-700 text-gray-300">
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-serif text-lg text-gray-200 truncate leading-none">{p.name}</span>
                        <div className="flex gap-2 mt-1.5">
                          {p.id === playerId && <span className="text-[9px] font-bold uppercase text-white bg-red-900 px-1.5 py-0.5 tracking-wider">You</span>}
                          {players[0]?.id === p.id && <span className="text-[9px] font-bold uppercase text-gray-300 bg-gray-700 px-1.5 py-0.5 tracking-wider">Host</span>}
                          {p.isReady ? (
                            <span className="text-[9px] font-bold uppercase text-green-400 border border-green-900 px-1.5 py-0.5 tracking-wider">Ready</span>
                          ) : (
                            <span className="text-[9px] font-bold uppercase text-red-400 border border-red-900 px-1.5 py-0.5 tracking-wider">Not Ready</span>
                          )}
                        </div>
                      </div>
                      {isHost && p.id !== playerId && (
                          <button onClick={() => socket?.emit('remove_player', { roomId: id, targetId: p.id })} className="ml-auto p-1.5 text-gray-600 hover:text-red-500 transition-colors" title="Remove Member">
                              <X size={20} />
                          </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              
              {isBotMode && isHost && (
                 <button onClick={handleAddBot} className="w-full mt-4 border border-dashed border-gray-700 text-gray-400 font-bold text-xs uppercase tracking-widest py-3 hover:bg-white/5 hover:text-white hover:border-gray-500 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
                    <UserPlus size={16} /> Recruit AI Yakuza
                 </button>
              )}
            </div>
          </div>
        </div>
        
        {/* ================= RIGHT FLAP (SETTINGS) ================= */}
        <div className="flex-1 p-6 lg:p-10 relative flex flex-col bg-black/40 backdrop-blur-md border border-gray-800 shadow-2xl min-h-[500px]">
          
          <div className="absolute top-6 right-6 lg:top-8 lg:right-8 z-30">
            <div className="bg-[#111] p-3 border border-gray-700 flex flex-col items-center">
              <span className="text-[9px] font-bold uppercase tracking-widest text-red-500 mb-1">Scroll Code</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl tracking-widest text-white font-serif leading-none">{id}</span>
                <button 
                  className="p-1 text-gray-500 hover:text-white transition-colors"
                  onClick={() => navigator.clipboard.writeText(id || '')}
                  title="Copy Code"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="h-20 lg:h-16" />

          <div className="relative flex-1 flex flex-col mb-6">
            <h2 className="font-bold text-lg text-red-500 uppercase border-b border-gray-800 pb-3 mb-4 flex items-center gap-2 tracking-widest">
              <Settings size={20} className="text-red-500" /> Laws of Edo
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 overflow-y-auto pr-2 custom-scrollbar">
              
              <div className="flex flex-col gap-1 col-span-1 md:col-span-2 mb-4 bg-white/5 p-4 border border-gray-800">
                <div className="text-red-500 font-bold uppercase tracking-widest text-[10px] border-b border-gray-800 pb-2 mb-2">Role Distribution</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                   <RoleCounter role="mafia" label="Yakuza" min={1} />
                   <div className="flex items-center justify-between py-2 border-b border-gray-800">
                      <span className="uppercase text-xs font-bold text-gray-300 tracking-widest">Heimin</span>
                      <div className="flex items-center gap-2 text-gray-200">
                         <span className="font-serif font-bold text-base w-4 text-center">
                            {Math.max(0, players.length - ((settings.mafia||0) + (settings.doctor||0) + (settings.detective||0) + (settings.jester||0)))}
                         </span>
                      </div>
                   </div>
                   <RoleCounter role="doctor" label="Sohei" />
                   <RoleCounter role="detective" label="Samurai" />
                   <RoleCounter role="jester" label="Kitsune" max={1} />
                </div>
              </div>

              <CustomSelect 
                label="Day Phase Time" 
                value={settings.discussionTime} 
                onChange={(e: any) => updateSetting('discussionTime', e.target.value)} 
                disabled={!isHost}
                options={[
                  { value: 'unlimited', label: 'Unlimited' },
                  { value: '1m', label: '1 Minute' },
                  { value: '3m', label: '3 Minutes' },
                  { value: '5m', label: '5 Minutes' },
                  { value: '10m', label: '10 Minutes' }
                ]} 
              />
              <CustomSelect 
                label="Night Phase Time" 
                value={settings.nightTime} 
                onChange={(e: any) => updateSetting('nightTime', e.target.value)} 
                disabled={!isHost}
                options={[
                  { value: 'unlimited', label: 'Unlimited' },
                  { value: '30s', label: '30 Seconds' },
                  { value: '1m', label: '1 Minute' },
                  { value: '2m', label: '2 Minutes' }
                ]} 
              />
              <CustomSelect 
                label="Action Order" 
                value={settings.nightOrder} 
                onChange={(e: any) => updateSetting('nightOrder', e.target.value)} 
                disabled={!isHost}
                options={[
                  { value: 'doc-det-maf', label: 'Sohei → Samurai → Yakuza' },
                  { value: 'maf-doc-det', label: 'Yakuza → Sohei → Samurai' },
                  { value: 'det-doc-maf', label: 'Samurai → Sohei → Yakuza' }
                ]} 
              />
              <CustomSelect 
                label="Samurai Discovers" 
                value={settings.detectiveSees} 
                onChange={(e: any) => updateSetting('detectiveSees', e.target.value)} 
                disabled={!isHost}
                options={[
                  { value: 'alignment', label: 'Alignment' },
                  { value: 'exact', label: 'Exact Role' }
                ]} 
              />
              <CustomSelect 
                label="Tied Votes" 
                value={settings.tieVote} 
                onChange={(e: any) => updateSetting('tieVote', e.target.value)} 
                disabled={!isHost}
                options={[
                  { value: 'nothing', label: 'No Elimination' },
                  { value: 'random', label: 'Random' }
                ]} 
              />
              <CustomSelect 
                label="Kitsune Win Condition" 
                value={settings.jesterWin} 
                onChange={(e: any) => updateSetting('jesterWin', e.target.value)} 
                disabled={!isHost}
                options={[
                  { value: 'end', label: 'Game Ends' },
                  { value: 'continue', label: 'Game Continues' }
                ]} 
              />

              <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mt-2 pt-4 border-t border-gray-800">
                 <CustomCheckbox label="Reveal True Role on Death" checked={settings.revealOnDeath} onChange={(e: any) => updateSetting('revealOnDeath', e.target.checked)} disabled={!isHost} />
                 <CustomCheckbox label="Sohei Can Self-Protect" checked={settings.doctorSelfHeal} onChange={(e: any) => updateSetting('doctorSelfHeal', e.target.checked)} disabled={!isHost} />
                 <CustomCheckbox label="Anonymous Voting" checked={settings.anonVoting} onChange={(e: any) => updateSetting('anonVoting', e.target.checked)} disabled={!isHost} />
                 <CustomCheckbox label="Allow Skipping Vote" checked={settings.skipVote} onChange={(e: any) => updateSetting('skipVote', e.target.checked)} disabled={!isHost} />
              </div>

            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
            <button 
              onClick={handleToggleReady}
              className={`w-full py-4 border font-bold text-xl uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                currentPlayer?.isReady 
                  ? 'bg-green-900/50 border-green-500 text-white hover:bg-green-800/80 shadow-[0_0_15px_rgba(34,197,94,0.2)]' 
                  : 'bg-white/5 border-gray-600 text-gray-300 hover:bg-white/10'
              }`}
            >
              <CheckSquare size={24} />
              {currentPlayer?.isReady ? "Ready to Serve" : "Declare Ready"}
            </button>

            {isHost ? (
              <button 
                onClick={handleStartGame}
                disabled={players.length < 4 || totalSpecifiedRoles > players.length || !allReady}
                className="w-full bg-red-900/80 border border-red-500 text-white py-4 font-bold text-xl uppercase tracking-widest hover:bg-red-800 transition-all shadow-[0_0_15px_rgba(139,0,0,0.3)] disabled:opacity-30 disabled:hover:bg-red-900/80 flex items-center justify-center gap-3"
              >
                <Play size={24} />
                {players.length < 4 ? `Need ${4 - players.length} more` : 
                 !allReady ? "Waiting for members" :
                 totalSpecifiedRoles > players.length ? "Too many roles" : "Begin Tale"}
              </button>
            ) : (
              <div className="w-full bg-white/5 border border-gray-800 text-gray-500 py-4 font-bold text-sm uppercase tracking-widest flex items-center justify-center">
                Awaiting Clan Leader...
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
