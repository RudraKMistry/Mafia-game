import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FolderOpen, Settings, User, Bot, Play, Fingerprint, UserPlus, Star, ChevronDown, ArrowLeft, X } from 'lucide-react';
import { socket } from '../../socket';
import { useGameState } from '../../hooks/useGameState';

export default function MobileLobby() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { room, playerId } = useGameState(id);
  const [activeTab, setActiveTab] = useState<'suspects'|'params'>('suspects');

  if (!room) {
    return (
      <div className="bg-[#fff8f6] min-h-screen flex items-center justify-center m-desk-texture">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-black"></div>
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
    <div className="bg-[#fff8f6] text-[#261816] min-h-[100dvh] font-body-standard overflow-x-hidden md:py-8 md:px-4">
      <div className="max-w-md mx-auto w-full relative">
        <header className="w-full top-0 sticky bg-[#E8D9C5] text-[#610000] border-b-[3px] border-black shadow-[0_2px_0_0_rgba(0,0,0,1)] z-40">
          <div className="flex justify-between items-center px-4 py-1.5 w-full max-w-md mx-auto">
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => navigate('/')} 
                className="hover:scale-110 transition-transform flex items-center justify-center p-1"
                aria-label="Back to home"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <FolderOpen className="w-5 h-5 ml-1" />
              <h1 className="font-display-xl text-xl text-[#610000] uppercase tracking-tighter">CASE #{id}</h1>
            </div>
            <div>
              <span className="font-typewriter-md font-bold px-1.5 py-0.5 text-xs bg-[#fee2dd] border-2 border-black rotate-2 inline-block shadow-[1px_1px_0px_#000000]">
                {players.length} / 12
              </span>
            </div>
          </div>
        </header>

        <main className="w-full bg-[#E8D9C5] m-paper-texture shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] min-h-[60vh] relative px-3 py-4 pb-40">
          {isHost && (
            <div className="absolute -top-3 -right-2 w-16 h-16 bg-[#fff8f6] neo-brutalist-shadow rotate-3 border-2 border-black flex flex-col items-center justify-center z-10">
              <div className="w-full h-2 bg-[#FACC15] opacity-80 absolute top-0"></div>
              <span className="font-label-caps text-[#5a403c] mt-2 text-[8px] leading-tight text-center">HOST<br/>STATUS</span>
              <Settings className="text-[#991B1B] w-4 h-4 mt-0.5" />
            </div>
          )}

          <nav className="flex w-full mb-3 px-1" role="tablist">
            <button 
              onClick={() => setActiveTab('suspects')}
              className={`flex-1 py-1.5 border-[3px] border-black border-b-0 font-typewriter-md text-xs transition-colors ${activeTab === 'suspects' ? 'bg-[#E8D9C5] neo-brutalist-shadow font-bold text-[#991B1B] relative z-10 translate-y-0.5' : 'bg-[#fee2dd] shadow-[2px_2px_0px_#000000] text-[#5a403c] relative z-0 mt-1 hover:bg-[#f8dcd8]'}`}
            >
              SUBJECTS
            </button>
            <button 
              onClick={() => setActiveTab('params')}
              className={`flex-1 py-1.5 border-[3px] border-black border-b-0 font-typewriter-md text-xs transition-colors ${activeTab === 'params' ? 'bg-[#E8D9C5] neo-brutalist-shadow font-bold text-[#991B1B] relative z-10 translate-y-0.5' : 'bg-[#fee2dd] shadow-[2px_2px_0px_#000000] text-[#5a403c] relative z-0 mt-1 hover:bg-[#f8dcd8]'}`}
            >
              PARAMETERS
            </button>
          </nav>

          <div className="notebook-lines min-h-[50vh] pt-1 mb-6" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 23px, #1E3A8A 23px, #1E3A8A 24px)', backgroundAttachment: 'local' }}>
            
            {activeTab === 'suspects' && (
              <div className="animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-2 border-b-2 border-black pb-1 bg-[#fff8f6]/80 p-1">
                  <h2 className="font-headline-lg text-base text-[#261816] tracking-tight">Gathering...</h2>
                  <div className="animate-pulse bg-[#991B1B] w-2.5 h-2.5 rounded-full border border-black"></div>
                </div>

                <ul className="space-y-2">
                  {players.map((p: any, index: number) => {
                    const rotClass = index % 3 === 0 ? 'rotate-[-1deg]' : index % 2 === 0 ? 'rotate-[1deg]' : 'rotate-[-0.5deg]';
                    return (
                      <li key={p.id} className={`bg-white border-2 border-black neo-brutalist-shadow p-1.5 flex items-center gap-2 relative ${rotClass}`}>
                        {p.id === playerId && (
                          <div className="absolute -left-1.5 -top-1.5 w-4 h-4 rounded-full bg-[#991B1B] border border-black flex items-center justify-center text-white z-10">
                            <Star className="w-2.5 h-2.5" />
                          </div>
                        )}
                        <div className="w-10 h-10 bg-[#fee2dd] border-2 border-black flex items-center justify-center">
                          {p.isBot ? <Bot className="w-5 h-5 text-[#5a403c]" /> : <User className="w-5 h-5 text-[#5a403c]" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-handwritten-lg text-xl text-[#261816] leading-none mb-1">{p.name}</p>
                          <p className="font-typewriter-sm text-xs text-[#5a403c] leading-none">ID: {p.id}</p>
                        </div>
                        <div className="pr-1">
                          {isHost && p.id !== playerId ? (
                            <button onClick={() => socket?.emit('remove_player', { roomId: id, targetId: p.id })} className="text-[#8e706b] hover:text-[#991B1B] p-1 transition-colors">
                              <X className="w-5 h-5" />
                            </button>
                          ) : (
                            <Fingerprint className="text-[#8e706b] w-4 h-4" />
                          )}
                        </div>
                      </li>
                    );
                  })}

                  {players.length < 12 && (
                    <li 
                      className={`border-2 border-dashed border-[#8e706b] p-2 flex items-center justify-center gap-1.5 bg-[#fff8f6]/50 mt-2 transition-colors ${isHost && new URLSearchParams(window.location.search).get('mode') === 'bots' ? 'cursor-pointer hover:bg-[#fee2dd]' : ''}`} 
                      onClick={isHost && new URLSearchParams(window.location.search).get('mode') === 'bots' ? handleAddBot : undefined}
                    >
                      <UserPlus className="text-[#8e706b] w-4 h-4" />
                      <span className="font-typewriter-md text-sm text-[#8e706b]">{isHost && new URLSearchParams(window.location.search).get('mode') === 'bots' ? '+ ADD AI SUBJECT' : 'AWAITING SUBJECT...'}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {activeTab === 'params' && (
              <div className="pt-3 bg-[#fff8f6]/80 p-3 border-[3px] border-black neo-brutalist-shadow relative animate-in fade-in duration-300">
                <h2 className="font-headline-lg text-base text-[#261816] mb-4 border-b-2 border-black inline-block">CASE SETTINGS</h2>
                <form className="flex flex-col gap-6">
                  <div className="border-l-2 border-[#991B1B] pl-3">
                    <label className="block font-typewriter-md font-bold mb-2 text-xs text-[#261816]">DISCUSSION DURATION</label>
                    <div className="relative w-full neo-brutalist-shadow">
                      <select disabled={!isHost} value={settings.discussionTime} onChange={(e) => updateSetting('discussionTime', e.target.value)} className="w-full bg-[#E8D9C5] border-2 border-black py-2.5 px-3 appearance-none font-typewriter-md text-sm focus:outline-none focus:border-[#991B1B] cursor-pointer">
                        <option value="1m">60 SECONDS (BLITZ)</option>
                        <option value="2m">120 SECONDS</option>
                        <option value="3m">180 SECONDS (STANDARD)</option>
                        <option value="4m">240 SECONDS</option>
                        <option value="5m">300 SECONDS</option>
                        <option value="infinite">INFINITE</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#261816] border-l-2 border-black">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="border-l-2 border-[#1E3A8A] pl-3">
                    <label className="block font-typewriter-md font-bold mb-2 text-xs text-[#261816]">NIGHT DURATION</label>
                    <div className="relative w-full neo-brutalist-shadow">
                      <select disabled={!isHost} value={settings.nightTime} onChange={(e) => updateSetting('nightTime', e.target.value)} className="w-full bg-[#E8D9C5] border-2 border-black py-2.5 px-3 appearance-none font-typewriter-md text-sm focus:outline-none focus:border-[#991B1B] cursor-pointer">
                        <option value="15s">15 SECONDS</option>
                        <option value="30s">30 SECONDS</option>
                        <option value="45s">45 SECONDS</option>
                        <option value="60s">60 SECONDS</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#261816] border-l-2 border-black">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="border-l-2 border-[#4C1D95] pl-3">
                    <label className="block font-typewriter-md font-bold mb-2 text-xs text-[#261816]">NIGHT PHASE ORDER</label>
                    <div className="relative w-full neo-brutalist-shadow">
                      <select disabled={!isHost} value={settings.nightOrder} onChange={(e) => updateSetting('nightOrder', e.target.value)} className="w-full bg-[#E8D9C5] border-2 border-black py-2.5 px-3 appearance-none font-typewriter-md text-sm focus:outline-none focus:border-[#991B1B] cursor-pointer">
                        <option value="doc-det-maf">DOC → DET → MAFIA</option>
                        <option value="det-doc-maf">DET → DOC → MAFIA</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#261816] border-l-2 border-black">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="border-l-2 border-[#065F46] pl-3">
                    <label className="block font-typewriter-md font-bold mb-2 text-xs text-[#261816]">JESTER WIN RULE</label>
                    <div className="relative w-full neo-brutalist-shadow">
                      <select disabled={!isHost} value={settings.jesterWin} onChange={(e) => updateSetting('jesterWin', e.target.value)} className="w-full bg-[#E8D9C5] border-2 border-black py-2.5 px-3 appearance-none font-typewriter-md text-sm focus:outline-none focus:border-[#991B1B] cursor-pointer">
                        <option value="end">GAME ENDS IMMEDIATELY</option>
                        <option value="continue">SOLO WIN (CONTINUES)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#261816] border-l-2 border-black">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="border-l-2 border-[#9D174D] pl-3">
                    <label className="block font-typewriter-md font-bold mb-2 text-xs text-[#261816]">TIE VOTE RESOLUTION</label>
                    <div className="relative w-full neo-brutalist-shadow">
                      <select disabled={!isHost} value={settings.tieVote} onChange={(e) => updateSetting('tieVote', e.target.value)} className="w-full bg-[#E8D9C5] border-2 border-black py-2.5 px-3 appearance-none font-typewriter-md text-sm focus:outline-none focus:border-[#991B1B] cursor-pointer">
                        <option value="nothing">NOTHING HAPPENS</option>
                        <option value="random">RANDOM DEATH</option>
                        <option value="coin">COIN FLIP</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#261816] border-l-2 border-black">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="border-l-2 border-[#0F766E] pl-3">
                    <label className="block font-typewriter-md font-bold mb-2 text-xs text-[#261816]">DETECTIVE SEES</label>
                    <div className="relative w-full neo-brutalist-shadow">
                      <select disabled={!isHost} value={settings.detectiveSees} onChange={(e) => updateSetting('detectiveSees', e.target.value)} className="w-full bg-[#E8D9C5] border-2 border-black py-2.5 px-3 appearance-none font-typewriter-md text-sm focus:outline-none focus:border-[#991B1B] cursor-pointer">
                        <option value="alignment">ALIGNMENT (MAFIA/TOWN)</option>
                        <option value="exact">EXACT ROLE</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#261816] border-l-2 border-black">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="border-l-2 border-[#27272A] pl-3">
                    <label className="block font-typewriter-md font-bold mb-3 text-[10px] text-[#261816]">ROLE DISTRIBUTION</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['mafia', 'doctor', 'detective', 'jester'].map(role => (
                        <div key={role}>
                          <label className="block font-label-caps uppercase text-[10px] text-[#5a403c] mb-1">{role}</label>
                          <input type="number" min="0" max="8" disabled={!isHost} value={settings[role] || 0} onChange={(e) => updateSetting(role, parseInt(e.target.value) || 0)} className="w-full bg-[#fff8f6] border-2 border-black p-2 text-sm font-typewriter-md focus:outline-none neo-brutalist-shadow-sm" />
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-[10px] font-typewriter-md text-[#5a403c] leading-tight">
                       * Remaining subjects become Villagers.
                    </div>
                  </div>

                  <div className="border-l-2 border-[#D97706] pl-3">
                    <label className="block font-typewriter-md font-bold mb-3 text-[10px] text-[#261816]">SPECIAL DIRECTIVES</label>
                    
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-dashed border-[#e3beb8]">
                      <span className="font-body-standard text-sm text-[#261816]">Reveal Roles on Death</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" disabled={!isHost} checked={settings.revealOnDeath} onChange={(e) => updateSetting('revealOnDeath', e.target.checked)} className="sr-only peer" />
                        <div className="w-10 h-5 bg-[#fee2dd] border-2 border-black peer-focus:outline-none peer-checked:bg-[#E8D9C5] neo-brutalist-shadow after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-[#991B1B] after:border-2 after:border-black after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-[20px]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-dashed border-[#e3beb8]">
                      <span className="font-body-standard text-sm text-[#261816]">Doctor Self-Heal</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" disabled={!isHost} checked={settings.doctorSelfHeal} onChange={(e) => updateSetting('doctorSelfHeal', e.target.checked)} className="sr-only peer" />
                        <div className="w-10 h-5 bg-[#fee2dd] border-2 border-black peer-focus:outline-none peer-checked:bg-[#E8D9C5] neo-brutalist-shadow after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-[#991B1B] after:border-2 after:border-black after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-[20px]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-dashed border-[#e3beb8]">
                      <span className="font-body-standard text-sm text-[#261816]">Anonymous Voting</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" disabled={!isHost} checked={settings.anonVoting} onChange={(e) => updateSetting('anonVoting', e.target.checked)} className="sr-only peer" />
                        <div className="w-10 h-5 bg-[#fee2dd] border-2 border-black peer-focus:outline-none peer-checked:bg-[#E8D9C5] neo-brutalist-shadow after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-[#991B1B] after:border-2 after:border-black after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-[20px]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-dashed border-[#e3beb8]">
                      <span className="font-body-standard text-sm text-[#261816]">Allow Skip Vote</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" disabled={!isHost} checked={settings.skipVote} onChange={(e) => updateSetting('skipVote', e.target.checked)} className="sr-only peer" />
                        <div className="w-10 h-5 bg-[#fee2dd] border-2 border-black peer-focus:outline-none peer-checked:bg-[#E8D9C5] neo-brutalist-shadow after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-[#991B1B] after:border-2 after:border-black after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-[20px]"></div>
                      </label>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </main>

        <div className="fixed bottom-0 w-full max-w-md mx-auto bg-[#E8D9C5] border-t-[3px] border-black p-3 pb-4 shadow-[0_-5px_10px_rgba(0,0,0,0.2)] z-50 flex flex-col gap-2">
          <button 
            onClick={handleToggleReady}
            className={`w-full py-3 border-[3px] border-black neo-brutalist-shadow active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all font-typewriter-md font-bold text-sm ${currentPlayer?.isReady ? 'bg-green-700 text-white' : 'bg-[#fff8f6] text-[#261816]'}`}
          >
            {currentPlayer?.isReady ? 'READY FOR OPERATION' : 'MARK AS READY'}
          </button>

          {isHost ? (
            <button 
              disabled={!allReady || players.length < 4}
              onClick={handleStartGame}
              className="w-full bg-[#991B1B] text-white font-typewriter-md font-bold text-sm py-3 border-[3px] border-black neo-brutalist-shadow active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              COMMENCE OPERATION
            </button>
          ) : (
            <div className="text-center font-label-caps text-[10px] text-[#5a403c] py-2 tracking-widest uppercase">
               Awaiting Commander...
            </div>
          )}
          
          {isHost && players.length < 4 && (
             <p className="text-center font-label-caps text-[9px] text-[#5a403c] tracking-widest uppercase mt-1">MINIMUM 4 SUBJECTS REQUIRED</p>
          )}
        </div>
        
      </div>
    </div>
  );
}
