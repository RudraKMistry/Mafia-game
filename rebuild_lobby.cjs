const fs = require('fs');

const content = `import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useGameState from '../../hooks/useGameState';
import { FolderOpen, Settings, User, Bot, Play, Fingerprint, UserPlus, Star, ChevronDown } from 'lucide-react';

export default function MobileLobby() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const playerName = localStorage.getItem('mafia_playerName') || 'Anonymous';
  
  const { room, playerId, socket, error } = useGameState(id, playerName);
  const [activeTab, setActiveTab] = useState<'suspects'|'params'>('suspects');

  if (error) {
    return (
      <div className="bg-[#fff8f6] min-h-screen p-8 text-center flex flex-col items-center justify-center m-desk-texture">
        <h2 className="font-display-xl text-4xl text-[#991B1B] mb-4">CONNECTION LOST</h2>
        <p className="font-typewriter-md text-[#261816] mb-8">{error}</p>
        <button onClick={() => navigate('/')} className="neo-brutalist-button bg-[#E8D9C5] border-4 border-black text-[#261816] py-3 px-6 rounded font-typewriter-md font-bold">
          RETURN TO HQ
        </button>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="bg-[#fff8f6] min-h-screen flex items-center justify-center m-desk-texture">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black"></div>
      </div>
    );
  }

  if (room.state !== 'lobby') {
    navigate(\`/game/\${id}\`);
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

  const isHost = players.length > 0 && players[0].id === playerId;

  return (
    <div className="bg-[#fff8f6] text-[#261816] min-h-[100dvh] font-body-standard md:py-8 md:px-4">
      <div className="max-w-md mx-auto w-full relative">
        <header className="w-full top-0 sticky bg-[#E8D9C5] text-[#610000] border-b-4 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] z-40">
          <div className="flex justify-between items-center px-6 py-2 w-full max-w-md mx-auto">
            <div className="flex items-center gap-2">
              <FolderOpen className="text-3xl" />
              <h1 className="font-display-xl text-[#610000] uppercase tracking-tighter">CASE #{id}</h1>
            </div>
            <div>
              <span className="font-typewriter-md font-bold px-2 py-1 bg-[#fee2dd] border-2 border-black rotate-2 inline-block shadow-[2px_2px_0px_#000000]">
                {players.length} / 12
              </span>
            </div>
          </div>
        </header>

        <main className="w-full bg-[#E8D9C5] m-paper-texture shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] min-h-[70vh] relative px-4 py-6 pb-32">
          {isHost && (
            <div className="absolute -top-4 -right-2 w-24 h-24 bg-[#fff8f6] neo-brutalist-shadow rotate-3 border-2 border-black flex flex-col items-center justify-center z-10">
              <div className="w-full h-4 bg-[#FACC15] opacity-80 absolute top-0"></div>
              <span className="font-label-caps text-[#5a403c] mt-4">HOST STATUS</span>
              <Settings className="text-[#991B1B] text-4xl mt-1" />
            </div>
          )}

          <nav className="flex w-full mb-4 px-2" role="tablist">
            <button 
              onClick={() => setActiveTab('suspects')}
              className={\`flex-1 py-3 border-4 border-black border-b-0 font-typewriter-md transition-colors \${activeTab === 'suspects' ? 'bg-[#E8D9C5] neo-brutalist-shadow font-bold text-[#991B1B] relative z-10 translate-y-1' : 'bg-[#fee2dd] shadow-[4px_4px_0px_#000000] text-[#5a403c] relative z-0 mt-2 hover:bg-[#f8dcd8]'}\`}
            >
              SUBJECTS
            </button>
            <button 
              onClick={() => setActiveTab('params')}
              className={\`flex-1 py-3 border-4 border-black border-b-0 font-typewriter-md transition-colors \${activeTab === 'params' ? 'bg-[#E8D9C5] neo-brutalist-shadow font-bold text-[#991B1B] relative z-10 translate-y-1' : 'bg-[#fee2dd] shadow-[4px_4px_0px_#000000] text-[#5a403c] relative z-0 mt-2 hover:bg-[#f8dcd8]'}\`}
            >
              PARAMETERS
            </button>
          </nav>

          <div className="notebook-lines min-h-[50vh] pt-2 mb-8" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #1E3A8A 31px, #1E3A8A 32px)', backgroundAttachment: 'local' }}>
            
            {activeTab === 'suspects' && (
              <div className="animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2 bg-[#fff8f6]/80 p-1">
                  <h2 className="font-headline-lg text-[#261816]">Gathering...</h2>
                  <div className="animate-pulse bg-[#991B1B] w-4 h-4 rounded-full border-2 border-black"></div>
                </div>

                <ul className="space-y-4">
                  {players.map((p: any, index: number) => {
                    const rotClass = index % 3 === 0 ? 'rotate-[-1deg]' : index % 2 === 0 ? 'rotate-[1deg]' : 'rotate-[-0.5deg]';
                    return (
                      <li key={p.id} className={\`bg-white border-2 border-black neo-brutalist-shadow p-2 flex items-center gap-4 relative \${rotClass}\`}>
                        {p.id === playerId && (
                          <div className="absolute -left-2 -top-2 w-6 h-6 rounded-full bg-[#991B1B] border-2 border-black flex items-center justify-center text-white z-10">
                            <Star className="w-4 h-4" />
                          </div>
                        )}
                        <div className="w-16 h-16 bg-[#fee2dd] border-2 border-black flex items-center justify-center">
                          {p.isBot ? <Bot className="w-8 h-8 text-[#5a403c]" /> : <User className="w-8 h-8 text-[#5a403c]" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-handwritten-lg text-xl text-[#261816]">{p.name}</p>
                          <p className="font-typewriter-sm text-[#5a403c]">ID: {p.id}</p>
                        </div>
                        <div className="pr-2">
                           <Fingerprint className="text-[#8e706b] w-6 h-6" />
                        </div>
                      </li>
                    );
                  })}

                  {players.length < 12 && (
                    <li className="border-2 border-dashed border-[#8e706b] p-4 flex items-center justify-center gap-2 bg-[#fff8f6]/50 mt-4 cursor-pointer hover:bg-[#fee2dd] transition-colors" onClick={isHost ? handleAddBot : undefined}>
                      <UserPlus className="text-[#8e706b] w-6 h-6" />
                      <span className="font-typewriter-md text-[#8e706b]">{isHost ? '+ ADD AI SUBJECT' : 'AWAITING SUBJECT...'}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {activeTab === 'params' && (
              <div className="pt-4 bg-[#fff8f6]/80 p-4 border-4 border-black neo-brutalist-shadow relative animate-in fade-in duration-300">
                <h2 className="font-headline-lg text-[#261816] mb-6 border-b-4 border-black inline-block">CASE SETTINGS</h2>
                <form className="space-y-6">
                  <div className="border-l-4 border-[#991B1B] pl-4">
                    <label className="block font-typewriter-md font-bold mb-2 text-[#261816]">DISCUSSION DURATION</label>
                    <div className="relative w-full neo-brutalist-shadow">
                      <select disabled={!isHost} value={settings.discussionTime} onChange={(e) => updateSetting('discussionTime', e.target.value)} className="w-full bg-[#E8D9C5] border-2 border-black py-3 px-4 appearance-none font-typewriter-md focus:outline-none focus:border-[#991B1B] cursor-pointer">
                        <option value="1m">60 SECONDS (BLITZ)</option>
                        <option value="2m">120 SECONDS</option>
                        <option value="3m">180 SECONDS (STANDARD)</option>
                        <option value="4m">240 SECONDS</option>
                        <option value="5m">300 SECONDS</option>
                        <option value="infinite">INFINITE</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#261816] border-l-2 border-black">
                        <ChevronDown className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  <div className="border-l-4 border-[#1E3A8A] pl-4">
                    <label className="block font-typewriter-md font-bold mb-2 text-[#261816]">NIGHT DURATION</label>
                    <div className="relative w-full neo-brutalist-shadow">
                      <select disabled={!isHost} value={settings.nightTime} onChange={(e) => updateSetting('nightTime', e.target.value)} className="w-full bg-[#E8D9C5] border-2 border-black py-3 px-4 appearance-none font-typewriter-md focus:outline-none focus:border-[#991B1B] cursor-pointer">
                        <option value="15s">15 SECONDS</option>
                        <option value="30s">30 SECONDS</option>
                        <option value="45s">45 SECONDS</option>
                        <option value="60s">60 SECONDS</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#261816] border-l-2 border-black">
                        <ChevronDown className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  <div className="border-l-4 border-[#27272A] pl-4 pt-2">
                    <label className="block font-typewriter-md font-bold mb-4 text-[#261816]">ROLE DISTRIBUTION</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['mafia', 'doctor', 'detective', 'jester'].map(role => (
                        <div key={role}>
                          <label className="block font-label-caps uppercase text-[#5a403c] mb-1">{role}</label>
                          <input type="number" min="0" max="8" disabled={!isHost} value={settings[role] || 0} onChange={(e) => updateSetting(role, parseInt(e.target.value) || 0)} className="w-full bg-[#fff8f6] border-2 border-black p-2 font-typewriter-md focus:outline-none" />
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-xs font-typewriter-md text-[#5a403c]">
                       * Remaining subjects become Villagers.
                    </div>
                  </div>

                  <div className="border-l-4 border-[#D97706] pl-4 pt-4">
                    <label className="block font-typewriter-md font-bold mb-4 text-[#261816]">SPECIAL DIRECTIVES</label>
                    <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-dashed border-[#e3beb8]">
                      <span className="font-body-standard text-[#261816]">Reveal Roles on Death</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" disabled={!isHost} checked={settings.revealOnDeath} onChange={(e) => updateSetting('revealOnDeath', e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-[#fee2dd] border-2 border-black peer-focus:outline-none peer-checked:bg-[#E8D9C5] neo-brutalist-shadow after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#991B1B] after:border-2 after:border-black after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-[20px]"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b-2 border-dashed border-[#e3beb8]">
                      <span className="font-body-standard text-[#261816]">Anonymous Voting</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" disabled={!isHost} checked={settings.anonVoting} onChange={(e) => updateSetting('anonVoting', e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-[#fee2dd] border-2 border-black peer-focus:outline-none peer-checked:bg-[#E8D9C5] neo-brutalist-shadow after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#991B1B] after:border-2 after:border-black after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-[20px]"></div>
                      </label>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </main>

        <div className="fixed bottom-0 w-full max-w-md mx-auto bg-[#E8D9C5] border-t-4 border-black p-4 pb-6 shadow-[0_-10px_20px_rgba(0,0,0,0.2)] z-50">
          <button 
            disabled={!isHost || players.length < 4}
            onClick={handleStartGame}
            className="w-full bg-[#991B1B] text-white font-typewriter-md font-bold py-4 border-4 border-black neo-brutalist-shadow active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-6 h-6" />
            COMMENCE OPERATION
          </button>
          {!isHost && (
             <p className="text-center font-label-caps text-[#5a403c] mt-3 tracking-widest uppercase">Waiting for Host...</p>
          )}
          {isHost && players.length < 4 && (
             <p className="text-center font-label-caps text-[#5a403c] mt-3 tracking-widest uppercase">MINIMUM 4 SUBJECTS REQUIRED</p>
          )}
        </div>
        
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/pages/mobile/MobileLobby.tsx', content);
console.log('MobileLobby.tsx restored completely.');
