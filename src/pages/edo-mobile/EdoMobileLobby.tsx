import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Settings, Play, Check, ArrowLeft } from 'lucide-react';
import { socket } from '../../socket';
import { useGameState } from '../../hooks/useGameState';
import { useSoundscape } from '../../hooks/useSoundscape';
import { MagneticCursor } from '../../components/MagneticCursor';
import { ScrambleText } from '../../components/ScrambleText';
import '../edo/Edo.css';

export default function EdoMobileLobby() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { room, playerId, errorMsg } = useGameState(id);
  const [activeTab, setActiveTab] = useState<'suspects'|'params'>('suspects');
  
  const { playHover, playThud, playSlash, playWhoosh, initAudio } = useSoundscape();
  const lobbyContainerRef = React.useRef<HTMLDivElement>(null);

  if (!room) {
    return (
      <div className="edo-theme min-h-screen flex items-center justify-center bg-[#eaddd3]">
        {errorMsg && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-[100] bg-red-900 text-[#fdfbf7] p-4 text-center font-bold uppercase tracking-widest text-sm border-2 border-[#1a1a1a] shadow-lg animate-in fade-in slide-in-from-top-4">
            {errorMsg}
          </div>
        )}
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-[#8b0000]"></div>
      </div>
    );
  }

  if (room.state !== 'lobby') {
    navigate(`/game/${id}`);
    return null;
  }

  const { players, settings } = room;

  const updateSetting = (key: string, value: any) => {
    socket.emit('update_settings', { roomId: id, settings: { [key]: value } });
  };

  const handleStartGame = () => {
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
  const currentPlayer = players.find((p: any) => p.id === playerId);
  const allReady = players.length > 0 && players.every((p: any) => p.isReady);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!lobbyContainerRef.current) return;
    const rect = lobbyContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    lobbyContainerRef.current.style.setProperty('--mouse-x', `${x}px`);
    lobbyContainerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div ref={lobbyContainerRef} onMouseMove={handleMouseMove} onClick={initAudio} className="edo-theme min-h-[100dvh] cursor-none overflow-x-hidden edo-lobby-bg text-gray-200 font-serif relative">
      <MagneticCursor />
      {/* Texture Overlay and Particles */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-overlay z-0"></div>

      {errorMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-[100] bg-red-900 text-[#fdfbf7] p-4 text-center font-bold uppercase tracking-widest text-sm border-2 border-[#1a1a1a] shadow-lg animate-in fade-in slide-in-from-top-4">
          {errorMsg}
        </div>
      )}

      {/* Giant Background Enso */}
      <div className="sun-enso !left-[50%] !top-[40%] !w-[150vw] !h-[150vw]"></div>

      <div id="particles" className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(15)].map((_, i) => (
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

      {/* Header */}
      <header className="w-full top-0 sticky cinematic-glass z-40 border-b border-[var(--glass-border)]">
        <div className="flex justify-between items-center px-4 py-3 w-full max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { playThud(); navigate('/'); }} 
              onMouseEnter={playHover}
              className="text-gray-400 hover:text-white transition-colors flex items-center justify-center p-1 active:scale-95 cursor-none"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col ml-2">
              <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-gray-500 leading-none">Access Code</span>
              <h1 className="text-white cinzel font-bold tracking-widest text-lg leading-none mt-1">{id}</h1>
            </div>
          </div>
          <div>
            <span className="font-bold px-2 py-1 text-[10px] bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30 rounded-sm">
              {players.length} / 20
            </span>
          </div>
        </div>
      </header>

      <main className="w-full max-w-md mx-auto relative px-4 py-6 pb-40 z-10">
        
        {/* Title */}
        <div className="text-center mb-6 mt-4">
          <h1 className="text-3xl font-bold text-white mb-1 tracking-[0.2em] drop-shadow-sm uppercase text-flicker cinzel">
            <ScrambleText text="The Clan" />
          </h1>
          <p className="text-[10px] text-gray-500 tracking-widest uppercase font-bold">
            Awaiting members...
          </p>
        </div>

        {/* Tabs */}
        <nav className="flex w-full mb-6 border-b border-[var(--glass-border)] pb-1 gap-2">
          <button 
            onClick={() => { playThud(); setActiveTab('suspects'); }}
            onMouseEnter={playHover}
            className={`flex-1 py-2.5 text-[10px] cursor-none font-bold uppercase tracking-[0.2em] transition-all rounded-md ${activeTab === 'suspects' ? 'bg-[var(--glass-bg)] text-white border border-[var(--glass-border)] shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Gathering
          </button>
          <button 
            onClick={() => { playThud(); setActiveTab('params'); }}
            onMouseEnter={playHover}
            className={`flex-1 py-2.5 text-[10px] cursor-none font-bold uppercase tracking-[0.2em] transition-all rounded-md ${activeTab === 'params' ? 'bg-[var(--glass-bg)] text-white border border-[var(--glass-border)] shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Decrees
          </button>
        </nav>

        {/* Content */}
        <div className="min-h-[50vh]">
          {activeTab === 'suspects' && (
            <div className="animate-in fade-in duration-300">
              <div className="grid grid-cols-2 gap-4">
                {players.filter(Boolean).map((p: any, idx: number) => (
                  <div key={idx} className="cinematic-glass-panel spotlight-card rounded-md h-28 relative flex flex-col items-center justify-center p-2 hover-slash overflow-hidden transition-all">
                    {idx === 0 && (
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-black/80 rounded-full flex items-center justify-center border border-[var(--gold)]/50 z-20">
                        <Settings className="text-[var(--gold)] w-3.5 h-3.5" />
                      </div>
                    )}
                    <div className="w-10 h-10 rounded-sm border border-[var(--glass-border)] overflow-hidden mb-2 bg-black/60 flex items-center justify-center z-10 cinzel font-bold text-gray-300 text-lg">
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-xs text-gray-200 truncate w-full text-center">{p.name} {p.id === playerId ? '(You)' : ''}</span>
                    <span className={`text-[9px] font-bold uppercase tracking-[0.1em] mt-1 ${p.isReady ? 'text-green-400 bg-green-900/30 px-1.5 py-0.5 rounded-sm' : 'text-gray-500'}`}>
                      {p.isReady ? 'Prepared' : 'Waiting'}
                    </span>
                  </div>
                ))}
                
                {isHost && new URLSearchParams(window.location.search).get('mode') === 'bots' && (
                  <div 
                    onClick={handleAddBot}
                    className="bg-black/20 rounded-md h-28 relative flex items-center justify-center p-2 opacity-60 border-dashed border-[var(--glass-border)] border cursor-pointer hover:opacity-100 hover:bg-black/40 transition-all"
                  >
                     <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">+ ADD AI SUBJECT</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'params' && (
            <div className="animate-in fade-in duration-300 space-y-4">
              <div className="cinematic-glass-panel p-5 rounded-md border border-[var(--glass-border)] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--blood)]/5 rounded-full blur-2xl pointer-events-none"></div>

                <h3 className="font-bold uppercase tracking-widest text-gray-300 border-b border-[var(--glass-border)] pb-2 mb-4 text-xs">Village Decrees</h3>
                
                <div className="space-y-4">
                  
                  <div className="border-b border-[var(--glass-border)] pb-4 mb-4">
                     <div className="font-bold text-xs uppercase mb-3 text-[var(--gold)] tracking-widest">Role Distribution</div>
                     <div className="grid grid-cols-1 gap-2">
                        <div className="flex justify-between items-center bg-black/40 p-2.5 rounded-sm border border-[var(--glass-border)]">
                           <span className="text-xs font-bold uppercase text-gray-300">Yakuza (Mafia)</span>
                           <div className="flex items-center gap-2">
                             <button disabled={!isHost} onClick={() => updateSetting('mafia', Math.max(1, (settings.mafia||1) - 1))} className="w-8 h-8 bg-black/60 border border-[var(--glass-border)] text-gray-300 flex items-center justify-center rounded-sm disabled:opacity-30 text-lg">-</button>
                             <span className="font-bold w-6 text-center text-sm text-[var(--gold)] cinzel">{settings.mafia || 1}</span>
                             <button disabled={!isHost} onClick={() => updateSetting('mafia', (settings.mafia||1) + 1)} className="w-8 h-8 bg-black/60 border border-[var(--glass-border)] text-gray-300 flex items-center justify-center rounded-sm disabled:opacity-30 text-lg">+</button>
                           </div>
                        </div>
                        <div className="flex justify-between items-center bg-black/40 p-2.5 rounded-sm border border-[var(--glass-border)]">
                           <span className="text-xs font-bold uppercase text-gray-300">Sohei (Doctor)</span>
                           <div className="flex items-center gap-2">
                             <button disabled={!isHost} onClick={() => updateSetting('doctor', Math.max(0, (settings.doctor||0) - 1))} className="w-8 h-8 bg-black/60 border border-[var(--glass-border)] text-gray-300 flex items-center justify-center rounded-sm disabled:opacity-30 text-lg">-</button>
                             <span className="font-bold w-6 text-center text-sm text-[var(--gold)] cinzel">{settings.doctor || 0}</span>
                             <button disabled={!isHost} onClick={() => updateSetting('doctor', (settings.doctor||0) + 1)} className="w-8 h-8 bg-black/60 border border-[var(--glass-border)] text-gray-300 flex items-center justify-center rounded-sm disabled:opacity-30 text-lg">+</button>
                           </div>
                        </div>
                        <div className="flex justify-between items-center bg-black/40 p-2.5 rounded-sm border border-[var(--glass-border)]">
                           <span className="text-xs font-bold uppercase text-gray-300">Samurai (Detective)</span>
                           <div className="flex items-center gap-2">
                             <button disabled={!isHost} onClick={() => updateSetting('detective', Math.max(0, (settings.detective||0) - 1))} className="w-8 h-8 bg-black/60 border border-[var(--glass-border)] text-gray-300 flex items-center justify-center rounded-sm disabled:opacity-30 text-lg">-</button>
                             <span className="font-bold w-6 text-center text-sm text-[var(--gold)] cinzel">{settings.detective || 0}</span>
                             <button disabled={!isHost} onClick={() => updateSetting('detective', (settings.detective||0) + 1)} className="w-8 h-8 bg-black/60 border border-[var(--glass-border)] text-gray-300 flex items-center justify-center rounded-sm disabled:opacity-30 text-lg">+</button>
                           </div>
                        </div>
                        <div className="flex justify-between items-center bg-black/40 p-2.5 rounded-sm border border-[var(--glass-border)]">
                           <span className="text-xs font-bold uppercase text-gray-300">Kitsune (Jester)</span>
                           <div className="flex items-center gap-2">
                             <button disabled={!isHost} onClick={() => updateSetting('jester', Math.max(0, (settings.jester||0) - 1))} className="w-8 h-8 bg-black/60 border border-[var(--glass-border)] text-gray-300 flex items-center justify-center rounded-sm disabled:opacity-30 text-lg">-</button>
                             <span className="font-bold w-6 text-center text-sm text-[var(--gold)] cinzel">{settings.jester || 0}</span>
                             <button disabled={!isHost} onClick={() => updateSetting('jester', Math.min(1, (settings.jester||0) + 1))} className="w-8 h-8 bg-black/60 border border-[var(--glass-border)] text-gray-300 flex items-center justify-center rounded-sm disabled:opacity-30 text-lg">+</button>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* DROP DOWNS */}
                  {[
                    { key: 'discussionTime', label: 'Day Phase Time', desc: 'Duration of day phase', options: [{v:'unlimited',l:'Unlimited'},{v:'1m',l:'1 Min'},{v:'3m',l:'3 Min'},{v:'5m',l:'5 Min'},{v:'10m',l:'10 Min'}] },
                    { key: 'nightTime', label: 'Night Phase Time', desc: 'Duration of night actions', options: [{v:'unlimited',l:'Unlimited'},{v:'30s',l:'30 Sec'},{v:'1m',l:'1 Min'},{v:'2m',l:'2 Min'}] },
                    { key: 'nightOrder', label: 'Action Order', desc: 'Order of night actions', options: [{v:'doc-det-maf',l:'Sohei → Samurai → Yakuza'},{v:'maf-doc-det',l:'Yakuza → Sohei → Samurai'},{v:'det-doc-maf',l:'Samurai → Sohei → Yakuza'}] },
                    { key: 'detectiveSees', label: 'Samurai Discovers', desc: 'What the detective learns', options: [{v:'alignment',l:'Alignment'},{v:'exact',l:'Exact Role'}] },
                    { key: 'tieVote', label: 'Tied Votes', desc: 'How ties are resolved', options: [{v:'nothing',l:'No Elimination'},{v:'random',l:'Random'}] },
                    { key: 'jesterWin', label: 'Kitsune Win Rule', desc: 'If jester is voted out', options: [{v:'end',l:'Game Ends'},{v:'continue',l:'Game Continues'}] }
                  ].map((s) => (
                    <div key={s.key} className="flex justify-between items-center bg-black/40 p-2.5 rounded-sm border border-[var(--glass-border)]">
                      <div className="pr-2">
                        <div className="font-bold text-xs uppercase text-gray-300">{s.label}</div>
                        <div className="text-[10px] text-gray-500 italic leading-tight mt-0.5">{s.desc}</div>
                      </div>
                      <select 
                        disabled={!isHost}
                        className="bg-black/60 border border-[var(--glass-border)] rounded-sm text-xs text-gray-300 p-1.5 outline-none disabled:opacity-30 font-bold max-w-[120px] focus:border-[var(--gold)]"
                        value={settings[s.key] || s.options[0].v}
                        onChange={(e) => updateSetting(s.key, e.target.value)}
                      >
                        {s.options.map(opt => <option key={opt.v} value={opt.v}>{opt.l}</option>)}
                      </select>
                    </div>
                  ))}

                  {/* TOGGLES */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--glass-border)]">
                    {[
                      { key: 'revealOnDeath', label: 'Reveal True Role' },
                      { key: 'doctorSelfHeal', label: 'Sohei Self-Protect' },
                      { key: 'anonVoting', label: 'Anonymous Voting' },
                      { key: 'skipVote', label: 'Allow Skipping Vote' }
                    ].map(t => (
                      <div key={t.key} className="flex flex-col items-center text-center gap-1.5 bg-black/40 p-2 rounded-sm border border-[var(--glass-border)]">
                        <span className="font-bold text-[10px] uppercase leading-tight h-6 text-gray-400">{t.label}</span>
                        <button 
                          disabled={!isHost}
                          onClick={() => updateSetting(t.key, !settings[t.key])}
                          className={`w-10 h-5 border border-[var(--glass-border)] rounded-full relative transition-colors disabled:opacity-30 ${settings[t.key] ? 'bg-[var(--gold)]/30 border-[var(--gold)]' : 'bg-black/60'}`}
                        >
                          <div className={`w-3 h-3 rounded-full absolute top-[3px] transition-transform ${settings[t.key] ? 'translate-x-[22px] bg-[var(--gold)]' : 'translate-x-[3px] bg-gray-500'}`}></div>
                        </button>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full cinematic-glass border-t border-[var(--glass-border)] p-4 z-50">
        <div className="max-w-md mx-auto w-full flex flex-col gap-3">
          
          <div className="flex gap-2">
            <button 
              onClick={handleToggleReady}
              onMouseEnter={playHover}
              className={`flex-1 py-4 font-bold text-[11px] rounded-none uppercase tracking-[0.1em] flex items-center justify-center gap-2 transition-all active:scale-95 ${
                currentPlayer?.isReady 
                  ? 'bg-green-900/40 border border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                  : 'bg-black/60 border border-[var(--glass-border)] text-gray-400'
              }`}
            >
              <Check className="w-5 h-5" />
              {currentPlayer?.isReady ? 'Prepared' : 'Set Ready'}
            </button>
          </div>

          {isHost && (
            <button 
              onClick={handleStartGame}
              onMouseEnter={playHover}
              disabled={!allReady || players.length < 4}
              className="w-full cinematic-slash-button py-4 font-bold text-sm uppercase tracking-widest flex items-center justify-between px-6 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"
            >
              <span className="flex items-center gap-3 relative z-10 text-white">
                <Play className="w-5 h-5 text-[var(--gold)]" />
                {players.length < 4 ? 'Need more members' : !allReady ? 'Waiting for clan' : 'Commence Operation'}
              </span>
              <span className="text-red-900 opacity-50 text-2xl font-black group-hover:opacity-100 transition-opacity">/</span>
            </button>
          )}

        </div>
      </div>
    </div>
  );
}

