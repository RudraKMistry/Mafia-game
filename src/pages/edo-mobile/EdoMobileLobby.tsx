import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Settings, User, Bot, Play, Check, ArrowLeft } from 'lucide-react';
import { socket } from '../../socket';
import { useGameState } from '../../hooks/useGameState';
import '../edo/Edo.css';

export default function EdoMobileLobby() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { room, playerId } = useGameState(id);
  const [activeTab, setActiveTab] = useState<'suspects'|'params'>('suspects');

  if (!room) {
    return (
      <div className="edo-theme min-h-screen flex items-center justify-center bg-[#eaddd3]">
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
    socket.emit('start_game', { roomId: id });
  };

  const handleAddBot = () => {
    socket.emit('add_bot', { roomId: id });
  };

  const handleToggleReady = () => {
    socket.emit('toggle_ready', { roomId: id, playerId });
  };

  const isHost = players.length > 0 && players[0].id === playerId;
  const currentPlayer = players.find((p: any) => p.id === playerId);
  const allReady = players.length > 0 && players.every((p: any) => p.isReady);

  return (
    <div className="edo-theme min-h-[100dvh] overflow-x-hidden edo-bg-night text-gray-200 font-serif relative">
      
      {/* Texture Overlay and Particles */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-overlay z-0"></div>
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-900/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-red-900/20 rounded-full blur-[100px] pointer-events-none"></div>

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
          {[...Array(10)].map((_, i) => (
             <div 
                key={`sakura-${i}`} 
                className="particle sakura" 
                style={{
                  width: `${Math.random() * 8 + 6}px`,
                  height: `${Math.random() * 8 + 6}px`,
                  left: `${Math.random() * 120 - 10}vw`,
                  animationDuration: `${Math.random() * 6 + 6}s`,
                  animationDelay: `${Math.random() * -10}s`,
                  backgroundColor: '#8b0000',
                  opacity: 0.6
                }}
             />
          ))}
      </div>

      {/* Header */}
      <header className="w-full top-0 sticky bg-[#3e2723] text-[#fdfbf7] border-b-4 border-[#1a1a1a] shadow-lg z-40">
        <div className="flex justify-between items-center px-4 py-3 w-full max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/')} 
              className="hover:text-[#ffb7c5] transition-colors flex items-center justify-center p-1"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold uppercase tracking-[0.2em] mt-1">Village: {id}</h1>
          </div>
          <div>
            <span className="font-bold px-2 py-1 text-xs bg-[#8b0000] text-white border border-[#1a1a1a] shadow-sm">
              {players.length}
            </span>
          </div>
        </div>
      </header>

      <main className="w-full max-w-md mx-auto relative px-4 py-6 pb-40 z-10">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#8b0000] mb-2 tracking-[0.15em] drop-shadow-sm uppercase">
            Gathering
          </h1>
          <p className="text-lg text-[#5a403c] italic">
            Wait for the villagers to assemble...
          </p>
        </div>

        {/* Tabs */}
        <nav className="flex w-full mb-6 border-b-2 border-[#3e2723]">
          <button 
            onClick={() => setActiveTab('suspects')}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'suspects' ? 'bg-[#3e2723] text-[#fdfbf7] shadow-inner border-t-2 border-l-2 border-r-2 border-[#1a1a1a]' : 'bg-[#eaddd3] text-[#5a403c] hover:bg-[#d8cbb8]'}`}
          >
            Villagers
          </button>
          <button 
            onClick={() => setActiveTab('params')}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'params' ? 'bg-[#3e2723] text-[#fdfbf7] shadow-inner border-t-2 border-l-2 border-r-2 border-[#1a1a1a]' : 'bg-[#eaddd3] text-[#5a403c] hover:bg-[#d8cbb8]'}`}
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
                  <div key={idx} className="shoji-frame shoji-paper rounded-sm h-28 relative flex flex-col items-center justify-center p-2">
                    {idx === 0 && (
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#8b0000] rounded-full flex items-center justify-center shadow-md border-2 border-[#fdfbf7] z-20">
                        <Settings className="text-[#fdfbf7] w-4 h-4" />
                      </div>
                    )}
                    <div className="w-10 h-10 rounded-full border-2 border-[#3e2723] overflow-hidden mb-2 bg-[#1a1a1a] flex items-center justify-center">
                      <User className="text-[#fdfbf7] w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm text-[#1a1a1a] truncate w-full text-center">{p.name} {p.id === playerId ? '(You)' : ''}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${p.isReady ? 'text-[#2e8b57]' : 'text-[#5a403c]'}`}>
                      {p.isReady ? 'Prepared' : 'Waiting'}
                    </span>
                  </div>
                ))}
                
                {isHost && new URLSearchParams(window.location.search).get('mode') === 'bots' && (
                  <div 
                    onClick={handleAddBot}
                    className="shoji-frame bg-[#eaddd3] rounded-sm h-28 relative flex items-center justify-center p-2 opacity-50 border-dashed border-[#5a403c] border-2 cursor-pointer hover:opacity-100"
                  >
                     <span className="text-xs text-[#5a403c] uppercase tracking-widest font-bold">+ ADD AI SUBJECT</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'params' && (
            <div className="animate-in fade-in duration-300 space-y-4">
              <div className="bg-[#fdfbf7] border-4 border-[#3e2723] p-4 shadow-md">
                <h3 className="font-bold uppercase tracking-widest text-[#8b0000] border-b-2 border-[#3e2723] pb-2 mb-4">Village Decrees</h3>
                
                <div className="space-y-4">
                  
                  <div className="border-b border-[#3e2723]/30 pb-4 mb-4">
                     <div className="font-bold text-sm uppercase mb-3 text-[#8b0000]">Role Distribution</div>
                     <div className="grid grid-cols-1 gap-3">
                        <div className="flex justify-between items-center bg-[#eaddd3] p-2 border border-[#3e2723]/20">
                           <span className="text-xs font-bold uppercase">Yakuza (Mafia)</span>
                           <div className="flex items-center gap-2">
                             <button disabled={!isHost} onClick={() => updateSetting('mafia', Math.max(1, (settings.mafia||1) - 1))} className="w-7 h-7 bg-[#3e2723] text-[#fdfbf7] flex items-center justify-center disabled:opacity-50">-</button>
                             <span className="font-bold w-6 text-center text-sm">{settings.mafia || 1}</span>
                             <button disabled={!isHost} onClick={() => updateSetting('mafia', (settings.mafia||1) + 1)} className="w-7 h-7 bg-[#3e2723] text-[#fdfbf7] flex items-center justify-center disabled:opacity-50">+</button>
                           </div>
                        </div>
                        <div className="flex justify-between items-center bg-[#eaddd3] p-2 border border-[#3e2723]/20">
                           <span className="text-xs font-bold uppercase">Sohei (Doctor)</span>
                           <div className="flex items-center gap-2">
                             <button disabled={!isHost} onClick={() => updateSetting('doctor', Math.max(0, (settings.doctor||0) - 1))} className="w-7 h-7 bg-[#3e2723] text-[#fdfbf7] flex items-center justify-center disabled:opacity-50">-</button>
                             <span className="font-bold w-6 text-center text-sm">{settings.doctor || 0}</span>
                             <button disabled={!isHost} onClick={() => updateSetting('doctor', (settings.doctor||0) + 1)} className="w-7 h-7 bg-[#3e2723] text-[#fdfbf7] flex items-center justify-center disabled:opacity-50">+</button>
                           </div>
                        </div>
                        <div className="flex justify-between items-center bg-[#eaddd3] p-2 border border-[#3e2723]/20">
                           <span className="text-xs font-bold uppercase">Samurai (Detective)</span>
                           <div className="flex items-center gap-2">
                             <button disabled={!isHost} onClick={() => updateSetting('detective', Math.max(0, (settings.detective||0) - 1))} className="w-7 h-7 bg-[#3e2723] text-[#fdfbf7] flex items-center justify-center disabled:opacity-50">-</button>
                             <span className="font-bold w-6 text-center text-sm">{settings.detective || 0}</span>
                             <button disabled={!isHost} onClick={() => updateSetting('detective', (settings.detective||0) + 1)} className="w-7 h-7 bg-[#3e2723] text-[#fdfbf7] flex items-center justify-center disabled:opacity-50">+</button>
                           </div>
                        </div>
                        <div className="flex justify-between items-center bg-[#eaddd3] p-2 border border-[#3e2723]/20">
                           <span className="text-xs font-bold uppercase">Kitsune (Jester)</span>
                           <div className="flex items-center gap-2">
                             <button disabled={!isHost} onClick={() => updateSetting('jester', Math.max(0, (settings.jester||0) - 1))} className="w-7 h-7 bg-[#3e2723] text-[#fdfbf7] flex items-center justify-center disabled:opacity-50">-</button>
                             <span className="font-bold w-6 text-center text-sm">{settings.jester || 0}</span>
                             <button disabled={!isHost} onClick={() => updateSetting('jester', Math.min(1, (settings.jester||0) + 1))} className="w-7 h-7 bg-[#3e2723] text-[#fdfbf7] flex items-center justify-center disabled:opacity-50">+</button>
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
                    <div key={s.key} className="flex justify-between items-center">
                      <div className="pr-2">
                        <div className="font-bold text-sm uppercase">{s.label}</div>
                        <div className="text-[10px] text-[#5a403c] italic leading-tight">{s.desc}</div>
                      </div>
                      <select 
                        disabled={!isHost}
                        className="bg-[#eaddd3] border-2 border-[#3e2723] text-xs p-2 outline-none disabled:opacity-50 font-bold max-w-[140px]"
                        value={settings[s.key] || s.options[0].v}
                        onChange={(e) => updateSetting(s.key, e.target.value)}
                      >
                        {s.options.map(opt => <option key={opt.v} value={opt.v}>{opt.l}</option>)}
                      </select>
                    </div>
                  ))}

                  {/* TOGGLES */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#3e2723]/30">
                    {[
                      { key: 'revealOnDeath', label: 'Reveal True Role on Death' },
                      { key: 'doctorSelfHeal', label: 'Sohei Can Self-Protect' },
                      { key: 'anonVoting', label: 'Anonymous Voting' },
                      { key: 'skipVote', label: 'Allow Skipping Vote' }
                    ].map(t => (
                      <div key={t.key} className="flex flex-col items-center text-center gap-2">
                        <span className="font-bold text-[10px] uppercase leading-tight h-6">{t.label}</span>
                        <button 
                          disabled={!isHost}
                          onClick={() => updateSetting(t.key, !settings[t.key])}
                          className={`w-12 h-6 border-2 border-[#3e2723] rounded-full relative transition-colors disabled:opacity-50 ${settings[t.key] ? 'bg-[#8b0000]' : 'bg-[#eaddd3]'}`}
                        >
                          <div className={`w-4 h-4 bg-[#fdfbf7] border border-[#3e2723] rounded-full absolute top-[1px] transition-transform ${settings[t.key] ? 'translate-x-[22px]' : 'translate-x-1'}`}></div>
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
      <div className="fixed bottom-0 left-0 w-full bg-[#0a0a0c] border-t-4 border-[#8b0000] p-4 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
        <div className="max-w-md mx-auto w-full flex flex-col gap-3">
          
          <div className="flex gap-3">
            {isHost && (
              <button 
                onClick={handleAddBot}
                className="flex-1 py-3 px-2 bg-transparent border border-gray-600 text-gray-300 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
              >
                <Bot className="w-4 h-4" />
                Add AI
              </button>
            )}

            <button 
              onClick={handleToggleReady}
              className={`flex-[2] py-3 px-2 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                currentPlayer?.isReady 
                  ? 'bg-green-900/50 border border-green-500 text-white hover:bg-green-800/80 shadow-[0_0_10px_rgba(34,197,94,0.3)]' 
                  : 'bg-white/5 border border-gray-600 text-gray-300 hover:bg-white/10'
              }`}
            >
              <Check className="w-4 h-4" />
              {currentPlayer?.isReady ? 'Prepared' : 'Declare Ready'}
            </button>
          </div>

          {isHost && (
            <button 
              onClick={handleStartGame}
              disabled={!allReady || players.length < 3}
              className="w-full py-4 px-2 bg-red-900/80 border border-red-500 text-white font-bold text-sm uppercase tracking-[0.1em] flex items-center justify-center gap-2 hover:bg-red-800 transition-all shadow-[0_0_15px_rgba(139,0,0,0.3)] disabled:opacity-30 disabled:hover:bg-red-900/80"
            >
              <Play className="w-5 h-5" />
              {players.length < 3 ? 'Need more players' : !allReady ? 'Waiting for villagers' : 'Begin Ritual'}
            </button>
          )}

        </div>
      </div>
    </div>
  );
}

