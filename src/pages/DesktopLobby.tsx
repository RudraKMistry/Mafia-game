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
    socket.emit('join_room', { roomId: id, playerName, isBotMode, theme });

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
          <div className="bg-[#f4ebd8] p-5 md:p-8 shadow-md border border-black/10 relative flex-1 flex flex-col rounded-sm max-h-[600px]" style={{ boxShadow: '2px 3px 10px rgba(0,0,0,0.2), inset 0 0 20px rgba(150, 120, 90, 0.05)' }}>
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
          <div className="bg-[#f4ebd8] p-5 md:p-8 relative flex-1 flex flex-col mb-6 rounded-sm" style={{ boxShadow: '2px 3px 10px rgba(0,0,0,0.2), inset 0 0 20px rgba(150, 120, 90, 0.05)' }}>
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

