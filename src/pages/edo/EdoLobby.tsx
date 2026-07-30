import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Settings, Play, Users, Copy, CheckSquare, Square, ArrowLeft, UserPlus, X } from 'lucide-react';
import { socket } from '../../socket';
import { useSoundscape } from '../../hooks/useSoundscape';
import { MagneticCursor } from '../../components/MagneticCursor';
import { ScrambleText } from '../../components/ScrambleText';
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
  const { playHover, playThud, playSlash, playWhoosh, initAudio } = useSoundscape();
  const lobbyContainerRef = React.useRef<HTMLDivElement>(null);

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

      // Sync theme from host
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
    playSlash();
    socket.emit('start_game', { roomId: id });
  };

  const handleAddBot = () => {
    playWhoosh();
    socket.emit('add_bot', { roomId: id });
  };

  const handleToggleReady = () => {
    playWhoosh();
    socket.emit('toggle_ready', { roomId: id, playerId });
  };

  const isHost = players.length > 0 && players[0].id === playerId;
  const currentPlayer = players.find(p => p.id === playerId);
  const allReady = players.length > 0 && players.every(p => p.isReady);

  const CustomSelect = ({ label, value, onChange, options, disabled }: any) => (
    <div className="flex flex-col gap-1.5 mb-2">
      <label className="text-gray-500 uppercase tracking-widest font-bold text-xs">{label}</label>
      <div className="relative">
        <select 
          value={value} 
          onChange={onChange} 
          disabled={disabled}
          className="appearance-none w-full bg-black/40 border border-[var(--glass-border)] rounded-md py-2.5 pl-3 pr-8 outline-none text-sm text-gray-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
        >
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value} className="bg-[#111] text-gray-200">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-sm">
          ▼
        </div>
      </div>
    </div>
  );

  const CustomCheckbox = ({ label, checked, onChange, disabled }: any) => (
    <label className={`flex items-center cursor-pointer gap-3 group mb-1 ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
      <input type="checkbox" className="hidden" checked={checked} onChange={onChange} disabled={disabled} />
      <div className={`transition-colors ${checked ? 'text-[var(--gold)]' : 'text-gray-600 group-hover:text-gray-400'}`}>
         {checked ? <CheckSquare size={18} /> : <Square size={18} />}
      </div>
      <span className={`uppercase tracking-wider text-xs font-bold transition-colors leading-tight ${checked ? 'text-gray-200' : 'text-gray-500 group-hover:text-gray-300'}`}>
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
      <div className="flex items-center justify-between py-2 border-b border-gray-800/50">
        <span className="uppercase text-xs font-bold text-gray-400 tracking-widest">{label}</span>
        <div className="flex items-center gap-3 text-gray-200">
           <button onClick={() => updateSetting(role, Math.max(min, settings[role] - 1))} disabled={!isHost || settings[role] <= min} className="w-8 h-8 rounded-full border border-gray-600 hover:border-[var(--gold)] flex items-center justify-center font-bold bg-black/50 disabled:opacity-30 transition-colors text-lg">-</button>
           <span className="cinzel font-bold text-lg w-6 text-center text-[var(--gold)]">{settings[role]}</span>
           <button onClick={handleAdd} disabled={!isHost || settings[role] >= max} className="w-8 h-8 rounded-full border border-gray-600 hover:border-[var(--gold)] flex items-center justify-center font-bold bg-black/50 disabled:opacity-30 transition-colors text-lg">+</button>
        </div>
      </div>
    );
  };

  // Mouse tracking removed for performance

  return (
    <div ref={lobbyContainerRef} onClick={initAudio} className="min-h-[100dvh] cursor-none edo-lobby-bg edo-theme flex items-center justify-center p-4 lg:p-8 overflow-x-hidden relative text-gray-200">
      <MagneticCursor />
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
      
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
      
      {/* Giant Background Enso */}
      <div className="sun-enso !left-[60%]"></div>

      {/* Back Button */}
      <button 
        onClick={() => { playThud(); navigate('/'); }}
        onMouseEnter={playHover}
        className="absolute top-4 left-4 sm:top-8 sm:left-8 z-50 flex items-center gap-2 text-gray-500 hover:text-red-500 font-bold text-xs uppercase tracking-widest transition-all hover:-translate-x-1"
      >
        <ArrowLeft size={18} />
        <span className="hidden sm:inline">Leave Clan</span>
      </button>

      {/* Main Container */}
      <div className="max-w-[85rem] w-full relative z-10 mt-16 xl:mt-0 animate-in zoom-in-95 duration-700">
        
        {/* Error Message Toast */}
        {errorMsg && (
          <div className="absolute top-0 left-0 w-full z-50 bg-red-900/90 text-white font-bold uppercase tracking-widest px-6 py-3 border-b border-red-500 shadow-[0_0_15px_rgba(139,0,0,0.5)] animate-in slide-in-from-top-full  text-sm text-center">
            {errorMsg}
          </div>
        )}

        <div className="flex flex-col xl:flex-row h-full lg:h-[780px] gap-8 items-stretch">
          {/* ================= LEFT PANEL (PLAYERS) ================= */}
          <div className="w-full xl:w-1/3 p-6 lg:p-10 flex flex-col cinematic-glass rounded-xl shadow-2xl relative border border-[var(--glass-border)] bg-black/40 ">
            
            <div className="pb-6 mb-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-[0.2em] uppercase cinzel text-flicker" style={{textShadow: '0 0 20px rgba(255,255,255,0.2)'}}>
                <ScrambleText text="Gathering" />
              </h1>
              <p className="text-gray-400 font-bold text-xs tracking-widest uppercase mt-2">Awaiting the Clan</p>
            </div>

            <div className="relative flex-1 flex flex-col">
              <h2 className="font-bold text-base text-gray-300 uppercase pb-3 mb-4 flex items-center justify-between tracking-widest border-b border-[var(--glass-border)]">
                <span className="flex items-center gap-2"><Users size={18} className="text-[var(--gold)]" /> Members</span>
                <span className="text-[var(--gold)] bg-[var(--gold)]/10 px-2 py-0.5 rounded-sm">{players.length}</span>
              </h2>

              <div className="flex-1 relative overflow-y-auto pr-2 custom-scrollbar">
                {players.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-gray-500 text-xs uppercase tracking-widest animate-pulse">
                    Silence falls...
                  </div>
                ) : (
                  <ul className="grid grid-cols-1 gap-3">
                    {players.filter(Boolean).map((p) => (
                      <li key={p.id} onMouseEnter={playHover} className="flex items-center gap-4 p-3 spotlight-card cinematic-glass-panel rounded-md transition-all hover:border-gray-500 hover-slash relative overflow-hidden group hover:scale-[1.02]">
                        <div className="w-10 h-10 flex flex-shrink-0 items-center justify-center text-lg font-bold bg-black/60 border border-[var(--glass-border)] text-gray-300 group-hover:text-[var(--gold)] transition-colors z-10 cinzel rounded-sm">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-semibold text-gray-200 truncate leading-none mb-1.5">{p.name}</span>
                          <div className="flex gap-2">
                            {p.id === playerId && <span className="text-[8px] font-bold uppercase text-white bg-[var(--blood)] px-1.5 py-0.5 tracking-wider rounded-sm">You</span>}
                            {players[0]?.id === p.id && <span className="text-[8px] font-bold uppercase text-[#d4af37] bg-[#d4af37]/20 border border-[#d4af37]/30 px-1.5 py-0.5 tracking-wider rounded-sm">Host</span>}
                            {p.isReady ? (
                              <span className="text-[8px] font-bold uppercase text-green-400 bg-green-900/40 border border-green-500/30 px-1.5 py-0.5 tracking-wider rounded-sm">Ready</span>
                            ) : (
                              <span className="text-[8px] font-bold uppercase text-gray-400 border border-[var(--glass-border)] px-1.5 py-0.5 tracking-wider rounded-sm">Waiting</span>
                            )}
                          </div>
                        </div>
                        {isHost && p.id !== playerId && (
                            <button onClick={() => socket?.emit('remove_player', { roomId: id, targetId: p.id })} className="ml-auto p-1.5 text-gray-600 hover:text-[var(--blood)] transition-colors z-20" title="Remove Member">
                                <X size={18} />
                            </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                
                {isBotMode && isHost && (
                   <button onClick={handleAddBot} className="w-full mt-4 border border-dashed border-gray-700 text-gray-400 font-bold text-[10px] uppercase tracking-widest py-3 hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] rounded-md">
                      <UserPlus size={14} /> Recruit AI Yakuza
                   </button>
                )}
              </div>
            </div>
          </div>
          
          {/* ================= RIGHT PANEL (SETTINGS) ================= */}
          <div className="w-full xl:w-2/3 p-6 lg:p-10 relative flex flex-col cinematic-glass rounded-xl shadow-2xl border border-[var(--glass-border)] bg-black/40 ">
            
            <div className="absolute top-6 right-6 lg:top-10 lg:right-10 z-30">
              <div className="cinematic-glass-panel px-4 py-2 rounded-md flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">Access Code</span>
                  <span className="text-xl tracking-widest text-white cinzel font-bold leading-none mt-1">{id}</span>
                </div>
                <button 
                  className="w-10 h-10 flex items-center justify-center bg-[var(--blood)]/20 hover:bg-[var(--blood)]/40 rounded-sm border border-[var(--blood)]/50 text-[var(--gold)] hover:text-white transition-all active:scale-95 shadow-[0_0_15px_rgba(139,0,0,0.3)]"
                  onClick={() => navigator.clipboard.writeText(id || '')}
                  onMouseEnter={playHover}
                  title="Copy Code"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            <div className="h-16 lg:h-12" />

            <div className="relative flex-1 flex flex-col mb-6">
              <h2 className="font-bold text-sm text-gray-300 uppercase pb-3 mb-6 flex items-center gap-2 tracking-widest border-b border-[var(--glass-border)]">
                <Settings size={16} className="text-gray-400" /> Server Configuration
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 overflow-y-auto pr-4 custom-scrollbar">
                
                {/* ROLE DISTRIBUTION */}
                <div className="flex flex-col gap-1 col-span-1 md:col-span-2 mb-2 cinematic-glass-panel p-5 rounded-md border border-[var(--glass-border)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--blood)]/5 rounded-full  pointer-events-none"></div>
                  
                  <div className="text-[var(--gold)] font-bold uppercase tracking-widest text-xs pb-3 mb-4 border-b border-[var(--glass-border)]/50">Role Distribution</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
                     <RoleCounter role="mafia" label="Yakuza" min={1} />
                     <div className="flex items-center justify-between py-2 border-b border-gray-800/50">
                        <span className="uppercase text-xs font-bold text-gray-400 tracking-widest">Heimin</span>
                        <div className="flex items-center gap-2 text-gray-200">
                           <span className="cinzel font-bold text-lg w-6 text-center text-[var(--gold)]">
                              {Math.max(0, players.length - ((settings.mafia||0) + (settings.doctor||0) + (settings.detective||0) + (settings.jester||0)))}
                           </span>
                        </div>
                     </div>
                     <RoleCounter role="doctor" label="Sohei" />
                     <RoleCounter role="detective" label="Samurai" />
                     <RoleCounter role="jester" label="Kitsune" max={1} />
                  </div>
                </div>

                {/* SELECT SETTINGS */}
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

                <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-2 pt-6 border-t border-[var(--glass-border)]">
                   <CustomCheckbox label="Reveal True Role on Death" checked={settings.revealOnDeath} onChange={(e: any) => updateSetting('revealOnDeath', e.target.checked)} disabled={!isHost} />
                   <CustomCheckbox label="Sohei Can Self-Protect" checked={settings.doctorSelfHeal} onChange={(e: any) => updateSetting('doctorSelfHeal', e.target.checked)} disabled={!isHost} />
                   <CustomCheckbox label="Anonymous Voting" checked={settings.anonVoting} onChange={(e: any) => updateSetting('anonVoting', e.target.checked)} disabled={!isHost} />
                   <CustomCheckbox label="Allow Skipping Vote" checked={settings.skipVote} onChange={(e: any) => updateSetting('skipVote', e.target.checked)} disabled={!isHost} />
                </div>

              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full mt-4 border-t border-[var(--glass-border)] pt-6">
              <button 
                onClick={handleToggleReady}
                onMouseEnter={playHover}
                className={`flex-1 py-5 font-bold text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 rounded-none ${
                  currentPlayer?.isReady 
                    ? 'bg-green-900/40 border border-green-500 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]' 
                    : 'bg-black/60 border border-[var(--glass-border)] text-gray-300 hover:border-gray-500'
                }`}
              >
                <CheckSquare size={20} />
                {currentPlayer?.isReady ? "Prepared" : "Set Ready"}
              </button>

              {isHost ? (
                <button 
                  onClick={handleStartGame}
                  onMouseEnter={playHover}
                  disabled={players.length < 4 || totalSpecifiedRoles > players.length || !allReady}
                  className="flex-[2] cinematic-slash-button py-5 font-bold text-lg uppercase tracking-widest flex items-center justify-between px-8 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <span className="flex items-center gap-4 relative z-10 text-white">
                    <Play size={20} className="text-[var(--gold)]" />
                    {players.length < 4 ? `Need ${4 - players.length} more` : 
                     !allReady ? "Waiting for members" :
                     totalSpecifiedRoles > players.length ? "Too many roles" : "Commence Operation"}
                  </span>
                  <span className="text-red-900 opacity-50 text-3xl font-black group-hover:opacity-100 transition-opacity">/</span>
                </button>
              ) : (
                <div className="flex-[2] bg-black/50 border border-gray-800 text-gray-500 py-5 font-bold text-xs uppercase tracking-widest flex items-center justify-center rounded-none shadow-inner">
                  Awaiting Commander...
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

