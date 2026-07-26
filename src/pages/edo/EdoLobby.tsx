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
      <label className="text-[#3e2723] uppercase tracking-widest font-bold text-xs font-serif">{label}</label>
      <div className="relative border-b-2 border-[#4e342e]">
        <select 
          value={value} 
          onChange={onChange} 
          disabled={disabled}
          className="appearance-none w-full bg-transparent py-1 pr-6 outline-none font-serif font-bold text-sm md:text-base text-[#2c1b18] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value} className="text-[#2c1b18] bg-[#ebdcb5] font-serif">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[#4e342e] text-xs">
          ▼
        </div>
      </div>
    </div>
  );

  const CustomCheckbox = ({ label, checked, onChange, disabled }: any) => (
    <label className={`flex items-center cursor-pointer gap-3 group mb-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <input type="checkbox" className="hidden" checked={checked} onChange={onChange} disabled={disabled} />
      <div className="text-[#4e342e] group-hover:text-[#8b0000] transition-colors">
         {checked ? <CheckSquare size={20} className="text-[#8b0000]" /> : <Square size={20} />}
      </div>
      <span className="text-[#3e2723] uppercase tracking-wider font-bold text-sm font-serif group-hover:text-[#8b0000] transition-colors leading-tight">
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
      <div className="flex items-center justify-between py-1 border-b border-[#4e342e]/30">
        <span className="font-serif uppercase text-sm font-bold text-[#3e2723]">{label}</span>
        <div className="flex items-center gap-2 text-[#2c1b18]">
           <button onClick={() => updateSetting(role, Math.max(min, settings[role] - 1))} disabled={!isHost || settings[role] <= min} className="w-6 h-6 border-2 border-[#4e342e]/50 hover:bg-[#4e342e]/20 flex items-center justify-center font-bold bg-[#fdfbf7]/50 disabled:opacity-40">-</button>
           <span className="font-serif font-black text-sm w-4 text-center">{settings[role]}</span>
           <button onClick={handleAdd} disabled={!isHost || settings[role] >= max} className="w-6 h-6 border-2 border-[#4e342e]/50 hover:bg-[#4e342e]/20 flex items-center justify-center font-bold bg-[#fdfbf7]/50 disabled:opacity-40">+</button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen edo-bg-day edo-theme flex items-center justify-center p-2 sm:p-4 lg:p-8 overflow-x-hidden relative">
      
      {/* Particles */}
      <div id="particles" className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(20)].map((_, i) => (
             <div 
                key={i} 
                className="particle sakura" 
                style={{
                  width: `${Math.random() * 10 + 8}px`,
                  height: `${Math.random() * 10 + 8}px`,
                  left: `${Math.random() * 120 - 10}vw`,
                  animationDuration: `${Math.random() * 5 + 5}s`,
                  animationDelay: `${Math.random() * -10}s`
                }}
             />
          ))}
      </div>

      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 sm:top-8 sm:left-8 z-50 flex items-center gap-2 text-[#8b0000] hover:text-red-900 font-serif font-bold uppercase tracking-widest transition-all hover:-translate-x-1 drop-shadow-md bg-white/50 p-2 rounded-sm border border-[#8b0000]"
      >
        <ArrowLeft size={24} />
        <span className="hidden sm:inline">Leave Village</span>
      </button>

      <div className="max-w-7xl w-full makimono-paper border-y-[16px] border-[#2c1b18] flex flex-col xl:flex-row relative z-10 mt-16 xl:mt-0 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* Error Message Toast */}
        {errorMsg && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#8b0000] text-[#ebdcb5] font-serif font-bold uppercase tracking-widest px-6 py-3 border-2 border-[#4e342e] shadow-lg animate-in fade-in slide-in-from-top-4">
            {errorMsg}
          </div>
        )}

        {/* ================= LEFT FLAP (PLAYERS) ================= */}
        <div className="flex-1 p-6 md:p-10 relative flex flex-col xl:border-r-[4px] xl:border-double xl:border-[#4e342e] min-h-[500px]">
          
          <div className="mt-8 md:mt-2 border-b-2 border-[#4e342e] pb-4 mb-6">
            <h1 className="text-5xl md:text-6xl font-bold text-[#8b0000] tracking-widest mb-1 drop-shadow-sm uppercase">Village Gathering</h1>
            <p className="font-serif text-[#3e2723] font-bold text-sm tracking-widest uppercase mt-2">Awaiting Clan Members...</p>
          </div>

          <div className="shoji-paper p-5 md:p-8 border-2 border-[#4e342e] shadow-inner relative flex-1 flex flex-col rounded-sm">

            <h2 className="font-serif font-bold text-xl text-[#8b0000] uppercase border-b-2 border-[#4e342e]/30 pb-3 mb-4 flex items-center gap-2 tracking-widest">
              <Users size={24} className="text-[#8b0000]" /> Members ({players.length})
            </h2>

            <div className="flex-1 relative overflow-y-auto pr-2">
              {players.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center font-serif font-bold text-[#3e2723]/60 text-sm uppercase tracking-widest animate-pulse">
                  Waiting for arrivals...
                </div>
              ) : (
                <ul className="grid grid-cols-1 gap-3">
                  {players.map((p) => (
                    <li key={p.id} className="flex items-center gap-4 p-2 bg-[#fdfbf7]/60 border border-[#4e342e]/20 shadow-sm rounded-sm">
                      <div className="w-10 h-10 rounded-full border-[2px] border-[#4e342e] flex flex-shrink-0 items-center justify-center text-lg font-serif font-bold shadow-inner bg-[#ebdcb5] text-[#2c1b18]">
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-serif text-xl text-[#2c1b18] font-bold truncate leading-none pt-1">{p.name}</span>
                        <div className="flex gap-2 mt-1">
                          {p.id === playerId && <span className="font-serif text-[10px] font-bold uppercase text-[#ebdcb5] bg-[#8b0000] px-1 rounded shadow-sm">You</span>}
                          {players[0]?.id === p.id && <span className="font-serif text-[10px] font-bold uppercase text-[#ebdcb5] bg-[#2c1b18] px-1 rounded shadow-sm">Host</span>}
                          {p.isReady ? (
                            <span className="font-serif text-[10px] font-bold uppercase text-[#276749] bg-green-100 px-1 rounded shadow-sm border border-[#276749]">Ready</span>
                          ) : (
                            <span className="font-serif text-[10px] font-bold uppercase text-[#8b0000] bg-red-100 px-1 rounded shadow-sm border border-[#8b0000]">Not Ready</span>
                          )}
                        </div>
                      </div>
                      {isHost && p.id !== playerId && (
                          <button onClick={() => socket?.emit('remove_player', { roomId: id, targetId: p.id })} className="ml-auto p-1.5 text-[#4e342e] hover:text-[#8b0000] hover:bg-red-100/50 rounded-sm transition-colors" title="Remove Member">
                              <X size={20} />
                          </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              
              {isBotMode && isHost && (
                 <button onClick={handleAddBot} className="w-full mt-4 border-2 border-dashed border-[#4e342e] text-[#4e342e] font-serif font-bold py-2 hover:bg-[#4e342e]/10 transition-all flex items-center justify-center gap-2 rounded-sm cursor-pointer active:scale-[0.98]">
                    <UserPlus size={18} /> Recruit AI Shinobi
                 </button>
              )}
            </div>
          </div>
        </div>
        
        {/* ================= RIGHT FLAP (SETTINGS) ================= */}
        <div className="flex-1 p-6 md:p-10 relative flex flex-col min-h-[500px]">
          
          <div className="absolute top-4 right-4 md:top-8 md:right-8 z-30">
            <div className="bg-[#fdfbf7] p-3 shadow-md border-[2px] border-[#4e342e] flex flex-col items-center">
              <span className="font-serif text-[10px] font-black uppercase tracking-widest text-[#8b0000] mb-1">Scroll Code</span>
              <div className="flex items-center gap-2">
                <span className="text-3xl tracking-widest text-[#2c1b18] font-bold leading-none">{id}</span>
                <button 
                  className="p-1 border border-[#2c1b18] bg-transparent text-[#2c1b18] hover:bg-[#2c1b18] hover:text-[#ebdcb5] transition-colors"
                  onClick={() => navigator.clipboard.writeText(id || '')}
                  title="Copy Code"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="h-24 md:h-20" />

          <div className="shoji-paper p-5 md:p-8 relative flex-1 flex flex-col mb-6 rounded-sm border-2 border-[#4e342e] shadow-inner">
            <h2 className="font-serif font-bold text-xl text-[#8b0000] uppercase border-b-2 border-[#4e342e]/30 pb-3 mb-4 flex items-center gap-2 tracking-widest">
              <Settings size={24} className="text-[#8b0000]" /> Laws of Edo
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 overflow-y-auto pr-2 custom-scrollbar">
              
              <div className="flex flex-col gap-1 col-span-1 md:col-span-2 mb-2 bg-[#fdfbf7]/40 p-3 border border-[#4e342e]/20">
                <div className="text-[#8b0000] font-bold uppercase tracking-widest text-xs font-serif border-b border-[#4e342e]/20 pb-1 mb-2">Role Distribution</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                   <RoleCounter role="mafia" label="Shinobi" min={1} />
                   <div className="flex items-center justify-between py-1 border-b border-[#4e342e]/30">
                      <span className="font-serif uppercase text-sm font-bold text-[#3e2723]">Heimin</span>
                      <div className="flex items-center gap-2 text-[#2c1b18]">
                         <span className="font-serif font-black text-sm w-4 text-center">
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
                  { value: 'doc-det-maf', label: 'Sohei → Samurai → Shinobi' },
                  { value: 'maf-doc-det', label: 'Shinobi → Sohei → Samurai' },
                  { value: 'det-doc-maf', label: 'Samurai → Sohei → Shinobi' }
                ]} 
              />
              <CustomSelect 
                label="Samurai Discovers" 
                value={settings.detectiveSees} 
                onChange={(e: any) => updateSetting('detectiveSees', e.target.value)} 
                disabled={!isHost}
                options={[
                  { value: 'alignment', label: 'Alignment (Shinobi/Innocent)' },
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
                  { value: 'random', label: 'Random Between Tied' }
                ]} 
              />
              <CustomSelect 
                label="Kitsune Win Condition" 
                value={settings.jesterWin} 
                onChange={(e: any) => updateSetting('jesterWin', e.target.value)} 
                disabled={!isHost}
                options={[
                  { value: 'end', label: 'Kitsune Wins & Game Ends' },
                  { value: 'continue', label: 'Kitsune Wins & Game Continues' }
                ]} 
              />

              <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-2 pt-4 border-t border-[#4e342e]/30">
                 <CustomCheckbox label="Reveal True Role on Death" checked={settings.revealOnDeath} onChange={(e: any) => updateSetting('revealOnDeath', e.target.checked)} disabled={!isHost} />
                 <CustomCheckbox label="Sohei Can Self-Protect" checked={settings.doctorSelfHeal} onChange={(e: any) => updateSetting('doctorSelfHeal', e.target.checked)} disabled={!isHost} />
                 <CustomCheckbox label="Anonymous Voting" checked={settings.anonVoting} onChange={(e: any) => updateSetting('anonVoting', e.target.checked)} disabled={!isHost} />
                 <CustomCheckbox label="Allow Skipping Vote" checked={settings.skipVote} onChange={(e: any) => updateSetting('skipVote', e.target.checked)} disabled={!isHost} />
              </div>

            </div>
          </div>

          {isHost ? (
            <button 
              onClick={handleStartGame}
              disabled={players.length < 4 || totalSpecifiedRoles > players.length || !allReady}
              className="w-full bg-[#8b0000] border-[3px] border-[#2c1b18] text-[#ebdcb5] py-4 md:py-6 font-serif font-black text-2xl md:text-3xl uppercase tracking-widest hover:bg-red-900 transition-all shadow-md active:translate-y-1 active:shadow-sm disabled:opacity-40 disabled:hover:bg-[#8b0000] disabled:active:translate-y-0 flex items-center justify-center gap-3"
            >
              <Play size={28} />
              {players.length < 4 ? `Need ${4 - players.length} more` : 
               !allReady ? "Waiting for players" :
               totalSpecifiedRoles > players.length ? "Too many roles" : "Begin Tale"}
            </button>
          ) : (
            <button 
              onClick={handleToggleReady}
              className={`w-full py-4 md:py-6 border-[3px] border-[#2c1b18] font-serif font-black text-2xl md:text-3xl uppercase tracking-widest transition-all shadow-md active:translate-y-1 active:shadow-sm flex items-center justify-center gap-3 ${
                currentPlayer?.isReady 
                  ? 'bg-[#276749] text-white hover:bg-green-900' 
                  : 'bg-[#ebdcb5] text-[#2c1b18] hover:bg-[#d1bfae]'
              }`}
            >
              <CheckSquare size={28} />
              {currentPlayer?.isReady ? "Ready to Serve" : "Declare Ready"}
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
